const User = require('../users/user.model');

exports.getKPIs = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const activeAdmins = await User.countDocuments({ role: 'admin' });
    const startOfMonth = new Date();

    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    return res.json({
      totalUsers,
      activeAdmins,
      newUsersThisMonth,
      monthlyGrowthPercentage: totalUsers > 0 ? ((newUsersThisMonth / totalUsers) * 100).toFixed(2) : 0
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'error interno al calcular metricas',
      error: error.message
    });
  }
};

exports.getRegistrationsChart = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'formato de fecha invalido o rango incorrecto'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'formato de fecha invalido o rango incorrecto'
      });
    }

    end.setHours(23, 59, 59, 999);

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: 'rango temporal incorrecto'
      });
    }

    const users = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          usersRegistered: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return res.json(users.map((user) => ({
      date: user._id,
      usersRegistered: user.usersRegistered
    })));
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'error interno al generar grafica',
      error: error.message
    });
  }
};

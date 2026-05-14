const User = require('../users/user.model');

// Obtener KPIs del Dashboard
exports.getKPIs = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const activeAdmins = await User.countDocuments({ role: 'admin' });
    
    // Usuarios creados este mes
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: startOfMonth } });
    
    res.json({
      totalUsers,
      activeAdmins,
      newUsersThisMonth,
      monthlyGrowthPercentage: totalUsers > 0 ? ((newUsersThisMonth / totalUsers) * 100).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno al calcular las métricas", error: error.message });
  }
};

// Obtener gráficas de registro
exports.getRegistrationsChart = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Formato de fecha inválido o el rango temporal es incorrecto" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    if (start > end) {
      return res.status(400).json({ message: "El rango temporal es incorrecto" });
    }

    const users = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          usersRegistered: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const formattedData = users.map(u => ({ date: u._id, usersRegistered: u.usersRegistered }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: "Error interno al generar gráfica", error: error.message });
  }
};

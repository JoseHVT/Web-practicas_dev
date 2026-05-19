const { verifyToken } = require('../utils/jwt');
const LoginAccount = require('../modules/auth/auth.model');
require('../modules/users/user.model');

const getBearerToken = (authorizationHeader = '') => {
  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
};

const authenticateToken = async (req, res, next) => {
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'token requerido'
    });
  }

  try {
    const payload = verifyToken(token);
    const account = await LoginAccount.findOne({
      _id: payload.sub,
      active: true
    }).populate('user', 'name email role');

    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'token invalido o expirado'
      });
    }

    req.auth = payload;
    req.account = account;
    req.authUser = account.user || null;
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'token invalido o expirado'
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.authUser?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'acceso solo para administradores'
    });
  }

  return next();
};

module.exports = {
  authenticateToken,
  requireAdmin
};

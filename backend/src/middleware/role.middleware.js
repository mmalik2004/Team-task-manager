const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Admins only.' });
};

const isAdminOrSelf = (req, res, next) => {
  if (req.user && (req.user.role === 'Admin' || req.user.id === parseInt(req.params.id))) {
    return next();
  }
  return res.status(403).json({ message: 'Access denied.' });
};

module.exports = { isAdmin, isAdminOrSelf };
const userRoutes = require('./user');
const router = require('express').Router();

router.use('/', userRoutes);

module.exports = router;

const router = require('koa-router')();
const middleware =require('../middleware')
const admin=require('../controllers/admin.js');

module.exports = router
.get('/getSettings',admin.getSettings)
.post('/setSettings',middleware.isAdmin,admin.setSettings)
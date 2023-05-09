const router = require('koa-router')();
const user=require('../controllers/user.js');
const middleware =require('../middleware')
module.exports = router
.post('/login',user.login)
.post('/register',user.register)
.get('/getUserInfo',middleware.isLogin,user.getUserInfo)
.post('/changePwd',middleware.isLogin,user.changePwd)
.post('/changeUserInfo',middleware.isLogin,user.changeUserInfo)
.post('/changeNickname',middleware.isLogin,user.changeNickname)
.get('/logout',user.logout)
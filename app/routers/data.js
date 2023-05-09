const router = require('koa-router')();
const middleware =require('../middleware')
const data=require('../controllers/data.js');

module.exports = router
.get('/getAllStudents',middleware.isAdmin,data.getAllStudents)
.get('/getStudentById',middleware.isLogin ,data.getStudentById)
.get('/getAverage',middleware.isLogin,data.getAverage)
.post('/changeOneWork',middleware.isAdmin,data.changeOneWork)
.post('/changeOtherScore', middleware.isAdmin,data.changeOtherScore)
.post('/addAssignments',middleware.isAdmin,data.addAssignments)
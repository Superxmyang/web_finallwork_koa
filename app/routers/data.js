const router = require('koa-router')();
const middleware = require('../middleware')
const data = require('../controllers/data.js');

module.exports = router
    .get('/getAllStudents', middleware.isAdmin, data.getAllStudents)
    .get('/getStudentById', middleware.isLogin, data.getStudentById)
    .get('/getAverage', middleware.isLogin, data.getAverage)
    .post('/changeOneWork', middleware.isAdmin, data.changeOneWork)
    .post('/changeOtherScore', middleware.isAdmin, data.changeOtherScore)
    .post('/addAssignments', middleware.isAdmin, data.addAssignments)
    .post('/getMachineList', middleware.isLogin, data.getMachineList)
    .post('/bookingMachine', middleware.isLogin, data.bookingMachine)
    .post('/getAllCourse', middleware.isLogin, data.getAllCourse)
    .post('/bookingCourse', middleware.isLogin, data.bookingCourse)
    .post('/getAllBookingCourse', middleware.isLogin, data.getAllBookingCourse)
    .post('/getAllBookingMachine', middleware.isLogin, data.getAllBookingMachine)
    .post('/getPlan', middleware.isLogin, data.getPlan)
    .post('/bookingPlan', middleware.isLogin, data.bookingPlan)
    .post('/updatePlan', middleware.isLogin, data.updatePlan)
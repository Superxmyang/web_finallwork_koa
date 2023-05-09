const router=require('koa-router')()
const userRouter = require('./user.js')
const adminRouter=require('./admin.js')
const data=require('./data.js');
router.use('/service/user',userRouter.routes())
router.use('/service/admin',adminRouter.routes())
router.use('/service/data',data.routes())

module.exports = router
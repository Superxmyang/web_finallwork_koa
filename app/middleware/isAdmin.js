const {failRes} = require('../utils/resData.js')
module.exports = {
    async isAdmin(ctx,next){
        console.log('isAdmin',ctx.cookies.get('isAdmin'));
        if(ctx.cookies.get('isAdmin')){
            await next()
        }else{
            ctx.status=403
            return  ctx.body = failRes(null,"你不是管理员");
        }
    },

    async isLogin(ctx,next){
        let id=ctx.cookies.get('id');
        console.log('用户id',id);
        if(id>0){
            await next()
        }else{
            ctx.status=401
            return ctx.body=failRes(null,"未登录");
        }
    }

}
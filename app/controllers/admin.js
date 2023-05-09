const { successRes,failRes}=require('../utils/resData.js')
const admin=require('../services/admin.js');

module.exports = {
    /**
     * 获取设置信息
     * @param {*} ctx 
     */
    async getSettings(ctx){
        let res=await admin.getSettings()
        if(res){
            return ctx.body = successRes(res,"获取成功");
        }else{
            return ctx.body = failRes(null,"获取失败");
        }
    },

    /**
     * 修改设置信息
     * @param {*} ctx 
     * @returns 
     */
    async setSettings(ctx){
        let body=ctx.request.body
        if(body.daily_score+body.examination_score+ body.assignments_score+body.middle_score+body.review_score!==100){
            return ctx.body = failRes(null,"分数组成错误");
        }
        let res=await admin.setSettings(body)
        if(res){
            return ctx.body = successRes(null,"设置成功");
        }else{
            return ctx.body = failRes(null,"设置失败");
        }
    }
}
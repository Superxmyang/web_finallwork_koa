const { successRes, failRes } = require('../utils/resData.js')
const data = require('../services/data.js');

module.exports = {
    /**
     * 获取所有学生信息
     * @param {*} ctx 
     * @returns 
     */
    async getAllStudents(ctx) {
        let res = await data.getAllStudents()
        if (res) {
            return ctx.body = successRes(res, "获取成功");
        } else {
            return ctx.body = failRes(null, "获取失败");
        }
    },

    /**
     * 获取单个学生信息
     * @param {*} ctx 
     */
    async getStudentById(ctx) {
        let id = ctx.query.id || ctx.cookies.get('id')
        if (!id) return ctx.body = failRes(null, "id不能为空");
        let res = await data.getStudentById(id)
        if (res) {
            return ctx.body = successRes(res, "获取信息成功");
        } else {
            return ctx.body = failRes(null, "获取信息失败");
        }
    },

    /**
     * 改变单次作业信息
     * @param {*} ctx 
     */
    async changeOneWork(ctx) {
        let body = ctx.request.body
        if (!body.id) return ctx.body = failRes(null, "id不能为空");
        let res = await data.changeOneWork(body)
        if (res) {
            return ctx.body = successRes(null, "修改成功");
        } else {
            return ctx.body = failRes(null, "修改失败");
        }
    },

    /**
     * 获取学生的平时成绩，期中成绩，考试成绩等
     * @param {*} ctx 
     */
    async changeOtherScore(ctx) {
        let body = ctx.request.body
        if (!body.userId) return ctx.body = failRes(null, "id不能为空");
        if (body.daily_score < 0 || body.daily_score > 100) return ctx.body = failRes(null, "平时成绩不合法");
        if (body.examination_score < 0 || body.examination_score > 100) return ctx.body = failRes(null, "考试成绩不合法");
        if (body.middle_score < 0 || body.middle_score > 100) return ctx.body = failRes(null, "期中成绩不合法");
        if (body.review_score < 0 || body.review_score > 100) return ctx.body = failRes(null, "讲评成绩不合法");
        let res = await data.changeOtherScore(body)
        if (res) {
            return ctx.body = successRes(null, "修改成功");
        } else {
            return ctx.body = failRes(null, "修改失败");
        }
    },
    /**
     * 获取全部学生的平均成绩
     * @param {*} ctx 
     */
    async getAverage(ctx){
        let res= await data.getAverage()
        if(res){
            return ctx.body = successRes(res,"获取平均成绩成功")
        }else{
            return ctx.body.failRes(null,"获取平均成绩失败")
        }
    },
    /**
     * 
     */
    async addAssignments(ctx){
        let body=ctx.request.body
        if(!body.value) return ctx.body=failRes(null,"作业不能为空")
        console.log(body.value);
        let res=await data.addAssignments(body.value)
        if(res){
            return ctx.body=successRes(null,"添加成功")
        }else{
            return ctx.body=failRes(null,"添加失败")
        }
    }
}
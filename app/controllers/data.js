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
        let isAdmin = ctx.cookies.get('isAdmin')
        if (!id) return ctx.body = failRes(null, "id不能为空");
        let res = await data.getStudentById(id, isAdmin)
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
    async getAverage(ctx) {
        let res = await data.getAverage()
        if (res) {
            return ctx.body = successRes(res, "获取平均成绩成功")
        } else {
            return ctx.body.failRes(null, "获取平均成绩失败")
        }
    },
    /**
     * 
     */
    async addAssignments(ctx) {
        let body = ctx.request.body
        if (!body.value) return ctx.body = failRes(null, "作业不能为空")
        console.log(body.value);
        let res = await data.addAssignments(body.value)
        if (res) {
            return ctx.body = successRes(null, "添加成功")
        } else {
            return ctx.body = failRes(null, "添加失败")
        }
    },

    async getMachineList(ctx) {
        let res = await data.getMachineList(ctx.request.body)
        if (res) {
            return ctx.body = successRes(res, "获取成功")
        }
    },

    async bookingMachine(ctx) {
        let id = ctx.cookies.get('id')
        let res = await data.bookingMachine(id, ctx.request.body)
        if (res) {
            return ctx.body = successRes(res, "修改成功")
        } else {
            return ctx.body = failRes(null, "添加失败,此时间段已被预约")
        }
    },

    async getAllCourse(ctx) {
        let res = await data.getAllCourse(ctx.request.body)
        if (res) {
            return ctx.body = successRes(res, "获取成功")
        }
        return ctx.body = failRes(null, "获取失败")
    },

    async bookingCourse(ctx) {
        let res = await data.bookingCourse(ctx.cookies.get('id'), ctx.request.body)
        if (res) {
            return ctx.body = successRes(res, "更改预约状态成功")
        }
        return ctx.body = failRes(null, "预约失败,此时间段已被预约")
    },
    async getAllBookingCourse(ctx) {
        let res = await data.getAllBookingCourse(ctx.cookies.get('id'))
        if (res) {
            return ctx.body = successRes(res, "获取成功")
        }
        return ctx.body = failRes(null, "获取失败")
    },
    async getAllBookingMachine(ctx) {
        let res = await data.getAllBookingMachine(ctx.cookies.get('id'))
        if (res) {
            return ctx.body = successRes(res, "获取成功")
        }
        return ctx.body = failRes(null, "获取失败")
    },
    async getPlan(ctx){
        let res = await data.getPlan(ctx.cookies.get('id'))
        if (res) {
            return ctx.body = successRes(res, "获取成功")
        }
        return ctx.body = failRes(null, "获取失败")
    },
    async bookingPlan(ctx){
        let res = await data.bookingPlan(ctx.cookies.get('id'),ctx.request.body)
        if (res) {
            return ctx.body = successRes(res, "添加计划成功")
        }
        return ctx.body = failRes(null, "预约失败,此时间段已被预约")
    },
    async updatePlan(ctx){
        let res = await data.updatePlan(ctx.cookies.get('id'),ctx.request.body)
        if (res) {
            return ctx.body = successRes(res, "更改计划成功")
        }
        return ctx.body = failRes(null, "更改计划失败,有时间重复")
    }


}
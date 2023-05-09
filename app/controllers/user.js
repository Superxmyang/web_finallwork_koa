const { successRes, failRes } = require('../utils/resData.js')
const user = require('../services/user.js');

module.exports = {
    /**
     * 登录接口
     * @param {*} ctx 
     * @returns 
     */
    async login(ctx) {
        let body = ctx.request.body
        //校验是否为空
        if (!body.username) {
            return ctx.body = failRes(null, "用户名不能为空");
        }
        //校验是否为空
        if (!body.password) {

            return ctx.body = failRes(null, "密码不能为空");
        }
        //登录
        let res = await user.login(body)
        //返回结果
        if (res) {
            ctx.cookies.set('id', res.id)
            ctx.cookies.set('isAdmin', res.is_admin)
            ctx.status = 200
            return ctx.body = successRes(null, "登录成功");
        } else {
            return ctx.body = failRes(null, "用户名密码错误");
        }
    },

    /**
     * 注册接口
     * @param {*} ctx 
     * @returns 
     */
    async register(ctx) {
        let body = ctx.request.body
        //简单校验用户名
        if (!body.username) {
            return ctx.body = failRes(null, "用户名不能为空");
        }
        if (body.username.length !== 13) {
            return ctx.body = failRes(null, "用户名必须为13位");
        }
        //简单校验密码
        if (!body.password) {
            return ctx.body = failRes(null, "密码不能为空");
        }
        //校验用户名是否存在
        if (body.username) {
            let res = await user.isExict(body.username);
            if (res) return ctx.body = failRes(null, "用户名已存在");
        }
        //检验昵称是否存在
        if (body.nickname) {
            let res = await user.nickIsExict(body.nickname);
            if (res) return ctx.body = failRes(null, "昵称已存在");
        }
        //注册
        let res = await user.register(body)

        //返回结果
        if (res) {
            return ctx.body = successRes(null, "注册成功");
        } else {
            return ctx.body = failRes(null, "注册失败");
        }
    },

    /**
     * 获取用户信息
     * @param {*} ctx 
     * @returns 
     */
    async getUserInfo(ctx) {
        let id = ctx.cookies.get('id')
        let res = await user.getUserInfo(id)
        if (res) {
            return ctx.body = successRes(res, "获取用户信息成功");
        } else {
            ctx.status = 401
            return ctx.body = failRes(null, "获取用户信息失败");
        }
    },

    /**
     * 更改用户密码
     * @param {*} ctx 
     */
    async changePwd(ctx) {
        let id = ctx.cookies.get('id')
        let body = ctx.request.body
        //简单校验
        if (!body.oldPassword) {
            return ctx.body = failRes(null, "旧密码不能为空");
        }
        //简单校验
        if (!body.newPassword) {
            return ctx.body = failRes(null, "新密码不能为空");
        }
        //新旧密码校验
        if (body.oldPassword === body.newPassword) {
            return ctx.body = failRes(null, "新密码不能与旧密码相同");
        }
        //数据库校验
        if (body.oldPassword) {
            let res = await user.oldPwdIsSame(id, body.oldPassword);
            if (!res) return ctx.body = failRes(null, "密码错误,请重新输入");
        }
        //更改密码
        let res = await user.changePwd(id, body.newPassword)
        if (res) {
            return ctx.body = successRes(null, "更改密码成功");
        } else {
            return ctx.body = failRes(null, "更改密码失败");
        }
    },

    /**
     * 修改个人信息
     * @param {*} ctx 
     */
    async changeUserInfo(ctx) {
        let id = ctx.cookies.get('id')  
        let body = ctx.request.body
        //简单校验
        
        //修改个人信息
        let res = await user.changeUserInfo(id, body)
        if (res) {
            return ctx.body = successRes(null, "修改个人信息成功");
        } else {
            return ctx.body = failRes(null, "修改个人信息失败");
        }
    },


    async changeNickname(ctx) {
        let id = ctx.cookies.get('id')
        let body = ctx.request.body
        //简单校验
        if (!body.value) return ctx.body = failRes(null, "昵称不能为空");
        if (body.value.length > 10) return ctx.body.failRes(null, "长度不能大于30")
        //修改个人信息
        let res = await user.nicknameIsExict(body.value);
        if (res) { return ctx.body = failRes(null, "昵称已存在"); }
        let res2 = await user.changeNickname(id, body.value)
        if (res2) {
            return ctx.body = successRes(null, "修改昵称成功");
        } else {
            return ctx.body = failRes(null, "修改昵称失败");
        }
    },
    /**
     * 退出登录
     * @param {*} ctx 
     */
    async logout(ctx) {
        ctx.cookies.set('id', null)
        ctx.cookies.set('isAdmin', null)
        return ctx.body = successRes(null, "退出登录成功");
    }


}
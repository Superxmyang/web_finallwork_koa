
const dbUtils = require('../utils/db-utils.js')

const user = {
    /**
     * 登录对象
     * @param {object} options 登录对象，包含username和password
     * @returns 成功返回对象，失败返回空
     */
    async login(options) {
        let _sql = `select * from user where username="${options.username}" and pwd="${options.password}";`
        let res = await dbUtils.query(_sql)
        console.log('login', res);
        if (Array.isArray(res) && res.length > 0) {
            res = res[0]
        } else {
            res = null
        }
        return res
    },
    /**
     * 注册接口
     * @param {Object} options 对象，包含username和password
     * @returns 成功返回对象，失败返回空
     */
    async register(options) {
        let _sql = `insert into user (username,pwd,nick_name,avatar) values ("${options.username}","${options.password}","${options.nickname}","https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png");`
        let res = await dbUtils.query(_sql)
        console.log('register', res);
        //初始化userscore数据
        let _sql2 = `insert into userscore (user_id) values ("${res.insertId}");`
        let res2 = await dbUtils.query(_sql2)
        console.log('register', res2);
        //获取作业次数
        let _sql3 = `select * from settings;`
        let res3 = await dbUtils.query(_sql3)
        if (Array.isArray(res3) && res3.length > 0) {
            res3 = res3[0]
        }else{
            return null
        }
        //初始化homework数据
        for(let i=1;i<=res3.assignments_count;i++){
            let _sql4 = `insert into assignments (user_id,times_number) values ("${res.insertId}","${i}");`
            let res4 = await dbUtils.query(_sql4)
            if(!res4) return null;
        }

        if (res) {
            return res
        } else {
            return null
        }
    },
    
    /**
     * 判断用户名是否存在
     * @param {*} id 
     * @returns 
     */
    async getUserInfo(id){
        let _sql = `select * from user where id="${id}";`
        let res = await dbUtils.query(_sql)
        if(Array.isArray(res) && res.length > 0){
            res=res[0]
            let obj={}
            obj.username=res.username
            obj.nickname=res.nick_name
            obj.avatar=res.avatar
            obj.email=res.email
            obj.isAdmin=res.is_admin
            obj.phone=res.phone
            return obj
        }else{
            return null
        }
    },
    /**
     * 
     * @param {*} username 
     * @returns 
     */
    async changeNickname(id,username){
        let _sql = `update user set nick_name="${username}" where id="${id}";`
        let res = await dbUtils.query(_sql)
        if(res){
            return res
        }else{
            return null
        }
    },

    async isExict(username){
        let _sql = `select * from user where username="${username}";`
        let res = await dbUtils.query(_sql)
        if(Array.isArray(res) && res.length > 0){
            return true
        }else{
            return false
        }
    },
    async nickIsExict(nickname){
        let _sql = `select * from user where nick_name="${nickname}";`
        let res = await dbUtils.query(_sql)
        if(Array.isArray(res) && res.length > 0){
            return true
        }else{
            return false
        }
    },
    /**
     * 判断新旧密码是否一致
     */
    async oldPwdIsSame(id,pwd){
        let _sql = `select * from user where id="${id}" and pwd="${pwd}";`
        let res = await dbUtils.query(_sql)
        if(Array.isArray(res) && res.length > 0){
            return true
        }else{
            return false
        }
    },

    /**
     * 修改密码
     * @param {number} id 
     * @param {string} pwd 
     * @returns 
     */
    async changePwd(id,pwd){
        let _sql = `update user set pwd="${pwd}" where id="${id}";`
        let res = await dbUtils.query(_sql)
        if(res){
            return res
        }else{
            return null
        }
    },

    /**
     * 修改用户信息
     * @param {number} id 
     * @param {object} body 
     */
    async changeUserInfo(id,body){
        let _sql = `update user set email="${body.email || ''}" ,phone="${body.phone || ''}",avatar="${body.avatar}" where id="${id}";`
        let res = await dbUtils.query(_sql)
        if(res){
            return res
        }else{
            return null
        }
    },

    async nicknameIsExict(nickname){
        let _sql = `select * from user where nick_name="${nickname}";`
        let res = await dbUtils.query(_sql)
        if(Array.isArray(res) && res.length > 0){
            return true
        }else{
            return false
        }
    }

}
module.exports=user

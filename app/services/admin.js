const dbUtils = require('../utils/db-utils.js')

module.exports = {
    /**
     * 获取设置信息
     * @returns 
     */
    async getSettings() {
        let sql = `select daily_score,examination_score,assignments_score,assignments_count,middle_score,review_score,show_examination from settings`
        let res= await dbUtils.query(sql)
        let obj = {}
        if (Array.isArray(res) && res.length > 0) {
            obj=res[0]
        } else {
            return null
        }
        let sql2=`select count(*) as count from user where is_admin=0;`
        let res2= await dbUtils.query(sql2)
        if(res2){
            obj.student_count=res2[0]['count']
        }else {
            return null
        }
        return obj
    },
    /**
     * 设置配置信息
     * @param {*} body 
     * @returns 
     */
    async setSettings(body){
        let sql = `update settings set daily_score="${body.daily_score}",examination_score="${body.examination_score}",show_examination="${body.show_examination}",assignments_score="${body.assignments_score}",middle_score="${body.middle_score}",review_score="${body.review_score}";`
        let res= await dbUtils.query(sql)
        if (res) {
            return res
        } else {
            return null
        }
    }
}
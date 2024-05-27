const { getPlan } = require('../controllers/data.js')
const { isAdmin } = require('../middleware/isAdmin.js')
const dbUtils = require('../utils/db-utils.js')

module.exports = {
    async getAllStudents() {
        let sql = `select * from user left join userscore u on user.id = u.user_id left join (
            SELECT user_id, avg(score) assignments_score
            FROM assignments
            group by user_id
        ) a  on u.user_id=a.user_id where is_admin=0`
        let res = await dbUtils.query(sql)
        if (Array.isArray(res) && res.length > 0) {
            let arr = []
            res.forEach(item => {
                let obj = {}
                obj.userId = item.id
                obj.avatar = item.avatar
                obj.username = item.username
                obj.nickname = item.nick_name
                obj.review_score = item.review_score || 0
                obj.daily_score = item.daily_score || 0
                obj.examination_score = item.examination_score || 0
                obj.middle_score = item.middle_score || 0
                obj.assignments_score = item.assignments_score || 0
                arr.push(obj)
            })
            return arr
        }
        return null
    },
    /**
     * 通过id获取学生信息
     * @param {*} id 
     */
    async getStudentById(id, isAdmin) {
        let sql = `SELECT daily_score,nick_name as nickname,examination_score,middle_score,review_score, assignments_score ,avatar from user left join userscore u on user.id = u.user_id
        left join (
           SELECT user_id, avg(score) assignments_score
           FROM assignments
           group by user_id
       ) a
        on a.user_id=u.user_id
        where id=${id} ;`
        let res = await dbUtils.query(sql)
        let obj = {}
        if (Array.isArray(res) && res.length > 0) {
            obj = res[0]
        } else {
            return null
        }
        let sql2 = `select id, times_number as time ,score from assignments where user_id=${id} order by times_number asc ;`
        let res2 = await dbUtils.query(sql2)
        obj.assignments = res2 || []

        if (!isAdmin) {
            let sql3 = `select * from settings`
            let res3 = await dbUtils.query(sql3)
            if (!res3) {
                return null
            }
            let daily_score = res3[0]['daily_score']
            let examination_score = res3[0]['examination_score']
            let middle_score = res3[0]['middle_score']
            let review_score = res3[0]['review_score']
            let assignments_score = res3[0]['assignments_score']
            let show_examination = res3[0]['show_examination']
            obj.totalScore = (daily_score * obj.daily_score + examination_score * obj.examination_score + middle_score * obj.middle_score + review_score * obj.review_score + assignments_score * obj.assignments_score) / 100
            obj.totalScore = obj.totalScore.toFixed(2)
            if (!show_examination) {
                obj.examination_score = 0
            }
        }
        return obj
    },
    /**
     * 修改学生单次作业信息
     * @param {*} body 
     * @returns 
     */
    async changeOneWork(body) {
        let sql = `update assignments set score=${body.score} where id=${body.id}`
        let res = await dbUtils.query(sql)
        if (res) {
            return res
        } else {
            return null
        }
    },
    /**
     * 修改学生的期中成绩，考试成绩等
     * @param {*} body 
     * @returns 
     */
    async changeOtherScore(body) {
        let sql = `update userscore set daily_score=${body.daily_score},examination_score=${body.examination_score},middle_score=${body.middle_score},review_score=${body.review_score} where user_id=${body.userId}`
        let res = await dbUtils.query(sql)
        if (res) {
            return res
        } else {
            return null
        }
    },

    /**
     * 获取全班的平均成绩
     */
    async getAverage() {
        let sql = `select avg(daily_score) as dailyAVG,avg(middle_score) as middleAVG,avg(examination_score) as examinationAVG,avg(review_score) as reviewAVG from userscore`
        let res = await dbUtils.query(sql)
        let obj = {}
        if (res) {
            obj = res[0]
        } else {
            return null
        }
        let sql2 = `select avg(score) as score,times_number as time from assignments group by times_number order by times_number asc`
        let res2 = await dbUtils.query(sql2)
        obj.assignments = res2 || []
        return obj

    },
    /**
     * 
     * @param {Array} value 
     * @returns 
     */
    async addAssignments(value) {

        let sql = `update settings set assignments_count=assignments_count+1`
        let res = await dbUtils.query(sql)
        if (res) {
        } else {
            return null
        }
        let sql2 = `select * from settings`
        let res2 = await dbUtils.query(sql2)
        let count = null
        if (res2) {
            count = res2[0]['assignments_count']
        } else {
            return null
        }
        console.log(value, count);
        for (let i in value) {
            let sql = `insert into assignments (user_id,score,times_number) values (${value[i].userId},${value[i].score},${count})`
            let res = await dbUtils.query(sql)
            if (res) { }
            else { return null }
        }
        return true
    },
    async getMachineList(value) {
        let sql = `select * from machine `
        let res = await dbUtils.query(sql)
        let ans = res.filter((item) => {
            if (value.status > 0) {
                if (item.status !== value.status) {
                    return false
                }
            }
            if (value.createTime) {
                if (item.createTime < value.createTime) {
                    return false
                }
            }
            if (value.type) {
                if (item.type !== value.type) {
                    return false
                }
            }
            return true
        })
        let sql2 = `select * from bookingmachine where state=1`
        let arr = await dbUtils.query(sql2)
        ans = ans.map((item) => {
            if (arr.findIndex((obj) => obj.machineid === item.id) >= 0) {
                item.has_booking = 1
            } else {
                item.has_booking = 0
            }
            return item
        })
        return ans
    },

    async bookingMachine(id, value) {
        if (value.state === 0) {
            let sql = `update bookingmachine set state=0  where machineid=${value.id} and userid=${id}`
            let res = await dbUtils.query(sql)
            if (res) {
                return true
            } else {
                return false
            }
        }
        let sql = `select * from bookingmachine where machineid=${value.id}`
        let res = await dbUtils.query(sql)
        for (let i in res) {
            if (res[i].startTime <= value.startTime && res[i].endTime >= value.startTime) {
                return false
            }
            if (res[i].startTime <= value.endTime && res[i].endTime >= value.endTime) {
                return false
            }
            if (res[i].startTime >= value.startTime && res[i].endTime <= value.endTime) {
                return false
            }
            if (res[i].startTime <= value.startTime && res[i].endTime >= value.endTime) {
                return false
            }
        }
        let sql2 = `insert into bookingmachine (machineid,userid,startTime,endTime) values (${value.id},${id},${value.startTime},${value.endTime})`
        let res2 = await dbUtils.query(sql2)
        if (res2) {
            return true
        } else {
            return false
        }
    },
    async getAllCourse(value) {
        let sql = `select * from course`
        let res = await dbUtils.query(sql)
        let ans = res.filter((item) => {
            if (value.name) {
                if (item.name.includs(value.name)) {
                    return false
                }
            }
            if (value.teacher) {
                if (item.teacher !== value.teacher) {
                    return false
                }
            }
            if (value.startTime && value.endTime) {
                if (item.startTime <= value.startTime && item.endTime >= value.endTime) {
                    return true
                }
                return false
            }
            return true
        })
        let sql2 = `select * from bookingcourse where state=1`
        let arr = await dbUtils.query(sql2)
        ans = ans.map((item) => {
            if (arr.findIndex((obj) => obj.courseid === item.id) >= 0) {
                item.has_booking = 1
            } else {
                item.has_booking = 0
            }
            return item
        })
        return ans
    },

    async bookingCourse(id, value) {
        let sql = `select * from bookingcourse where courseid=${value.id} and userid=${id} and state=1`
        let res = await dbUtils.query(sql)
        if (value.state === 0) {
            let sql2 = `update bookingcourse set state=0 where courseid=${value.id} and userid=${id}`
            let res2 = await dbUtils.query(sql2)
            if (res2) {
                return true
            } else {
                return false
            }
        }
        if (res.length > 0 && value.state) {
            return false
        }
        let sql2 = `insert into bookingcourse (courseid,userid,state) values (${value.id},${id},1)`
        let res2 = await dbUtils.query(sql2)
        if (res2) {
            return true
        } else {
            return false
        }
    },
    async getAllBookingCourse(id) {
        let sql = `select * from bookingcourse left join course c on bookingcourse.courseid=c.id where userid=${id} and state=1`
        let res = await dbUtils.query(sql)
        return res
    },
    async getAllBookingMachine(id) {
        let sql = `select * from bookingmachine left join machine c on bookingmachine.machineid=c.id where userid=${id}`
        let res = await dbUtils.query(sql)
        return res
    },
    async getPlan(id) {
        let sql = `select * from plan where userid=${id} and state=1`
        let res = await dbUtils.query(sql)
        return res
    },
    async bookingPlan(id, value) {
        let sql = `select * from plan where userid=${id}`
        let res = await dbUtils.query(sql)
        for (let i in res) {
            if (res[i].startTime <= value.startTime && res[i].endTime >= value.startTime) {
                return false
            }
            if (res[i].startTime <= value.endTime && res[i].endTime >= value.endTime) {
                return false
            }
            if (res[i].startTime >= value.startTime && res[i].endTime <= value.endTime) {
                return false
            }
            if (res[i].startTime <= value.startTime && res[i].endTime >= value.endTime) {
                return false
            }
        }
        let sql2 = `insert into plan (userid,info,startTime,endTime,state) values (${id},'${value.info}',${value.startTime},${value.endTime},1)`
        let res2 = await dbUtils.query(sql2)
        if (res2) {
            return true
        } else {
            return false
        }
    },

    async updatePlan(id, value) {
        let updateKey = ""
        if (value.info) {
            updateKey += `info='${value.info}' `
        }
        if (value.startTime) {
            if (updateKey.length > 0) {
                updateKey += ','
            }
            updateKey += `startTime=${value.startTime} `
        }
        if (value.endTime) {
            if (updateKey.length > 0) {
                updateKey += ','
            }
            updateKey += `endTime=${value.endTime} `
        }
        if (value.state !== undefined) {
            if (updateKey.length > 0) {
                updateKey += ','
            }
            updateKey += `state=${value.state} `
        }
        if (value.type) {
            if (updateKey.length > 0) {
                updateKey += ','
            }
            updateKey += `type='${value.type}' `
        }
        // 检查是否有重复
        let sql = `select * from plan where userid=${id}`
        let res = await dbUtils.query(sql)
        for (let i in res) {
            if (res[i].id === value.id) {
                continue
            }
            if (res[i].startTime <= value.startTime && res[i].endTime >= value.startTime) {
                return false
            }
            if (res[i].startTime <= value.endTime && res[i].endTime >= value.endTime) {
                return false
            }
            if (res[i].startTime >= value.startTime && res[i].endTime <= value.endTime) {
                return false
            }
            if (res[i].startTime <= value.startTime && res[i].endTime >= value.endTime) {
                return false
            }
        }

        let sql2 = `update plan set ${updateKey} where id=${value.id}`
        let res2 = await dbUtils.query(sql2)
        if (res2) {
            return true
        } else {
            return false
        }
    }



}
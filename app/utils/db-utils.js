const mysql = require('mysql')
const allConfig = require('../../config.js')
const config = allConfig.database

const pool = mysql.createPool({
    user: config.USERNAME,
    password: config.PASSWORD,
    database: config.DATABASE,
    host: config.HOST,
    port: config.PORT
})


let query = function (sql,values){
    return new Promise((resolve,reject) => {
        pool.getConnection(function (err,connection){
            if(err){
                reject(err)
            }else{
                connection.query(sql,values,(err,rows) => {
                    if(err){
                        reject(err)
                    }else{
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}


module.exports={
    query,
}

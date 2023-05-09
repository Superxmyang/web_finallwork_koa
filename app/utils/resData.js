module.exports={
    /**
     * 返回处理成功的结果
     * @param {*} data 返回的数据
     * @param {string} msg 返回的提示信息
     * @returns 
     */
    successRes(data,msg){
        return {
            code:0,
            data,
            msg
        }
    },
    /**
     * 
     * @param {*} data 返回的数据
     * @param {*} msg 返回的提示信息
     * @returns 
     */
    failRes(data,msg){
        return {
            code:1,
            data,
            msg
        }
    }
}
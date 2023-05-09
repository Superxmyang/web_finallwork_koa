const Koa = require('koa')
const koaLogger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const config = require("../config.js")
const routers=require("./routers/index.js")
const session=require('koa-session')
const app = new Koa()

app.use(koaLogger())

app.use(bodyParser())
//配置路由
app.use(routers.routes())
//配置session
app.use(session(app))

app.listen(config.port)
console.log('the server is start at port ',config.port)

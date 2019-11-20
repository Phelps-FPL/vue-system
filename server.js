const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();

//引入api
const users = require('./router/api/users');
const profile = require('./router/api/profile');

// db config
const db =  require('./config/keys').mongoURI;

//使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// db connect
mongoose.connect(db)
.then(()=> console.log('MongoDB connected'))
.catch(err => console.log(err))

//passport 初始化
app.use(passport.initialize());
//把passport的内容引入到config下的passport文件里写token
require('./config/passport')(passport);

//设置路由路径

// app.get("/",(req,res)=>{
//     res.send('hello world');
// })

//使用routes
app.use("/api/users", users);
app.use("/api/profiles", profile);

//设置监听端口开发环境
const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})
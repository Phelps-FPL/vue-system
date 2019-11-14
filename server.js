const express = require('express');
const app = express();

//设置路由路径
app.get("/",(req,res)=>{
    res.send('hello world');
})
//设置监听端口开发环境
const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})
// login && register
const express =  require('express');
const router =  express.Router();
const bcrypt =  require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const keys = require('../../config/keys');
const passport = require("passport");

const User =  require('../../models/Users');
// key名称引用key里的secret


    //rout GET api/users/test
    //@desc  返回json
    //access public
router.get('/test',(req,res)=> {
    res.json({msg:"login success"});
});

//rout POST api/users/register
//access public
router.post('/register',(req,res)=> {
    // console.log(req.body);

    //查询数据库中是否有邮箱
    User.findOne({email:req.body.email})
        .then((user)=>{
            if(user){
                //有则返回
                return res.status(400).json({email:'邮箱已被注册!'});
            }else{
                //添加头像
                const avatar = gravatar.url('req.body.email', {s: '200', r: 'pg', d: 'mm'});
                //没有则创建新邮箱
                const newUser = new User({
                    name:req.body.name,
                    email:req.body.email,
                    avatar,
                    password:req.body.password
                })
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, function(err, hash) {
                        // Store hash in your password DB.
                        if(err) throw err;
                        //没错误 则加密
                        newUser.password = hash;
                        //保存在数据中
                        newUser.save().then(user=> res.json(user))
                        .catch(err => console.log(err));
                    });
                });
            }
        })

});

//rout POST api/users/login
    //@desc  返回token jwt password
    //access public
router.post('/login',(req,res)=>{
    const email =  req.body.email;
    const password = req.body.password;
    //查询数据库与登录的是否一致
    User.findOne({email})
    .then(user => {
        if(!user){
        return res.status(404).json({email:'用户不存在!'});
        }
        //密码匹配
        bcrypt.compare(password, user.password)
        .then(isMatch =>{
            // 匹配,则返回一个token
            if(isMatch){
                const rule = {id:user.id, name:user.name};
                jwt.sign(rule,keys.secretOrKey,{expiresIn:3600},(err,token)=>{
                    if(err) throw err;
                    res.json({
                        success:true,
                        token:"Bearer " + token
                    });
                })
                // res.json({msg:'success'});
            }else{
                return res.status(400).json({password:'密码不正确!'});
            }
        })
    })
})
//rout GET api/users/current
    //@desc  返回 current的内容
    //access Private, 需要token验证
router.get('/current',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email
    });
} )

module.exports = router;
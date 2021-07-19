const express = require('express') // 익스프레스 모듈을 가져오기
const app = express() // 새로운 익스프레스 앱을 만들기
const port = 6000 // 서버로 두는 곳
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const config = require('./config/key')

const { auth } = require('./middleware/auth');
var { User } = require('./models/User');

app.use(bodyParser.urlencoded({extended: true})); //application/x-www-form-unlencoded 로 된 데이터를 분석해서 가져올 수 있게

app.use(bodyParser.json()); //application/json 로 된 데이터를 분석해서 가져올 수 있게
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify:false
}).then(()=> console.log('MongoDB Connected...')).catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World! Goodmorning!'))

app.get('/api/hello', (req,res) => {
    res.send("안녕하세요!")
})

app.post('/api/users/register',(req, res)=>{
    //회원가입에 필요한 정보들을 client에서 가져오면
    //그것들을 데이터베이스에 넣어준다.
    
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login',(req, res)=>{
    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({email:req.body.email},(err,user)=>{
        if(!user){
            return res.json({
                loginSucess: false,
                message:"제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch)
            return res.json({loginSucess:false, message:"비밀번호가 틀렸습니다."})

    //비밀번호까지 맞다면 토큰을 생성하기.
            user.generateToken((err, user)=> {
                if(err) return res.status(400).send(err);

                //토큰을 저장한다. 어디에? 쿠키, 로컬 스토리지(어디에 저장해야하는지에 대한 논란이 있다.) 여기선 쿠키에 저장
                res.cookie("x_auth", user.token)
                .status(200)
                .json({loginSucess: true, userId:user._id})
            })
        })
    })
})

app.get('/api/users/auth', auth, (req,res)=>{
    //여기까지 미들웨어를 통과해 왔다는 이야가는 Authentication이 true
    res.status(200).json({
        _id: req.user._id,
        //role 0 이면 일반유저 role가 0이 아니면 관리자
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email:req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

//로그아웃 라우터
app.get('/api/users/logout', auth, (res, req)=>{
    User.findOneAndUpdate({_id: req.user._id},
        {token:""}
        ,(err, user)=>{
            if(err) return res.json({success: false, err});
            return res.status(200).send({
                success: true
            })
        })
})

app.listen(port, ()=> console.log(`Example app listening on port ${port}!`))
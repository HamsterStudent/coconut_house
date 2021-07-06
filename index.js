const express = require('express') // 익스프레스 모듈을 가져오기
const app = express() // 새로운 익스프레스 앱을 만들기
const port = 6000 // 서버로 두는 곳
const bodyParser = require('body-parser');
const { User } = require("./models/User");

app.use(bodyParser.urlencoded({extended: true})); //application/x-www-form-unlencoded 로 된 데이터를 분석해서 가져올 수 있게

app.use(bodyParser.json()); //application/json 로 된 데이터를 분석해서 가져올 수 있게

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://chekov:chekov!@coconut.lcm3e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify:false
}).then(()=> console.log('MongoDB Connected...')).catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World! Goodmorning!'))

app.post('/register',(req, res)=>{
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

app.listen(port, ()=> console.log(`Example app listening on port ${port}!`))
const express = require('express') // 익스프레스 모듈을 가져오기
const app = express() // 새로운 익스프레스 앱을 만들기
const port = 6000 // 서버로 두는 곳

const mongoose =require('mongoose')
mongoose.connect('mongodb+srv://chekov:chekov!@coconut.lcm3e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify:false
}).then(()=> console.log('MongoDB Connected...')).catch(err => console.log(err))



app.get('/', (req, res)=> res.send('Hello World! hi'))
app.listen(port, ()=> console.log(`Example app listening on port ${port}!`))
import React, { useEffect } from 'react'
import axios from 'axios';
// import { response } from 'express';

function LandingPage(){
    useEffect(()=> {
        axios.get('/api/hello')
        .then(response => console.log(response.data))
    }, [])
    return (
        <div style={{
            display:'flex', justifyContent:'center', alignItems:'center',
            width:'100%', height:'100vh'
        }}>
            시작페이지 
        </div>
    )
}

export default LandingPage
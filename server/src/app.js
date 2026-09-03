const express=require('express');
const cors=require('cors');

const app=express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/api/health',(req,res)=>{
    res.json({success:true,message:'Server is running'});   
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});


module.exports=app;
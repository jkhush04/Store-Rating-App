const express=require('express');
const cors=require('cors');
const { errorHandler } = require('./middleware/errorHandler');

const app=express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/api/health',(req,res)=>{
    res.json({success:true,message:'Server is running'});   
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/stores', require('./routes/store.routes'));
app.use('/api/owner', require('./routes/owner.routes')); 

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

module.exports=app;
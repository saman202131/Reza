const express=require('express');const multer=require('multer');const fs=require('fs');const path=require('path');
const app=express();const PORT=process.env.PORT||3000;const ROOT=__dirname;const DATA=path.join(ROOT,'data','site.json');const UP=path.join(ROOT,'uploads');
fs.mkdirSync(path.dirname(DATA),{recursive:true});fs.mkdirSync(UP,{recursive:true});
if(!fs.existsSync(DATA))fs.writeFileSync(DATA,JSON.stringify({name:'گردونه شانس',segments:[]},null,2));
app.use(express.json({limit:'2mb'}));app.use(express.static(path.join(ROOT,'public')));app.use('/uploads',express.static(UP));
const storage=multer.diskStorage({destination:(req,file,cb)=>cb(null,UP),filename:(req,file,cb)=>{const ext=path.extname(file.originalname).toLowerCase();cb(null,Date.now()+'-'+Math.random().toString(36).slice(2)+ext)}});const upload=multer({storage});
function read(){return JSON.parse(fs.readFileSync(DATA,'utf8'))}function write(x){fs.writeFileSync(DATA,JSON.stringify(x,null,2))}
app.get('/api/site',(req,res)=>res.json(read()));
app.post('/api/save',(req,res)=>{write(req.body);res.json({ok:true})});
app.post('/api/upload',upload.single('image'),(req,res)=>res.json({ok:true,url:'/uploads/'+req.file.filename}));
app.listen(PORT,()=>console.log('running on '+PORT));

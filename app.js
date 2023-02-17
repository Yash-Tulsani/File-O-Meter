require('dotenv').config()
const express=require('express')
const path=require('path')
const ejs=require('ejs')
const bodyParser=require('body-parser')
const multer=require('multer');
const Database=require('./database')
const bcrypt=require('bcrypt');
const File=require('./models/File')
const { v4: uuid4}= require('uuid')

const storage= multer.diskStorage(
    {
       destination: (req,file,cb)=>{
        cb(null,'userFiles')
       },
       filename: (req,file,cb)=>{
        cb(null,`${file.originalname}`)
       } 
    }
)

let upload=multer({
    storage: storage,
    limits: {
        fileSize : 1000000*100
        // file of maximum size 100 mb can only be uploaded
    }
}
   
)

let app=express();

app.use(bodyParser.urlencoded({
    extended:true
}))

app.use(bodyParser.json());

app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));

app.get('/',(req,res)=>{
    res.render("index.ejs")
})



async function handleDownload(req,res,file){
    file.downloadCount++;
   await file.save();
   res.download(file.path,file.name);
  
}



app.get('/file/:uuid',async (req,res)=>{
  
    try{
    const file= await File.findOne({uuid:req.params.uuid})
    
    // if no such file exits or the file link has expired
    if(!file){
        return res.render('downloadPage.ejs',{error: 'Link has been expired'})
    }
    
    // File is not password protected then simply render the download page
    if(file.password==null || file.password==undefined || file.password=='') {
   
       res.render('downloadPage.ejs',{
        uuid: file.uuid,
        fileName : file.name,
        size: Math.round(file.size/1024),
        download : `${process.env.APP_LEVEL_URL}/file/download/${file.uuid}`
       })
       
       
       return;
    }
    else{
        // file has password
        
        res.render('downloadPage.ejs',{
            uuid: file.uuid,
            fileName : file.name,
            size: Math.round(file.size/1024),
            download : `${process.env.APP_LEVEL_URL}/file/download/${file.uuid}`
           })
           
           return;
    }
   
    // return res.render('downloadPage.ejs')
}
catch(err){
    console.log(err);
    return res.render('fileDownload.ejs',{error: 'Something went wrong'})
}

})


app.post('/file/:id',async (req,res)=>{
    
    console.log(req.body.password);
    const file=await File.findOne({uuid:req.params.id});
   
    if(bcrypt.compareSync(req.body.password,file.password)){
        handleDownload(req,res,file);   
    }
    else{
        console.log("wrong password");
       return res.json({success:false});
        
    }

})


app.post('/upload',upload.single("myFile"), async (req,res)=>{
    if(!req.file){
       return res.json({error:"All fields are required"})
    }
  
   const fileData={
    uuid: uuid4(),
    name: req.file.originalname,
    path : req.file.path,
    size: req.file.size
   }

   const file= await File.create(fileData);
   
   res.json({fileLink: `${process.env.APP_LEVEL_URL}/file/${file.uuid}`})

   
})

app.post('/send-email',async (req,res)=>{
    let {uuid,senderEmail,receiverEmail}=req.body;

    if(uuid==null || uuid==undefined || receiverEmail==null || receiverEmail==undefined|| senderEmail==null || senderEmail==undefined){
       return res.status(422).json({err: "All fields are required"})
    }



    let file= await File.findOne({uuid: uuid});
    
    let allReceivers=file.receivers;
    if(file.receivers.length){
        if(allReceivers.contains(receiverEmail)){
          return res.status(200).send({alreadySent: true})
        }
    }

    file.sender=senderEmail;
    file.receivers.push(receiverEmail);
    await file.save();
    const sendMail=require('./services/emailService');
    try{
        
    sendMail({
        from: senderEmail,
        to: receiverEmail,
        subject: "File-o-Meter File sharing",
        text: `${senderEmail} shared a file with you.`,
        html: require('./services/emailTemplate')(
            {
                emailFrom: senderEmail, 
                downloadLink: `${process.env.APP_LEVEL_URL}/file/download/${file.uuid}`, 
                size: `${parseInt(file.size/1000)}kb`, 
                expires: "24hrs"
            }
        )
    })
 
    return res.send({success: true})
}
catch(err){
    return res.status(500).send({err: "Error in sending email"})
}

   
    
})

app.post('/set-password',async (req,res)=>{
    let password=req.body.password;
    let uuid=req.body.uuid;

    let file=await File.findOne({uuid:uuid});
    
    if(password!=null && password!=undefined && password!=''){
        const passwordHash= bcrypt.hashSync(req.body.password,10);
        file.password=passwordHash;
       try{ 
       await file.save();
       return res.status(200).send({success:true});
       }
       catch(err){
        return res.status(400).send({success:false});
       }
       
    }
    else{
        return res.status(400).send({success:false});
    }
})

const port=process.env.PORT || 2000;

app.listen(port);
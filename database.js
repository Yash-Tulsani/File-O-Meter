require('dotenv').config()
const mongoose =require('mongoose');

// import and export of modules are singleton by default in ES6 module loader

class Database{

    //private
   #connnectionString=`mongodb+srv://phoenixReborn:${process.env.PASSWORD}@cluster0.gywglgt.mongodb.net/?retryWrites=true&w=majority`

    constructor(){
        this.connectDB();
    }

    connectDB(){
        mongoose.connect(this.#connnectionString,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
       
    }).then(()=>{
        console.log("DB connected successfully")
    }).catch((err)=>{
        console.log(err);
    })
    }
}

module.exports= new Database();
// importing/exporting modules in EJS follows singleton pattern
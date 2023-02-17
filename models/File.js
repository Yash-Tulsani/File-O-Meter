
const mongoose=require('mongoose');

const fileSchema=mongoose.Schema({
    uuid:{
        type:String,
        required: true
    },

    createdAt:{
        type:Date,
        default: Date.now
    },

    name:{
        type:String,
        required: true
    },



    path:{
        type: String,
        required: true
    }
    ,

    password:{
        type: String,
        default: undefined
    },

    downloadCount:{
        type: Number,
        default: 0
    },

    sender :{
        type: String,
        required: false
    }
    ,
    receivers:{
        type: Array,
        required: false
    },

    size:{
        type: Number,
        required:true
    }

})

module.exports=mongoose.model("File",fileSchema);
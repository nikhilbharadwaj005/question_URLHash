var mongoose=require('mongoose');

var hashCodesSchema=new mongoose.Schema({
    hashCode:{
        type: String
    },
    longUrl:{
        type: String
    }
})

module.exports=mongoose.model('hashCodes',hashCodesSchema);
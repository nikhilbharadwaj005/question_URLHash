var mongoose=require('mongoose');

var visitedCodesSchema=new mongoose.Schema({
    hashCode:{
        type: String
    }
})

module.exports=mongoose.model('visitedCodes',visitedCodesSchema);
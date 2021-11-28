var hashCodesModel=require("../models/hashCodes");
var visitedCodesModel=require("../models/visitedCodes");

// https://www.geeksforgeeks.org/string-hashing-using-polynomial-rolling-hash-function/

encode=function(str)
{
      
    // P and M
    let p = 31;
    let m = (1e9 + 9);
    let power_of_p = 1;
    let hash_val = 0;
  
    // Loop to calculate the hash value
    // by iterating over the elements of String
    for(let i = 0; i < str.length; i++)
    {
        hash_val = (hash_val + (str[i].charCodeAt() -
                    'a'.charCodeAt() + 1) * power_of_p) % m;
        power_of_p = (power_of_p * p) % m;
    }
    return hash_val;
}

exports.hashUrl=(request,response) => {
    console.log(request.body);
    var urlHashCode=encode(request.body.url);

    console.log(urlHashCode);

    var HashUrlRecord = new hashCodesModel({
        hashCode: urlHashCode,
        longUrl: request.body.url
    });

    HashUrlRecord.save((err,savedHashUrl) => {
        if(err){
            console.log(err);
            return response.status(500).json({
                message: err.message
            })
        }

        
        return response.status(200).json({
            hashUrl: "https://question-url-hash-ilfn3.ondigitalocean.app/"+savedHashUrl.hashCode
        })
    })
}

exports.visitUrl=(request,response) => {
    visitedCodesModel.findOne({hashCode: request.params.id}).then((visitedCode) => {
        if(visitedCode){
            // return 204 no content response
            return response.status(204).json({
                message: "You can use this url only once"
            })
        }else{
            var markVisited=new visitedCodesModel({
                hashCode: request.params.id
            });

            markVisited.save((err,savedRecord) => {
                if(err){
                    console.log(err);
                    return response.status(500).json({
                        message: err.message
                    })
                }

                hashCodesModel.findOne({hashCode: request.params.id}).then((foundRecord) => {
                    if(foundRecord){   
                        if(foundRecord.longUrl.indexOf("http")<0){
                            return response.redirect(307, "http://"+foundRecord.longUrl);
                        } 
                        return response.redirect(307, foundRecord.longUrl);
                    }else{
                        return response.status(404).json({
                            message: "URL doesn't exists"
                        })
                    }
                })
            })
        }
    })
}
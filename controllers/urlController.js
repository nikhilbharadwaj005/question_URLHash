// Database collection Models
var hashCodesModel=require("../models/hashCodes");
var visitedCodesModel=require("../models/visitedCodes");

//planned to use redis 
//but using an object to cache hashcode and its urls
var cacheCodes={}

// Used polynomial rolling hash function. Used below resource
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

    //if empty url is provided
    if(request.body.url.length==0){
        return response.status(200).json({
            hashUrl: ""
        })
    }

    //hash the url
    var urlHashCode=encode(request.body.url);


    var HashUrlRecord = new hashCodesModel({
        hashCode: urlHashCode,
        longUrl: request.body.url
    });

    //save the hashcode and url mapping
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

    // check in cache object if visited, if visited, respond with 204
    if(cacheCodes[request.params.id]!=undefined){
        return response.status(204).json({
            message: "You can use this url only once"
        })
    }

    //else find and mark as visited in DB and cache as well

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

                        // add http is not present (eg: google.com turns to http://google.com)
                        if(foundRecord.longUrl.indexOf("http")<0){
                            cacheCodes[request.params.id]="http://"+foundRecord.longUrl;
                            return response.redirect(307, "http://"+foundRecord.longUrl);
                        } 
                        
                        cacheCodes[request.params.id]=foundRecord.longUrl;
                        return response.redirect(307, foundRecord.longUrl);
                    }else{

                        // if wrong hashcode is given
                        return response.status(404).json({
                            message: "URL doesn't exists"
                        })
                    }
                })
            })
        }
    })
}
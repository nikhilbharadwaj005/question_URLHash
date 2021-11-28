var express=require('express');

var urlController=require('../controllers/urlController');

var routes=express.Router();


routes.post("/hashUrl",urlController.hashUrl);
routes.get("/:id",urlController.visitUrl);  // here :id is the hashcode generated

module.exports=routes;
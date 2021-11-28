var express=require('express');

var bodyParser=require('body-parser');

var mongoose=require('mongoose');
var cors=require('cors');

var routes=require("./routes");
var config=require("../config/config");

var app=express();
var port=process.env.PORT || 3500;

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())

app.use('/',routes);

mongoose.connect(config.db,{ useNewUrlParser: true, useUnifiedTopology: true });

const connection=mongoose.connection;

connection.once('open',() => {
	console.log("DB Connected");
})

connection.on('error',(err) => {
	console.log(err);
	console.log("Something went wrong");
})

app.listen(port);

console.log("Listening on port: "+ port);
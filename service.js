var express = require('express');
var bodyParser = require('body-parser');
var sha1 = require('js-sha1');
var md5 = require('md5');

var app = express();

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';

app.use(bodyParser.urlencoded({extended: false}));

module.exports = (function(app){
	app.get('/', function(req, res){
		console.log("GET Method");
		res.end("GET Method");
	});

    app.post('/login', function(req, res){
        console.log("username: "+req.body.username);
        console.log("password: "+req.body.password);

        MongoClient.connect(url, function(err, database){
            const myDB = database.db('SoftwareEn');
            myDB.collection('user').findOne({ username:req.body.username},
            function(err, user){
                if(user == null){
                    res.end("User Invalid");
                }else if(user.username === req.body.username && 
                    user.password === md5(req.body.password)){
                        var authorization;
                        if (user.Authorization === "1783bdb83dbfab7739f82b3817eef16b"){
                            authorization = "pinyo";
                        }else if (user.Authorization === "21232f297a57a5a743894a0e4a801fc3"){
                            authorization = "admin";
                        }else{
                            authorization ="no authorization"
                        }
                        res.json({"Login success":true,
						"Name":user.name,
						"Age":user.age,
                        "Gender":user.gender,
						"Authorization":authorization});
                }else{
                    console.log("Credentials wrong");
                    res.end("Password incorrect");
                }
            });
        });
    });
});
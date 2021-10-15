var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var rand = require("random-key");
var validator = require('validator');
var config = require('config');



router.get('/getall/:locale', function(req, res) 
{ 


    var valid=true;
    var errors={};
    var locales=['en','ar'];
	if(!req.params.locale || validator.isEmpty(req.params.locale)) { errors.locale = "locale is required."; valid = false; }
    else if(!locales.includes(req.params.locale)){ errors.locale = "locale is not valid"; valid = false; }

	if (valid == false) { return res.json({ status: false, message: "Validation Fails.", errors: errors }); }
    else 
    {
            var db=mysql.createConnection(config.db);
            var sql ="SELECT IF(name=''|| name IS NULL ,'',name) AS name ,  IF(`"+req.params.locale+"`=''|| `"+req.params.locale+"` IS NULL ,'',`"+req.params.locale+"`) AS trans FROM `translations` WHERE status='1'";

            db.connect(function(error) 
            {
                if(error){ return res.json(error); }
                db.query(sql, function (error,data) 
                {
                    if(error){ return res.json(error); }
                    else
                    {
                        return res.json({status:true,translations:data});
                    }

                });

            });   


    }




});



module.exports = router;

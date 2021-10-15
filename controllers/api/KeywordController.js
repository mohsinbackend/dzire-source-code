var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var rand = require("random-key");
var validator = require('validator');
var config = require('config');
var Listing = require('../../models/Listing');




router.get('/getbylistingalpha/:alpha?',async function(req, res) 
{
    
    

    var get={};
    var errors={};
    
	if(!req.params.alpha || validator.isEmpty(req.params.alpha)) { errors.alpha=`alpha is required.`; }
    else if(!validator.isByteLength(req.params.alpha, { min: 1, max: 100 })) {errors.alpha="alpha length is min 2 & max 100."; }
    else{get.alpha=req.params.alpha; }

	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {

        let names = await Listing.GetNamesByLikeAlpha(get.alpha);
        return res.json({'status':true,'names':names,'message':"success"});	
    
    }



});





router.get('/getall/:locale?', function(req, res) 
{
    
    
    

    var valid=true;
    var errors={};
    var locale="";
    var locales=['en','ar'];
    
    if(!req.params.locale || validator.isEmpty(req.params.locale)) { errors.locale = "locale is required."; valid = false; }
    else if(!locales.includes(req.params.locale)){ errors.locale = "locale is not valid"; valid = false; }
    else { locale = req.params.locale;  }


	if (valid == false) { return res.json({ status: false, message: "Validation Fails.", errors: errors }); }
    else 
    {

        var db = mysql.createConnection(config.db);
            
        db.connect(function(err) 
        {
            if (err){return res.json({status:false,message:err.sqlMessage}); }
            else
            {   
                var sql ="SELECT id ,IF("+locale+"_name IS NULL,'',"+locale+"_name) AS name FROM `keywords`";
                db.query(sql, function (err,keywords) 
                {
                    if (err){ return res.json({status:false,message:err.sqlMessage}) }
                    else if(!keywords)
                    {
                        return res.json({status:false,message:'Keywords not available'});
                    }
                    else
                    {
                        return res.json({ status:true,message:'success',keywords:keywords });
                    }
                
                });
        

            }
            

        }); 


    }    

  


});


router.get('/getbykey/:locale?/:key?', function(req, res) 
{
    
    
    var get={};
    var errors={};
    var valid=true; 
    var locales=['en','ar'];
    
    if(!req.params.key || validator.isEmpty(req.params.key)) { errors.key = "Key name is required."; valid = false; }
    else { get.key = req.params.key; }

    if(!req.params.locale || validator.isEmpty(req.params.locale)) { errors.locale = "locale is required."; valid = false; }
    else if(!locales.includes(req.params.locale)){ errors.locale = "locale is not valid"; valid = false; }
    else { get.locale = req.params.locale;  }
    
    
	if (valid == false) { return res.json({ status: false, message: "Validation Fails.", errors: errors }); }
    else 
    {

        var db = mysql.createConnection(config.db);
            
        db.connect(function(err) 
        {
            if (err){return res.json({status:false,message:err.sqlMessage}); }
            else
            {   
                var sql ="SELECT id ,IF("+get.locale+"_name IS NULL,'',"+get.locale+"_name) AS name FROM `keywords` WHERE "+get.locale+"_name LIKE '%"+get.key+"%' ";
                db.query(sql, function (err,keywords) 
                {
                    if (err){ return res.json({status:false,message:err.sqlMessage}) }
                    else if(!keywords)
                    {
                        return res.json({status:false,message:'Keywords not found.'});
                    }
                    else
                    {
                        return res.json({ status:true,message:'success',keywords:keywords });
                    }
                
                });
        

            }
            

        }); 


    }    

  


});





module.exports = router;

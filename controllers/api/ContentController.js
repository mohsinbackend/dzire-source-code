var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('config');
var validator = require('validator');

var Content = require('../../models/Content');


router.get('/getall/:locale?', async function(req, res) 
{
    
    var get={};
    var errors={};
    if(!req.params.locale || validator.isEmpty(req.params.locale)) { errors.locale = "locale is required."; }
    else if(!config.locales.includes(req.params.locale)){ errors.locale = "locale is not valid"; }else { get.locale = req.params.locale;  }
   
	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
        let contents = await Content.GetAll(get.locale);
        return res.json({'status':true,'contents':contents,'message':'success'});
    }


});


router.get('/getbyid/:locale?/:content_id?', async function(req, res) 
{
   
    //return res.json('786 getbyid');
    
    var get={};
    var errors={};

    if(!req.params.locale || validator.isEmpty(req.params.locale)) { errors.locale = "Locale is required."; }
    else if(!config.locales.includes(req.params.locale)){ errors.locale = `Locale is not valid. Should be ${config.locales.toString()}.`; }
    else { get.locale = req.params.locale;  }
    
    if(!req.params.content_id || validator.isEmpty(req.params.content_id)){ errors.content_id=`Content id is required.`; }
    else if(!validator.isInt(req.params.content_id) ){ errors.content_id=`Content id must be integer.`; }
    else if( await Content.Exists(req.params.content_id)=='0'){errors.content_id=`Content id is not exists.`;}
    else{get.content_id=req.params.content_id;} 
    

	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
       let content = await Content.GetById(get.locale,get.content_id);
       return res.json({'status':true,'content':content,'message':'success'});
    
    }


});










module.exports = router;

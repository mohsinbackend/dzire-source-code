var express = require('express');
var router = express.Router();
var validator = require('validator');
var config = require('config');

var User = require('../../models/User');
var Region = require('../../models/Region');
var Country = require('../../models/Country');




router.get('/create/:locale?', async function (req, res) 
{

  
    var get={};
    var errors={};   
    if(!req.params.locale || validator.isEmpty(req.params.locale)) { errors.locale = "locale is required."; }
    else if(!config.locales.includes(req.params.locale)){ errors.locale=`locale is not valid. Only Allow : ${config.locales.toString()}.`; }
    else { get.locale = req.params.locale;  }

	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {

        //return res.json(await Country.GetLookup(get.locale));

        let countries = await Region.GetWithParent(get.locale); 
        return res.json({'status':true,message:'success',countries});      
      
    }

});





router.post('/store', async function (req, res) 
{

	var post={};
    var errors={};
    
    if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id=`User id is required.`; }
    else if(!validator.isInt(req.body.user_id) ){ errors.user_id=`User id must be integer.`; }
    else if( await User.Exists(req.body.user_id)=='0'){errors.user_id=`User id is not exists.`;}
    else{post.user_id=req.body.user_id;} 

	if(!req.body.region_id || validator.isEmpty(req.body.region_id)){ errors.region_id=`User id is required.`; }
    else if(!validator.isInt(req.body.region_id) ){ errors.region_id=`User id must be integer.`; }
    else if( await Region.Exists(req.body.region_id)=='0'){errors.region_id=`User id is not exists.`;}
    else{post.region_id=req.body.region_id;} 

    if(!req.body.country_id || validator.isEmpty(req.body.country_id)){ errors.country_id=`User id is required.`; }
    else if(!validator.isInt(req.body.country_id) ){ errors.country_id=`User id must be integer.`; }
    else if( await Country.Exists(req.body.country_id)=='0'){errors.country_id=`User id is not exists.`;}
    else{post.country_id=req.body.country_id;} 


	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
        let result = await User.SetCountryRegion(post.user_id,post.country_id,post.region_id);
        return res.json({'status':true,message:'success',result:result});      
    }


});






module.exports = router;

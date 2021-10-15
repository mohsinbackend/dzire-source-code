var express = require('express');
var router = express.Router();

var config = require('config');
var validator = require('validator');
var DB = require('../../config/Database');


var User = require('../../models/User');
var Country = require('../../models/Country');
var Contactus = require('../../models/Contactus');






//updated 2020
router.post('/submit', async function(req,res) 
{	 
	var post={};
    var errors={};

	if (!req.body.name || validator.isEmpty(req.body.name)) { errors.name = "Name is required."; }
	else if (!validator.isByteLength(req.body.name, { min: 3, max: 100 })) {errors.name="Name length is min 3 & max 100.";}else{post.name=req.body.name;}

	if (!req.body.phone || validator.isEmpty(req.body.phone)) { errors.phone = "Phone is required."; }
	else if (!validator.isByteLength(req.body.phone, { min: 7, max: 20 })) {errors.phone = "Phone length is min 7 & max 20.";}else{post.phone=req.body.phone;}

	if (!req.body.email || validator.isEmpty(req.body.email)) { errors.email = "Email is required."; }
	else if(!validator.isEmail(req.body.email)){ errors.email = "Email is not valid."; }
	else if(!validator.isByteLength(req.body.email, { min: 3, max: 100 })) {errors.name="Email length is min 3 & max 100."; }else{post.email=req.body.email; }

	if (!req.body.text || validator.isEmpty(req.body.text)) { errors.text = "Text is required."; }
	else if (!validator.isByteLength(req.body.text, { min: 3, max: 1000 })) { errors.text = "Text length is min 3 & max 1000."; }else{ post.text=req.body.text; }

	if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id="User id is required."; }
	else if(!validator.isInt(req.body.user_id) ){ errors.user_id="User  id must be integer."; }
	else if( await User.Exists(req.body.user_id)=='0'){errors.user_id="User id is not exists.";}else{post.user_id=req.body.user_id;} 
	
    if(!req.body.country_id || validator.isEmpty(req.body.country_id)){ errors.country_id=`Country id is required.`; }
    else if(!validator.isInt(req.body.country_id) ){ errors.country_id=`Country id must be integer.`; }
    else if( await Country.Exists(req.body.country_id)=='0'){errors.country_id=`Country id is not exists.`;}
	else{post.country_id=req.body.country_id;} 
	
	
	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
		let dbreulst = await Contactus.ApiSave(post);
		return res.json({'status':true,'message':"Contact has been successfully submited."});
	}	




});


module.exports = router;

var express = require('express');
var router = express.Router();
var md5 = require('md5');
var mysql = require('mysql');
var validator = require('validator');
var config = require('config');

var rand = require("random-key");
const fs = require('fs');
var config = require('config');

var Os = require('../../models/Os');
var User = require('../../models/User');
var Image = require('../../models/Image');
var Email = require('../../models/Email');
var Country = require('../../models/Country');

var Guest = require('../../models/Guest');






var DB = require('../..//config/Database');







//updated 2020
router.post('/login', async function (req, res) 
{

	
	var post = {}
	var errors = {};
	
	if (!req.body.os || validator.isEmpty(req.body.os)) { errors.os="OS name is required."; }
	else if(config.operating_systems.includes(req.body.os)==false) { errors.os=`OS name must be ${config.operating_systems.toString()}.`;  }	
	else { post.os_id =  await Os.getIdByName(req.body.os); }


	if (!req.body.device_token || validator.isEmpty(req.body.device_token)) { errors.device_token = "device_token is required.";  }
	else{post.device_token=req.body.device_token;  }

	if (Object.keys(errors).length > 0){ return res.json({ status: false, message: "Validation Fails.", errors: errors }); }
	else 
	{
		
		let dbguest = await Guest.GetByToken(post.device_token);
		if( (dbguest) && (dbguest.id) ) 
		{ 
			let update = await DB.execute(`UPDATE guests SET logged='1' WHERE id='${dbguest.id}' `);	
			return res.json({ status:true ,'guest':dbguest ,message:"success" }); 
		}
		else
		{
			let query='INSERT INTO guests SET ';
			query+=`status='1' `;
			query+=`,logged='1' `;
			query+=`,os_id='${post.os_id}' `;
			query+=`,device_token='${post.device_token}' `;
			query+=`,updated_at=CURRENT_TIMESTAMP ,created_at=CURRENT_TIMESTAMP `;
			let newguest = await DB.execute(query);
		
			let getguest = await Guest.GetById(newguest.insertId); 

			return res.json({ status: true,'guest':getguest,message:"success" });
			
		
		}
		
	
			
	}


});


router.post('/logout', async function (req, res) 
{
	
	
	
	var post = {}
	var errors = {};
	
	if(!req.body.guest_id || validator.isEmpty(req.body.guest_id)){ errors.guest_id="Guest id is required."; }
    else if(!validator.isInt(req.body.guest_id) ){ errors.guest_id="Guest  id must be integer."; }
    else if( await Guest.Exists(req.body.guest_id)=='0'){errors.guest_id="Guest id is not exists.";} 
    else{ post.guest_id=req.body.guest_id; }


	if (Object.keys(errors).length > 0){ return res.json({ status: false, message: "Validation Fails.", errors: errors }); }
	else 
	{
			
		let dbguest = await Guest.GetByToken(post.device_token);
		if( (dbguest) && (dbguest.id) ){ return res.json({ status: true,'guest':dbguest,message:"success" }); }
		else
		{
			let query='UPDATE guests SET ';
			query+=`logged='0',updated_at=CURRENT_TIMESTAMP  `;
			query+=`WHERE id='${post.guest_id}' `;
			let updateguest = await DB.execute(query);
			return res.json({ status:true,message:"Guest has been logout." });
			
		}
		
	
			
	}
	
	
	
	



});




module.exports = router;

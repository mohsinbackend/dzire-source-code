var express = require('express');
var router = express.Router();
var md5 = require('md5');
var mysql = require('mysql');
var validator = require('validator');
var config = require('config');
//var nodemailer = require('nodemailer');
var rand = require("random-key");
const fs = require('fs');
var config = require('config');

var Os = require('../../models/Os');
var User = require('../../models/User');
var Image = require('../../models/Image');
var Email = require('../../models/Email');
var Country = require('../../models/Country');
var Setting = require('../../models/Setting');
var EmailTemplate = require('../../models/EmailTemplate');
var UserNotification = require('../../models/UserNotification');


var db = require('../..//config/Database');
var Tenant = require('../../models/Tenant');
var Language = require('../../models/Language');





router.post('/langchange',async (req,res)=>{

	try
	{
		
		var post={};
		var errors={};
		
		if(!req.body.locale || validator.isEmpty(req.body.locale)) { errors.locale = "locale is required."; }
		else if(!config.locales.includes(req.body.locale)){ errors.locale=`locale is not valid. Only Allow : ${config.locales.toString()}.`; }
		else { post.locale = req.body.locale;  }

		if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id=`User id is required.`; }
		else if(!validator.isInt(req.body.user_id) ){ errors.user_id=`User id must be integer.`; }
		else if( await User.Exists(req.body.user_id)=='0'){errors.user_id=`User id is not exists.`;}
		else{post.user_id=req.body.user_id;} 
	
		if(Object.keys(errors).length > 0 ){ return res.json({status:false,message:"Validation fails.",errors:errors}); }
		else
		{
			const updated = await User.ChangeLang(post.locale,post.user_id);
			const message = await Language.One('lang_change_msg',post.locale);
			return res.json({status:true,message:message});

		}


	}catch(error){ return next(error);}
	
});




router.post('/email-check',async function(req,res)
{

	let post={}
	let errors={};

	if (!req.body.email || validator.isEmpty(req.body.email)) { errors.email = "Email is required.";  }
	else if (!validator.isByteLength(req.body.email,{min:5,max:50})){ errors.email = "Email length is min 3 & max 50.";  }
	else if (!validator.isEmail(req.body.email)){ errors.email = "Email is not valid.";  }else{ post.email = req.body.email; } 

	if(Object.keys(errors).length > 0 ){ return res.json({status:false,message:'fails',errors}); }
    else
    {
		let status;
		let message;
		if(await User.EmailCheck(post.email)){status=false;message='Email is already taken.';}
		else{status=true;message='Email is available.';}return res.json({status,message,errors});
	
	}


});





router.get('/totalearnings/:user_id?', async function (req, res) 
{
    
	var get={};
	var errors={};

    if(!req.params.user_id || validator.isEmpty(req.params.user_id)){ errors.user_id="User id is required."; }
    else if(!validator.isInt(req.params.user_id) ){ errors.user_id="Listing  id must be integer."; }
    else if( await User.Exists(req.params.user_id)=='0'){errors.user_id="Listing id is not exists.";}else{get.user_id=req.params.user_id;}  


	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
		const totalearnings = await User.TotalEarnings(get.user_id);
		const notification_switch = await UserNotification.GetSwitch(get.user_id);
		return res.json({'status':true,'notification_switch':notification_switch,'totalearnings':totalearnings,'message':"success"});	
	}


});






router.put('/email-update', async function (req, res) 
{	
	valid=true; var user={}; var errors={};

	if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id="User id is required.";valid = false; }
    else if(!validator.isInt(req.body.user_id) ){ errors.user_id="User  id must be integer."; valid=false; }else{ user.id=req.body.user_id }

	if(!req.body.email || validator.isEmpty(req.body.user_id)){ errors.email="email id is required.";valid = false; }
	else if(!validator.isByteLength(req.body.email,{ min: 5, max: 50 })){ errors.email="Email length is min 3 & max 50."; valid = false; }
	else if(!validator.isEmail(req.body.email)){ errors.email = "Email is not valid."; valid=false; }
	else
	{ 
		var dbuser = await User.id_email(req.body.user_id,req.body.email); 
		if(dbuser[0].exist=='1'){errors.email="Email is already taken."; valid=false;}else{ user.email=req.body.email }
	}	

	
	
	if(valid==false){ return res.json({status:false,message:"Validation Fails.",errors:errors}); }
	else
	{ 
		await db.execute(`UPDATE users SET email='${user.email}' WHERE id='${user.id}'`);
		return res.json({ status: true, message: 'Email has been successfully updated.'});
			
	}

	


	
});




//updated 2020
router.post('/update', async function (req, res) 
{


	var user={}; 
	var errors={};

	// if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id="User id is required."; }
    // else if(!validator.isInt(req.body.user_id) ){ errors.user_id="User  id must be integer."; }else{ user.id=req.body.user_id }
	
	if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id=`User id is required.`; }
    else if(!validator.isInt(req.body.user_id) ){ errors.user_id=`User id must be integer.`; }
    else if( await User.Exists(req.body.user_id)=='0'){errors.user_id=`User id is not exists.`;}
    else{user.id=req.body.user_id;} 

	
	if( !req.body.fname || validator.isEmpty(req.body.fname) ){ errors.fname = "First name is required."; }
	else if (!validator.isByteLength(req.body.fname, { min: 3, max: 20 })){ errors.fname = "First name length is min 3 & max 20."; }
	else{ user.fname=req.body.fname;  }
	
	if ( !req.body.lname || validator.isEmpty(req.body.lname)) { errors.lname = "Last name is required."; }
	else if(!validator.isByteLength(req.body.lname, { min: 3, max: 20 })){ errors.lname = "Last name length is min 3 & max 20."; }
	else{ user.lname=req.body.lname;  }
	
	// if( (req.files)  && Object.keys(req.files).length > 0 && req.files.image!=undefined &&  typeof(req.files.image)=='object' )
	// {                      
	// 	if( Math.round(req.files.image.size / 1024) > 5120 ){errors.image="Image size should be less than 5 Mb.";}
	// 	else if(!config.image_upload_types.includes(req.files.image.mimetype.split("/")[1])){ errors.image=`Image mimetype shuuld be ${config.image_upload_types.toString()}.`;  }
	// 	else{user.imgsrc=req.files.image;}
	// }


	// if( !req.body.image || !validator.isBase64(req.body.image) ){errors.image="Base64 image is required."; }
	// else{ user.imgbase64=req.body.image; }


	if((req.files && typeof(req.files)=='object') && (req.files.image && typeof(req.files.image)=='object')  )
    {
        if(config.imgobjstr!=Object.keys(req.files.image).toString()){ errors.image=`Image object not valid. should be ${config.imgobjstr}.`; }
        else if(!config.image_upload_types.includes(req.files.image.mimetype.split("/")[1])){ errors.image=`Image is not allow must be ${config.image_upload_types.toString()}.`; }
        else{user.imgsrc=req.files.image;} 
    }


	if(Object.keys(errors).length > 0){ return res.json({status:false,message:"Validation Fails.",errors:errors}); }
	else
	{ 



		var updquery="UPDATE users SET ";
		updquery+=` fname='${user.fname}' ,lname='${user.lname}' `;
		
		var dbuser = await db.first(`SELECT id,image FROM users WHERE id=${user.id}`);
		
		if(!dbuser || !dbuser.id){ return res.json({status:false,message:"User id is not exist.",errors:{}});  }		
		else
		{	
		
			if(user.imgsrc)
			{	
				
				var newimg = await Image.Upload('user',user.imgsrc);
				//var newimg = await Image.SaveForUser(user.imgsrc);
				if(newimg!=false)
				{
					var delresult = await Image.delete('user',dbuser.image);		
					if(delresult){ updquery+=`,image='${newimg}' `; }
				}
								
			}

			updquery+=` WHERE id='${user.id}' `;
			var dbupdate = await db.execute(updquery);
			var updUser = await User.profile(user.id);
			return  res.json({status:true,message:"Profile has been successfully updated.",user:updUser});

		}


		

		
	
	
	}





});





//updated 2020
router.post('/login', async function (req, res) 
{

	var user = {}
	var errors = {};
	if (!req.body.email || validator.isEmpty(req.body.email)) { errors.email = "Email is required."; }
	else if (!validator.isEmail(req.body.email)) { errors.email = "Email is valid."; }else{user.email=req.body.email; }
	
	if (!req.body.password || validator.isEmpty(req.body.password)) { errors.password = "Password is required."; }
	else if (!validator.isByteLength(req.body.password, { min: 6, max: 16 })) { errors.password = "Password length is min 6 & max 16."; }
	else{user.password=md5(req.body.password); }

	if (!req.body.os || validator.isEmpty(req.body.os)) { errors.os="OS name is required."; }
	else if(config.operating_systems.includes(req.body.os)==false) { errors.os=`OS name must be ${config.operating_systems.toString()}.`;  }	
	else { user.os_id =  await Os.getIdByName(req.body.os); }


	if (!req.body.device_token || validator.isEmpty(req.body.device_token)) { errors.device_token = "device_token is required.";  }
	else{user.device_token=req.body.device_token;  }

	if (Object.keys(errors).length > 0){ return res.json({ status: false, message: "Validation Fails.", errors: errors }); }
	else 
	{
		
		var dbuser = await db.first(`SELECT  id,fname,lname,email,status FROM users WHERE email='${user.email}' AND password='${user.password}'`);
		if(dbuser==undefined||typeof(dbuser)!='object'||dbuser.status==undefined){return res.json({status:false,message:'Invalid Creadentials!',errors:{} }); }
		else
		{
			switch(dbuser.status)
			{
				case '2': return res.json({status:false,message:'Account is unverified.',errors:{} });  break;
				case '0': return res.json({status:false,message:'Account is deactivated by admin.',errors:{} });  break;
				case '1': 		
					dbupdate= await db.execute(`UPDATE users SET os_id='${user.os_id}',device_token='${req.body.device_token}' WHERE id='${dbuser.id}'`);
					
					var loginuser = await User.profile(dbuser.id);
					const tenant = new Tenant();
					let tuser={}
					tuser.id=dbuser.id;
					tuser.token=user.device_token;
					tuser.name=`${dbuser.fname} ${dbuser.lname}`;
					const response = await tenant.RegisterNewUser(tuser);
					return res.json({ status:true,tenant:response.data,message:'success',user:loginuser });	 
				break;
			}

		}	
		

	}

});





//updated 2020
router.post('/email-resend', async function (req, res) 
{
	var user = {};
	var errors = {};
	if (!req.body.email || validator.isEmpty(req.body.email)) { errors.email = "Email is required.";  }
	else if (!validator.isEmail(req.body.email)) { errors.email = "Email is not valid.";  }
	else if (!validator.isByteLength(req.body.email, { min: 5, max: 50 })) { errors.email = "Email length is min 3 & max 50.";  }
	else{ var dbuser= await User.email(req.body.email); if(dbuser[0].exist=='0'){errors.email="Email is not exist.";}else{user.email = req.body.email;} }

	if (Object.keys(errors).length > 0){ return res.json({ status: false, message: "Validation Fails.", errors: errors }); }
	else 
	{
		
		user.email_code = rand.generateDigits(4);	
		var dbupdate = await db.execute(`UPDATE users  SET status='2' ,email_code='${user.email_code}' ,email_expiry=CURRENT_TIMESTAMP() WHERE email='${user.email}'`);
		
		var options={};
		options.to=user.email;
		options.subject='Email Resent';
		options.text=`Email verification code is [${user.email_code}]`;
		Email.sendText(options);
		return res.json({status:true,message:'Email has been successfully resent.'});
			
	}


});




//updated 2020
router.post('/register',async function (req, res) 
{

			
	var user = {};
	var errors = {};
	var db = mysql.createConnection(config.db);

	if (!req.body.lat || validator.isEmpty(req.body.lat)) { errors.lat = "latitude is required.";  }
	else{ user.lat = req.body.lat;}

	if (!req.body.lng || validator.isEmpty(req.body.lng)) { errors.lng = "longtitude is required."; }
	else{ user.lng = req.body.lng;}

	if (!req.body.fname || validator.isEmpty(req.body.fname)) { errors.fname = "First name is required.";  }
	else if (!validator.isByteLength(req.body.fname, { min: 3, max: 20 })) { errors.fname = "First name length is min 3 & max 20."; }
	else{ user.fname = req.body.fname;}

	if (!req.body.lname || validator.isEmpty(req.body.lname)) { errors.lname = "Last name is required."; }
	else if (!validator.isByteLength(req.body.lname, { min: 3, max: 20 })) { errors.lname = "Last name length is min 3 & max 20."; }
	else{ user.lname = req.body.lname;}

	if (!req.body.password || validator.isEmpty(req.body.password)) { errors.password = "Password is required."; }
	else if (!validator.isByteLength(req.body.password, { min: 6, max: 16 })) { errors.password = "Password length is min 6 & max 16.";  }
	else{ user.password = md5(req.body.password); }
	

	if(!req.body.device_token || validator.isEmpty(req.body.device_token)){ errors.device_token = "device_token is required."; }
	else{ user.device_token = req.body.device_token;  }
	
	if (!req.body.full_address || validator.isEmpty(req.body.full_address)) { errors.full_address = "full address is required."; valid = false; }
	else if (!validator.isByteLength(req.body.full_address, { min: 6, max: 255 })) { errors.full_address = "Full_address length is min 3 & max 255.";  }
	else{user.full_address = req.body.full_address; }
	
	
	if (!req.body.os || validator.isEmpty(req.body.os)) { errors.os = "OS name is required."; }
	else if(config.operating_systems.includes(req.body.os)==false) { errors.os = "OS name must be ios or android."; }
	else { user.os_id =  await Os.getIdByName(req.body.os); }

	
	if (!req.body.country_code || validator.isEmpty(req.body.country_code)){ errors.country_code = "country code is required."; }
	else{ user.country_id= await Country.getIdByCode(req.body.country_code); }

	
	if (!req.body.email || validator.isEmpty(req.body.email)) { errors.email = "Email is required.";  }
	else if (!validator.isEmail(req.body.email)) { errors.email = "Email is not valid.";  }
	else if (!validator.isByteLength(req.body.email, { min: 5, max: 50 })) { errors.email = "Email length is min 3 & max 50.";  }
	else{ var dbuser= await User.email(req.body.email); if(dbuser[0].exist=='1'){  return res.json({ status: false, message:"Email is already taken.",errors:{} });}
	else{user.email = req.body.email;} }



	if (Object.keys(errors).length > 0){ return res.json({ status: false, message: "Validation Fails.", errors: errors }); }
	else 
	{	
			
			
			const OTP = rand.generateDigits(4);		
			const emailtemplate = await EmailTemplate.Register(OTP);
			var insertQuery=`INSERT INTO users SET status='2',fname='${user.fname}',lname='${user.lname}',email='${user.email}',password='${user.password}',lat='${user.lat}',lng='${user.lng}',country_id='${user.country_id}',full_address='${user.full_address}',os_id='${user.os_id}',device_token='${user.device_token}',email_code='${OTP}' ,email_expiry=CURRENT_TIMESTAMP() ,updated_at=CURRENT_TIMESTAMP() ,created_at=CURRENT_TIMESTAMP() `;
			
			
			db.query(insertQuery,async function (err, dbInsert) 
			{
				if(err||!dbInsert.insertId){return res.json({ status:false, message:`Insert query error: ${err}.` ,errors:{} }); }
				else
				{

					var options={};
					options.to=user.email;
					options.subject=emailtemplate.title;
					options.text=emailtemplate.template;
					Email.sendText(options); 
					
					var newUser={};
					newUser.fname=user.fname;
					newUser.lname=user.lname;
					newUser.email=user.email;
					newUser.id=dbInsert.insertId;
					
					
					const tenant = new Tenant();
					let tuser={}
					tuser.id=newUser.id;
					tuser.token=user.device_token;
					tuser.name=`${user.fname} ${user.lname}`;
					const response = await tenant.RegisterNewUser(tuser);
					return res.json({ status:true,tenant:response.data,message:'Registration has been successfully completed.',user:newUser });

				}

				
			});
			
		
		
		
		
	}

});






//updated 2020
router.post('/email-verify', async function (req, res) 
{

	var user = {};
	var errors = {};
	
	if (!req.body.code || validator.isEmpty(req.body.code)){ errors.code = "Verify code is required."; }
	else if (!validator.isByteLength(req.body.code, { min:4,max:4})) { errors.code = "Code length is must be 4 digits.`";  }else{ user.code=req.body.code;}
	
	if (!req.body.email || validator.isEmpty(req.body.email)) { errors.email = "Email is required.";  }
	else if (!validator.isEmail(req.body.email)) { errors.email = "Email is not valid.";  }
	else if (!validator.isByteLength(req.body.email, { min: 5, max: 50 })) { errors.email = "Email length is min 3 & max 50.";  }else{user.email = req.body.email;} 

	if (Object.keys(errors).length > 0){ return res.json({ status: false, message: "Validation Fails.", errors: errors }); }
	else 
	{

		
		var dbmaster = await db.first(`SELECT users.id FROM users LEFT JOIN settings ON settings.id='1' WHERE settings.master_email_code='${user.code}'  AND users.email='${user.email}' `);
		if(dbmaster.id)
		{ 
			var dbupdate = await db.execute(`UPDATE users  SET status='1' ,email_code='0000' ,email_expiry=NULL WHERE id='${dbmaster.id}'`);
			return res.json({status:true,message:'Email verification procedure has been successfully completed. By master email code.'});
		}


		var dbuser = await db.first(`SELECT id ,status ,TIMESTAMPDIFF(SECOND,email_expiry,CURRENT_TIMESTAMP()) AS timediff FROM users WHERE status='2' AND email_code!='0000' AND email_code='${user.code}' AND email='${user.email}' `);
		if(!dbuser || !dbuser.id){ return res.json({status:false,message:'Invalid  verify code.'}); }
		else 
		{

			if(dbuser.timediff>config.user_timediff_second){ return res.json({status:false,message:'Verify code has been expired.'}); }
			else
			{	
				var dbupdate = await db.execute(`UPDATE users  SET status='1' ,email_code='0000' ,email_expiry=NULL WHERE id='${dbuser.id}'`);
				return res.json({status:true,message:'Email verification procedure has been successfully completed.'});
			}
			
		}



	
	}


});




//updated 2020
router.post('/forgotpass',async function (req, res) 
{

	var user = {};
	var errors = {};
	if (!req.body.email || validator.isEmpty(req.body.email)) { errors.email = "Email is required.";  }
	else if (!validator.isEmail(req.body.email)) { errors.email = "Email is not valid.";  }
	else if (!validator.isByteLength(req.body.email, { min: 5, max: 50 })) { errors.email = "Email length is min 3 & max 50.";  }
	else{ var dbuser= await User.email(req.body.email); if(dbuser[0].exist=='0'){ errors.email="Email is not exist."; }
	else{user.email = req.body.email;} }


	if (Object.keys(errors).length > 0){ return res.json({ status: false, message: "Validation Fails.", errors: errors }); }
	else 
	{
		user.email_code = rand.generateDigits(4);	
		var dbupdate = await db.execute(`UPDATE users  SET email_code='${user.email_code}' ,email_expiry=CURRENT_TIMESTAMP() WHERE email='${user.email}'`);
		
		var options={};
		options.to=user.email;
		options.subject='Forgot Password';
		options.text=`Reset Password Code is [${user.email_code}]`;
		Email.sendText(options);
		return res.json({ status:true,message: "Forgot password email verification code has been sent."});
		
		
	}


});





//updated 2020
router.post('/resetpass', async function (req, res) 
{

	// try
	// {
	// 	mohsin
	// 	return res.json(rand.generate(255));	
	// }catch(err){ return res.json(err.message);}
  


	var user = {};
	var errors = {};
	
	if (!req.body.code || validator.isEmpty(req.body.code)){ errors.code = "Verify code is required."; }
	else if (!validator.isByteLength(req.body.code, { min:4,max:4})) { errors.code = "Code length is must be 4 digits.`";  }else{ user.code=req.body.code;}
	
	// if (!req.body.password || validator.isEmpty(req.body.password)) { errors.password = "Password is required."; }
	// else if (!validator.isByteLength(req.body.password, { min: 6, max: 16 })) { errors.password = "Password length is min 6 & max 16.";  }
	// else{ user.password = md5(req.body.password); }
	
	if (!req.body.email || validator.isEmpty(req.body.email)) { errors.email = "Email is required.";  }
	else if (!validator.isEmail(req.body.email)) { errors.email = "Email is not valid.";  }
	else if (!validator.isByteLength(req.body.email, { min: 5, max: 50 })) { errors.email = "Email length is min 3 & max 50.";  }else{user.email = req.body.email;} 


	if (Object.keys(errors).length > 0){ return res.json({ status: false, message: "Validation Fails.", errors: errors }); }
	else 
	{

		const password_token = rand.generate(255);
		var dbmaster = await db.first(`SELECT users.id FROM users LEFT JOIN settings ON settings.id='1' WHERE settings.master_email_code='${user.code}' AND users.email='${user.email}' `);
		
		if(dbmaster.id)
		{
			
		 	var dbupdate = await db.execute(`UPDATE users  SET email_code='0000' ,password_token='${password_token}' ,email_expiry=NULL WHERE id='${dbmaster.id}'`);
			return res.json({status:true,password_token,message:'Change password token has been successfully generated.'});
		}


		var dbuser = await db.first(`SELECT id ,status ,TIMESTAMPDIFF(SECOND,email_expiry,CURRENT_TIMESTAMP()) AS timediff FROM users WHERE email_code!='0000' AND email_code='${user.code}' AND email='${user.email}' `);
		if(!dbuser || !dbuser.id){ return res.json({status:false,message:'Invalid  verify code.'}); }
		else 
		{

			if(dbuser.timediff>config.user_timediff_second){ return res.json({status:false,message:'Email verification code has been expired.'}); }
			else
			{	
				//var dbupdate = await db.execute(`UPDATE users  SET email_code='0000' ,password='${user.password}' ,email_expiry=NULL  WHERE id='${dbuser.id}'`);
				var dbupdate = await db.execute(`UPDATE users  SET email_code='0000' ,password_token='${password_token}' ,email_expiry=NULL  WHERE id='${dbuser.id}'`);
				return res.json({status:true,password_token,message:'Change password token has been successfully generated.'});
			
			}
			
		}


	}


});





router.post('/changepasswithtoken',async function (req, res) 
{

	var post={};
	var errors={};
	
	if(!req.body.password_token || validator.isEmpty(req.body.password_token)){ errors.password_token="name is required."; }
	else if(!validator.isByteLength(req.body.password_token,{ min:255,max:255})){ errors.password_token="name length is min 255 & max 255."; }
	else{post.password_token=req.body.password_token; }	
	
	if (!req.body.password || validator.isEmpty(req.body.password)) { errors.password = "Password is required."; }
	else if (!validator.isByteLength(req.body.password, { min: 6, max: 16 })) { errors.password = "Password length is min 6 & max 16.";  }
	else{ post.password = md5(req.body.password); }


	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
		var dbuser = await db.first(`SELECT id FROM users WHERE password_token='${post.password_token}' `);
		if(!dbuser.id || dbuser.id==undefined){ return res.json({'status':false,'message':"Invalid password token." }); }
		else
		{
			
			var dbupdate = await db.execute(`UPDATE users  SET password='${post.password}' , password_token=NULL WHERE id='${dbuser.id}'`);
			return res.json({'status':true,'message':"Password has been successfully changed." });
		
		}


	}


});




router.post('/logout', async (req , res , next)=>{
	
	
	try
	{

		var post={};
		var errors={};
		
		if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id=`User id is required.`; }
		else if(!validator.isInt(req.body.user_id) ){ errors.user_id=`User id must be integer.`; }
		else if( await User.Exists(req.body.user_id)=='0'){errors.user_id=`User id is not exists.`;}
		else{post.user_id=req.body.user_id;} 

	
		if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
		else
		{
			const tenant = new Tenant();
			const logouted = await User.Logout(post.user_id);
			const response = await tenant.LogoutUser({id:post.user_id});
			return res.json({status:true,message:'success',response:response.data,logouted});	

		}
	
	}catch(error){return next(error);}


});


module.exports = router;

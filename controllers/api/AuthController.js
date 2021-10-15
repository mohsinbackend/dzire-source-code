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





var DB = require('../../config/Database');

var os = require('os');
const axios = require('axios');
var Tenant = require('../../models/Tenant');
var AppNotify = require('../../models/AppNotify');




//updated 2020
router.get('/study', async function(req,res,next) 
{	 
	
	
	try
	{
		const tenant = new Tenant();
		const response = await tenant.RegisterNewUser({id:5,name:"Mark Alan"});
		return res.json(response.data);
	

		
		// let data={};
		// data.UserId=5;
		// data.UserName="Mark Alan";
		// data.TenantId=process.env.TENANT_ID;
		// data.TenantPassword=process.env.TENANT_PASSWORD;
		// const TENANT_URL = process.env.TENANT_URL;
	
		// //let data = {"UDID":"sacsa","UserId":5,"TenantId":5,"TenantPassword":"Dzire321!","UserName":"Mark Alan","Token":"eSrWxN3cRq2Q-oziHbznz7:APA91bFpmJT28hLT3-i1hqxVtbxvBEV5vqkfHqS8SHBq6gGjEXGdDZDg2PtFzU0ZlDTilUt1z74TwtgtizV-d8FOcUDAIiV_T2n9sw8XbN0cH-nf5qg-x2aCN0TKEh4BBfhNDaMzjzja"};
		// const response = await axios.post(`${TENANT_URL}/users/RegisterNewUser`,data);
		// return res.json(response.data);

	
		// var config = {
		// method: 'post',
		// url: 'http://52.203.181.17:6211/v1/users/RegisterNewUser',
		// headers: { 
		// 	'Content-Type': 'application/json'
		// },data:data};

		// axios(config).then(function(response) 
		// {
		// 	return res.json({data:response.data});
			
		// }).catch(function (error) { return res.json({error}); });

		//const user = await DB.first(`SELECT id,fname,lname,email,device_token from users WHERE email='peter@gmail.com' `);
		//let pushed = await AppNotify.Push(user.device_token,{},{title:'MyTitle',body:'This is my body text.'});
		//return res.json(pushed);


	}catch(err){return res.json({status:'error',message:err.message});}
	//finally{ data.second="finally"; return res.json(data); }
	
	//return res.json("786 auth study");
	//return res.json(process.env.TENANT_NAME);

	// Begin Tanent RegisterNewUser
	// const data = {
	// 	 UserId:1
	// 	 ,UserName:'Mohummad Mohsin'
	// 	,UDID:'John Doe'
	// 	,Token:""
	// 	,TenantId:config.tenant.id
	// 	,TenantPassword:config.tenant.password
	// };
	// axios.post(`${config.tenant.url}/users/RegisterNewUser`,data)
    // .then((response) => {
       
	// 	return res.json({status:true,data:response.data});
	// }).catch((err)=>{ console.error(err); return res.json({status:false,message:err}) });
	// End Tanent RegisterNewUser
	

	//var ip = require('ip');
	//console.log(ip.address());
	//ip.isPrivate('127.0.0.1')
	//return res.json(ip.address());
	//return res.json(ip.isPrivate('127.0.0.1'));
	
	//res.json(os.networkInterfaces());
	//console.log(os.networkInterfaces());
	// return res.json(window.location.host);
	// if (window.location.host == "localhost")
	// {
	// 	// Do whatever
	// }

	// var data={};
	// data.country_id = await Country.getIdByCode('pk');
	// data.os_id = await Os.getIdByName('ios');

	// var options = {
	// 	to:'moshin.backend@gmail.com'
	// 	,subject:'Forgot Password Mail'
	// 	,text:"Your Reset Password Code is 786786"
	// };

	// var sendResult = Email.sendText(options); 
				

	// return res.json(sendResult);

	// var transporter = nodemailer.createTransport({
	// 	port: 587
	// 	,host:"smtp.gmail.com"
	// 	,auth:{ pass: "app@dzire123",user: "appdzire@gmail.com" }
	// 	,tls: { rejectUnauthorized: false } 
	// });


	// var randomNumber=786;
	// var mailOptions = {
	// 	to:'moshin.backend@gmail.com',
	// 	from:'verification@industrialamazon.com',
	// 	subject:'Forgot Password Mail',
	// 	text:"Your Reset Password Code is "+randomNumber
	// };

	// transporter.sendMail(mailOptions, (error, info) => {
	// 	if (error) {
	// 		return res.json({ errorMessage: error.message });
	// 	} else {
	// 		// return res.json("sdghs")
	// 		return res.json({ status: true, success: info.response, message: "email send successfully" });
	// 	}
	// });

	// return res.json("786 nodemailer..");
	//var os = await Os.GetIdByName('ios');
	//return res.json(os);
	//return res.json({status:true,os:os});	
	
	//var user={};
	//var os = await Os.GetIdByName('ios2');
	
	// req.body.os="android";
	// var os = await Os.GetIdByName(req.body.os);
	// if(os){ user.os_id=os.id; }else{ user.os_id=0; }
	// return res.json({status:true,user:user});	



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
		await DB.execute(`UPDATE users SET email='${user.email}' WHERE  id='${user.id}'`);
		return res.json({ status: true, message: 'Email has been successfully updated.'});
			
	}

	


	
});



//updated 2020
router.put('/update', async function (req, res) 
{


	var user={}; 
	var errors={};

	if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id="User id is required."; }
    else if(!validator.isInt(req.body.user_id) ){ errors.user_id="User  id must be integer."; }else{ user.id=req.body.user_id }

	
	if( !req.body.fname || validator.isEmpty(req.body.fname) ){ errors.fname = "First name is required."; }
	else if (!validator.isByteLength(req.body.fname, { min: 3, max: 20 })){ errors.fname = "First name length is min 3 & max 20."; }
	else{ user.fname=req.body.fname;  }
	
	if ( !req.body.lname || validator.isEmpty(req.body.lname)) { errors.lname = "Last name is required."; }
	else if(!validator.isByteLength(req.body.lname, { min: 3, max: 20 })){ errors.lname = "Last name length is min 3 & max 20."; }
	else{ user.lname=req.body.lname;  }
	
	if( (req.files)  && Object.keys(req.files).length > 0 && req.files.image!=undefined &&  typeof(req.files.image)=='object' )
	{                      
		if( Math.round(req.files.image.size / 1024) > 5120 ){errors.image="Image size should be less than 5 Mb.";}
		else if(!config.image_upload_types.includes(req.files.image.mimetype.split("/")[1])){ errors.image=`Image mimetype shuuld be ${config.image_upload_types.toString()}.`;  }
		else{user.imgsrc=req.files.image;}
	}



	if(Object.keys(errors).length > 0){ return res.json({status:false,message:"Validation Fails.",errors:errors}); }
	else
	{ 
		
		var updquery="UPDATE users SET ";
		updquery+=` fname='${user.fname}' ,lname='${user.lname}' `;
		
		var dbuser = await DB.first(`SELECT id,image FROM users WHERE id=${user.id}`);
		if(!dbuser || !dbuser.id){ return res.json({status:false,message:"User id is not exist.",errors:{}});  }		
		else
		{	
			
			if(user.imgsrc)
			{	
				var newimg = await Image.upload(user.imgsrc,'user');
				var delresult = await Image.delete(dbuser.image,'user');
				if(delresult){ updquery+=`,image='${newimg}' `; }				
			}

			updquery+=` WHERE id='${user.id}' `;
			var dbupdate = await DB.execute(updquery);
			var updUser = await User.profile(user.id);
			return  res.json({status:true,message:"Profile has been successfully updated.",user:updUser});

		}


		

		
	
	
	}





});



//updated 2020
router.post('/guest', async function (req, res) 
{
	var user = {}
	var errors = {};
	if (!req.body.email || validator.isEmpty(req.body.email)) { errors.email = "Email is required."; }
	else if (!validator.isEmail(req.body.email)) { errors.email = "Email is valid."; }else{user.email=req.body.email; }
	
	if (!req.body.os || validator.isEmpty(req.body.os)) { errors.os="OS name is required."; }
	else if(config.operating_systems.includes(req.body.os)==false) { errors.os=`OS name must be ${config.operating_systems.toString()}.`;  }	
	else { user.os_id =  await Os.getIdByName(req.body.os); }


	if (!req.body.device_token || validator.isEmpty(req.body.device_token)) { errors.device_token = "device_token is required.";  }
	else{user.device_token=req.body.device_token;  }

	if (Object.keys(errors).length > 0){ return res.json({ status: false, message: "Validation Fails.", errors: errors }); }
	else 
	{

			
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
			
		var dbuser = await db.first(`SELECT  id,fname,lname,email,status FROM users WHERE  email='${user.email}' AND password='${user.password}'`);
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
					return res.json({ status:true,message:'success',user:loginuser });	 
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
			user.email_code = rand.generateDigits(4);
			var insertQuery=`INSERT INTO users SET status='2',fname='${user.fname}',lname='${user.lname}',email='${user.email}',password='${user.password}',lat='${user.lat}',lng='${user.lng}',country_id='${user.country_id}',full_address='${user.full_address}',os_id='${user.os_id}',device_token='${user.device_token}',email_code='${user.email_code}' ,email_expiry=CURRENT_TIMESTAMP() ,updated_at=CURRENT_TIMESTAMP() ,created_at=CURRENT_TIMESTAMP() `;
			db.query(insertQuery, function (err, dbInsert) 
			{
				if(err||!dbInsert.insertId){return res.json({ status:false, message:`Insert query error: ${err}.` ,errors:{} }); }
				else
				{
					var newUser={};
					newUser.fname=user.fname;
					newUser.lname=user.lname;
					newUser.email=user.email;
					newUser.id=dbInsert.insertId;
					
					var options={};
					options.to=user.email;
					options.subject='Email Registration';
					options.text=`Your Reset Password Code is [${user.email_code}]`;
					Email.sendText(options); 
					
					return res.json({ status:true,message:'Registration has been successfully completed.',user:newUser });

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

	var user = {};
	var errors = {};
	
	if (!req.body.code || validator.isEmpty(req.body.code)){ errors.code = "Verify code is required."; }
	else if (!validator.isByteLength(req.body.code, { min:4,max:4})) { errors.code = "Code length is must be 4 digits.`";  }else{ user.code=req.body.code;}
	
	if (!req.body.password || validator.isEmpty(req.body.password)) { errors.password = "Password is required."; }
	else if (!validator.isByteLength(req.body.password, { min: 6, max: 16 })) { errors.password = "Password length is min 6 & max 16.";  }
	else{ user.password = md5(req.body.password); }
	
	if (!req.body.email || validator.isEmpty(req.body.email)) { errors.email = "Email is required.";  }
	else if (!validator.isEmail(req.body.email)) { errors.email = "Email is not valid.";  }
	else if (!validator.isByteLength(req.body.email, { min: 5, max: 50 })) { errors.email = "Email length is min 3 & max 50.";  }else{user.email = req.body.email;} 


	if (Object.keys(errors).length > 0){ return res.json({ status: false, message: "Validation Fails.", errors: errors }); }
	else 
	{
		var dbuser = await db.first(`SELECT id ,status ,TIMESTAMPDIFF(SECOND,email_expiry,CURRENT_TIMESTAMP()) AS timediff FROM users WHERE email_code!='0000' AND email_code='${user.code}' AND email='${user.email}' `);
		
		if(!dbuser || !dbuser.id){ return res.json({status:false,message:'Invalid  verify code.'}); }
		else 
		{

			if(dbuser.timediff>config.user_timediff_second){ return res.json({status:false,message:'Email verification code has been expired.'}); }
			else
			{	
				
				var dbupdate = await db.execute(`UPDATE users  SET email_code='0000' ,password='${user.password}' ,email_expiry=NULL  WHERE id='${dbuser.id}'`);
				return res.json({status:true,message:'Reset password procedure has been successfully completed.'});
			
			}
			
		}

	}


});





router.put('/updatepassword', function (req, res) 
{
	var valid = true;
	var email = req.body.email;
	var password = req.body.password;
	var errors = {};

	if (!email || validator.isEmpty(email)) { errors.email = "Email is required."; valid = false; }
	else if (!validator.isEmail(email)) { errors.email = "valid Email is required."; valid = false; }

	if (!password || validator.isEmpty(req.body.password)) { errors.password = "Password is required."; valid = false; }
	else if (!validator.isByteLength(req.body.password, { min: 6, max: 16 })) { errors.password = "Password length is min 6 & max 16."; valid = false; }

	if (valid === false) {

		return res.json({ status: false, message: "Validation Fails.", errors: errors });
	}
	else {
		//db Connection
		var db = mysql.createConnection(config.db);
		var hashPassword = md5(password)
		db.connect(function (err) {
			if (err) { return res.json({ status: false, message: "DB connect error", errors: {} }); }
			var sql = "select * from `users` where email = '" + email + "'";
			db.query(sql, function (err, user) {

				if (err) { return res.json({ status: false, message: "Query Error", errors: { err } }); }
				else {
					if (user[0]) {
						var sqlUpdate = "update `users` set password = '" + hashPassword + "'  where id = '" + user[0].id + "';";
						db.query(sqlUpdate, function (err, user) {

							if (err) { return res.json({ status: false, message: "Query Error", errors: { err } }); }
							else {
								return res.json({ status: true, message: "password is updated" })
							}

						});

					} else {
						return res.json({ status: false, message: 'email not found.' });
					}
				}

			});


		});
	}
});




router.put('/change-password', function (req, res) 
{

	var valid = true;
	var errors = {};

	//return res.json(md5("mohsin"));

	if (!req.body.user_id || validator.isEmpty(req.body.user_id)) { errors.user_id = "User id is required."; valid = false; }
	else if (!validator.isInt(req.body.user_id)) { errors.user_id = "User  id must be integer."; valid = false; }


	if (!req.body.old_password || validator.isEmpty(req.body.old_password)) { errors.old_password = "Old password is required."; valid = false; }
	else if (!validator.isByteLength(req.body.old_password, { min: 6, max: 16 })) { errors.old_password = "Old Password length is min 6 & max 16."; valid = false; }

	if (!req.body.new_password || validator.isEmpty(req.body.new_password)) { errors.new_password = "New password is required."; valid = false; }
	else if (!validator.isByteLength(req.body.new_password, { min: 6, max: 12 })) { errors.new_password = "New Password length is min 6 & max 16."; valid = false; }



	if (valid == false) { return res.json({ status: false, message: "Validation Fails.", errors: errors }); }
	else {

		var user = { id: req.body.user_id, old_password: md5(req.body.old_password), new_password: md5(req.body.new_password) };


		//db Connection
		var db = mysql.createConnection(config.db);

		db.connect(function (err) {
			if (err) throw err;

			var authen_sql = "SELECT users.id FROM `users` WHERE users.id='" + user.id + "' AND users.password='" + user.old_password + "' ";
			db.query(authen_sql, function (err, result) {
				if (err) { return res.json({ status: false, message: err }); }

				if (!result[0]) { return res.json({ status: false, message: 'Old password is Incurrect.', errors: {} }); }
				else {
					var chnage_pass = "UPDATE `users` SET users.password='" + user.new_password + "' WHERE users.id='" + user.id + "';";
					db.query(chnage_pass, function (err, result) {
						if (err) { return res.json({ status: false, message: err }); }
						else {
							return res.json({ status: true, message: 'New password has been succfully changed.' });
						}

					});


				}

			});


		});


	}

});
router.get('/getprofile/:id?/:locale?', function (req, res) {

	var valid = true;
	var errors = {};
	var db = mysql.createConnection(config.db);
	var locale = "";
	var locales = ['en', 'ar'];

	if (!req.params.id || validator.isEmpty(req.params.id)) { valid = false; errors.id = "user id is required."; }

	if (!req.params.locale || validator.isEmpty(req.params.locale)) { errors.locale = "Locale is required."; valid = false; }
	else if (!locales.includes(req.params.locale)) { errors.locale = "locale is not valid"; valid = false; }
	else { locale = req.params.locale; }

	if (valid == false) { return res.json({ status: false, message: "Validation Fails.", errors: errors }); }
	else {
		let id = req.params.id;
		db.connect(function (err) {
			if (err) { return res.json({ status: false, message: "DB connect error", errors: {} }); }
			var url = req.get('host') + "/images/subcategory/";
			var no_image = req.get('host') + "/images/no-images-placeholder.png";

			var sql = "select fname,lname,email,phone,country_id,city_id,zipcode,IF(image=''||image IS NULL,'" + no_image + "',CONCAT('" + url + "',image) ) AS image_url from `users` where id = '" + id + "'";
			db.query(sql, function (err, user) {
				if (err) { return res.json({ status: false, message: "Query Error", errors: {} }); }
				else {
					var sql = "SELECT id , IF(" + locale + "_name IS NULL,''," + locale + "_name) AS name FROM `countries`";
					db.query(sql, function (error, countries) {

						if (error) { return res.json({ status: false, message: error }); }
						else {
							return res.json({ status: true, message: 'success', user: user, countries: countries });
						}

					});
				}
			});

		});

	}

});
router.put('/editprofile', function (req, res) {

	var valid = true;
	var errors = {};
	var db = mysql.createConnection(config.db);

	if (!req.body.id || validator.isEmpty(req.body.id)) { errors.id = "id is required."; valid = false; }
	if (!req.body.fname || validator.isEmpty(req.body.fname)) { errors.fname = "First name is required."; valid = false; }
	else if (!validator.isByteLength(req.body.fname, { min: 3, max: 20 })) { errors.fname = "First name length is min 3 & max 20."; valid = false; }

	if (!req.body.lname || validator.isEmpty(req.body.lname)) { errors.lname = "Last name is required."; valid = false; }
	else if (!validator.isByteLength(req.body.lname, { min: 3, max: 20 })) { errors.lname = "Last name length is min 3 & max 20."; valid = false; }

	if (!req.body.phone || validator.isEmpty(req.body.phone)) { errors.phone = "Phone Number is required."; valid = false; }
	else if (!validator.isByteLength(req.body.phone, { min: 5, max: 15 })) { errors.password = "phone Number length is min 5 & max 15."; valid = false; }

	if (!req.body.zipcode || validator.isEmpty(req.body.zipcode)) { errors.zipcode = "zip code is required."; valid = false; }

	if (!req.body.country_id || validator.isEmpty(req.body.country_id)) { errors.country_id = "country_id is required."; valid = false; }
	if (!req.body.city_id || validator.isEmpty(req.body.city_id)) { errors.city_id = "city_id is required."; valid = false; }

	if (!req.body.full_address || validator.isEmpty(req.body.full_address)) { errors.full_address = "full address is required."; valid = false; }

	if (valid == false) { return res.json({ status: false, message: "Validation Fails.", errors: errors }); }
	else {
		var user = {};
		user.id = req.body.id;
		user.fname = req.body.fname;
		if (req.files) {
			var image = req.files.image;
			user.image = rand.generate(20) + "." + image.name.split(".")[1];
		}
		user.lname = req.body.lname;
		user.phone = req.body.phone;
		user.zipcode = req.body.zipcode;
		user.country_id = req.body.country_id;
		user.city_id = req.body.city_id;
		user.full_address = req.body.full_address;
		db.connect(function (err) {
			if (err) { return res.json({ status: false, message: "DB connect error", errors: {} }); }
			var sql = "update `users` set fname = '" + user.fname + "',lname = '" + user.lname + "',image = '" + user.image + "',phone ='" + user.phone + "' ,zipcode='" + user.zipcode + "',country_id='" + user.country_id + "',city_id= '" + user.city_id + "',full_address = '" + user.full_address + "' where id = '" + user.id + "'";
			var sq2 = "update `users` set fname = '" + user.fname + "',lname = '" + user.lname + "',phone ='" + user.phone + "' ,zipcode='" + user.zipcode + "',country_id='" + user.country_id + "',city_id= '" + user.city_id + "',full_address = '" + user.full_address + "' where id = '" + user.id + "'";
			if (req.files) {
				let q = "select image from `users` where id = '" + user.id + "'";
				db.query(q, function (err, imageName) {
					if (err) { return res.json({ status: false, message: "Query Error 1", errors: {} }); }
					else {
						fs.unlink('./public/images/user/' + imageName[0].image, (err) => {
							if (err) { return res.json({ status: false, message: "error", error: err }) }
							else {
								db.query(sql, function (err, result) {
									if (err) { return res.json({ status: false, message: "Query Error 2", errors: {} }); }
									else {
										image.mv('./public/images/user/' + user.image);
										return res.json({
											status: true, message: 'profile has been updated successfully.'
										});
									}
								});
							}
						});
					}
				})

			}
			else {
				db.query(sq2, function (err, result) {
					if (err) { return res.json({ status: false, message: "Query Error 3", errors: {} }); }
					else {
						return res.json({
							status: true, message: 'profile has been updated successfully.'
						});
					}
				});
			}
		});

	}

});

router.post('/sendotpcode', function (req, res) {
	var valid = true;
	var errors = {};
	if (!req.body.email || validator.isEmpty(req.body.email)) { errors.email = "Email is required."; valid = false; }
	else if (!validator.isEmail(req.body.email)) { errors.email = "valid Email is required."; valid = false; }

	if (valid === false) {
		return res.json({ status: false, message: "Validation Fails.", errors: errors });
	}
	else {
		//db Connection
		var db = mysql.createConnection(config.db);
		let email = req.body.email;
		db.connect(function (err) {
			if (err) { return res.json({ status: false, message: "DB connect error", errors: {} }); }
			var sql = "select id from `users` where email = '" + email + "'";
			db.query(sql, function (err, userID) {

				if (err) { return res.json({ status: false, message: "Query Error", errors: { err } }); }
				else {
					if (userID[0]) {
						var randomNumber = rand.generateDigits(4);
						var d = new Date();
						var finalDate = d.toISOString().split('T')[0] + ' ' + d.toTimeString().split(' ')[0];
						var sqlUpdate = "update `users` set otp_code = '" + randomNumber + "' , otp_code_time = '" + finalDate + "'  where id = '" + userID[0].id + "';";
						db.query(sqlUpdate, function (err, response) {
							if (err) { return res.json({ status: false, message: "Query Error", errors: { err } }); }
							else {
								return res.json({ success: response, meessage: "Verification code send successfully" });
							}
						})

					} else {
						return res.json({ status: true, message: 'email not found.' });
					}
				}

			});

		});
	}

});

router.post('/verifyotpcode', function (req, res) {
	var valid = true;
	var code = req.body.code;
	var email = req.body.email;
	var errors = {};
	if (!code || validator.isEmpty(code)) { errors.code = "enter verfication code."; valid = false; }
	else if (!validator.isInt(code)) { errors.typeError = "enter only number."; valid = false; }
	else if (!validator.isLength(code, { min: 4, max: 4 })) { errors.lengthError = "enter only 4 number."; valid = false; }
	if (!email || validator.isEmpty(email)) { errors.email = "Email is required."; valid = false; }
	else if (!validator.isEmail(email)) { errors.email = "valid Email is required."; valid = false; }

	if (valid === false) {

		return res.json({ status: false, message: "Validation Fails.", errors: errors });
	}
	else {
		//db Connection
		var db = mysql.createConnection(config.db);
		db.connect(function (err) {
			if (err) { return res.json({ status: false, message: "DB connect error", errors: {} }); }
			var sql = "select * from `users` where email = '" + email + "'";
			db.query(sql, function (err, user) {

				if (err) { return res.json({ status: false, message: "Query Error", errors: { err } }); }
				else {
					if (user[0]) {
						let minute = 60000;
						if (((new Date) - user[0].otp_code_time) > minute) {
							return res.json({ status: false, message: 'code is expired.' })
						} else if (code == user[0].otp_code) {
							return res.json({ status: true, message: 'Code is matched' });
						} else {
							return res.json({ status: false, message: 'Invalid Code' });
						}
					} else {
						return res.json({ status: false, message: 'email not found.' });
					}
				}

			});


		});
	}
});

// temporary api for test

router.get('/testcode/:email?', function (req, res) {
	var valid = true;
	var email = req.params.email;
	var errors = {};
	if (!email || validator.isEmpty(email)) { errors.email = "Email is required."; valid = false; }
	else if (!validator.isEmail(email)) { errors.email = "valid Email is required."; valid = false; }

	if (valid === false) {

		return res.json({ status: false, message: "Validation Fails.", errors: errors });
	}
	else {
		//db Connection
		var db = mysql.createConnection(config.db);
		db.connect(function (err) {
			if (err) { return res.json({ status: false, message: "DB connect error", errors: {} }); }
			var sql = "select otp_code from `users` where email = '" + email + "'";
			db.query(sql, function (err, otp_code) {

				if (err) { return res.json({ status: false, message: "Query Error", errors: { err } }); }
				else {
					return res.json({ status: true, otp_code: otp_code, message: "code receivec" })
				}

			});


		});
	}
});
module.exports = router;

var express = require('express');
var router = express.Router();
var validator = require('validator');
var config = require('config');
var md5 = require('md5');
var path = require('path');

var DB = require('../..//config/Database');
var User = require('../../models/User');
var Image = require('../../models/Image');
var Region = require('../../models/Region');
var Country = require('../../models/Country');
var Listing = require('../../models/Listing');




router.get('/edit/:locale?/:user_id?', async function (req, res) 
{
    
	var get={};
	var errors={};

	if(!req.params.locale || validator.isEmpty(req.params.locale)) { errors.locale=`locale is required.`; }
    else if(!config.locales.includes(req.params.locale)){ errors.locale=`locale is not valid like : ${config.locales.toString()} .`; }
    else { get.locale=req.params.locale;  }
    
    if(!req.params.user_id || validator.isEmpty(req.params.user_id)){ errors.user_id="User id is required."; }
    else if(!validator.isInt(req.params.user_id) ){ errors.user_id="Listing  id must be integer."; }
    else if( await User.Exists(req.params.user_id)=='0'){errors.user_id="Listing id is not exists.";}else{get.user_id=req.params.user_id;}  


	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
        let regions = await Region.GetLookup(get.locale);
        let countries = await Country.GetLookup(get.locale);
        let user = await User.GetAccountEdit(get.locale,get.user_id);
        return res.json({'status':true,'user':user,'regions':regions,'countries':countries,'message':"success"});	
    }


});






router.get('/view/:locale?/:user_id?', async function (req, res) 
{
    

	var get={};
	var errors={};

	if(!req.params.locale || validator.isEmpty(req.params.locale)) { errors.locale=`locale is required.`; }
    else if(!config.locales.includes(req.params.locale)){ errors.locale=`locale is not valid like : ${config.locales.toString()} .`; }
    else { get.locale=req.params.locale;  }
    
    if(!req.params.user_id || validator.isEmpty(req.params.user_id)){ errors.user_id="User id is required."; }
    else if(!validator.isInt(req.params.user_id) ){ errors.user_id="Listing  id must be integer."; }
    else if( await User.Exists(req.params.user_id)=='0'){errors.user_id="Listing id is not exists.";}else{get.user_id=req.params.user_id;}  


	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
        let  user = await User.GetForAccount(get.locale,get.user_id);
        let listings = await Listing.GetForAccount(get.locale,get.user_id);
		return res.json({'status':true,'user':user,'listings':listings,'message':"success"});	
    
    }



});





router.post('/update',async function(req,res) 
{

    
    var post={};
    var errors={};

    if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id=`User id is required.`; }
    else if(!validator.isInt(req.body.user_id) ){ errors.user_id=`User id must be integer.`; }
    else if( await User.Exists(req.body.user_id)=='0'){errors.user_id=`User id is not exists.`;}
    else{post.user_id=req.body.user_id;} 

    if(!req.body.region_id || validator.isEmpty(req.body.region_id)){ errors.region_id=`Region id is required.`; }
    else if(!validator.isInt(req.body.region_id) ){ errors.region_id=`Region id must be integer.`; }
    else if( await Region.Exists(req.body.region_id)=='0'){errors.region_id=`Region id is not exists.`;}
    else{post.region_id=req.body.region_id;} 
    
    if(!req.body.country_id || validator.isEmpty(req.body.country_id)){ errors.country_id=`Country id is required.`; }
    else if(!validator.isInt(req.body.country_id) ){ errors.country_id=`Country id must be integer.`; }
    else if( await Country.Exists(req.body.country_id)=='0'){errors.country_id=`Country id is not exists.`;}
    else{post.country_id=req.body.country_id;} 
    
    if (!req.body.fname || validator.isEmpty(req.body.fname)) { errors.fname = "Frist Name is required."; }
	else if (!validator.isByteLength(req.body.fname, { min: 3, max: 100 })) { errors.fname = "First Name length is min 3 & max 100."; } 
    else{ post.fname=req.body.fname; }

    if (!req.body.lname || validator.isEmpty(req.body.lname)) { errors.lname = "Last Name is required."; }
	else if (!validator.isByteLength(req.body.lname, { min: 3, max: 100 })) { errors.lname = "Last Name length is min 3 & max 100."; } 
    else{ post.lname=req.body.lname; }

    
    if (!req.body.phone || validator.isEmpty(req.body.phone)) { errors.phone = "Phone number is required."; }
	else if (!validator.isByteLength(req.body.phone, { min: 10, max: 15 })) { errors.phone = "Phone number  length is min 10 & max 10."; } 
    else{ post.phone=req.body.phone; }

    if (!req.body.address || validator.isEmpty(req.body.address)) { errors.address = "Address is required."; }
	else if (!validator.isByteLength(req.body.address, { min: 3, max: 255 })) { errors.address = "Address length is min 3 & max 255."; } 
    else{ post.address=req.body.address; }
    
    if (!req.body.zipcode || validator.isEmpty(req.body.zipcode)) { errors.zipcode = "Zip code is required."; }
	else if (!validator.isByteLength(req.body.zipcode, { min: 5, max: 20 })) { errors.zipcode = "Zip code length is min 5 & max 20."; } 
    else{ post.zipcode=req.body.zipcode; }

    
    if(req.files && req.files.image )
    {
        if(config.imgobjstr!=Object.keys(req.files.image).toString()){ errors.image=`Image object not valid. should be ${config.imgobjstr}.`; }
        else if(!config.image_upload_types.includes(req.files.image.mimetype.split("/")[1])){ errors.image=`Image is not allow must be ${config.image_upload_types.toString()}.`; }
        else{post.imgsrc=req.files.image;}
    }


	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
        
        var query=`UPDATE ${User.table} SET `;
        query+=`fname='${post.fname}' `;
        query+=`,lname='${post.lname}' `;
        query+=`,phone='${post.phone}' `;
        query+=`,zipcode='${post.zipcode}' `;
        query+=`,region_id='${post.region_id}' `;
        query+=`,country_id='${post.country_id}' `;
        query+=`,full_address='${post.address}' `;
		let dbuser = await DB.first(`SELECT id,image FROM ${User.table} WHERE id='${post.user_id}' `);
        if(post.imgsrc)
		{	
            var newimg = await Image.Upload('user',post.imgsrc);	
            if(newimg!=false)
			{
				var delresult = await Image.delete('user',dbuser.image);		
				if(delresult){ query+=`,image='${newimg}' `; }
            }
            
        }
        query+=`WHERE ${User.table}.id='${post.user_id}' `;
        let dbupdate = await DB.execute(query);
		let profile = await User.profile(post.user_id);
		return  res.json({status:true,message:"Profile has been successfully updated.",user:profile});


    }

    


});








router.post('/changepass',async function(req,res) 
{
    
    var post={};
    var errors={};

    if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id=`User id is required.`; }
    else if(!validator.isInt(req.body.user_id) ){ errors.user_id=`User id must be integer.`; }
    else if( await User.Exists(req.body.user_id)=='0'){errors.user_id=`User id is not exists.`;}
    else{post.user_id=req.body.user_id;} 

	if (!req.body.old_pass || validator.isEmpty(req.body.old_pass)){ errors.old_pass="Old password is required."; }
	else if(!validator.isByteLength(req.body.old_pass, { min: 6, max: 16 })){errors.old_pass="Old password length is min 6 & max 16.";  }
    else{ post.old_pass = md5(req.body.old_pass); }    

    if (!req.body.new_pass || validator.isEmpty(req.body.new_pass)) { errors.new_pass = "New password is required."; }
	else if (!validator.isByteLength(req.body.new_pass, { min: 6, max: 16 })) { errors.new_pass = "New password length is min 6 & max 16.";  }
	else{ post.new_pass = md5(req.body.new_pass); }

    if(post.user_id && post.old_pass && post.new_pass){ if( await User.MachedPass(post.user_id,post.old_pass)=='0'){errors.old_pass=`Password is not mached.`;} } 
   
	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
        let result  = await User.ChangePass(post.user_id,post.new_pass);
        return res.json({'status':true,'message':'Password has been successfully changed.','result':result});          
    }


});






module.exports = router;

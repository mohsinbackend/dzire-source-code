var express = require('express');
var router = express.Router();
var validator = require('validator');
var config = require('config');


var Os = require('../../models/Os');
var User = require('../../models/User');
var Country = require('../../models/Country');




router.post('/login',async function(req, res) 
{ 

    var post = {};
	var errors = {} 

	if (!req.body.os || validator.isEmpty(req.body.os)) { errors.os = "OS name is required."; }
	else if(config.operating_systems.includes(req.body.os)==false) { errors.os = "OS name must be ios or android."; }
	else { post.os_id =  await Os.getIdByName(req.body.os); }
	
	
	// if (!req.body.lat || validator.isEmpty(req.body.lat)) { errors.lat = "latitude is required.";  }
	// else{ post.lat = req.body.lat;}

	// if (!req.body.lng || validator.isEmpty(req.body.lng)) { errors.lng = "longtitude is required."; }
	// else{ post.lng = req.body.lng;}

	if (!req.body.fname || validator.isEmpty(req.body.fname)) { errors.fname = "First name is required.";  }
	else if (!validator.isByteLength(req.body.fname, { min: 3, max: 20 })) { errors.fname = "First name length is min 3 & max 20."; }
	else{ post.fname = req.body.fname;}

	if (!req.body.lname || validator.isEmpty(req.body.lname)) { errors.lname = "Last name is required."; }
	else if (!validator.isByteLength(req.body.lname, { min: 3, max: 20 })) { errors.lname = "Last name length is min 3 & max 20."; }
	else{ post.lname = req.body.lname;}

	if(!req.body.device_token || validator.isEmpty(req.body.device_token)){ errors.device_token = "device_token is required."; }
	else{ post.device_token = req.body.device_token;  }
	
	if(req.body.email && !validator.isEmpty(req.body.email))
	{
		if(!validator.isEmail(req.body.email)) { errors.email = "Email is not valid.";  }
		else{post.email=req.body.email; }
	}

	
	// if (!req.body.country_code || validator.isEmpty(req.body.country_code)){ errors.country_code = "country code is required."; }
	// else{ post.country_id= await Country.getIdByCode(req.body.country_code); }
	
	// if (!req.body.full_address || validator.isEmpty(req.body.full_address)) { errors.full_address = "full address is required."; }
	// else if (!validator.isByteLength(req.body.full_address, { min: 6, max: 255 })) { errors.full_address = "Full_address length is min 3 & max 255.";  }
	// else{post.full_address = req.body.full_address; }
	
		
    
    if(!req.body.social_id || validator.isEmpty(req.body.social_id)){ errors.social_id=`Social id is required.`; }
    else if(!validator.isInt(req.body.social_id) ){ errors.social_id=`Social id must be integer.`; }else{post.social_id=req.body.social_id;} 
	
	if(!req.body.social_type || validator.isEmpty(req.body.social_type)) { errors.social_type = "Social type is required.";}
    else if(!config.social_types.includes(req.body.social_type)){errors.social_type=`Social type is not valid ${config.social_types.toString()}.`;  }
    else { post.social_type = req.body.social_type;  }

    // if (!req.body.social_avatar || validator.isEmpty(req.body.social_avatar)) { errors.social_avatar = "Social Avatar Url is required.";  }
	// else if (!validator.isByteLength(req.body.social_avatar, { min: 1, max: 255 })) { errors.social_avatar = "Social Avatar Url length is min 1 & max 255.";  }
	// else{post.social_avatar = req.body.social_avatar; }

    if (!req.body.social_image || validator.isEmpty(req.body.social_image)) { errors.social_image = "Social Image Url is required.";  }
	else if (!validator.isByteLength(req.body.social_image, { min: 1, max: 1000 })) { errors.social_image = "Social Image Url length is min 1 & max 1000.";  }
	else{post.social_image = req.body.social_image; }

	if (Object.keys(errors).length > 0){ return res.json({ status: false, message: "Validation Fails.", errors: errors }); }
	else 
	{

		//return res.json(post);
		let user_id=0;
		if(await User.SocialIdExists(post.social_id)=='1')
        {user_id= await User.SocialUpdate(post); }
		else{user_id= await User.SocialStore(post); }
		let profile = await User.profile(user_id);
        return res.json({status:true,message:'success',user:profile});
	
	}
   


});



module.exports = router;

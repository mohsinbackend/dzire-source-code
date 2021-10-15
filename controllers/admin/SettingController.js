var express = require('express');
var router = express.Router();
var validator = require('validator');
var config = require('config');

var Image = require('../../models/Image');
var db = require('../..//config/Database');
var AdminSettings = require('../../models/AdminSettings');
var EmailTemplate = require('../../models/EmailTemplate');




router.get('/application',async function(req,res)
{ 
    let setting = await AdminSettings.GetAll();
    return res.render('admin/setting/application',{setting});

});



router.get('/emailtemplate',async (req,res)=>
{ 
    try
    {
        let emailtemplates = await EmailTemplate.GetAll();
        const register=emailtemplates[0];
        return res.render('admin/setting/emailtemplate',{register});

    }catch(error){return res.json(error.message);}
    
});

router.post('/emailtemplate-register',async (req,res)=>
{ 
    try
    {

        let post = {};
        let errors = {};   
    
        if (!req.body.register_title || validator.isEmpty(req.body.register_title)){errors.register_title="Register title is required.";req.flash('register_title_err',`${errors.register_title}`); }
        else if(!validator.isByteLength(req.body.register_title,{min:3,max:255}) ){ errors.register_title=`Register title lenght must be min 3 & max 255..`; req.flash('register_title_err',`${errors.register_title}`); }
        else{ post.register_title=req.body.register_title.trim();req.flash('register_title',`${post.register_title}`);  }
    

        if (!req.body.register_template || validator.isEmpty(req.body.register_template)){errors.register_template="register template is required.";req.flash('register_template_err',`${errors.register_template}`); }
        else if(!validator.isByteLength(req.body.register_template,{min:3,max:1000}) ){ errors.register_template=`register template lenght must be min 3 & max 1000.`; req.flash('register_template_err',`${errors.register_template}`); }
        else if(!req.body.register_template.includes('[OPT]')){ errors.register_template=`[OPT] key must be include in register template.`; req.flash('register_template_err',`${errors.register_template}`); }
        else{ post.register_template=req.body.register_template.trim();req.flash('register_template',`${post.register_template}`);  }
    
        
        if (Object.keys(errors).length > 0){ return res.redirect("emailtemplate"); }
        else
        {


            const updated = await EmailTemplate.updateRegister(post);
            if(!updated.affectedRows || updated.affectedRows!=1){return res.redirect("emailtemplate");}
            else
            {
                req.flash('success',`Email template has been successfully updated.`);  
                return res.redirect(`emailtemplate`);
            }
        
            
            
        }
        
       

    }catch(error){return res.json(error.message);}
    
});



router.post('/application-submit',async function(req,res)
{
    
    let post = {};
    let errors = {};   

    if (!req.body.listing_newly_more_limit || validator.isEmpty(req.body.listing_newly_more_limit)){errors.listing_newly_more_limit="listing_newly_more_limit is required.";req.flash('listing_newly_more_limit_err',`${errors.listing_newly_more_limit}`); }
    else if(!validator.isInt(req.body.listing_newly_more_limit) ){ errors.listing_newly_more_limit=`listing_newly_more_limit of dashboard must be integer.`; req.flash('listing_newly_more_limit_err',`${errors.listing_newly_more_limit}`); }
    else{ post.listing_newly_more_limit=req.body.listing_newly_more_limit.trim();req.flash('listing_newly_more_limit',`${post.listing_newly_more_limit}`);  }

    
    if (!req.body.listing_recommended_more_limit || validator.isEmpty(req.body.listing_recommended_more_limit)){errors.listing_recommended_more_limit="listing_recommended_more_limit is required.";req.flash('listing_recommended_more_limit_err',`${errors.listing_recommended_more_limit}`); }
    else if(!validator.isInt(req.body.listing_recommended_more_limit) ){ errors.listing_recommended_more_limit=`listing_newly_more_limit of dashboard must be integer.`; req.flash('listing_recommended_more_limit_err',`${errors.listing_recommended_more_limit}`); }
    else{ post.listing_recommended_more_limit=req.body.listing_recommended_more_limit.trim();req.flash('listing_recommended_more_limit',`${post.listing_recommended_more_limit}`);  }

    if (!req.body.en_renting_policy || validator.isEmpty(req.body.en_renting_policy)){errors.en_renting_policy="listing_recommended_more_limit is required.";req.flash('en_renting_policy_err',`${errors.en_renting_policy}`); }
    else if(!validator.isByteLength(req.body.en_renting_policy,{min:3,max:255}) ){ errors.en_renting_policy=`listing_newly_more_limit lenght must be min 3 & max 255..`; req.flash('en_renting_policy_err',`${errors.en_renting_policy}`); }
    else{ post.en_renting_policy=req.body.en_renting_policy.trim();req.flash('en_renting_policy',`${post.en_renting_policy}`);  }

    
    if (!req.body.en_care_instructions || validator.isEmpty(req.body.en_care_instructions)){errors.en_care_instructions="en_care_instructions is required.";req.flash('en_care_instructions_err',`${errors.en_care_instructions}`); }
    else if(!validator.isByteLength(req.body.en_care_instructions,{min:3,max:255}) ){ errors.en_care_instructions=`en_care_instructions lenght must be min 3 & max 255.`; req.flash('en_care_instructions_err',`${errors.en_care_instructions}`); }
    else{ post.en_care_instructions=req.body.en_care_instructions.trim();req.flash('en_care_instructions',`${post.en_care_instructions}`);  }

    
    if (Object.keys(errors).length > 0){ return res.redirect("application"); }
	else
	{
        //return res.json(post);
        let result = await AdminSettings.SetAll(post);
        //return res.json(result);
        req.flash('success',`Application setting has been successfullyapplied.`);  
        return res.redirect(`application`);
    }

    

});





module.exports = router;

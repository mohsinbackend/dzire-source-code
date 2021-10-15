var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var rand = require("random-key");
var validator = require('validator');
var config = require('config');

var User = require('../../models/User');
var Listing = require('../../models/Listing');
var Category = require('../../models/Category');
var Advertise = require('../../models/Advertise');






//update 2020
router.get('/stuff/:locale?/:user_id?', async function(req, res) 
{
   
    var get={};
    var errors={};

    if(!req.params.locale || validator.isEmpty(req.params.locale)) { errors.locale = "locale is required."; }
    else if(!config.locales.includes(req.params.locale)){ errors.locale=`locale is not valid. Only Allow : ${config.locales.toString()}.`; }
    else { get.locale = req.params.locale;  }

    if(!req.params.user_id || validator.isEmpty(req.params.user_id)){ errors.user_id="User id is required."; }
    else if(!validator.isInt(req.params.user_id) ){ errors.user_id="User  id must be integer."; }
    else if(req.params.user_id!=0 || req.params.user_id!='0' ){ if( await User.Exists(req.params.user_id)=='0'){errors.user_id="User id is not exists.";}else{get.user_id=req.params.user_id;} }
    else{ get.user_id=req.params.user_id; }

    if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {

        
        let categories = await Category.GetForAppDashboard(get.locale);
        let advertises = await Advertise.GetForAppDashboard(get.locale);
        let listings = await Listing.GetForAppDashboard(get.locale,get.user_id); 
        return res.json({'status':true,'message':"Success",'listings':listings,'categories':categories,'advertises':advertises});

    }

    

});












module.exports = router;

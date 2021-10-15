var express = require('express');
var router = express.Router();
var validator = require('validator');
var config = require('config');
const { Expo } = require('expo-server-sdk');


var User = require('../../models/User');
var Wishe = require('../../models/Wishe');
var Basket = require('../../models/Basket');
var UserNotification = require('../../models/UserNotification');

const IO  = require("../../config/Soket");



router.get('/count',async function(req,res) 
{

    try
    {

        IO.IoEmit("app_notification_counts",{ notifycount: 123 })
        return res.json({ notifycount: 786 })
            
        //return res.json(786);
        
    }catch(error){ return next(error);}


});


router.get('/switch/:user_id?/:toggle?',async function(req,res) 
{
    
    
    var get={};
    var errors={};
    if(!req.params.toggle || validator.isEmpty(req.params.toggle)) { errors.toggle = "toggle is required."; }
    else if(!['0','1'].includes(req.params.toggle)){ errors.toggle = "toggle must be 1 or 0 ."; }
    else { get.toggle = req.params.toggle;  }
   
    if(!req.params.user_id || validator.isEmpty(req.params.user_id)){ errors.user_id="User id is required."; }
    else if(!validator.isInt(req.params.user_id) ){ errors.user_id="User  id must be integer."; }
    else if( await User.Exists(req.params.user_id)=='0'){errors.user_id="User id is not exists.";}else{get.user_id=req.params.user_id;} 
  
	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {

        let result = await UserNotification.SetSwitch(get.user_id,get.toggle);
        const notification_switch = await UserNotification.GetSwitch(get.user_id);
        return res.json({'status':true,'notification_switch':notification_switch,'message':'Notification has been switched.','result':result});
    
    }

    


});



router.get('/seen/:notify_id?', async function(req, res) 
{

    var get={};
    var errors={};

    if(!req.params.notify_id || validator.isEmpty(req.params.notify_id)){ errors.notify_id="Notify id is required."; }
    else if(!validator.isInt(req.params.notify_id) ){ errors.notify_id="Notify id must be integer."; }
    else if( await UserNotification.Exists(req.params.notify_id)=='0'){errors.notify_id="Notify id is not exists.";}else{get.notify_id=req.params.notify_id;} 
  
    if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
        let updated = await UserNotification.SetSeen(get.notify_id);
        return res.json({'status':true,'message':"success",'updated':updated});

    }

});





router.get('/getall/:locale?/:user_id?', async function(req, res) 
{
   

    var get={};
    var errors={};

    if(!req.params.locale || validator.isEmpty(req.params.locale)) { errors.locale = "locale is required."; }
    else if(!config.locales.includes(req.params.locale)){ errors.locale=`locale is not valid. Only Allow : ${config.locales.toString()}.`; }
    else { get.locale = req.params.locale;  }

    if(!req.params.user_id || validator.isEmpty(req.params.user_id)){ errors.user_id="User id is required."; }
    else if(!validator.isInt(req.params.user_id) ){ errors.user_id="User  id must be integer."; }
    else if( await User.Exists(req.params.user_id)=='0'){errors.user_id="User id is not exists.";}else{get.user_id=req.params.user_id;} 
  
    if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
        
        let notifications = await UserNotification.GetByUser(get.user_id);
        let countunseen = await UserNotification.GetCountUnseen(get.user_id);
        return res.json({'status':true,'countunseen':countunseen,'notifications':notifications,'message':"success"});
    }

    

});





module.exports = router;

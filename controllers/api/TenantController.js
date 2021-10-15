var express = require('express');
var router = express.Router();


const validator = require('validator');


const DB = require('../../config/Database');
const User = require('../../models/User');
const Tenant = require('../../models/Tenant');
const IO  = require("../../config/Soket");

router.get('/loadchannels/:user_id', async function (req,res,next) 
{
    try
    {

        //IO.IoEmit("app_notification_counts")
        //return res.json({ IOObject: 'abc' })
        
        // IO.on('connection', client => {
        //     client.on('event', data => { 
        //         return res.json('');    
        //     });
            
        // });


        // var get={};
		// var errors={};	
		// if(!req.params.user_id || validator.isEmpty(req.params.user_id)){ errors.user_id=`User id is required.`; }
		// else if(!validator.isInt(req.params.user_id) ){ errors.user_id=`User id must be integer.`; }
		// else if( await User.Exists(req.params.user_id)=='0'){errors.user_id=`User id is not exists.`;}else{get.user_id=req.params.user_id;} 
	
		// if(Object.keys(errors).length > 0 ){ return res.json({status:false,message:"Validation fails.",errors:errors}); }
		// else
		// {
        //     const _Tenant = new Tenant();			
        //     const response = await _Tenant.LoadChannels(get.user_id)
        //     return res.json({status:true,response:response.data});
        // }



        
    }catch(error){ return next(error);}

});





module.exports = router;

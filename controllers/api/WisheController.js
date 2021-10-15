var express = require('express');
var router = express.Router();
var validator = require('validator');
var config = require('config');
const { Expo } = require('expo-server-sdk');


var User = require('../../models/User');
var Wishe = require('../../models/Wishe');
var Basket = require('../../models/Basket');
var AppNotify = require('../../models/AppNotify');
var Notification = require('../../config/Notification');



router.get('/notify', async function (req, res) 
{

    let message=
    {
        to: 'ExponentPushToken[sAgXkTOVbu4JdQsHom_bAh]',
        sound: 'default',
        body: 'Send One Object Notification.',
        data: { withSome: 'data' },
    };

   
    try 
    {
        let result =  await Notification.Push(message);
        return res.send( result );

    }catch (error){ return res.json(error); }
            


    // let = messages=[];
    // messages.push({
    //     to: 'ExponentPushToken[sAgXkTOVbu4JdQsHom_bAh]',
    //     sound: 'default',
    //     body: '1 Notify.',
    //     data: { withSome: 'data' },
    // });
    // messages.push({
    //     to: 'ExponentPushToken[sAgXkTOVbu4JdQsHom_bAh]',
    //     sound: 'default',
    //     body: '2 Notify.',
    //     data: { withSome: 'data' },
    // });

    // try
    // {
    //     let result =  await Notification.PushBulk(messages);
    //     return res.json( result );
    // }catch(error){ return res.json(errors); }

    

    

});


router.post('/torent', async function (req, res) 
{

    var post={};
    var errors={};

	if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id=`User id is required.`; }
    else if(!validator.isInt(req.body.user_id) ){ errors.user_id=`User id must be integer.`; }
    else if( await User.Exists(req.body.user_id)=='0'){errors.user_id=`User id is not exists.`;}
    else{post.user_id=req.body.user_id;} 

    // if(!req.body.basket_id || validator.isEmpty(req.body.basket_id)){ errors.basket_id="Basket id is required."; }
    // else if(!validator.isInt(req.body.basket_id) ){ errors.basket_id="Basket id must be integer."; }
    // else if( await Basket.Exists(req.body.basket_id)=='0'){errors.basket_id="Basket id is not exists.";}
    // else{post.basket_id=req.body.basket_id;}
    
    if(!req.body.basket_ids || validator.isEmpty(req.body.basket_ids)){ errors.basket_ids="Basket ids is required."; }
    else{post.basket_ids=req.body.basket_ids;}
   
    
	//if(post.user_id && post.basket_id){ if( await Basket.IsOwner(post.user_id,post.basket_id)=='0'){errors.basket="Is not owner of basket.";}    }
	
	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
       
        //let result = await Wishe.ToRentMany(post.basket_ids);
        //return res.json(result);
        let indexs=[];
        let basket_ids =  post.basket_ids.split(','); 
        basket_ids.map(async function(basket_id,index)
        {
            indexs.push(index);
            let torented = await Wishe.ToRent(basket_id);
            console.log('insertId',torented);
            
            let notify = await Wishe.GetForNotify('torent',torented.insertId);
            console.log('notify',notify);
            let pushed = await AppNotify.Push(notify.to,{},{title:notify.title,body:notify.body});
            console.log('pushed',pushed);
            let basket_delrow = await Basket.DelRow(basket_id); 
            console.log('basket_delrow',basket_delrow); 
            if(indexs.length==basket_ids.length){return res.json({'status':true,'message':'Basket product successfully added to wish.'});}
           
        });

        //return res.json({'status':true,'message':'Basket product successfully added to wish.'});  
        

        //return res.json(outputs);
        //return res.json(outputs);
        // let result = await Wishe.ToRent(post.basket_id);
        // if(!result.insertId){ return res.json({status:false,message:'Could not to rent basket somthing wrong.'}); }
        // else
        // {

        //     let notify = await Wishe.GetForNotify('torent',result.insertId);
        //     let push_result = await Notification.Push(notify);
        //     let deleted = await Basket.DelRow(post.basket_id);        
        //     return res.json({'status':true,'message':'Basket product successfully added to wish.','result':result});  
        
        // }
    
        
    }


});







router.post('/togrant', async function (req, res) 
{

	var post={};
    var errors={};
    
	if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id=`User id is required.`; }
    else if(!validator.isInt(req.body.user_id) ){ errors.user_id=`User id must be integer.`; }
    else if( await User.Exists(req.body.user_id)=='0'){errors.user_id=`User id is not exists.`;}
    else{post.user_id=req.body.user_id;} 

    if(!req.body.wishe_id || validator.isEmpty(req.body.wishe_id)){ errors.wishe_id="Wishe id is required."; }
    else if(!validator.isInt(req.body.wishe_id) ){ errors.wishe_id="Wishe id must be integer."; }
    else if( await Wishe.Exists(req.body.wishe_id)=='0'){errors.wishe_id="Wishe id is not exists.";}
    else{post.wishe_id=req.body.wishe_id;}  
    
	if(post.user_id && post.wishe_id){ if( await Wishe.Valid('Grant',post.user_id,post.wishe_id)=='0'){errors.basket="Is not valid for grant.";}    }
	

	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
        let result = await Wishe.ToGrant(post.wishe_id);
        let notify = await Wishe.GetForNotify('togrant',post.wishe_id);
        //let pushed = await Notification.Push(notify);
        let pushed = await AppNotify.Push(notify.to,notify.data,{title:notify.title,body:notify.body}); 
        return res.json({'status':true,'message':'Wish has been successfully granted.','result':result});  
    
    }


});







router.post('/collection', async function (req, res) 
{

	var post={};
    var errors={};

	if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id=`User id is required.`; }
    else if(!validator.isInt(req.body.user_id) ){ errors.user_id=`User id must be integer.`; }
    else if( await User.Exists(req.body.user_id)=='0'){errors.user_id=`User id is not exists.`;}
    else{post.user_id=req.body.user_id;} 

    if(!req.body.wishe_id || validator.isEmpty(req.body.wishe_id)){ errors.wishe_id="Wishe id is required."; }
    else if(!validator.isInt(req.body.wishe_id) ){ errors.wishe_id="Wishe id must be integer."; }
    else if( await Wishe.Exists(req.body.wishe_id)=='0'){errors.wishe_id="Wishe id is not exists.";}
    else{post.wishe_id=req.body.wishe_id;}  
    
    if(!req.body.date_time || validator.isEmpty(req.body.date_time)){ errors.date_time=`Date & time is required.`; }
	else{post.date_time=req.body.date_time;}

    if(post.user_id && post.wishe_id){ if( await Wishe.Valid('Collection',post.user_id,post.wishe_id)=='0'){errors.wishe="Is not valid for collection.";}    }
        
	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
        let result = await Wishe.Collection(post.wishe_id,post.date_time);
        let notify = await Wishe.GetForNotify('collection',post.wishe_id);
        //let pushed = await Notification.Push(notify);
        let pushed = await AppNotify.Push(notify.to,notify.data,{title:notify.title,body:notify.body});
        return res.json({'status':true,'message':'Wish has been successfully ready for collection.','result':result});            
    }



});






router.post('/completed', async function (req, res) 
{

	var post={};
    var errors={};

	if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id=`User id is required.`; }
    else if(!validator.isInt(req.body.user_id) ){ errors.user_id=`User id must be integer.`; }
    else if( await User.Exists(req.body.user_id)=='0'){errors.user_id=`User id is not exists.`;}
    else{post.user_id=req.body.user_id;} 

    if(!req.body.wishe_id || validator.isEmpty(req.body.wishe_id)){ errors.wishe_id="Wishe id is required."; }
    else if(!validator.isInt(req.body.wishe_id) ){ errors.wishe_id="Wishe id must be integer."; }
    else if( await Wishe.Exists(req.body.wishe_id)=='0'){errors.wishe_id="Wishe id is not exists.";}
    else{post.wishe_id=req.body.wishe_id;}  
    
	if(post.user_id && post.wishe_id){ if( await Wishe.Valid('Completed',post.user_id,post.wishe_id)=='0'){errors.wishe="Is not valid for completed.";}    }
	
	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
        let result = await Wishe.Completed(post.wishe_id);
        let notify = await Wishe.GetForNotify('completed',post.wishe_id);
        //let pushed = await Notification.Push(notify);
        let pushed = await AppNotify.Push(notify.to,notify.data,{title:notify.title,body:notify.body});
        return res.json({'status':true,'message':'Wish has been successfully completed.','result':result});

    }



});







router.post('/decline', async function (req, res) 
{
    var post={};
    var errors={};

    
    if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id=`User id is required.`; }
    else if(!validator.isInt(req.body.user_id) ){ errors.user_id=`User id must be integer.`; }
    else if( await User.Exists(req.body.user_id)=='0'){errors.user_id=`User id is not exists.`;}
    else{post.user_id=req.body.user_id;} 

    if(!req.body.wishe_id || validator.isEmpty(req.body.wishe_id)){ errors.wishe_id="Wishe id is required."; }
    else if(!validator.isInt(req.body.wishe_id) ){ errors.wishe_id="Wishe id must be integer."; }
    else if( await Wishe.Exists(req.body.wishe_id)=='0'){errors.wishe_id="Wishe id is not exists.";}
    else{post.wishe_id=req.body.wishe_id;}  

    
    if (!req.body.reason || validator.isEmpty(req.body.reason)) { errors.reason = "Reason is required."; }
    else if (!validator.isByteLength(req.body.reason, { min: 3, max: 1000 })) { errors.reason = "Reason length is min 3 & max 1000."; }
    else{ post.reason=req.body.reason; }

	if(post.user_id && post.wishe_id){ if( await Wishe.Valid('Decline',post.user_id,post.wishe_id)=='0'){errors.basket="Is not valid for decline.";}    }
    
    
	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
        let result = await Wishe.Decline(post.wishe_id,post.reason);
        let notify = await Wishe.GetForNotify('decline',post.wishe_id);
        //let pushed = await Notification.Push(notify);
        let pushed = await AppNotify.Push(notify.to,notify.data,{title:notify.title,body:notify.body});
        return res.json({'status':true,'message':'Wish has been successfully Declined.','result':result});  
    }



});





router.get('/owner/:locale?/:user_id?', async function (req, res) 
{

	var get={};
    var errors={};

    if(!req.params.locale || validator.isEmpty(req.params.locale)) { errors.locale = `locale is required.`; }
	else if(!config.locales.includes(req.params.locale)){ errors.locale = `locale is not valid should be  ${config.locales.toString()}.`; }
	else{ get.locale=req.params.locale;  }

    if(!req.params.user_id || validator.isEmpty(req.params.user_id)){ errors.user_id="User id is required."; }
    else if( !validator.isInt(req.params.user_id) ){ errors.user_id="User  id must be integer."; }
	else if( await User.Exists(req.params.user_id)=='0'){errors.user_id="User id is not exists.";}
	else{get.user_id=req.params.user_id;} 

    if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {

		let wishes={};
        wishes.completed = await Wishe.OwnerCompleted(get.locale,get.user_id);
        wishes.new = await Wishe.OwnerNew(get.locale,get.user_id);
		wishes.declined = await Wishe.OwnerDeclined(get.locale,get.user_id);
        wishes.inprogress = await Wishe.OwnerInProgress(get.locale,get.user_id);
        return res.json({'status':true,'wishes':wishes,'message':"Success"});
		
    }




});




//updated 2020
router.get('/renter/:locale?/:user_id?', async function (req, res) 
{

	var get={};
    var errors={};

    if(!req.params.locale || validator.isEmpty(req.params.locale)) { errors.locale = `locale is required.`; }
	else if(!config.locales.includes(req.params.locale)){ errors.locale = `locale is not valid should be  ${config.locales.toString()}.`; }
	else{ get.locale=req.params.locale;  }

    if(!req.params.user_id || validator.isEmpty(req.params.user_id)){ errors.user_id="User id is required."; }
    else if( !validator.isInt(req.params.user_id) ){ errors.user_id="User  id must be integer."; }
	else if( await User.Exists(req.params.user_id)=='0'){errors.user_id="User id is not exists.";}
	else{get.user_id=req.params.user_id;} 

    if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
		let wishes={};
        wishes.completed = await Wishe.RenterCompleted(get.locale,get.user_id);
        wishes.new = await Wishe.RenterNew(get.locale,get.user_id);
		wishes.declined = await Wishe.RenterDeclined(get.locale,get.user_id);
		wishes.accepted = await Wishe.RenterAccepted(get.locale,get.user_id);
		
		return res.json({'status':true,'wishes':wishes,'message':"Success"});
		
    }




});





module.exports = router;

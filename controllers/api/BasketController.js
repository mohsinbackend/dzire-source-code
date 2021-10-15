var express = require('express');
var router = express.Router();
var validator = require('validator');
var config = require('config');

var User = require('../../models/User');
var Basket = require('../../models/Basket');
var Listing = require('../../models/Listing');





router.post('/removeto', async function (req, res) 
{

	var post={};
    var errors={};
    
	if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id=`User id is required.`; }
    else if(!validator.isInt(req.body.user_id) ){ errors.user_id=`User id must be integer.`; }
    else if( await User.Exists(req.body.user_id)=='0'){errors.user_id=`User id is not exists.`;}
    else{post.user_id=req.body.user_id;} 

    if(!req.body.basket_id || validator.isEmpty(req.body.basket_id)){ errors.basket_id="Basket id is required."; }
    else if(!validator.isInt(req.body.basket_id) ){ errors.basket_id="Basket id must be integer."; }
    else if( await Basket.Exists(req.body.basket_id)=='0'){errors.basket_id="Basket id is not exists.";}
    else{post.basket_id=req.body.basket_id;}  
    
	if(post.user_id && post.basket_id){ if( await Basket.IsOwner(post.user_id,post.basket_id)=='0'){errors.basket="Is not owner of basket.";}    }
	
	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
		let deleted = await Basket.DelRow(post.basket_id);
        return res.json({'status':true,'deleted':deleted,'message':'Basket has been successfully removed.'});
    }


});










router.post('/addto', async function (req, res) 
{
	var msg='';
	var post={};
	var errors={};

	if(!req.body.pickup_date || validator.isEmpty(req.body.pickup_date)){ msg=errors.pickup_date=`Pickup date is required.`; }
	//else if(!validator.isDate(req.body.pickup_date,'YYYY-MM-DD') ){errors.pickup_date=`Pickup date format is not valid. like YYYY-MM-DD `; }
	else{post.pickup_date=req.body.pickup_date;}

	if(!req.body.dropoff_date || validator.isEmpty(req.body.dropoff_date)){ msg=errors.dropoff_date=`Pickup date is required.`; }
	//else if(!validator.isDate(req.body.dropoff_date,'YYYY-MM-DD') ){errors.dropoff_date=`Pickup date format is not valid. like YYYY-MM-DD `; }
	else{post.dropoff_date=req.body.dropoff_date;}

	if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ msg=errors.user_id=`User id is required.`; }
    else if(!validator.isInt(req.body.user_id) ){ msg=errors.user_id=`User id must be integer.`; }
    else if( await User.Exists(req.body.user_id)=='0'){msg=errors.user_id=`User id is not exists.`;}else{post.user_id=req.body.user_id;} 

    
    if(!req.body.listing_id || validator.isEmpty(req.body.listing_id)){ msg=errors.listing_id="Listing id is required."; }
    else if(!validator.isInt(req.body.listing_id) ){ msg=errors.listing_id="Listing  id must be integer."; }
    else if( await Listing.Exists(req.body.listing_id)=='0'){ msg=errors.listing_id="Listing id is not exists.";}else{post.listing_id=req.body.listing_id;}  
	
	if(post.user_id && post.listing_id){ const check = await Listing.IsOwner(post); if(check=='1'){ msg=errors.basket="User is owner of listing.";} }
	
	if(post.user_id && post.listing_id){ const check = await Basket.Already(post); if(check=='1'){ msg=errors.basket="This product is already in basket.";} }
    
    if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':msg,'errors':errors }); }
    else
    {		
		let result = await Basket.AddTo(post);
		return res.json({'status':true,'result':result,'message':"Successfully added to basket."});	
    }


});




router.get('/mybasket/:locale?/:user_id?', async function (req, res) 
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
		let baskets = await Basket.GetMy(get.locale,get.user_id);
		return res.json({'status':true,'baskets':baskets,'message':"success"});	
    }


});





module.exports = router;

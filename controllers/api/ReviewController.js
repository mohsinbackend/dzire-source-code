var express = require('express');
var router = express.Router();
var config = require('config');
var validator = require('validator');

var User = require('../../models/User');
var Wishe = require('../../models/Wishe');
var Review = require('../../models/Review');





router.get('/getowner/:locale?/:user_id?' , async function(req,res) 
{

    var get={};
    var errors={};
    if(!req.params.locale || validator.isEmpty(req.params.locale)) { errors.locale = "locale is required."; }
    else if(!config.locales.includes(req.params.locale)){ errors.locale=`Only allow this loacle ${config.locales.toString()}.`; }
    else { get.locale = req.params.locale;  }

    if(!req.params.user_id || validator.isEmpty(req.params.user_id)){ errors.user_id="User id is required."; }
    else if(!validator.isInt(req.params.user_id) ){ errors.user_id="User  id must be integer."; }
    else if( await User.Exists(req.params.user_id)=='0'){errors.user_id="User id is not exists.";}else{get.user_id=req.params.user_id;} 

    if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
        let reviews = await Review.GetOwner(get.locale,get.user_id);
        return res.json({'status':true,'reviews':reviews,'message':'success'});    
    }


});



router.get('/getrenter/:locale?/:user_id?' , async function(req,res) 
{    

    var get={};
    var errors={};
    if(!req.params.locale || validator.isEmpty(req.params.locale)) { errors.locale = "locale is required."; }
    else if(!config.locales.includes(req.params.locale)){ errors.locale=`Only allow this loacle ${config.locales.toString()}.`; }
    else { get.locale = req.params.locale;  }

    if(!req.params.user_id || validator.isEmpty(req.params.user_id)){ errors.user_id="User id is required."; }
    else if(!validator.isInt(req.params.user_id) ){ errors.user_id="User  id must be integer."; }
    else if( await User.Exists(req.params.user_id)=='0'){errors.user_id="User id is not exists.";}else{get.user_id=req.params.user_id;} 

    if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
        let reviews = await Review.GetRenter(get.locale,get.user_id);
        return res.json({'status':true,'reviews':reviews,'message':'success'});    
    }

});



router.post('/setowner' , async function(req,res) 
{
   
   
    var post={};
	var errors={};
            
    if(!req.body.wishe_id || validator.isEmpty(req.body.wishe_id)){ errors.wishe_id="Wishe id is required."; }
    else if(!validator.isInt(req.body.wishe_id) ){ errors.wishe_id="Wishe id must be integer."; }
    else if( await Wishe.Exists(req.body.wishe_id)=='0'){errors.wishe_id="Wishe id is not exists.";}
    else{post.wishe_id=req.body.wishe_id;}  
  
    if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id=`User id is required.`; }
    else if(!validator.isInt(req.body.user_id) ){ errors.user_id=`User id must be integer.`; }
    else if( await User.Exists(req.body.user_id)=='0'){errors.user_id=`User id is not exists.`;}
    else{post.user_id=req.body.user_id;} 

 
    if(!req.body.user_rating || validator.isEmpty(req.body.user_rating)){ errors.user_rating=`User Rating is required.`; }
    else if(!validator.isDecimal(req.body.user_rating) ){ errors.user_rating=`Rating  must be Decimal.`; }
    else if(req.body.user_rating < 1 || req.body.user_rating > 5 ){ errors.user_rating=`Rating should be greater then 1 & less then 5`; }
    else{post.user_rating=req.body.user_rating;}

    if (!req.body.user_review || validator.isEmpty(req.body.user_review)){errors.user_review = "User Review is required."; }
    else if (!validator.isByteLength(req.body.user_review, { min: 3, max: 1000 })){errors.user_review = "User Review length is min 3 & max 1000."; }
    else{ post.user_review=req.body.user_review; }

    if(!req.body.listing_rating || validator.isEmpty(req.body.listing_rating)){ errors.listing_rating=`Listing Rating is required.`; }
    else if(!validator.isDecimal(req.body.listing_rating) ){ errors.listing_rating=`Listing Rating  must be Decimal.`; }
    else if(req.body.listing_rating < 1 || req.body.listing_rating > 5 ){ errors.listing_rating=`Listing Rating should be greater then 1 & less then 5`; }
    else{post.listing_rating=req.body.listing_rating;}

    if (!req.body.listing_review || validator.isEmpty(req.body.listing_review)){errors.listing_review = "Listing Review is required."; }
    else if (!validator.isByteLength(req.body.listing_review, { min: 3, max: 1000 })){errors.listing_review = "Listing Review length is min 3 & max 1000."; }
    else{ post.listing_review=req.body.listing_review; }

    if(post.user_id && post.wishe_id)
    {
        if( await Review.TypeUserWishAlready('owner',post.user_id,post.wishe_id)=='1'){errors.valid=`Owner wish rating & review already written..`;}
        else if( await Review.Valid('Owner',post.user_id,post.wishe_id)=='0'){errors.valid="Is not valid for Owner Review. user_id is not renter or wishe_id not completed.";}
    }
   


    if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
   
        let result= await Review.SetOwner(post);
        return res.json({'status':true,'result':result,'message':"Owner review has been successfully submited."});	

    }



});





router.post('/setrenter' , async function(req,res) 
{
   
   
    var post={};
	var errors={};
    
    var post={};
	var errors={};
            
    if(!req.body.wishe_id || validator.isEmpty(req.body.wishe_id)){ errors.wishe_id="Wishe id is required."; }
    else if(!validator.isInt(req.body.wishe_id) ){ errors.wishe_id="Wishe id must be integer."; }
    else if( await Wishe.Exists(req.body.wishe_id)=='0'){errors.wishe_id="Wishe id is not exists.";}
    else{post.wishe_id=req.body.wishe_id;}  
  
    if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id=`User id is required.`; }
    else if(!validator.isInt(req.body.user_id) ){ errors.user_id=`User id must be integer.`; }
    else if( await User.Exists(req.body.user_id)=='0'){errors.user_id=`User id is not exists.`;}
    else{post.user_id=req.body.user_id;} 

 
    if(!req.body.user_rating || validator.isEmpty(req.body.user_rating)){ errors.user_rating=`User Rating is required.`; }
    else if(!validator.isDecimal(req.body.user_rating) ){ errors.user_rating=`Rating  must be Decimal.`; }
    else if(req.body.user_rating < 1 || req.body.user_rating > 5 ){ errors.user_rating=`Rating should be greater then 1 & less then 5`; }
    else{post.user_rating=req.body.user_rating;}

    if (!req.body.user_review || validator.isEmpty(req.body.user_review)){errors.user_review = "User Review is required."; }
    else if (!validator.isByteLength(req.body.user_review, { min: 3, max: 1000 })){errors.user_review = "User Review length is min 3 & max 1000."; }
    else{ post.user_review=req.body.user_review; }


    if(post.user_id && post.wishe_id){ const valid = await Review.Valid('Renter',post.user_id,post.wishe_id); if(valid!='1')
    {errors.valid="";}    }

    if(post.user_id && post.wishe_id)
    {
        if( await Review.TypeUserWishAlready('renter',post.user_id,post.wishe_id)=='1'){errors.valid=`Renter wish rating & review already written..`;}
        else if( await Review.Valid('Renter',post.user_id,post.wishe_id)=='0'){errors.valid="Is not valid for Renter Review. user_id not of owner or wish_id not completed.";}
    }

    if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
       
        let result= await Review.SetRenter(post);
        return res.json({'status':true,'result':result,'message':"Renter review has been successfully submited."});	

    }



});









module.exports = router;

var express = require('express');
var router = express.Router();
// var mysql = require('mysql');
// var rand = require("random-key");
var validator = require('validator');
var config = require('config');
var DB = require('../../config/Database');

var User = require('../../models/User');
var Size = require('../../models/Size');
var Brand = require('../../models/Brand');
var Color = require('../../models/Color');
var Region = require('../../models/Region');
var Country = require('../../models/Country');
var Listing = require('../../models/Listing');
var Category = require('../../models/Category');
var Condition = require('../../models/Condition');
var Subcategory = require('../../models/Subcategory');
var Chargestype = require('../../models/Chargestype');
var UserSeenListing = require('../../models/UserSeenListing');
var WebNotify = require('../../models/WebNotify');





router.post('/wantpropics',async function(req,res)
{

    var post={};
    var errors={};
   
    if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id=`User id is required.`; }
    else if(!validator.isInt(req.body.user_id) ){ errors.user_id=`User id must be integer.`; }
    else if( await User.Exists(req.body.user_id)=='0'){errors.user_id=`User id is not exists.`;}
    else{post.user_id=req.body.user_id;} 

    if(Object.keys(errors).length > 0 ){ return res.json({status:false,message:'valid fails.',errors:errors }); }
    else
    {
        let user = await User.first(['fname','lname'],post.user_id);
        if(typeof(user)!='object' || !user.id){ return res.json({status:false,message:user});}
        else
        {
            let notify={};
            notify.type='wantpropics';
            notify.user_id=post.user_id;
            notify.title=`${user.fname} ${user.lname} want to get professional pics.`;
            notify.body=`${user.fname} ${user.lname} Want to get professional pics to best showcase her product.`;
            let pushed = await WebNotify.Send(notify);
            let stored = await WebNotify.Store(notify);
            return res.json({status:true,message:'success',stored});       
        }
        
    }





});



// router.post('/getbysubcate',async function(req,res) 
// {

//     var post={};
//     var errors={};
//     if(!req.body.locale || validator.isEmpty(req.body.locale)) { errors.locale = `locale is required.`; }
//     else if(!config.locales.includes(req.body.locale)){ errors.locale = `locale is not valid like: ${config.locales.toString()}.`; }
//     else { post.locale = req.body.locale;  }

//     if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id="User id is required."; }
//     else if(!validator.isInt(req.body.user_id) ){ errors.user_id="User id must be integer."; }
//     else if(req.body.user_id!=0 || req.body.user_id!='0' ){ if( await User.Exists(req.body.user_id)=='0'){errors.user_id="User id is not exists.";}else{post.user_id=req.body.user_id;} }
//     else{ post.user_id=req.body.user_id; }


//     if(!req.body.subcate_id || validator.isEmpty(req.body.subcate_id)){ errors.subcate_id=`Subcategory id is required.`; }
//     else if(!validator.isInt(req.body.subcate_id) ){ errors.subcate_id=`Subcategory id must be integer.`; }
//     else if( await Subcategory.Exists(req.body.subcate_id)=='0'){errors.subcate_id=`Subcategory id is not exists.`;}
//     else{post.subcate_id=req.body.subcate_id;} 


//     if(!req.body.listing_len || validator.isEmpty(req.body.listing_len)){ errors.listing_len="Listing length is required."; }
//     else if(!validator.isInt(req.body.listing_len) ){ errors.listing_len="Listing length must be integer."; }
//     else{ post.listing_len=req.body.listing_len; }

//     if(!req.body.sortby || validator.isEmpty(req.body.sortby)){ errors.sortby="Sortby is required."; }
//     else if(!validator.isInt(req.body.sortby) ){ errors.sortby="Listing length must be integer."; }
//     else{ post.sortby=req.body.sortby; }
    
  
    

// 	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
//     else
//     {
       
//         post.limit=10; 
//         let listings = await Listing.GetBySubcate(post);
//         return res.json({'status':true,'listings':listings,'message':'success'});  
        

//     }



// });





router.get('/getbysubcate/:locale?/:user_id?/:subcate_id/:listing_len?',async function(req,res) 
{


    var get={};
    var errors={};

    if(!req.params.locale || validator.isEmpty(req.params.locale)) { errors.locale = `locale is required.`; }
    else if(!config.locales.includes(req.params.locale)){ errors.locale = `locale is not valid like: ${config.locales.toString()}.`; }
    else { get.locale = req.params.locale;  }

    if(!req.params.user_id || validator.isEmpty(req.params.user_id)){ errors.user_id="User id is required."; }
    else if(!validator.isInt(req.params.user_id) ){ errors.user_id="User id must be integer."; }
    else if(req.params.user_id!=0 || req.params.user_id!='0' ){ if( await User.Exists(req.params.user_id)=='0'){errors.user_id="User id is not exists.";}else{get.user_id=req.params.user_id;} }
    else{ get.user_id=req.params.user_id; }


    if(!req.params.subcate_id || validator.isEmpty(req.params.subcate_id)){ errors.subcate_id=`Subcategory id is required.`; }
    else if(!validator.isInt(req.params.subcate_id) ){ errors.subcate_id=`Subcategory id must be integer.`; }
    else if( await Subcategory.Exists(req.params.subcate_id)=='0'){errors.subcate_id=`Subcategory id is not exists.`;}
    else{get.subcate_id=req.params.subcate_id;} 

    if(!req.params.listing_len || validator.isEmpty(req.params.listing_len)){ errors.listing_len="Listing length is required."; }
    else if(!validator.isInt(req.params.listing_len) ){ errors.listing_len="Listing length must be integer."; }else{ get.listing_len=req.params.listing_len; }
    
	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
        get.limit=10; 
        let listings = await Listing.GetBySubcate(get);
        return res.json({'status':true,'listings':listings,'message':'success'});  
    
    }


});




//Filters 2020
router.get('/filters/:locale?/', async function(req,res) 
{

    
    var get={};
    var errors={};

    if(!req.params.locale || validator.isEmpty(req.params.locale)) { errors.locale=`locale is required.`; }
    else if(!config.locales.includes(req.params.locale)){ errors.locale=`locale is not valid like : ${config.locales.toString()} .`; }
    else { get.locale=req.params.locale;  }
    

    if(Object.keys(errors).length>0){ return res.json({status:false,message:`Validation Fails.`,errors:errors}); }
	else
	{
        let filters={};
        filters.sizes = await Size.GetLookup(get.locale);
        filters.brands = await Brand.GetLookup(get.locale);
        filters.colors = await Color.GetLookup(get.locale);
        filters.conditions= await Condition.GetLookup(get.locale);
        filters.categories = await Category.GetLookup(get.locale);
        filters.subcategories = await Subcategory.GetLookup(get.locale);
        filters.chargestypes = await Chargestype.GetLookup(get.locale);
       
        return res.json({status:true,'filters':filters,message:`success`});
    
    }
    


});







//2020 updated
router.get('/create/:locale?/:user_id?',async function(req,res) 
{

    var get={};
    var errors={};
    
    if(!req.params.locale || validator.isEmpty(req.params.locale)) { errors.locale = `locale is required.`; }
    else if(!config.locales.includes(req.params.locale)){ errors.locale = `locale is not valid like: ${config.locales.toString()}.`; }
    else { get.locale = req.params.locale;  }

    if(!req.params.user_id || validator.isEmpty(req.params.user_id)){ errors.user_id=`User id is required.`; }
    else if(!validator.isInt(req.params.user_id) ){ errors.user_id=`User id must be integer.`; }
    else if( await User.Exists(req.params.user_id)=='0'){errors.user_id=`User id is not exists.`;}
    else{get.user_id=req.params.user_id;} 
    

	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {

        let data={};
        data.taxt_options = await Listing.GetTaxtOptions(get.locale,get.user_id);
        data.chargestypes = await Chargestype.GetLookup(get.locale);
        data.sizes = await Size.GetLookup(get.locale);
        data.brands = await Brand.GetLookup(get.locale);
        data.colors = await Color.GetLookup(get.locale);
        data.regions = await Region.GetLookup(get.locale);
        data.countries = await Country.GetLookup(get.locale);
        data.categories = await Category.GetLookup(get.locale);
        data.conditions = await Condition.GetLookup(get.locale);
        data.subcategories = await Subcategory.GetLookup(get.locale);
        return res.json({'status':true,'data':data,'message':'success'});  
        
    
    }

    


});


//2020 updated
router.post('/store',async function(req,res) 
{


    var post={};
    var errors={};
    
    
    if (!req.body.is_deposit || validator.isEmpty(req.body.is_deposit)) { errors.is_deposit = "Is deposit required."; }
    else if(!['0','1'].includes(req.body.is_deposit)){ errors.is_deposit=`Is deposit  must be 0 or 1.`; }else{ post.is_deposit=req.body.is_deposit; }
        
    if (!req.body.is_pay_return || validator.isEmpty(req.body.is_pay_return)) { errors.is_pay_return = "Is pay return required."; }
    else if(!['0','1'].includes(req.body.is_pay_return)){ errors.is_pay_return=`Is pay return must be 0 or 1.`; }else{ post.is_pay_return=req.body.is_pay_return; }

    if (!req.body.is_cash_collect || validator.isEmpty(req.body.is_cash_collect)) { errors.is_cash_collect = "Is cash collect deposit required."; }
    else if(!['0','1'].includes(req.body.is_cash_collect)){ errors.is_cash_collect=`Is cash collect must be 0 or 1.`; }else{ post.is_cash_collect=req.body.is_cash_collect; }
    
    if (!req.body.is_upon_pickup || validator.isEmpty(req.body.is_upon_pickup)) { errors.is_upon_pickup = "Is upon pickup  required."; }
    else if(!['0','1'].includes(req.body.is_upon_pickup)){ errors.is_upon_pickup=`Is upon pickup must be 0 or 1.`; }else{ post.is_upon_pickup=req.body.is_upon_pickup; }

    if (!req.body.name || validator.isEmpty(req.body.name)) { errors.name = "Name is required."; }
	else if (!validator.isByteLength(req.body.name, { min: 3, max: 100 })) { errors.name = "Name length is min 3 & max 100."; } 
    else{ post.name=req.body.name; }

    //Remove Reason PerDay,PerWeek,PerMonth,Purchase Price Add
    // if (!req.body.charges_amount || validator.isEmpty(req.body.charges_amount)) { errors.charges_amount = "Charges amount is required."; }
	// else if(!validator.isInt(req.body.charges_amount) ){ errors.charges_amount=`Charges amount must be integer.`; }else{ post.charges_amount=req.body.charges_amount; }

    
    if (!req.body.deposit_amount || validator.isEmpty(req.body.deposit_amount)) { errors.deposit_amount = "Deposit amount is required."; }
	else if(!validator.isInt(req.body.deposit_amount) ){ errors.deposit_amount=`Deposit amount must be integer.`; }else{ post.deposit_amount=req.body.deposit_amount; }

    if (!req.body.min_rent_days || validator.isEmpty(req.body.min_rent_days)) { errors.min_rent_days = "Minimum rental days is required."; }
	else if(!validator.isInt(req.body.min_rent_days) ){ errors.min_rent_days=`Minimum Rental days must be integer.`; }else{ post.min_rent_days=req.body.min_rent_days; }
    

    if (!req.body.location || validator.isEmpty(req.body.location)) { errors.location = "Location is required."; }
	else if (!validator.isByteLength(req.body.location, { min: 3, max: 255 })) { errors.location = "Location length is min 3 & max 255."; } 
    else{ post.location=req.body.location; }

    if (!req.body.description || validator.isEmpty(req.body.description)) { errors.description = "Description is required."; }
	else if (!validator.isByteLength(req.body.description, { min: 3, max: 1000 })) { errors.description = "Description length is min 3 & max 1000."; } 
    else{ post.description=req.body.description; }

    if (!req.body.renting_policy || validator.isEmpty(req.body.renting_policy)) { errors.renting_policy = "Renting policy is required."; }
	else if (!validator.isByteLength(req.body.renting_policy, { min: 3, max: 1000 })) { errors.renting_policy = "Renting policy length is min 3 & max 1000."; } 
    else{ post.renting_policy=req.body.renting_policy; }

    if (!req.body.care_instructions || validator.isEmpty(req.body.care_instructions)) { errors.care_instructions = "Renting policy is required."; }
	else if (!validator.isByteLength(req.body.care_instructions, { min: 3, max: 1000 })) { errors.care_instructions = "Renting policy length is min 3 & max 1000."; } 
    else{ post.care_instructions=req.body.care_instructions; }

    
    if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id=`User id is required.`; }
    else if(!validator.isInt(req.body.user_id) ){ errors.user_id=`User id must be integer.`; }
    else if( await User.Exists(req.body.user_id)=='0'){errors.user_id=`User id is not exists.`;}
    else{post.user_id=req.body.user_id;} 

    //Remove Reason PerDay,PerWeek,PerMonth,Purchase Price Add
    // if(!req.body.chargestype_id || validator.isEmpty(req.body.chargestype_id)){ errors.chargestype_id=`Charges type id is required.`; }
    // else if(!validator.isInt(req.body.chargestype_id) ){ errors.chargestype_id=`Charges type id must be integer.`; }
    // else if( await Chargestype.Exists(req.body.chargestype_id)=='0'){errors.chargestype_id=`Charges type id is not exists.`;}
    // else{post.chargestype_id=req.body.chargestype_id;}

    
    
    if(!req.body.region_id || validator.isEmpty(req.body.region_id)){ errors.region_id=`Region id is required.`; }
    else if(!validator.isInt(req.body.region_id) ){ errors.region_id=`Region id must be integer.`; }
    else if( await Region.Exists(req.body.region_id)=='0'){errors.region_id=`Region id is not exists.`;}
    else{post.region_id=req.body.region_id;} 
    
    if(!req.body.country_id || validator.isEmpty(req.body.country_id)){ errors.country_id=`Country id is required.`; }
    else if(!validator.isInt(req.body.country_id) ){ errors.country_id=`Country id must be integer.`; }
    else if( await Country.Exists(req.body.country_id)=='0'){errors.country_id=`Country id is not exists.`;}
    else{post.country_id=req.body.country_id;} 
    

    if(!req.body.size_id || validator.isEmpty(req.body.size_id)){ errors.size_id=`Size id is required.`; }
    else if(!validator.isInt(req.body.size_id) ){ errors.size_id=`Size id must be integer.`; }
    else if( await Size.Exists(req.body.size_id)=='0'){errors.size_id=`Size id is not exists.`;}
    else{post.size_id=req.body.size_id;} 

    if(!req.body.color_id || validator.isEmpty(req.body.color_id)){ errors.color_id=`Color id is required.`; }
    else if(!validator.isInt(req.body.color_id) ){ errors.color_id=`Color id must be integer.`; }
    else if( await Color.Exists(req.body.color_id)=='0'){errors.color_id=`Color id is not exists.`;}
    else{post.color_id=req.body.color_id;} 
    
    if(!req.body.brand_id || validator.isEmpty(req.body.brand_id)){ errors.brand_id=`Brand id is required.`; }
    else if(!validator.isInt(req.body.brand_id) ){ errors.brand_id=`Brand id must be integer.`; }
    else if( await Brand.Exists(req.body.brand_id)=='0'){errors.brand_id=`Brand id is not exists.`;}
    else{post.brand_id=req.body.brand_id;} 
    
    if(!req.body.condition_id || validator.isEmpty(req.body.condition_id)){ errors.condition_id=`Condition id is required.`; }
    else if(!validator.isInt(req.body.condition_id) ){ errors.condition_id=`Condition id must be integer.`; }
    else if( await Condition.Exists(req.body.condition_id)=='0'){errors.condition_id=`Condition id is not exists.`;}
    else{post.condition_id=req.body.condition_id;} 
    
    if(!req.body.category_id || validator.isEmpty(req.body.category_id)){ errors.category_id=`Category id is required.`; }
    else if(!validator.isInt(req.body.category_id) ){ errors.category_id=`Category id must be integer.`; }
    else if( await Category.Exists(req.body.category_id)=='0'){errors.category_id=`Category id is not exists.`;}
    else{post.category_id=req.body.category_id;} 
    
    if(!req.body.subcategory_id || validator.isEmpty(req.body.subcategory_id)){ errors.subcategory_id=`Subcategory id is required.`; }
    else if(!validator.isInt(req.body.subcategory_id) ){ errors.subcategory_id=`Subcategory id must be integer.`; }
    else if( await Subcategory.Exists(req.body.subcategory_id)=='0'){errors.subcategory_id=`Subcategory id is not exists.`;}
    else{post.subcategory_id=req.body.subcategory_id;} 


    if (!req.body.per_day_amount || validator.isEmpty(req.body.per_day_amount)) { errors.per_day_amount = "Per Day amount is required."; }
	else if(!validator.isInt(req.body.per_day_amount) ){ errors.per_day_amount=`Per Day must be integer.`; }else{ post.per_day_amount=req.body.per_day_amount; }

    if (!req.body.per_week_amount || validator.isEmpty(req.body.per_week_amount)) { errors.per_week_amount = "Per Week amount is required."; }
	else if(!validator.isInt(req.body.per_week_amount) ){ errors.per_week_amount=`Per Week must be integer.`; }else{ post.per_week_amount=req.body.per_week_amount; }

    if (!req.body.per_month_amount || validator.isEmpty(req.body.per_month_amount)) { errors.per_month_amount = "Per Month amount is required."; }
	else if(!validator.isInt(req.body.per_month_amount) ){ errors.per_month_amount=`Per Month must be integer.`; }else{ post.per_month_amount=req.body.per_month_amount; }

    if (!req.body.purchase_amount || validator.isEmpty(req.body.purchase_amount)) { errors.purchase_amount = "Purchase amount is required."; }
	else if(!validator.isInt(req.body.purchase_amount) ){ errors.purchase_amount=`Purchase must be integer.`; }else{ post.purchase_amount=req.body.purchase_amount; }


    if(!req.files || Object.keys(req.files).length===0 || req.files.images===undefined ){errors.images="images is required."; }
    else if( Array.isArray(req.files.images)==false ){ errors.images="Images is must be multiple."; }
    else 
    { 
        post.images=req.files.images; 
        post.images.forEach(function(row,index)
        { 
            let splits=row.mimetype.split("/"); 
            if(splits[0]!='image'){ errors.images=` [${index}] image ${row.name} must be ${config.image_upload_types.toString()}.`; }
        });
        
       
    }

    
    
	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
        
        let liststore = await Listing.ApiStore(post);
        if(!liststore.insertId){ return res.json({status:false,message:'Listing Not stored.',errors}); }
        else
        {
            let notify={};
            notify.type='approvlist';
            notify.user_id=post.user_id;
            notify.title=`Approval New ${post.name} Listing.`;
            notify.body=`User upload New ${post.name} Listing admin approval `;
            let pushed = await WebNotify.Send(notify);let stored = await WebNotify.Store(notify);
            return res.json({status:true,message:'Listin has been successfully stored.',output:liststore});          
        }
    
        
    }

    


});




//2020 updated
router.get('/getfavourites/:locale?/:user_id?',async function(req,res) 
{

    var get={};
    var errors={};
    
    if(!req.params.locale || validator.isEmpty(req.params.locale)) { errors.locale = `locale is required.`; }
    else if(!config.locales.includes(req.params.locale)){ errors.locale = `locale is not valid like: ${config.locales.toString()}.`; }
    else { get.locale = req.params.locale;  }

    if(!req.params.user_id || validator.isEmpty(req.params.user_id)){ errors.user_id=`User id is required.`; }
    else if(!validator.isInt(req.params.user_id) ){ errors.user_id=`User id must be integer.`; }
    else if( await User.Exists(req.params.user_id)=='0'){errors.user_id=`User id is not exists.`;}
    else{get.user_id=req.params.user_id;} 
    
	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {

        let listings = await Listing.GetFavourites(get.locale,get.user_id);
        return res.json({'status':true,'listings':listings,'message':'success'});     
    
    }


});





router.post('/setfavourite',async function(req,res) 
{

    var post={};
    var errors={};
    
    if(!req.body.listing_id || validator.isEmpty(req.body.listing_id)){ errors.listing_id="Listing id is required."; }
    else if(!validator.isInt(req.body.listing_id) ){ errors.listing_id="Listing  id must be integer."; }
    else if( await Listing.Exists(req.body.listing_id)=='0'){errors.listing_id="Listing id is not exists.";}
    else{post.listing_id=req.body.listing_id;}  
    

    if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id=`User id is required.`; }
    else if(!validator.isInt(req.body.user_id) ){ errors.user_id=`User id must be integer.`; }
    else if( await User.Exists(req.body.user_id)=='0'){errors.user_id=`User id is not exists.`;}
    else{post.user_id=req.body.user_id;} 
    

	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
        let message='';
        let dbresult = await Listing.SetFavourite(post.user_id,post.listing_id);
        if(dbresult.status=='0'){message='This item has been removed from the favourites';}
        if(dbresult.status=='1'){message='This item has been marked as favourite';}
        return res.json({status:true,message:message});  
        
    }

    


});






router.post('/more',async function(req,res) 
{

    var post={};
    var errors={};

    if(!req.body.type || validator.isEmpty(req.body.type)) { errors.type = `type is required.`; }
    else if(!config.listing_types.includes(req.body.type)){ errors.type = `type is not valid like: ${config.listing_types.toString()}.`; }
    else { post.type = req.body.type;  }

    if(!req.body.locale || validator.isEmpty(req.body.locale)) { errors.locale = `locale is required.`; }
    else if(!config.locales.includes(req.body.locale)){ errors.locale = `locale is not valid like: ${config.locales.toString()}.`; }
    else { post.locale = req.body.locale;  }

    //No need Skip_ID Because always show 20 listings.
    // if(!req.body.skip_id || validator.isEmpty(req.body.skip_id)){ errors.skip_id="Skip id is required."; }
    // else if(!validator.isInt(req.body.skip_id) ){ errors.skip_id="Skip id must be integer."; }
    // else if(req.body.skip_id!=0 || req.body.skip_id!='0' ){ if( await Listing.Exists(req.body.skip_id)=='0'){errors.skip_id="Skip id is not exists.";}else{post.skip_id=req.body.skip_id;}  }
    
    if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id=`User id is required.`; }
    else if(!validator.isInt(req.body.user_id) ){ errors.user_id=`User id must be integer.`; }
    else if(req.body.user_id!=0 || req.body.user_id!='0' ){ if( await User.Exists(req.body.user_id)=='0'){errors.user_id=`User id is not exists.`;}else{post.user_id=req.body.user_id;} }
    else{ post.user_id=req.body.user_id; }

	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
        
        let count=0;   
        post.skip_id=0; post.limit=20;
        let listings = await Listing.More(post);
        if(typeof(listings)=='object'){count=listings.length;}
        return res.json({'status':true,count,listings,'message':'success'});          
    
    }


});





router.post('/search',async function(req, res) 
{
    
    var post={};
    var errors={};
    let filters={};

    //return res.json(req.body);

    if(!req.body.locale || validator.isEmpty(req.body.locale)) { errors.locale = "locale is required."; }
    else if(!config.locales.includes(req.body.locale)){ errors.locale = "locale is not valid"; }
    else { post.locale = req.body.locale;  }

    if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id="User id is required."; }
    else if(!validator.isInt(req.body.user_id) ){ errors.user_id="User id must be integer."; }
    else if(req.body.user_id!=0 || req.body.user_id!='0' ){ if( await User.Exists(req.body.user_id)=='0'){errors.user_id="User id is not exists.";}else{post.user_id=req.body.user_id;} }
    else{ post.user_id=req.body.user_id; }

    if(req.body.keyword && !validator.isEmpty(req.body.keyword) ){ filters.keyword = req.body.keyword; }
    if(req.body.size_id && !validator.isEmpty(req.body.size_id) ){ filters.size_id = req.body.size_id; }
    if(req.body.color_id && !validator.isEmpty(req.body.color_id) ){ filters.color_id = req.body.color_id; }
    if(req.body.brand_id && !validator.isEmpty(req.body.brand_id) ){ filters.brand_id = req.body.brand_id; }
    if(req.body.category_id && !validator.isEmpty(req.body.category_id) ){ filters.category_id = req.body.category_id; }
    if(req.body.subcategory_id && !validator.isEmpty(req.body.subcategory_id) ){ filters.subcategory_id = req.body.subcategory_id; }    
    
    if((req.body.min && !validator.isEmpty(req.body.min)) && (req.body.max && !validator.isEmpty(req.body.max))  )
    { filters.min = req.body.min; filters.max = req.body.max; }
    
    if(!req.body.sortby || validator.isEmpty(req.body.sortby)) { errors.sortby = `sortby is required.`; }
    else if(!config.sortbys.includes(req.body.sortby)){ errors.sortby = `sortby is not valid like: ${config.sortbys.toString()}.`; }
    else { post.sortby = req.body.sortby;  }

	if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {

        let listings = await Listing.Search(post.locale,post.user_id,post.sortby,filters);
        return res.json({'status':true,'count':listings.length,'listings':listings}); 

    }



    
});





//Detail 2020
router.get('/detail/:locale?/:user_id?/:listing_id?', async function(req,res) 
{

    var get={};
    var errors={};

    if(!req.params.locale || validator.isEmpty(req.params.locale)) { errors.locale=`locale is required.`; }
    else if(!config.locales.includes(req.params.locale)){ errors.locale=`locale is not valid like : ${config.locales.toString()} .`; }
    else { get.locale=req.params.locale;  }
    
    if(!req.params.user_id || validator.isEmpty(req.params.user_id)){ errors.user_id="User id is required."; }
    else if(!validator.isInt(req.params.user_id) ){ errors.user_id="Listing  id must be integer."; }
    else if(req.params.user_id!=0 || req.params.user_id!='0' ){ if( await User.Exists(req.params.user_id)=='0'){errors.user_id="Listing id is not exists.";}else{get.user_id=req.params.user_id;}  }
    else{ get.user_id=req.params.user_id; }

    if(!req.params.listing_id || validator.isEmpty(req.params.listing_id)){ errors.listing_id="Listing id is required."; }
    else if(!validator.isInt(req.params.listing_id) ){ errors.listing_id="Listing  id must be integer."; }
    else if(req.params.listing_id!=0 || req.params.listing_id!='0' ){ if( await Listing.Exists(req.params.listing_id)=='0'){errors.listing_id="Listing id is not exists.";}else{get.listing_id=req.params.listing_id;}  }
    

    if(Object.keys(errors).length>0){ return res.json({status:false,message:`Validation Fails.`,errors:errors}); }
	else
	{   
       
        if(get.user_id!=0)
        {
            let result = await UserSeenListing.StoreIfExistsUpdate(get.user_id,get.listing_id);
        }
        let listing = await Listing.GetDetail(get.locale,get.user_id,get.listing_id);
        let relateds = await Listing.GetRelatedById(get.locale,get.user_id,get.listing_id,2,0);
        return res.json({status:true,'listing':listing,'relateds':relateds,message:`success`});
    
    }
    


});







































module.exports = router;

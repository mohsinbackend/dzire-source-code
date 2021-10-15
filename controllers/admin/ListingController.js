var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var rand = require("random-key");
var validator = require('validator');
var config = require('config');
const fs = require('fs');
var Jimp = require('jimp');


var Listing = require('../../models/Listing');
var AppNotify = require('../../models/AppNotify');
var ListingImages = require('../../models/ListingImages');
var UserNotification = require('../../models/UserNotification');
const Wishe = require('../../models/Wishe');





router.get('/list', async function (req, res) 
{  
   let listings= await Listing.GetForListing();
   return res.render('admin/listing/list',{listings:listings});

});




router.get('/gallery', function (req, res) 
{

    var db = mysql.createConnection(config.db);
    db.connect(function (error) {

        if (error) { return res.json(error); }
        else 
        {
            var url = config.url+"/images/listing/";
            var no_image = config.url+"/images/no-images-placeholder.png";
            var query = "";
            query += "SELECT listings.id ,listings.name ,categories.name AS category_name ";
            query += ",IF(listings.image=''||listings.image IS NULL,'" + no_image + "',CONCAT('" + url + "',listings.image) ) AS url ";
            query += "FROM `listings` LEFT JOIN categories ON categories.id=listings.category_id ";


            db.query("SELECT id, en_name AS name FROM categories", function (error,categories)
            { 
                db.query(query, function (error,images) 
                {
                    if (error){ return res.json(error); }
                    else
                    {
                        return res.render('admin/listing/gallery', {categories:categories,images:images,url:config.url });
                    }
                });

            });


        }



    });


    

});






router.get('/view/:id', async function (req,res) 
{
    let listing = await Listing.GetForViewByAdmin(req.params.id);
    return res.render('admin/listing/view',{'listing':listing});
});


router.post('/update',async function(req,res) 
{ 

    let post={};
    let errors={};

    if(!req.body.id || validator.isEmpty(req.body.id)){ errors.id="Listing id is required."; }
    else if(!validator.isInt(req.body.id) ){ errors.id="Listing  id must be integer."; }
    else if( await Listing.Exists(req.body.id)=='0'){errors.id="Listing id is not exists.";}
    else{post.id=req.body.id;}  

    if (!req.body.status || validator.isEmpty(req.body.status)) { errors.status = "Status is required."; req.flash('status_err',`${errors.status}`); }
    else if(!['0','1'].includes(req.body.status)){ errors.status=`Status  must be 0 or 1.`; req.flash('status_err',`${errors.status}`); }
    else{ post.status=req.body.status.trim(); req.flash('status',`${post.status}`);  }
   
    

    if(Object.keys(errors).length>0){req.flash('error',`${errors[Object.keys(errors)[0]]}`);return res.redirect(`view/${req.body.id}`); }
	else
	{
        let updated = await Listing.UpdateByAdmin(post);
        if(typeof(updated)!='object' || updated.changedRows==undefined){req.flash('error',`Database Error`);return res.redirect(`view/${req.body.id}`); }
        else
        {

            let listing = await Listing.GetForOwnerNotifyByAdmin(post.id);
            let title=`${listing.status} ${listing.name} Listing by Admin`;
            let body=`Dear ${listing.owner} Your ${listing.name} Listing ${listing.status} by Admin.`;
            await AppNotify.Push(listing.device_token,{},{title,body});
            await UserNotification.Save(listing.user_id,'0','Admin',title,body);
            req.flash('success',`Listing has been successfully ${listing.status}.`);     
            return res.redirect(`view/${req.body.id}`);  

            
        }



    }
    
   
    
    



});




// router.get('/create', function (req, res) 
// {

//     var db = mysql.createConnection(config.db);
//     db.connect(function (error) 
//     {

//         if (error) { return res.json(error); }
//         var UsersQuery = "SELECT id ,CONCAT('(',id,') ',fname,' ',lname) AS name  FROM `users` WHERE `status`='1'";
//         db.query(UsersQuery, function (error, users) 
//         {
//             if (error) { return res.json(error); }
//             var RentTypeQuery = "SELECT id,name FROM `rent_types`";
//             db.query(RentTypeQuery, function (error, rent_types) 
//             {

//                 var CategoryQuery = "SELECT categories.id ,categories.name ,GROUP_CONCAT(DISTINCT subcategories.id) AS subcategory_ids ,GROUP_CONCAT(DISTINCT subcategories.name) AS subcategory_names FROM `categories` JOIN `subcategories` ON categories.id=subcategories.category_id WHERE categories.status='1' GROUP BY categories.id";
//                 db.query(CategoryQuery, function (error, categories) 
//                 {
//                     return res.json({ 'url': config.url, 'users': users, 'rent_types': rent_types, categories: categories });
//                     if (error) { return res.json(error); }
//                     return res.render('admin/listing/create', { 'url': config.url, 'users': users, 'rent_types': rent_types, categories: categories });

//                 });


//             });


//         });


//     });


// });



// router.post('/store', function (req, res) 
// {

//     var errors = {};
//     var valid = true;
//     var listing = {};


//     if (!req.files || Object.keys(req.files).length === 0) { errors.image = "Image field is required."; }

//     if (!req.body.name || validator.isEmpty(req.body.name)) { errors.name = "Name field is required."; }
//     else if (!validator.isByteLength(req.body.name, { min: 3, max: 30 })) { errors.name = "Name length is min 3 or max 30."; }

//     if (!req.body.user || validator.isEmpty(req.body.user)) { errors.user = "User field is required."; }

//     if (!req.body.rent_rate || validator.isEmpty(req.body.rent_rate)) { errors.rent_rate = "Rent rate field is required."; }

//     if (!req.body.rent_type || validator.isEmpty(req.body.rent_type)) { errors.rent_type = "Rent type field is required."; }

//     if (!req.body.category || validator.isEmpty(req.body.category)) { errors.category = "Category field is required."; }

//     if (!req.body.description || validator.isEmpty(req.body.description)) { errors.description = "Description field is required."; }
//     else if (!validator.isByteLength(req.body.description, { min: 10, max: 1000 })) { errors.description = "Description field length is min 10 & max 1000."; }

//     if (!req.body.terms_usage || validator.isEmpty(req.body.terms_usage)) { errors.terms_usage = "Terms Usage field is required."; }
//     else if (!validator.isByteLength(req.body.terms_usage, { min: 10, max: 1000 })) { errors.terms_usage = "Terms Usage field length is min 10 & max 1000."; }

//     if (!req.body.featured || validator.isEmpty(req.body.featured)) { errors.featured = "Featured field is required."; }
//     if (!req.body.status || validator.isEmpty(req.body.status)) { errors.status = "Status field is required."; }

//     if (!errors.image) { } else { valid = false; req.flash('image_err', errors.image); };
//     if (!errors.name) { listing.name = req.body.name.trim(); req.flash('name', listing.name); } else { valid = false; req.flash('name_err', errors.name); }
//     if (!errors.user) { listing.user = req.body.user.trim(); req.flash('user', listing.user); } else { valid = false; req.flash('user_err', errors.user); }

//     if (!errors.rent_rate) { listing.rent_rate = req.body.rent_rate.trim(); req.flash('rent_rate', listing.rent_rate); } else { valid = false; req.flash('rent_rate_err', errors.rent_rate); }
//     if (!errors.rent_type) { listing.rent_type = req.body.rent_type.trim(); req.flash('rent_type', listing.rent_type); } else { valid = false; req.flash('rent_type_err', errors.rent_type); }

//     if (!errors.category) { listing.category = req.body.category.trim(); req.flash('category', listing.category); } else { valid = false; req.flash('category_err', errors.category); }

//     if (!errors.description) { listing.description = req.body.description.trim(); req.flash('description', listing.description); } else { valid = false; req.flash('description_err', errors.description); }
//     if (!errors.terms_usage) { listing.terms_usage = req.body.terms_usage.trim(); req.flash('terms_usage', listing.terms_usage); } else { valid = false; req.flash('terms_usage_err', errors.terms_usage); }

//     if (!errors.featured) { listing.featured = req.body.featured.trim(); req.flash('status', listing.featured); } else { valid = false; req.flash('featured_err', errors.featured); }
//     if (!errors.status) { listing.status = req.body.status.trim(); req.flash('status', listing.status); } else { valid = false; req.flash('status_err', errors.status); }

//     if (valid == false) {
//         req.flash('error', 'Could not store Listing validation fails.');
//         return res.redirect("create");
//     }
//     else {

//         //return res.json(listing);
//         var db = mysql.createConnection(config.db);
//         db.connect(function (error) {
//             if (error) { return res.json(error); }



//             var CategoryQuery = "SELECT `category_id` FROM `subcategories` WHERE id='" + listing.category + "'";
//             db.query(CategoryQuery, function (error, row) {
//                 if (error) { return res.json(error); }
//                 else {
//                     let image = req.files.image;
//                     listing.category_id = row[0].category_id;
//                     listing.subcategory_id = listing.category;
//                     listing.image = rand.generate(20) + "." + image.name.split(".")[1];

//                     var sql = "INSERT INTO listings(id,user_id,name,category_id,subcategory_id,rent_type_id,rent_rate,is_featured,image,description,terms_usage,status) VALUES(NULL ,'" + listing.user + "' ,'" + listing.name + "' ,'" + listing.category_id + "' ,'" + listing.subcategory_id + "' ,'" + listing.rent_type + "' ,'" + listing.rent_rate + "' ,'" + listing.featured + "'  ,'" + listing.image + "' ,'" + listing.description + "' ,'" + listing.terms_usage + "'  ,'" + listing.status + "' );";
//                     db.query(sql, function (err) {
//                         if (err) { return res.json({ status: false, message: err, errors: {} }); }
//                         else {
//                             req.flash('success', "Listing has been success stored.");
//                             image.mv('./public/images/listing/l/' + listing.image);
//                             Jimp.read('./public/images/listing/l/' + listing.image, (err, lenna) => {
//                                 if (err) throw err;
//                                 else{
//                                     lenna
//                                         .resize(300, 300) // resize
//                                         .write('./public/images/listing/m/' + listing.image);
//                                 }
//                             });
//                             Jimp.read('./public/images/listing/l/' + listing.image, (err, lenna) => {
//                                 if (err) throw err;
//                                 else{
//                                     lenna
//                                         .resize(100, 100) // resize
//                                         .write('./public/images/listing/s/' + listing.image); // save
//                                         return res.redirect("list");
//                                 }
//                             });
//                         }

//                     });



//                 }

//             });


//         });
//         // if(err){return res.json({status:false,message:err,errors:{} }); } 
//         // 
//     }


// });



router.delete('/delete', async function(req,res) 
{

    var del={};
    var errors={};
 

    if(!req.body.listing_id || validator.isEmpty(req.body.listing_id)){ errors.listing_id="Listing id is required."; }
    else if(!validator.isInt(req.body.listing_id) ){ errors.listing_id="Listing  id must be integer."; }
    else if( await Listing.Exists(req.body.listing_id)=='0'){errors.listing_id="Listing id is not exists.";}
    else{del.listing_id=req.body.listing_id;}  
    

    if(Object.keys(errors).length>0){ return res.json({status:false,message:`Validation Fails.`,errors:errors}); }
	else
	{

        let result={};
        result.find = await Wishe.Count(del.listing_id);
         if(result.find.count>0){
         req.flash('error',`${result.find.count} items purchased Should not delete the purchased items.`);     
             return res.json({status:false,message:`${result.find.count} items purchased Should not delete the purchased items.`,result:result});

         }else{

             result.listing = await Listing.DelWithImage(del.listing_id);
             result.images = await ListingImages.DetWithImagesByIistingId(del.listing_id);
             return res.json({status:true,message:`Listing has been succssfully deleted.`,result:result});
        
            }
            // return res.redirect(req.header('Referer'));

    }

    
});



module.exports = router;

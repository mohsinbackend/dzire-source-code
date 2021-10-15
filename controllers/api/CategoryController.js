var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var rand = require("random-key");
var validator = require('validator');
var config = require('config');


var User = require('../../models/User');
var Category = require('../../models/Category');
var Subcategory = require('../../models/Subcategory');
var UserRequest = require('../../models/UserRequest');
var WebNotify = require('../../models/WebNotify');





router.post('/addrequest',async function(req, res) 
{
    
    var post={};
    var errors={};
	if(!req.body.name || validator.isEmpty(req.body.name)){ errors.name="Category name is required."; }
	else if(!validator.isByteLength(req.body.name,{ min:3,max:20})){ errors.name="Category name length is min 3 or max 20."; }
    else{ post.name=req.body.name; }

    if(!req.body.user_id || validator.isEmpty(req.body.user_id)){ errors.user_id=`User id is required.`; }
    else if(!validator.isInt(req.body.user_id) ){ errors.user_id=`User id must be integer.`; }
    else if( await User.Exists(req.body.user_id)=='0'){errors.user_id=`User id is not exists.`;}
    else{post.user_id=req.body.user_id;} 


    if(Object.keys(errors).length > 0 ){ return res.json({status:false,message:'valid fails',errors}); }
    else
    {
        let catestored = await UserRequest.SetCategory(post.user_id,post.name);
        if(!catestored.insertId){ return res.json({status:false,message:'Category Not stored.',errors}); }
        else
        {
            let notify={};
            notify.type='reqcate';
            notify.user_id=post.user_id;
            notify.title=`Requested ${post.name} Category.`;
            notify.body=`User requested to add ${post.name} category.`;
            let pushed = await WebNotify.Send(notify);
            let stored = await WebNotify.Store(notify);
            return res.json({status:true,message:'success',output:catestored});
        
        }
     
       
    }



});



router.get('/getcates&subcates/:locale?',async function(req,res) 
{

    var get={};
    var errors={};

    if(!req.params.locale || validator.isEmpty(req.params.locale)) { errors.locale = "locale is required."; }
    else if(!config.locales.includes(req.params.locale)){ errors.locale=`locale is not valid. Only Allow : ${config.locales.toString()}.`; }
    else { get.locale = req.params.locale;  }

    if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {
        let categories = await Category.GetLookup(get.locale);
        let subcategories = await Subcategory.GetLookup(get.locale);
        return res.json({'status':true,'categories':categories,'subcategories':subcategories});
    }

});



router.get('/getall/:locale?', function(req, res) 
{
    
    
    var valid=true;
    var errors={};
    var locale="";
    var locales=['en','ar'];
    
    if(!req.params.locale || validator.isEmpty(req.params.locale)) { errors.locale = "locale is required."; valid = false; }
    else if(!locales.includes(req.params.locale)){ errors.locale = "locale is not valid"; valid = false; }
    else { locale = req.params.locale;  }


	if (valid == false) { return res.json({ status: false, message: "Validation Fails.", errors: errors }); }
    else 
    {

        var db = mysql.createConnection(config.db);
            
        db.connect(function(err) 
        {

            if (err) throw err;
            var url = req.get('host')+"/images/category/";
            var no_image = req.get('host')+"/images/no-images-placeholder.png";
            var sql ="SELECT id ,IF("+locale+"_name IS NULL,'',"+locale+"_name) AS name ,IF(image=''||image IS NULL,'"+no_image+"',CONCAT('"+url+"',image) ) AS image_url  FROM `categories`";
            db.query(sql, function (err,data) 
            {
                if (err){ return res.json({status:false,message:err})};
                
                if(!data)
                {
                    return res.json({status:false,message:'Category not available'});
                }
                else
                {
                    return res.json({ status:true,message:'success',data:data });
                }
            
            });
        

        }); 


    }    

  


});





router.post('/set', function(req, res) 
{
    

    
    var errors={};
	if(!req.body.name || validator.isEmpty(req.body.name)){ errors.name="name is required."; }
	else if(!validator.isByteLength(req.body.name,{ min:3,max:30})){ errors.name="name length is min 3 or max 30."; }
    
    if(!req.body.description||validator.isEmpty(req.body.description)){ errors.description="description is required."; }
	else if(!validator.isByteLength(req.body.description,{ min:10,max:1000})){ errors.description="description length is min 10 & max 1000."; }
    
    if(!req.files || Object.keys(req.files).length===0){ errors.image="image is required."; }
    
   
	if(errors.name || errors.image || errors.description)
	{ 
		return res.json({status:false,message:"Validation Fails.",errors:errors});
	}
	else
	{

            let image = req.files.image;
            let random_name= rand.generate(20)+"."+image.name.split (".")[1];    
            image.mv('./public/images/category/'+random_name);
            
            var category={};
            category.image = random_name;
            category.name = req.body.name;
            category.description = req.body.description;
            
            var db = mysql.createConnection(config.db);
            db.connect(function(err) 
            {
                if(err){return res.json({status:false,message:err,errors:{} }); } 
                var sql ="INSERT INTO categories(id,name,image,description) VALUES(NULL,'"+category.name+"','"+category.image+"','"+category.description+"' );";
                db.query(sql, function (err)
                { 
                    if(err){return res.json({status:false,message:err,errors:{} }); } 
                    else{ return res.json({status:true,message:"Category has been success stored."}); }
                    
                });

            });             

            
             
    

    }



});




module.exports = router;

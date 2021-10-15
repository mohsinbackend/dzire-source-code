var express = require('express');
var router = express.Router();
var validator = require('validator');
var config = require('config');

var Category = require('../../models/Category');
var Subcategory = require('../../models/Subcategory');


router.get('/getbycategory/:locale?/:category_id?',async function(req, res) 
{

    
    var get={};
    var errors={};

    if(!req.params.locale || validator.isEmpty(req.params.locale)) { errors.locale = "locale is required."; }
    else if(!config.locales.includes(req.params.locale)){ errors.locale=`locale is not valid. Only Allow : ${config.locales.toString()}.`; }
    else { get.locale = req.params.locale;  }

    if(!req.params.category_id || validator.isEmpty(req.params.category_id)){ errors.category_id="Category id is required."; }
    else if(!validator.isInt(req.params.category_id) ){ errors.category_id="Category id must be integer."; }
    else if( await Category.Exists(req.params.category_id)=='0'){errors.category_id="Category id is not exists.";}
    else{get.category_id=req.params.category_id;}  


    if(Object.keys(errors).length > 0 ){ return res.json({'status':false,'message':"Validation fails.",'errors':errors }); }
    else
    {  
        let subcategories = await Subcategory.GetByCategory(get.locale,get.category_id);
        return res.json({'status':true,'subcategories':subcategories,'message':'success'});
    }


});




// router.post('/set', function(req, res) 
// {
    

//     //return res.send(image.name);
//     var errors={};
//     if(!req.body.category_id || validator.isEmpty(req.body.category_id)){ errors.category_id="Category id is required."; }
    
// 	if(!req.body.name || validator.isEmpty(req.body.name)){ errors.name="name is required."; }
// 	else if(!validator.isByteLength(req.body.name,{ min:3,max:30})){ errors.name="name length is min 3 or max 30."; }
    
//     if(!req.body.description||validator.isEmpty(req.body.description)){ errors.description="description is required."; }
// 	else if(!validator.isByteLength(req.body.description,{ min:10,max:1000})){ errors.description="description length is min 10 & max 1000."; }
    
//     if(!req.files || Object.keys(req.files).length===0){ errors.image="image is required."; }
    
   
// 	if(errors.category_id || errors.name || errors.image || errors.description )
// 	{ 
// 		return res.json({status:false,message:"Validation Fails.",errors:errors});
// 	}
// 	else
// 	{
//             let image = req.files.image;
//             let random_name= rand.generate(20)+"."+image.name.split (".")[1];    
//             image.mv('./public/images/subcategory/'+random_name);
            
//             var subcategory={};
//             subcategory.name = req.body.name;
//             subcategory.image = random_name;
//             subcategory.category_id = req.body.category_id;
//             subcategory.description = req.body.description;
            
//             var db = mysql.createConnection(config.db);
//             db.connect(function(err) 
//             {
//                 if(err){return res.json({status:false,message:err,errors:{} }); } 
//                 var sql ="INSERT INTO subcategories(id,category_id,name,image,description) VALUES(NULL,'"+subcategory.category_id+"','"+subcategory.name+"','"+subcategory.image+"','"+subcategory.description+"' );";
//                 db.query(sql, function (err)
//                 { 
//                     if(err){return res.json({status:false,message:err,errors:{} }); } 
//                     else{ return res.json({status:true,message:"Subcategory has been success stored."}); }
                    
//                 });

//             });             

            
             
    

//     }



// });




module.exports = router;

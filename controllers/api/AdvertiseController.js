var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var validator = require('validator');
var config = require('config');
var Advertise = require('../../models/Advertise');







router.get('/getall',async function(req, res) 
{
    let advertises = await Advertise.GetForApi();
    return res.json({status:true , message:"success",advertises:advertises});              

});



// router.get('/getall', function(req, res) 
// {
//     var valid=true;
//     var errors={};
  

// 	if (valid == false) { return res.json({ status: false, message: "Validation Fails.", errors: errors }); }
//     else 
//     {

//         var db = mysql.createConnection(config.db);
            
//         db.connect(function(err) 
//         {

//             if (err) throw err;
//             var url = req.get('host')+"/images/advertise/";
//             var sql ="SELECT id , CONCAT('"+url+"',image) AS image_url FROM `advertises`";
//             db.query(sql, function (err,data) 
//             {
//                 if (err){ return res.json({status:false,message:err})}
//                 else{
//                     return res.json({status:true , message:"success" , data:data});
//                 }
//             });

//         }); 


//     }    
// });



module.exports = router;

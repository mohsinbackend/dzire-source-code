var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var rand = require("random-key");
var validator = require('validator');
var config = require('config');
const fs = require('fs');
var Jimp = require('jimp');

var Image = require('../../models/Image');
var db = require('../..//config/Database');
var Advertise = require('../../models/Advertise');




router.get('/manage',async function(req,res)
{ 
    let advertise = await Advertise.GetAll();
    return res.render('admin/advertise/manage',{advertise:advertise});
});




router.post('/manage-submit',async function(req,res)
{
    
    let post = {};
    let errors = {};   


    if(typeof req.body.btn_dashboard1 !== 'undefined')
    {
        post.btn_dashboard1=req.body.btn_dashboard1;
        if(!req.files ||  !req.files.dashboard1 || typeof(req.files.dashboard1)!='object' ){errors.dashboard1="Dashboard1 Image is required.";req.flash('dashboard1',`${errors.dashboard1}`); }
        else if( Math.round(req.files.dashboard1.size / 1024) > 5120 ){errors.dashboard1="Image size should be less than 5 Mb.";req.flash('dashboard1',`${errors.dashboard1}`);}else{post.dashboard1=req.files.dashboard1;} 
    }

    if(typeof req.body.btn_dashboard2 !== 'undefined')
    {
        post.btn_dashboard2=req.body.btn_dashboard2;
        if(!req.files ||  !req.files.dashboard2 || typeof(req.files.dashboard2)!='object' ){errors.dashboard2="Dashboard2 Image is required.";req.flash('dashboard2',`${errors.dashboard2}`); }
        else if( Math.round(req.files.dashboard2.size / 1024) > 5120 ){errors.dashboard2="Image size should be less than 5 Mb.";req.flash('dashboard2',`${errors.dashboard2}`);}else{post.dashboard2=req.files.dashboard2;} 
    }

    if(typeof req.body.btn_skipad1 !== 'undefined')
    {
        post.btn_skipad1=req.body.btn_skipad1;
        if(!req.files ||  !req.files.skipad1 || typeof(req.files.skipad1)!='object' ){errors.skipad1="skipad1 Image is required.";req.flash('skipad1',`${errors.skipad1}`); }
        else if( Math.round(req.files.skipad1.size / 1024) > 5120 ){errors.skipad1="Image size should be less than 5 Mb.";req.flash('skipad1',`${errors.skipad1}`);}else{post.skipad1=req.files.skipad1;} 
    }

    
    if(typeof req.body.btn_walkthrough1 !== 'undefined')
    {
        post.btn_walkthrough1=req.body.btn_walkthrough1;
        if(!req.files ||  !req.files.walkthrough1 || typeof(req.files.walkthrough1)!='object' ){errors.walkthrough1="walkthrough1 Image is required.";req.flash('walkthrough1',`${errors.walkthrough1}`); }
        else if( Math.round(req.files.walkthrough1.size / 1024) > 5120 ){errors.walkthrough1="Image size should be less than 5 Mb.";req.flash('walkthrough1',`${errors.walkthrough1}`);}else{post.walkthrough1=req.files.walkthrough1;} 
    }


    
    if(typeof req.body.btn_walkthrough2 !== 'undefined')
    {
        post.btn_walkthrough2=req.body.btn_walkthrough2;
        if(!req.files ||  !req.files.walkthrough2 || typeof(req.files.walkthrough2)!='object' ){errors.walkthrough2="walkthrough2 Image is required.";req.flash('walkthrough2',`${errors.walkthrough2}`); }
        else if( Math.round(req.files.walkthrough2.size / 1024) > 5120 ){errors.walkthrough2="Image size should be less than 5 Mb.";req.flash('walkthrough2',`${errors.walkthrough2}`);}else{post.walkthrough2=req.files.walkthrough2;} 
    }


    if(typeof req.body.btn_walkthrough3 !== 'undefined')
    {
        post.btn_walkthrough3=req.body.btn_walkthrough3;
        if(!req.files ||  !req.files.walkthrough3 || typeof(req.files.walkthrough3)!='object' ){errors.walkthrough3="walkthrough3 Image is required.";req.flash('walkthrough3',`${errors.walkthrough3}`); }
        else if( Math.round(req.files.walkthrough3.size / 1024) > 5120 ){errors.walkthrough3="Image size should be less than 5 Mb.";req.flash('walkthrough3',`${errors.walkthrough3}`);}else{post.walkthrough3=req.files.walkthrough3;} 
    }


    
    if (Object.keys(errors).length > 0){ return res.redirect("manage"); }
	else
	{
        let message='Nothing Update & change';
        let advertise = await db.first(`SELECT * FROM advertise `);
        
        if(post.dashboard1)
        {
            var uploaded = await Image.Upload('advertise',post.dashboard1);
            if(uploaded!=false)
            {
                let updatated = await db.execute(`UPDATE advertise SET dashboard1='${uploaded}' WHERE id='1'`);
                if(updatated.affectedRows > 0){let deleted = await Image.delete('advertise',advertise.dashboard1); }
                message='Dashboard 1 advertise image has been successfully changed.';
            }       
        }

       
        if(post.dashboard2)
        {
            var uploaded = await Image.Upload('advertise',post.dashboard2);
            if(uploaded!=false)
            {
                let updatated = await db.execute(`UPDATE advertise SET dashboard2='${uploaded}' WHERE id='1'`);
                if(updatated.affectedRows > 0){let deleted = await Image.delete('advertise',advertise.dashboard2); }
                message='Dashboard 2 advertise image has been successfully changed.';
            }       
        }


        if(post.skipad1)
        {
            var uploaded = await Image.Upload('advertise',post.skipad1);
            if(uploaded!=false)
            {
                let updatated = await db.execute(`UPDATE advertise SET skipad1='${uploaded}' WHERE id='1'`);
                if(updatated.affectedRows > 0){let deleted = await Image.delete('advertise',advertise.skipad1); }
                message='Skipad 1 advertise image has been successfully changed.';
            }       
        }


        
        if(post.walkthrough1)
        {
            var uploaded = await Image.Upload('advertise',post.walkthrough1);
            if(uploaded!=false)
            {
                let updatated = await db.execute(`UPDATE advertise SET walkthrough1='${uploaded}' WHERE id='1'`);
                if(updatated.affectedRows > 0){let deleted = await Image.delete('advertise',advertise.walkthrough1); }
                message='Walk through 1 advertise image has been successfully changed.';
            }       
        }

        
        if(post.walkthrough2)
        {
            var uploaded = await Image.Upload('advertise',post.walkthrough2);
            if(uploaded!=false)
            {
                let updatated = await db.execute(`UPDATE advertise SET walkthrough2='${uploaded}' WHERE id='1'`);
                if(updatated.affectedRows > 0){let deleted = await Image.delete('advertise',advertise.walkthrough2); }
                message='Walk through 2 advertise image has been successfully changed.';
            }       
        }


        if(post.walkthrough3)
        {
            var uploaded = await Image.Upload('advertise',post.walkthrough3);
            if(uploaded!=false)
            {
                let updatated = await db.execute(`UPDATE advertise SET walkthrough3='${uploaded}' WHERE id='1'`);
                if(updatated.affectedRows > 0){let deleted = await Image.delete('advertise',advertise.walkthrough3); }
                message='Walk through 3 advertise image has been successfully changed.';
            }       
        }



        req.flash('success',`${message}`);  return res.redirect(`manage`);

    }

    

});




// router.get('/list', function (req, res) 
// {


//     const url = `${req.protocol}://${req.headers.host}/images/advertise/l/`;
//     const no_image = `${req.protocol}://${req.headers.host}/images/no-images-placeholder.png`;
       
//     var db = mysql.createConnection(config.db);

//     db.connect(function (error) 
//     {
//         if (error) { return res.json(error); }
//         var sql = "SELECT id ,en_name AS name  ,IF(image=''||image IS NULL,'" + no_image + "',CONCAT('" + url + "',image) ) AS image_url ,status  FROM `advertises`";


//         db.query(sql, function (error, data) {

//             if (error) { return res.json(error); }
//             return res.render('admin/advertise/list', { advertises: data });

//         });


//     });



// });




// router.get('/create', function (req, res) {
//     return res.render('admin/advertise/create');

// });


// router.get('/view/:id?', function (req, res) {

//     var db = mysql.createConnection(config.db);
//     db.connect(function (error) {
//         var url = "http://" + req.get('host') + "/images/advertise/";
//         var no_image = "http://" + req.get('host') + "/images/no-images-placeholder.png";
//         if (error) { return res.json(error); }
//         var query = "select id," + config.locale + "_name AS name,IF(image=''||image IS NULL,'" + no_image + "',CONCAT('" + url + "',image) ) AS image_url,"+config.locale+"_description AS description from `advertises` where id = '" + req.params.id + "'";

//         db.query(query, function (error, advertise) {
//             var status = true;
//             var flas_msg = "";
//             if (error) { status = false; flas_msg = "Query error."; }
//             if (!advertise[0]) { status = false; flas_msg = "user not exist."; }
//             if (status == false) {
//                 req.flash('error', flas_msg);
//                 return res.redirect("user");
//             }
//             else {
//                 return res.render('admin/advertise/view', { 'url': config.url, advertise: advertise[0] });
//             }

//         });


//     });

// });



// router.post('/store', async function (req, res) 
// {

//     var errors = {};
//     var advertise = {};
    
//     if (!req.body.ar_name || validator.isEmpty(req.body.ar_name)) { errors.ar_name = "Arabic Name field is required."; }
//     else if (!validator.isByteLength(req.body.ar_name, { min: 3, max: 30 })) { errors.ar_name = "Arabic Name length is min 3 or max 30."; }

//     if (!req.body.en_name || validator.isEmpty(req.body.en_name)) { errors.en_name = "English Name field is required."; }
//     else if (!validator.isByteLength(req.body.en_name, { min: 3, max: 30 })) { errors.en_name = "English Name length is min 3 or max 30."; }

    
//     if (!req.body.ar_description || validator.isEmpty(req.body.ar_description)) { errors.ar_description = "Arabic Description field is required."; }
//     else if (!validator.isByteLength(req.body.ar_description, { min: 3, max: 1000 })) { errors.ar_description = "Arabic Description field length is min 10 & max 1000."; }

//     if (!req.body.en_description || validator.isEmpty(req.body.en_description)) { errors.en_description = "English Description field is required."; }
//     else if (!validator.isByteLength(req.body.en_description, { min: 3, max: 1000 })) { errors.en_description = "English Description field length is min 10 & max 1000."; }

    
//     if (!req.body.status || validator.isEmpty(req.body.status)) { errors.status = "Status field is required."; }


//     if( (req.files)  && Object.keys(req.files).length > 0 && req.files.image!=undefined &&  typeof(req.files.image)=='object' )
// 	{                      
// 		if( Math.round(req.files.image.size / 1024) > 5120 ){errors.image="Image size should be less than 5 Mb.";}
// 		else if(!config.image_upload_types.includes(req.files.image.mimetype.split("/")[1])){ errors.image=`Image mimetype shuuld be ${config.image_upload_types.toString()}.`;  }
// 		else{advertise.imgsrc=req.files.image;}
// 	}



//     if (!errors.image) { } else {  req.flash('image_err', errors.image); };
//     if (!errors.ar_name) { advertise.ar_name = req.body.ar_name.trim(); req.flash('ar_name', advertise.ar_name); } else {  req.flash('ar_name_err', errors.ar_name); }
//     if (!errors.en_name) { advertise.en_name = req.body.en_name.trim(); req.flash('en_name', advertise.en_name); } else {  req.flash('en_name_err', errors.en_name); }
//     if (!errors.status) { advertise.status = req.body.status.trim(); req.flash('status', advertise.status); } else { req.flash('status_err', errors.status); };
    
//     if (!errors.ar_description) { advertise.ar_description = req.body.ar_description.trim(); req.flash('ar_description', advertise.ar_description); }else{ req.flash('ar_description_err', errors.ar_description); };
//     if (!errors.en_description) { advertise.en_description = req.body.en_description.trim(); req.flash('en_description', advertise.en_description); }else{ req.flash('en_description_err', errors.en_description); };


//     if (Object.keys(errors).length > 0) 
//     {
//         req.flash('error', 'Could not store Advertise validation fails.');
//         return res.redirect("create");
//     }
//     else 
//     {
        

        
//         if(advertise.imgsrc)
//         {	
//             var query="INSERT INTO 'advertises' ";
//             query+=`'status'='${advertise.status}' `;
//             query+=`,'ar_name'='${advertise.ar_name}' `;
//             query+=`,'en_name'='${advertise.en_name}' `;
//             query+=`,'ar_description'='${advertise.ar_description}' `;
//             query+=`,'en_description'='${advertise.en_description}' `;
//             let inserted = await db.execute(query);    				
//             return res.json(inserted);    

//         }






//     }

// });



// router.delete('/delete/:id', function (req, res) {
//     var id = req.params.id;
//     var db = mysql.createConnection(config.db);
//     var sql = "select id,image from advertises where id = '" + id + "'";
//     db.connect(function (error) {
//         if (error) { return res.json(error); }
//         else {
//             db.query(sql, function (error, data) {
//                 if (error) { return res.json(error); }
//                 else {
//                     try {
//                         // return res.json(data)
//                         if (fs.existsSync("./public/images/advertise/" + data[0].image)) {
//                             // file exists
//                             fs.unlink('./public/images/advertise/' + data[0].image, (err) => {
//                                 if (err) throw err;
//                                 else {
//                                     var q = "delete from advertises where id = '" + data[0].id + "'";
//                                     db.query(q, function (err) {
//                                         if (err) { return res.json({ status: false, message: err, errors: {} }); }
//                                         else {
//                                             res.json("advertise has been deleted successfully")
//                                         };

//                                     });
//                                 }
//                             });
//                         } else {
//                             return res.json("File Does Not Exist")
//                         }
//                     } catch (err) {
//                         res.send(err.message)
//                     }
//                 }
//             });
//         }
//     });

// });


module.exports = router;

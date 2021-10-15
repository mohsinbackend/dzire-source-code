var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var validator = require('validator');
var config = require('config');


var Content = require('../../models/Content');


router.get('/list', async function (req, res) 
{


    let contents = await Content.GetForListing();
    return res.render('admin/content/list',{contents:contents});

    // var db = mysql.createConnection(config.db);

    // db.connect(function (error) {

    //     if (error) { return res.json(error); }
    //     var sql = "SELECT `id`,`" + config.locale + "_name` AS name ,CONCAT(LEFT(`" + config.locale + "_text`,70),'....') AS text,`status` FROM `contents`";

    //     db.query(sql, function (error, data) {

    //         if (error) { return res.json(error); }
    //         return res.render('admin/content/list', { contents: data, url: config.url });


    //     });


    // });



});


router.get('/view/:id?', async function (req, res) 
{
    let content = await Content.GetForView(req.params.id);
    return res.render('admin/content/view',{content:content});
});



router.get('/edit/:id?',async function (req, res) 
{
    
    let content = await Content.GetForEdit(req.params.id);
    return res.render('admin/content/edit',{content:content});

});



router.post('/update', async function (req, res) 
{

    let post = {};
    let errors = {};   

    if (!req.body.text || validator.isEmpty(req.body.text)){errors.text="Text is required.";req.flash('text_err',`${errors.text}`); }
    else{ post.text=req.body.text.trim(); req.flash('text',`${post.text}`); }
    

 
    if(!req.body.id || validator.isEmpty(req.body.id)){ errors.id="ID is required.";req.flash('id_err',`${errors.id}`); }
    else if(!validator.isInt(req.body.id) ){ errors.id="ID must be integer.";req.flash('id_err',`${errors.id}`); }
    else{post.id=req.body.id.trim(); req.flash('id',`${post.id}`); }  


    if (Object.keys(errors).length > 0){ return res.redirect(req.header('Referer')); }
	else
	{
        const result = await Content.UpdateByAdmin(post);
        req.flash('success','Content has been successfully updated.');     
        return res.redirect(req.header('Referer'));
        
    }




});






// router.delete('/delete/:id', function (req, res) {
//     var id = req.params.id;
//     var db = mysql.createConnection(config.db);
//     db.connect(function (error) {
//         if (error) { return res.json(error); }
//         else {
//             var q = "delete from contents where id = '" + id + "'";
//             db.query(q, function (err) {
//                 if (err) { return res.json({ status: false, message: err, errors: {} }); }
//                 else {
//                     res.json("content has been deleted successfully")
//                 };

//             });
//         }

//     });

// });


module.exports = router;

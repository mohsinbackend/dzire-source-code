var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var rand = require("random-key");
var validator = require('validator');
var config = require('config');


var Category = require('../../models/Category');
var Subcategory = require('../../models/Subcategory');



router.get('/list', async function(req, res) 
{
    let subcategories = await Subcategory.GetForListing();
    return res.render('admin/subcategory/list',{subcategories:subcategories});
});




router.get('/view/:id?', async function (req, res) 
{

    let get = {};
    let errors = {};   

    if(!req.params.id || validator.isEmpty(req.params.id)){ errors.id="ID is required.";req.flash('id_err',`${errors.id}`); }
    else if(!validator.isInt(req.params.id) ){ errors.id="ID must be integer.";req.flash('id_err',`${errors.id}`); }
    else if( await Subcategory.Exists(req.params.id)=='0'){errors.id="ID is not exists.";req.flash('id_err',`${errors.id}`);}
    else{get.id=req.params.id.trim();}  

    if (Object.keys(errors).length > 0){req.flash('error',`${errors.id}`); return res.redirect(`subcategory/list`); }
	else
	{
        const subcategory = await Subcategory.GetForView(get.id);
        return res.render('admin/subcategory/view',{subcategory:subcategory});
    }


    
});






router.get('/create',async function (req,res) 
{

    let categories = await Category.GetLookup(config.locale);
    return res.render('admin/subcategory/create',{ categories:categories});

});




router.post('/store', async function(req, res) 
{
            
    let post = {};
    let errors = {};   

    if (!req.body.en || validator.isEmpty(req.body.en)){errors.en="Category name is required.";req.flash('en_err',`${errors.en}`); }
    else{ post.en=req.body.en.trim(); req.flash('en',`${post.en}`); }
    
    if (!req.body.status || validator.isEmpty(req.body.status)){errors.status="Status is required.";req.flash('status_err',`${errors.status}`); }
    else{ post.status=req.body.status.trim();req.flash('status',`${post.status}`); }
    
    if(!req.body.cate_id || validator.isEmpty(req.body.cate_id)){ errors.cate_id="Category is required.";req.flash('cate_id_err',`${errors.cate_id}`); }
    else if(!validator.isInt(req.body.cate_id) ){ errors.cate_id="Category must be integer.";req.flash('cate_id_err',`${errors.cate_id}`); }
    else if( await Category.Exists(req.body.cate_id)=='0'){errors.cate_id="Category is not exists.";req.flash('cate_id_err',`${errors.cate_id}`);}
    else{post.cate_id=req.body.cate_id.trim(); req.flash('cate_id',`${post.cate_id}`) }  

    
    if (Object.keys(errors).length > 0){ return res.redirect("create"); }
	else
	{
        const result = await Subcategory.StoreByAdmin(post);
        if(!result.insertId){ req.flash('error','Subcategory could not store unspected error.');}
        else 
        {
            req.flash('success','Subcategory has been successfully stored.');     
        }
        return res.redirect("create");

    }


});








router.get('/edit/:id?', async function (req, res) 
{

    let get = {};
    let errors = {};   

    if(!req.params.id || validator.isEmpty(req.params.id)){ errors.id="ID is required.";req.flash('id_err',`${errors.id}`); }
    else if(!validator.isInt(req.params.id) ){ errors.id="ID must be integer.";req.flash('id_err',`${errors.id}`); }
    else if( await Subcategory.Exists(req.params.id)=='0'){errors.id="ID is not exists.";req.flash('id_err',`${errors.id}`);}
    else{get.id=req.params.id.trim();}  

    if (Object.keys(errors).length > 0){req.flash('error',`${errors.id}`); return res.redirect(`subcategory/list`); }
	else
	{
        const subcategory = await Subcategory.GetForEdit(get.id);
        let categories = await Category.GetLookup(config.locale);
        return res.render('admin/subcategory/edit',{subcategory:subcategory,categories:categories});
    
    }


    
});




router.post('/update', async function(req, res) 
{


    let post = {};
    let errors = {};   

    if (!req.body.en || validator.isEmpty(req.body.en)){errors.en="Category name is required.";req.flash('en_err',`${errors.en}`); }
    else{ post.en=req.body.en.trim(); req.flash('en',`${post.en}`); }
    
    if (!req.body.status || validator.isEmpty(req.body.status)){errors.status="Status is required.";req.flash('status_err',`${errors.status}`); }
    else{ post.status=req.body.status.trim();req.flash('status',`${post.status}`); }
    

    if(!req.body.cate_id || validator.isEmpty(req.body.cate_id)){ errors.cate_id="Category is required.";req.flash('cate_id_err',`${errors.cate_id}`); }
    else if(!validator.isInt(req.body.cate_id) ){ errors.cate_id="Category must be integer.";req.flash('cate_id_err',`${errors.cate_id}`); }
    //else if( await Category.Exists(req.body.cate_id)=='0'){errors.cate_id="Category is not exists.";req.flash('cate_id_err',`${errors.cate_id}`);}
    else{post.cate_id=req.body.cate_id.trim(); req.flash('cate_id',`${post.cate_id}`); }  

 
    if(!req.body.id || validator.isEmpty(req.body.id)){ errors.id="ID is required.";req.flash('id_err',`${errors.id}`); }
    else if(!validator.isInt(req.body.id) ){ errors.id="ID must be integer.";req.flash('id_err',`${errors.id}`); }
    //else if( await Subcategory.Exists(req.body.id)=='0'){errors.id="ID is not exists.";req.flash('id_err',`${errors.id}`);}
    else{post.id=req.body.id.trim(); req.flash('id',`${post.id}`); }  


    if (Object.keys(errors).length > 0){ return res.redirect(req.header('Referer')); }
	else
	{

        const result = await Subcategory.UpdateByAdmin(post);
        req.flash('success','Subcategory has been successfully updated.');     
        return res.redirect(req.header('Referer'));
        
    }


});















router.delete('/delete/:id', function (req, res) 
{
    
    var id = req.params.id;
    var db = mysql.createConnection(config.db);
    var sql = "select id,image from subcategories where id = '" + id + "'";
    db.connect(function (error) {
        if (error) { return res.json(error); }
        else {
            db.query(sql, function (error, data) {
                if (error) { return res.json(error); }
                else {
                    try {
                        // return res.json(data)
                        if (fs.existsSync("./public/images/subcategory/" + data[0].image)) {
                            // file exists
                            fs.unlink('./public/images/subcategory/' + data[0].image, (err) => {
                                if (err) throw err;
                                else {
                                    var q = "delete from subcategories where id = '" + data[0].id + "'";
                                    db.query(q, function (err) {
                                        if (err) { return res.json({ status: false, message: err, errors: {} }); }
                                        else {
                                            res.json("catogory has been deleted successfully")
                                        };

                                    });
                                }
                            });
                        } else {
                            return res.json("File Does Not Exist")
                        }
                    } catch (err) {
                        res.send(err.message)
                    }
                }
            });
        }
    });


});

module.exports = router;

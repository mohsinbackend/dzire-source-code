var express = require('express');
var router = express.Router();
var validator = require('validator');
 

var Brand = require('../../models/Brand');
const Listing = require('../../models/Listing');


router.get('/list', async (req,res) => 
{
    try
    {
        const brands = await Brand.List();
        return res.render('admin/brand/list',{brands});

    }catch(error){ return res.json(error.message);}

});



router.get('/create',async function (req,res) 
{
    try
    {
        return res.render('admin/brand/create');
    }catch(error){ return res.json(error.message);}
});



router.post('/store', async function (req, res) 
{

    try
    {
        
        let post = {};
        let errors = {};   

        // if(!req.body.id || validator.isEmpty(req.body.id)){ errors.id="ID is required.";req.flash('id_err',`${errors.id}`); }
        // else if(!validator.isInt(req.body.id) ){ errors.id="ID must be integer.";req.flash('id_err',`${errors.id}`); }
        // else if( await Brand.Exists(req.body.id)=='0'){errors.id="ID is not exists.";req.flash('id_err',`${errors.id}`);}
        // else{post.id=req.body.id.trim(); req.flash('id',`${post.id}`) }  

        if (!req.body.ar_name || !req.body.ar_name.trim() || validator.isEmpty(req.body.ar_name)){errors.ar_name="Arabic name is required.";req.flash('ar_name_err',`${errors.ar_name}`); }
        else{ post.ar_name=req.body.ar_name.trim(); req.flash('ar_name',`${post.ar_name}`); }

        if (!req.body.en_name || !req.body.en_name.trim()  || validator.isEmpty(req.body.en_name)){errors.en_name="English name is required.";req.flash('en_name_err',`${errors.en_name}`); }
        else{ post.en_name=req.body.en_name.trim(); req.flash('en_name',`${post.en_name}`); }

        if (!req.body.status || validator.isEmpty(req.body.status)) { errors.status = "Status is required."; req.flash('status_err',`${errors.status}`); }
        else if(!['0','1'].includes(req.body.status)){ errors.status=`Status  must be 0 or 1.`; req.flash('status_err',`${errors.status}`); }
        else{ post.status=req.body.status.trim(); req.flash('status',`${post.status}`);  }
    

        if (Object.keys(errors).length > 0){ return res.redirect(req.header('Referer')); }
        else
        {
            const stored = await Brand.Store(post);
            if(stored?.affectedRows===1){
                req.flash('success','Brand has been successfully stored.');
                return res.redirect('/admin/brand/list');

            }else{
                req.flash('error',`${stored}`);
                return res.redirect(req.header('Referer'));
            }
            
        }

    }catch(error){ return res.json(error.message);}
    
});







router.get('/edit/:id?',async function (req, res) 
{
    try
    {
        const {id}= req.params;
        const brand = await Brand.Edit(id);
        return res.render('admin/brand/edit',{brand});
    }catch(error){ return res.json(error.message);}
});






router.post('/update', async function (req, res) 
{

    try
    {
        
        let post = {};
        let errors = {};   

        if(!req.body.id || validator.isEmpty(req.body.id)){ errors.id="ID is required.";req.flash('id_err',`${errors.id}`); }
        else if(!validator.isInt(req.body.id) ){ errors.id="ID must be integer.";req.flash('id_err',`${errors.id}`); }
        else if( await Brand.Exists(req.body.id)=='0'){errors.id="ID is not exists.";req.flash('id_err',`${errors.id}`);}
        else{post.id=req.body.id.trim(); req.flash('id',`${post.id}`) }  

        if (!req.body.ar_name || validator.isEmpty(req.body.ar_name)){errors.ar_name="Arabic name is required.";req.flash('ar_name_err',`${errors.ar_name}`); }
        else{ post.ar_name=req.body.ar_name.trim(); req.flash('ar_name',`${post.ar_name}`); }

        if (!req.body.en_name || validator.isEmpty(req.body.en_name)){errors.en_name="English name is required.";req.flash('en_name_err',`${errors.en_name}`); }
        else{ post.en_name=req.body.en_name.trim(); req.flash('en_name',`${post.en_name}`); }

        if (!req.body.status || validator.isEmpty(req.body.status)) { errors.status = "Status is required."; req.flash('status_err',`${errors.status}`); }
        else if(!['0','1'].includes(req.body.status)){ errors.status=`Status  must be 0 or 1.`; req.flash('status_err',`${errors.status}`); }
        else{ post.status=req.body.status.trim(); req.flash('status',`${post.status}`);  }
    

        if (Object.keys(errors).length > 0){ return res.redirect(req.header('Referer')); }
        else
        {
            const updated = await Brand.Update(post);
            req.flash('success','Brand has been successfully updated.');     
            return res.redirect(req.header('Referer'));
            
        }

    }catch(error){ return res.json(error.message);}
    
});





router.get('/delete/:id?',async function (req, res) 
{
    try
    {
        const {id}= req.params;
        const brandEdit = await Listing.CheckItemWithBrandId(id);
        if(brandEdit[0].count>0){
           req.flash('error',`This Brand is used in ${brandEdit[0].count} Items.`);     
        }else{
            const brand = await Brand.Delete(id);
            req.flash('success','Brand has been successfully deleted.');     
        }
        return res.redirect(req.header('Referer'));

    }catch(error){ return res.json(error.message);}

});




module.exports = router;

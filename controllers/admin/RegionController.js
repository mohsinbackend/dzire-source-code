var express = require('express');
var router = express.Router();

var config = require('config');
var validator = require('validator');

var Region = require('../../models/Region');
var Country = require('../../models/Country');



router.get('/list', async function (req, res) 
{
    
    let regions = await Region.GetForlist();
    return res.render('admin/region/list',{regions:regions});  
});



router.get('/create', async function (req, res) 
{   

    let countries = await Country.GetLookup(config.locale);
    return res.render('admin/region/create',{countries:countries});  

});



router.post('/store', async function (req, res) 
{



    
    let post = {};
    let errors = {};  

    if (!req.body.ar || validator.isEmpty(req.body.ar)){errors.ar="Arabic name is required.";req.flash('ar_err',`${errors.ar}`); }
    else{ post.ar=req.body.ar.trim(); req.flash('ar',`${post.ar}`); }

    if (!req.body.en || validator.isEmpty(req.body.en)){errors.en="English name is required.";req.flash('en_err',`${errors.en}`); }
    else{ post.en=req.body.en.trim(); req.flash('en',`${post.en}`); }

    if (!req.body.status || validator.isEmpty(req.body.status)) { errors.status = "Status is required."; req.flash('status_err',`${errors.status}`); }
    else if(!['0','1'].includes(req.body.status)){ errors.status=`Status  must be 0 or 1.`; req.flash('status_err',`${errors.status}`); }
    else{ post.status=req.body.status.trim(); req.flash('status',`${post.status}`);  }
    
    if(!req.body.country || validator.isEmpty(req.body.country)){ errors.country="Country is required.";req.flash('country_err',`${errors.country}`); }
    else if(!validator.isInt(req.body.country) ){ errors.country="Country id must be integer.";req.flash('country_err',`${errors.country}`); }
    else if( await Country.Exists(req.body.country)=='0'){errors.country="Country is not exists.";req.flash('country_err',`${errors.country}`);}
    else{ post.country=req.body.country.trim(); }  

    if (Object.keys(errors).length > 0){ return res.redirect(`create`);  }
	else
	{
        let storedResult = await Region.StoreByAdmin(post);
        if(!storedResult.insertId){req.flash('error',`Error: ${storedResult}`); }
        else
        {
            req.flash('success','Region has been successfully created.');     
            return res.redirect(`create`);
        }
        
    }



});


router.get('/edit/:id', async function (req, res) 
{   
    
    const {id} = req.params;
    const region = await Region.GetForEdit(id);
    const countries = await Country.GetLookup(config.locale);
    return res.render('admin/region/edit',{region,countries});


});




router.post('/update', async function (req, res) 
{

    
    let post = {};
    let errors = {};  

    if (!req.body.id || validator.isEmpty(req.body.id)){errors.id="ID is required.";req.flash('id_err',`${errors.id}`); }
    else{ post.id=req.body.id.trim(); req.flash('id',`${post.id}`); }

    if (!req.body.ar || validator.isEmpty(req.body.ar)){errors.ar="Arabic name is required.";req.flash('ar_err',`${errors.ar}`); }
    else{ post.ar=req.body.ar.trim(); req.flash('ar',`${post.ar}`); }

    if (!req.body.en || validator.isEmpty(req.body.en)){errors.en="English name is required.";req.flash('en_err',`${errors.en}`); }
    else{ post.en=req.body.en.trim(); req.flash('en',`${post.en}`); }

    if (!req.body.status || validator.isEmpty(req.body.status)) { errors.status = "Status is required."; req.flash('status_err',`${errors.status}`); }
    else if(!['0','1'].includes(req.body.status)){ errors.status=`Status  must be 0 or 1.`; req.flash('status_err',`${errors.status}`); }
    else{ post.status=req.body.status.trim(); req.flash('status',`${post.status}`);  }
    
    if(!req.body.country || validator.isEmpty(req.body.country)){ errors.country="Country is required.";req.flash('country_err',`${errors.country}`); }
    else if(!validator.isInt(req.body.country) ){ errors.country="Country id must be integer.";req.flash('country_err',`${errors.country}`); }
    else if( await Country.Exists(req.body.country)=='0'){errors.country="Country is not exists.";req.flash('country_err',`${errors.country}`);}
    else{ post.country=req.body.country.trim(); }  

    if (Object.keys(errors).length > 0){ return res.redirect(`edit/${post.id}`);  }
	else
	{
        const updatedResult = await Region.UpdateByAdmin(post);
        req.flash('success','Region has been successfully updated.');     
        return res.redirect(`edit/${post.id}`);
        
    }



});




module.exports = router;

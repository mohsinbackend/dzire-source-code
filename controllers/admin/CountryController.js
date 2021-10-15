var express = require('express');
var router = express.Router();

var config = require('config');
var validator = require('validator');

var Region = require('../../models/Region');
var Country = require('../../models/Country');



router.get('/list', async function (req, res) 
{
    
    let countries = await Country.GetForlist();
    return res.render('admin/country/list',{countries:countries});  

});




router.get('/create', async function (req, res) 
{   
    return res.render('admin/country/create');  
});






router.post('/store', async function (req, res) 
{


    //return res.json('Country Store');

    let post = {};
    let errors = {};  

    if (!req.body.ar || validator.isEmpty(req.body.ar)){errors.ar="Arabic name is required.";req.flash('ar_err',`${errors.ar}`); }
    else{ post.ar=req.body.ar.trim(); req.flash('ar',`${post.ar}`); }
    
    if (!req.body.en || validator.isEmpty(req.body.en)){errors.en="English name is required.";req.flash('en_err',`${errors.en}`); }
    else{ post.en=req.body.en.trim(); req.flash('en',`${post.en}`); }    

    if (!req.body.status || validator.isEmpty(req.body.status)) { errors.status = "Status is required."; req.flash('status_err',`${errors.status}`); }
    else if(!['0','1'].includes(req.body.status)){ errors.status=`Status  must be 0 or 1.`; req.flash('status_err',`${errors.status}`); }
    else{ post.status=req.body.status.trim(); req.flash('status',`${post.status}`);  }
    

    if (Object.keys(errors).length > 0){ return res.redirect(`create`);  }
	else
	{

        let storedResult = await Country.StoreByAdmin(post);
        if(!storedResult.insertId){req.flash('error',`Erro: ${storedResult}`); return res.redirect(`create`); }
        else
        {
            req.flash('success','Country has been successfully Created.');     
            return res.redirect(`create`)    
        }
        

    }



});






module.exports = router;

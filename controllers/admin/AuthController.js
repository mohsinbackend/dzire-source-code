var md5 = require('md5');
var express = require('express');
var router = express.Router();
var validator = require('validator');



var Admin = require('../../models/Admin');


router.get('/login', async function (req, res) 
{


   return res.render('admin/page/login');

});




router.post('/attempt', async function (req, res) 
{


    let post = {};
    let errors = {};   
    if (!req.body.email || validator.isEmpty(req.body.email)){errors.email="Email is required.";req.flash('email_err',errors.email); }
    else{ post.email=req.body.email.trim(); req.flash('email',post.email); }

    if (!req.body.password || validator.isEmpty(req.body.password)){errors.password="Password is required.";req.flash('password_err',errors.password); }
    else{ post.password=md5(req.body.password);     }

    if (Object.keys(errors).length > 0){ return res.redirect("login"); }
	else 
	{
        const attempt = await Admin.attempt(post.email,post.password);
        if(attempt.auth==false){ req.flash('error',`${attempt.msg}`); return res.redirect("login"); }
        else
        {
            let admin = await Admin.account(attempt.id);
            if(req.body.remember && req.body.remember=='1')
            {
                req.session.cookie.expires = false;
                req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
            }
            req.session.admin = admin; 
            return res.redirect("/admin");
        }

    }

});



// router.get('/lock',function(req,res)
// {
//     return res.render('admin/page/lock');
// });



// router.post('/unlock',function(req,res)
// {
//     return res.send("This function is underdevelopment.....");

// });


router.get('/logout', function(req, res) 
{
    req.session.admin=null;
    res.clearCookie('admin_sid');
    return res.redirect("/admin/auth/login");
});

    

module.exports = router;

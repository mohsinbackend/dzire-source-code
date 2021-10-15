var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var rand = require("random-key");
var validator = require('validator');
var config = require('config');
const fs = require('fs');
var Jimp = require('jimp');



var User = require('../../models/User');
var Image = require('../../models/Image');
var db = require('../..//config/Database');



router.get('/list',async function (req, res) 
{
    let users = await User.GetForListing();
    //return res.json(users);
    return res.render('admin/user/list',{users:users});
});


router.get('/view/:id',async function (req, res) 
{
    let user = await User.GetForView(req.params.id);
    return res.render('admin/user/view',{ user:user});
});


router.get('/create', function (req, res) {

    return res.render('admin/user/create', { url: config.url });

});

function resizeMethod(path, savePath, size) {
    Jimp.read(path, (err, lenna) => {
        if (err) throw err;
        else {
            lenna
                .resize(size, size) // resize
                .write(savePath); // save
            return true;
        }
    });
}


router.post('/update', async function (req, res) 
{
    const result = await User.UpdateByAdmin(req.body);
    req.flash('success','User has been successfully updated.');     
    return res.redirect(`view/${req.body.id}`);

});


router.post('/store', function (req, res) 
{

    var user = {};
    var errors = {};
    var valid = true;
    if (!req.files || Object.keys(req.files).length === 0) { errors.image = "Image field is required."; }

    if (!req.body.fname || validator.isEmpty(req.body.fname)) { errors.fname = "First name field is required."; }
    else if (!validator.isByteLength(req.body.fname, { min: 3, max: 30 })) { errors.fname = "First name length is min 3 or max 30."; }

    if (!req.body.lname || validator.isEmpty(req.body.lname)) { errors.lname = "Last name field is required."; }
    else if (!validator.isByteLength(req.body.lname, { min: 3, max: 30 })) { errors.lname = "Last name length is min 3 or max 30."; }

    if (!req.body.uname || validator.isEmpty(req.body.uname)) { errors.uname = "Username field is required."; }
    else if (!validator.isByteLength(req.body.uname, { min: 3, max: 30 })) { errors.uname = "Username length is min 3 or max 30."; }

    if (!req.body.phone || validator.isEmpty(req.body.phone)) { errors.phone = "Phone field is required."; }
    else if (!validator.isByteLength(req.body.phone, { min: 7, max: 15 })) { errors.phone = "Phone length is min 7 or max 15."; }
    else if (!validator.isInt(req.body.phone)) { errors.phone = "Phone number is not valid."; }


    if (!req.body.email || validator.isEmpty(req.body.email)) { errors.email = "Email field is required."; }
    else if (!validator.isEmail(req.body.email)) { errors.email = "Email address is valid."; }

    if (!req.body.gender || validator.isEmpty(req.body.gender)) { errors.gender = "Gender field is required."; }
    if (!req.body.status || validator.isEmpty(req.body.status)) { errors.status = "Status field is required."; }



    if (!errors.image) { } else { valid = false; req.flash('image_err', errors.image); };
    if (!errors.fname) { user.fname = req.body.fname.trim(); req.flash('fname', user.fname); } else { valid = false; req.flash('fname_err', errors.fname); }
    if (!errors.lname) { user.lname = req.body.lname.trim(); req.flash('lname', user.lname); } else { valid = false; req.flash('lname_err', errors.lname); }
    if (!errors.uname) { user.uname = req.body.uname.trim(); req.flash('uname', user.uname); } else { valid = false; req.flash('uname_err', errors.uname); }
    if (!errors.email) { user.email = req.body.email.trim(); req.flash('email', user.email); } else { valid = false; req.flash('email_err', errors.email); }
    if (!errors.phone) { user.phone = req.body.phone.trim(); req.flash('phone', user.phone); } else { valid = false; req.flash('phone_err', errors.phone); }
    if (!errors.gender) { user.gender = req.body.gender.trim(); req.flash('gender', user.gender); } else { valid = false; req.flash('gender_err', errors.gender); }
    if (!errors.status) { user.status = req.body.status.trim(); req.flash('status', user.status); } else { valid = false; req.flash('status_err', errors.status); }


    if (valid == false) {
        req.flash('error', 'Could not store User validation fails.');
        return res.redirect("create");
    }
    else {

        let image = req.files.image;
        user.image = rand.generate(20) + "." + image.name.split(".")[1];
        var db = mysql.createConnection(config.db);
        db.connect(function (err) {

            if (err) { return res.json({ status: false, message: err, errors: {} }); }
            else {
                var sql = "INSERT INTO users(id,fname,lname,username,email,gender,phone,image,status) VALUES(NULL ,'" + user.fname + "' ,'" + user.lname + "' ,'" + user.uname + "' ,'" + user.email + "' ,'" + user.gender + "' ,'" + user.phone + "' ,'" + user.image + "'  ,'" + user.status + "' );";
                //return res.send(sql);    

                db.query(sql, async function (err) {
                    if (err) { return res.json({ status: false, message: err, errors: {} }); }
                    else {
                        req.flash('success', "User has been success stored.");
                        image.mv('./public/images/user/l/' + user.image);
                        await resizeMethod('./public/images/user/l/' + user.image, './public/images/user/m/' + user.image, 300)
                        await resizeMethod('./public/images/user/l/' + user.image, './public/images/user/s/' + user.image, 100)
                        return res.json("list")
                    }

                });

            }

        });

    }

});


router.delete('/delete/:id', async function (req, res) 
{

    var dbuser = await db.first(`SELECT id,image FROM users WHERE id='${req.params.id}'`);
    if(dbuser==null || typeof(dbuser)!='object' || dbuser.id==undefined)
    { return res.json({'status':false,message:"User is not exist."});  }
    else
    {
        Image.delete(dbuser.image,'user');
        var deluser = await db.first(` DELETE FROM users WHERE id='${req.params.id}' `);     
        return res.json({'status':true,message:"User has beeen deleted."});
    }

    
});


module.exports = router;

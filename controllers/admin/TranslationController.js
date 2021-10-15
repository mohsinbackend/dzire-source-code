var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var rand = require("random-key");
var validator = require('validator');
var config = require('config');



router.get('/list', function (req, res) {

    var db = mysql.createConnection(config.db);
    var sql = "SELECT translations.id ,translations.name ,CONCAT(LEFT(translations.ar,70),'....') AS ar ,CONCAT(LEFT(translations.en,70),'....') AS en  ,translations.status FROM `translations`";

    db.connect(function (error) {
        if (error) { return res.json(error); }
        db.query(sql, function (error, data) {
            if (error) { return res.json(error); }
            return res.render('admin/translation/list', { translations: data, url: config.url });

        });

    });



});


router.get('/create', function (req, res) {

    return res.render('admin/translation/create', { url: config.url });

});

router.get('/view/:id?', function (req, res) {

    var db = mysql.createConnection(config.db);
    db.connect(function (error) {
        if (error) { return res.json(error); }
        var query = "select id , " + config.locale + " AS name from `translations` where id = '" + req.params.id + "'";
        db.query(query, function (error, translation) {
            var status = true;
            var flas_msg = "";
            if (error) { status = false; flas_msg = "Query error."; }
            if (!translation[0]) { status = false; flas_msg = "user not exist."; }
            if (status == false) {
                req.flash('error', flas_msg);
                return res.redirect("user");
            }
            else {
                return res.render('admin/translation/view', { 'url': config.url, translation: translation[0] });
            }

        });


    });

});

router.post('/store', function (req, res) {


    //return res.json(req.body);

    var errors = {};
    var valid = true;
    var translation = {};

    if (!req.body.name || validator.isEmpty(req.body.name)) { errors.name = "Name field is required."; }
    else if (!validator.isByteLength(req.body.name, { min: 3, max: 100 })) { errors.fname = "Name length is min 3 or max 100."; }

    if (!req.body.ar || validator.isEmpty(req.body.ar)) { errors.ar = "Arabic field is required."; }
    else if (!validator.isByteLength(req.body.ar, { min: 3, max: 100 })) { errors.ar = "Arabic length is min 3 or max 1000."; }

    if (!req.body.en || validator.isEmpty(req.body.en)) { errors.en = "English field is required."; }
    else if (!validator.isByteLength(req.body.en, { min: 3, max: 100 })) { errors.en = "English length is min 3 or max 1000."; }


    if (!req.body.status || validator.isEmpty(req.body.status)) { errors.status = "Status field is required."; }

    if (!errors.ar) { translation.ar = req.body.ar.trim(); req.flash('ar', translation.ar); } else { valid = false; req.flash('ar_err', errors.ar); }
    if (!errors.en) { translation.en = req.body.en.trim(); req.flash('en', translation.en); } else { valid = false; req.flash('en_err', errors.en); }
    if (!errors.name) { translation.name = req.body.name.trim(); req.flash('name', translation.name); } else { valid = false; req.flash('name_err', errors.name); }
    if (!errors.status) { translation.status = req.body.status.trim(); req.flash('status', translation.status); } else { valid = false; req.flash('status_err', errors.status); }


    if (valid == false) {
        req.flash('error', 'Could not store Translation validation fails.');
        return res.redirect("create");
    }
    else {
        //return res.json(translation);
        var db = mysql.createConnection(config.db);
        db.connect(function (err) {


            if (err) { return res.json({ status: false, message: err, errors: {} }); }
            else {
                var sql = "INSERT INTO translations(id,name,en,ar,status) VALUES(NULL ,'" + translation.name + "' ,'" + translation.en + "' ,'" + translation.ar + "' ,'" + translation.status + "' );";

                db.query(sql, function (err) {
                    if (err) { return res.json({ status: false, message: err, errors: {} }); }
                    else {
                        req.flash('success', "Translation has been successfully stored.");
                        return res.redirect("list");
                    }

                });



            }



        });

    }




});



router.delete('/delete/:id', function (req, res) {
    var id = req.params.id;
    var db = mysql.createConnection(config.db);
    db.connect(function (error) {
        if (error) { return res.json(error); }
        else {

            var q = "delete from translations where id = '" + id + "'";
            db.query(q, function (err) {
                if (err) { return res.json({ status: false, message: err, errors: {} }); }
                else {
                    res.json("translation has been deleted successfully")
                };

            });


        }
    });

});


module.exports = router;

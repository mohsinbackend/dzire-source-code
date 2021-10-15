var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var rand = require("random-key");
var validator = require('validator');
var config = require('config');




router.get('/list', function (req, res) {


    var db = mysql.createConnection(config.db);
    db.connect(function (err) {
        if (err) { return res.render('admin/page/error', { url: config.url, err: err.sqlMessage }); }
        else {

            var sql = "SELECT id ,en_name ,ar_name ,status FROM `keywords`";

            db.query(sql, function (err, keywords) {
                if (err) { return res.render('admin/page/error', { url: config.url, err: err.sqlMessage }); }
                else {
                    return res.render('admin/keyword/list', { keywords: keywords, url: config.url });
                }

            });

        }



    });



});

router.get('/view/:id?', function (req, res) {

    var db = mysql.createConnection(config.db);
    db.connect(function (error) {
        if (error) { return res.json(error); }
        var query = "select id,"+config.locale+"_name AS name from `keywords` where id = '" + req.params.id + "'";

        db.query(query, function (error, keywords) {
            var status = true;
            var flas_msg = "";
            if (error) { status = false; flas_msg = "Query error."; }
            if (!keywords[0]) { status = false; flas_msg = "user not exist."; }
            if (status == false) {
                req.flash('error', flas_msg);
                return res.redirect("user");
            }
            else {
                return res.render('admin/keyword/view', { 'url': config.url, keywords: keywords[0] });
            }

        });


    });

});


router.get('/create', function (req, res) {

    return res.render('admin/keyword/create', { url: config.url });

});




router.post('/store', function (req, res) {



    var errors = {};
    var valid = true;
    var keyword = {};

    if (!req.body.ar || validator.isEmpty(req.body.ar)) { errors.ar = "Arabic Name field is required."; }
    else if (!validator.isByteLength(req.body.ar, { min: 3, max: 255 })) { errors.ar = "Arabic Name length is min 3 or max 255."; }

    if (!req.body.en || validator.isEmpty(req.body.en)) { errors.en = "English Name field is required."; }
    else if (!validator.isByteLength(req.body.en, { min: 3, max: 255 })) { errors.en = "English Name length is min 3 or max 255."; }

    if (!req.body.status || validator.isEmpty(req.body.status)) { errors.status = "Status field is required."; }
    if (!req.files || Object.keys(req.files).length === 0) { errors.image = "Image field is required."; }



    if (!errors.ar) { keyword.ar = req.body.ar.trim(); req.flash('ar', keyword.ar); } else { valid = false; req.flash('ar_err', errors.ar); }
    if (!errors.en) { keyword.en = req.body.en.trim(); req.flash('en', keyword.en); } else { valid = false; req.flash('en_err', errors.en); }
    if (!errors.status) { keyword.status = req.body.status.trim(); req.flash('status', keyword.status); } else { valid = false; req.flash('status_err', errors.status); };


    if (valid == false) {
        req.flash('error', 'Could not store keyword validation fails.');
        return res.redirect("create");
    }
    else {

        var db = mysql.createConnection(config.db);
        db.connect(function (err) {
            if (err) { return res.json({ status: false, message: err, errors: {} }); }
            var sql = "INSERT INTO keywords(id ,ar_name ,en_name ,status) VALUES(NULL  ,'" + keyword.ar + "' ,'" + keyword.en + "'  ,'" + keyword.status + "' );";
            db.query(sql, function (err) {
                if (err) { return res.render('admin/page/error', { url: config.url, err: err.sqlMessage }); }
                else {
                    req.flash('success', "Keyword has been success stored.");
                    return res.redirect("list");
                }

            });

        });





    }

});

router.delete('/delete/:id', function (req, res) {
    var id = req.params.id;
    var db = mysql.createConnection(config.db);
    db.connect(function (error) {
        if (error) { return res.json(error); }
        else {

            var q = "delete from keywords where id = '" +id + "'";
            db.query(q, function (err) {
                if (err) { return res.json({ status: false, message: err, errors: {} }); }
                else {
                    res.json("keyword has been deleted successfully")
                };

            });


        }
    });

});


module.exports = router;

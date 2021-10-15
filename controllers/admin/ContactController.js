var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('config');

var Contactus = require('../../models/Contactus');


router.get('/list', async function (req, res) 
{
    let contacts = await Contactus.GetForlist();
    return res.render('admin/contact/list',{contacts:contacts});  
});


router.get('/view/:id?', async function (req, res) 
{
    let contact = await Contactus.GetForView(req.params.id);
    return res.render('admin/contact/view',{contact:contact});
});



router.delete('/delete/:id?', function (req, res) {

    var db = mysql.createConnection(config.db);
    db.connect(function (error) {
        if (error) { return res.json(error); }
        var query = "delete from `contactus` where id = '" + req.params.id + "'";
        db.query(query, function (error, contact) {
            if (error) { status = false; flas_msg = "Query error."; }
            if (!contact[0]) { status = false; flas_msg = "contact not exist."; }
            else {
                return res.json('Contact Info Deleted');
            }

        });


    });

});





module.exports = router;

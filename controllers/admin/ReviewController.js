var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('config');

var Review = require('../../models/Review');



router.get('/list',async function(req, res) 
{
    let reviews = await Review.GetForList();
    //return res.json(reviews);
    return res.render('admin/review/list',{reviews:reviews});
});



router.get('/view/:id?',async function (req, res) 
{
    let review = await Review.GetForView(req.params.id);
    return res.render('admin/review/view',{review:review});

});






router.delete('/delete/:id', function (req, res) 
{
    var id = req.params.id;
    var db = mysql.createConnection(config.db);
    db.connect(function (error) {
        if (error) { return res.json(error); }
        else {
            var q = "delete from reviews where id = '" + id + "'";
            db.query(q, function (err) {
                if (err) { return res.json({ status: false, message: err, errors: {} }); }
                else {
                    res.json("Reviews has been deleted successfully")
                };

            });
        }

    });
 
});


module.exports = router;

var md5 = require('md5');
var express = require('express');
var router = express.Router();
var validator = require('validator');
var config = require('config');

const webpush = require('web-push');
var DB = require('../..//config/Database');
var WebNotify = require('../../models/WebNotify');



router.get('/view/:id', async function (req, res) 
{
   
   //return res.json(`view id='${req.params.id}' `);
   //let notification={};
   let notification = await WebNotify.View(req.params.id);  
   //return res.json(notification);
   let updated = await WebNotify.SetSeen(req.params.id);  
   return res.render('admin/webnotify/view',{notification});

});


router.get('/listing', async function (req, res) 
{

   let notifications = await WebNotify.Listing({});  
   //return res.json(notifications);
   return res.render('admin/webnotify/listing',{notifications});

});




router.post('/subscribe', async function(req, res) 
{  
   if(!req.body.endpoint || !req.body.keys){return res.json('endpoint and keys is required.');}
   else
   {

       // Send 201 - resource created    
        res.status(201).json({});
        // Get pushSubscription object
        const subscription = req.body;
        let result = await WebNotify.SetSubscription(subscription);
        console.log('subscription stored in database.',result);
        return res.json({status:true,messge:'subscription has been completed.',result});
   } 
   
});


router.post('/send', async function(req,res) 
{ 
   if(!req.body.title){return res.json('title is required.');}
   else
   {
        let result = await WebNotify.Send(req.body.title);
        return res.json(result);
   }

});

router.delete('/delete/:id',async function(req, res) 
{
   let deleted = await WebNotify.Deleting(req.params.id);  
   return res.json(deleted);
  
});




module.exports = router;

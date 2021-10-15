var md5 = require('md5');
var express = require('express');
var router = express.Router();
var validator = require('validator');
var config = require('config');



var User = require('../../models/User');
var AppNotify = require('../../models/AppNotify');
var Notification = require('../../config/Notification');
var SentNotifylog = require('../../models/SentNotifylog');




router.get('/sent-logs', async function (req, res) 
{
    let notifylogs = await SentNotifylog.List();
    //return res.json(notifylogs);
    return res.render('admin/notification/sent_logs',{notifylogs});

});




// router.get('/list', async function (req, res) 
// {
//     //return res.json('786 list json.');
//     let users = await User.GetAllForNotification();
//     const count = users.length;
//     return res.json({count,users});
//     return res.render('admin/notification/list',{users});

// });



router.get('/manage', async function (req, res) 
{
   let users = await User.GetAllForNotification();
   //return res.json(users);
   return res.render('admin/notification/manage',{users:users});

});



router.post('/send', async function (req, res) 
{

   
    let post = {};
    let errors = {}; 

    if (!req.body.title || validator.isEmpty(req.body.title)){errors.title="Title is required.";req.flash('title_err',`${errors.title}`); }
    else{ post.title=req.body.title.trim(); req.flash('title',post.title); }

    if (!req.body.body || validator.isEmpty(req.body.body)){errors.body="Body is required.";req.flash('body_err',`${errors.body}`); }
    else{ post.body=req.body.body.trim(); req.flash('body',post.body); }
    
    if(req.body.selectall && req.body.selectall=='1'){ post.selectall=req.body.selectall;  }
    else
    {
        if (!req.body.users){errors.users="Users is required.";req.flash('users_err',`${errors.users}`); }
        else{ post.users=req.body.users; req.flash('users',post.users); }
    }
    
    

    if (Object.keys(errors).length > 0){ req.flash('error',`Validation Fails`); return res.redirect("manage"); }
	else 
	{
        try
        {
            //return res.json(req.body);
            
            let resullt='';
            let data=[];
            let indexs=[]; 
            let tokens=[];
            if(post.selectall){tokens= await User.GetTokensAll();}
            else{tokens = await User.GetTokens(post.users);} 
            
            //return res.json(tokens);

            tokens.forEach(async (row,index)=>
            {

                result = await AppNotify.Push(row.device_token,{},{title:post.title,body:post.body});
                indexs.push(index); data.push(result);
                data.push({token:token,data:{},notify:{title:post.title,body:post.body}});
                
                //Still Loading this code.
                // if(indexs.length==data.length)
                // {
                //     req.flash('success',`(${indexs.length}) Notifications has been successfully Sent.`);     
                //     return res.redirect(`manage`); 
                // }

                
            });
            
            let notify={}
            notify.body=post.body;
            notify.title=post.title;
            notify.no_of_sent=tokens.length;     
            const sentStored = await SentNotifylog.Store(notify);
            req.flash('success',`Notifications has been successfully Sent.`);     
            return res.redirect(`manage`);
        
        }catch(err){return res.json({status:false,message:err.message}); }

        
    }


});



    

module.exports = router;

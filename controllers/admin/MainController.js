var md5 = require('md5');
var express = require('express');
var router = express.Router();

var DB = require('../..//config/Database');
var dashboard = require('../../models/Dashboard');

var AppNotify = require('../../models/AppNotify');



//Mohsin
var mohsin_token='eSrWxN3cRq2Q-oziHbznz7:APA91bFpmJT28hLT3-i1hqxVtbxvBEV5vqkfHqS8SHBq6gGjEXGdDZDg2PtFzU0ZlDTilUt1z74TwtgtizV-d8FOcUDAIiV_T2n9sw8XbN0cH-nf5qg-x2aCN0TKEh4BBfhNDaMzjzja';
//Haris
var haris_token = 'eW-23H-_RoGd7RolNS1ao4:APA91bFUAuYaZG_sPjVTV9zVfhk7fr1R3NERL-V-DYvbEGYN3HlSb48vWx1_vSUizkrBxeplnjEr1uryDirgX6M8uV8gsIypn8cUi5ed80XeJZ-y4YPW5ht67b4PGjGb1xtD6q3d0Nv0';
    

router.post('/study',async function(req,res)
{


    let tokens=[];
    tokens.push(haris_token);
    tokens.push(mohsin_token);

    let token=mohsin_token;
    
    //let tokens=`${mohsin_token},${haris_token}`;
    let data={ score: '850', time: '2:45' }
    let notify={
        
        title : '786 Title of notification'
        ,body : '786 This Body of notification tex.'
        ,image:'https://dzirebackend.herokuapp.com//assets/img/logo.png',
    }

    //let result = await AppNotify.Push(token,data,notify);
    let result = await AppNotify.PushMany(tokens,data,notify);
    
    return res.json(result);

});




router.get('/', async function(req, res) 
{  

    //res.sendfile('./views/webpush/index.html');
    var os = await dashboard.os();
    var statistics = await dashboard.statistics();
    var months = await dashboard.month();
    var pichart = await dashboard.pichart();
    return res.render('admin/dashboard/index',{'os':os,'statistics':statistics,'months':months,'pichart':pichart});

});





router.get('/restart', function (req, res, next) 
{
    
  process.exit();
  res.send('Successfully Restart NodeJs.');
});












router.get('/profile', function(req, res) 
{


    return res.render('admin/user/profile');


});







module.exports = router;

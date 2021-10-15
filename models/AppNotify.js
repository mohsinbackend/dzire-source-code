var config = require('config');
var DB = require('../config/Database');

var fcm = require('fcm-notification');
var FCM = new fcm(require('../config/haris-fcm.json'));

//Mohsin
//var token='eSrWxN3cRq2Q-oziHbznz7:APA91bFpmJT28hLT3-i1hqxVtbxvBEV5vqkfHqS8SHBq6gGjEXGdDZDg2PtFzU0ZlDTilUt1z74TwtgtizV-d8FOcUDAIiV_T2n9sw8XbN0cH-nf5qg-x2aCN0TKEh4BBfhNDaMzjzja';
//Haris
//var token = 'eW-23H-_RoGd7RolNS1ao4:APA91bFUAuYaZG_sPjVTV9zVfhk7fr1R3NERL-V-DYvbEGYN3HlSb48vWx1_vSUizkrBxeplnjEr1uryDirgX6M8uV8gsIypn8cUi5ed80XeJZ-y4YPW5ht67b4PGjGb1xtD6q3d0Nv0';
    

class AppNotify
{


    static Push(token,data={},notify={})
    {
        return  new Promise(function(resolve,reject)
        {
            var message={}
            
            message.data=data;
            message.token=token;
            
            // if(notify.title){message.notification.title=notify.title;}else{message.notification.title=`Dzire`;}
            // if(notify.body){message.notification.body=notify.body;}else{message.notification.body=`Dzire Body text.`;}
            // if(notify.image){message.notification.image=notify.image;}else{message.notification.image=`${config.url}/assets/img/logo.png`;;}
            
            message.notification=notify;
            //return message;
           

            FCM.send(message,function(err,response) 
            {
                if(err){ console.log(`Error ${err}`); return resolve(`Error ${err}`); }
                else 
                {
                    console.log(`Response ${response}`);
                    return resolve(`Response ${response}`);
                }

            });

        });

    }   

    
    static async PushMany(tokens=[],data={},notify={})
    {
        return  new Promise(async function(resolve,reject)
        {
            var respons=[];
            tokens.forEach(async (token,index)=>
            {
               //let result = await this.Push(token,data,notify); 
               respons.push({token:token});
            });
            return resolve(token);
        });

    }   
    




}
module.exports = AppNotify;

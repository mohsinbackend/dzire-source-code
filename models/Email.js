//var db = require('../config/Database');
var nodemailer = require('nodemailer');

//Google SMTP Account
var transporter = nodemailer.createTransport({
    port: 587
    ,host:"smtp.gmail.com"
    ,auth:{ pass: "app@dzire123",user: "appdzire@gmail.com" }
    ,tls: { rejectUnauthorized: false } 
});

//Cpanel SMTP Account
// var transporter = nodemailer.createTransport({
//     port: 587
//     ,host:"mail.hnh11.xyz"
//     ,auth:{ pass: "W%6B%ENJ4Q0=",user: "dzire@hnh11.xyz" }
//     ,tls: { rejectUnauthorized: false } 
// });


class Email
{

        

    static sendText(options)
    {
        
        return  new Promise(function(resolve,reject)
        {                
            transporter.sendMail(options, (error, info) => 
            {
                if(error){return resolve(error.message);} 
                else {return resolve(true); }
            });

        });
      
    }
   

}

module.exports = Email;

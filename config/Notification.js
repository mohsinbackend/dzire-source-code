var mysql = require('mysql');
var config = require('config');
const { Expo } = require('expo-server-sdk');


class Notification
{

    static Push(message)
    {

        return  new Promise(function(resolve,reject)
        {
            (async () => 
            {
                
                try 
                {
                    if(!Expo.isExpoPushToken(message.to))
                    { 
                        return resolve(`Push token ${message.to} is not a valid.`);
                    }   
                    else
                    {
                        let expo = new Expo();
                        let result = await expo.sendPushNotificationsAsync([message]);
                        return resolve(result[0]);
                    }

                }catch (error){ return resolve(error); }
            
            
            })();
        });
        
        
    }



    static PushBulk(messages)
    {

        return  new Promise(function(resolve,reject)
        {
            let errors = [];
            let tickets = [];
            let expo = new Expo();
            let chunks = expo.chunkPushNotifications(messages);

            (async () => 
            {
            
                for (let chunk of chunks) 
                {
                    if(!Expo.isExpoPushToken(chunk[0].to))
                    { 
                            errors.push(`Push token ${chunk[0].to} is not a valid.`);   
                    }   
                    else
                    {
                        try 
                        {
                            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                            console.log(ticketChunk); tickets.push(...ticketChunk);
                                    
                        }catch (error){ console.error(error); }    
                    
                    }
                    
                    
                }
            
                return resolve(tickets);
            
            })();


            
            
            
        });
        
        
    }





}

module.exports=Notification;





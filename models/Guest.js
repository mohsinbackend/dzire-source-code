var config = require('config');
var db = require('../config/Database');


class Guest
{
    
    static async Exists(id)
    {
        let dbuser = await db.first(`SELECT EXISTS( SELECT id FROM guests WHERE id='${id}' ) AS existing`);
        return dbuser.existing;   
    }
    

    static async GetById(id)
    {
        let dbguest = await db.first(`SELECT id FROM guests WHERE id='${id}'`);
        return dbguest;        
    }



    static async GetByToken(token)
    {

        let dbguest = await db.first(`SELECT id FROM guests WHERE device_token='${token}'`);
        return dbguest;        
    }


    static async Proceed(token)
    {
        let dbguest = await db.first(`SELECT id FROM guests WHERE device_token='${token}'`);
        if( (dbguest) && dbguest.id !=undefined && dbguest.id!=null){ return dbguest; }
        else
        {

        }
        
    }


}

module.exports = Guest;

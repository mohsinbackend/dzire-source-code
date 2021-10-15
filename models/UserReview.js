var config = require('config');
var DB = require('../config/Database');


class UserReview
{
    
    static primarykey=`id`;
    static table=`user_reviews`;
    
    static async Exists(id)
    {
        //let dbuser = await DB.first(`SELECT EXISTS( SELECT id FROM guests WHERE id='${id}' ) AS existing`);
        //return dbuser.existing;   
    }


    static async Store(owner_id,renter_id,text)
    {
        let query=`INSERT INTO ${this.table} `;
        query+=`SET text='${text}' `;
        query+=`,owner_id='${owner_id}' `;
        query+=`,renter_id='${renter_id}' `;
        query+=`,updated_at=CURRENT_TIMESTAMP `;
        query+=`,created_at=CURRENT_TIMESTAMP `;
        return await DB.execute(query); 
    }
    


}

module.exports = UserReview;

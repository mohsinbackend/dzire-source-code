var config = require('config');
var DB = require('../config/Database');


class UserSeenListing
{
    

    static primarykey=`id`;
    static table=`user_seen_listings`;
    

    static async Exists(id)
    {
        //let dbuser = await DB.first(`SELECT EXISTS( SELECT id FROM guests WHERE id='${id}' ) AS existing`);
        //return dbuser.existing;   
    }


    
    static async IncrementSeenCount(id)
    {
        return await DB.execute(`UPDATE ${this.table} SET seen_count=(seen_count+1) ,updated_at=CURRENT_TIMESTAMP WHERE id='${id}' `);
    }
    

    static async Store(selects={})
    {
        
        let query=`INSERT INTO ${this.table} SET `;
        let keys = Object.keys(selects);
        keys.forEach((key,index) => {
            if(index==0){query+=` ${key}='${selects[key]}' `; }   
            else{ query+=`,${key}='${selects[key]}' `; }
        });
        if(keys.length > 0){query+=`,created_at=CURRENT_TIMESTAMP `;}else{query+=`created_at=CURRENT_TIMESTAMP `;}  
        return await DB.execute(query);
        
    }


    static async Update(selects={},wheres={})
    {
        
        let query=`UPDATE ${this.table} SET `;
        let keys = Object.keys(selects);
        keys.forEach((key,index) => {
            if(index==0){query+=`${key}='${selects[key]}' `; }   
            else{ query+=`,'${key}'='${selects[key]}'`; }
        });
        if(keys.length > 0){query+=`,updated_at=CURRENT_TIMESTAMP `;}else{query+=`updated_at=CURRENT_TIMESTAMP `;}  
        
        let keys2 = Object.keys(wheres);
        keys2.forEach((key2,index2) => {
            if(index2==0){query+=`WHERE ${key2}='${wheres[key2]}' `; }   
            else{ query+=`AND '${key2}'='${wheres[key2]}'`; }
        });
        return await DB.execute(query);
        

    }

    

    
    static async IncrementSeenCount(id)
    {
        return await DB.execute(`UPDATE ${this.table} SET seen_count=(seen_count+1) ,updated_at=CURRENT_TIMESTAMP WHERE id='${id}' `);
    }



    static async StoreIfExistsUpdate(user_id,listing_id)
    {

        let userseen = await DB.first(`SELECT id FROM ${this.table} WHERE user_id='${user_id}' AND listing_id='${listing_id}'`);
        
        if(userseen.id){  return this.IncrementSeenCount(userseen.id); }
        else{ return await this.Store({'seen_count':1,'user_id':user_id,'listing_id':listing_id}); }
            

    }
    



}

module.exports = UserSeenListing;

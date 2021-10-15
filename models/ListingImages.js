var config = require('config');
var Image = require('./Image');
var DB = require('../config/Database');



class ListingImages
{
    
    static primarykey=`id`;
    static table=`listing_images`;
    
    static async Exists(id)
    {
        var db = await DB.get(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE id='${id}' ) AS existing`);
        return db.existing;
    }    

    static async Del(id)
    {
        return await DB.execute(`DELETE FROM ${this.table} WHERE id='${id}' `);
    } 

    
    static async DetWithImagesByIistingId(listing_id)
    {
        let indexes=[];
        let data = await DB.get(`SELECT id,image FROM ${this.table} WHERE listing_id='${listing_id}' `);
        data.forEach(async function(row,index)
        {
            indexes.push(index);
            await Image.delete(`listing_gallery`,row.image); await this.Del(id);
            if(indexes.length==data.length){return true;}
        });
        
    }


    static async DelByIistingId(listing_id)
    {
        return await DB.get(`SELECT * FROM ${this.table} WHERE listing_id='${listing_id}' `);
 
        return await DB.execute(`DELETE FROM ${this.table} WHERE listing_id='${listing_id}' `);
    }




}

module.exports = ListingImages;

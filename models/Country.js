var config = require('config');
var Image = require('./Image');
var Region = require('./Region');

var DB = require('../config/Database');



class Country
{
    
    
    static primarykey=`id`;
    static table=`countries`;
    
    static async Exists(id)
    {
        var db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE id='${id}' ) AS existing`);
        return db.existing;
    }    


    static async getIdByCode(code)
    {
        var country= await DB.first(`SELECT IF(EXISTS(SELECT id FROM ${this.table} WHERE code='${code}'  AND status='1'),(SELECT id FROM ${this.table} WHERE code='${code}' AND  status='1' ),0) AS id`);
        return country.id;
    }    

    static async GetLookup(locale)
    {
        return await DB.get(`SELECT id,${locale}_name AS name FROM ${this.table} WHERE status='1' `);
    }



    static async GetForlist()
    {
        return await DB.get(`SELECT id,status,${config.locale}_name AS name FROM ${this.table} `);
    }



    static async StoreByAdmin(obj)
    {

        let query =`INSERT INTO ${this.table} SET `; 
        query+=`ar_name='${obj.ar}' `;
        query+=`,en_name='${obj.en}' `;
        query+=`,status='${obj.status}' `;
        return await DB.execute(query);  

    }




}

module.exports = Country;

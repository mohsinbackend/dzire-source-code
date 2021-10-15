var config = require('config');
var Image = require('./Image');
var DB = require('../config/Database');



class Color
{
    
    static primarykey=`id`;
    static table=`colors`;
    
    static async Exists(id)
    {
        var db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE id='${id}' ) AS existing`);
        return db.existing;
    }    

    static async GetLookup(locale)
    {
        return await DB.get(`SELECT id,code,${locale}_name AS name FROM ${this.table} WHERE status='1' `);
    }




}

module.exports = Color;

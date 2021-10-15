var config = require('config');
var Image = require('./Image');
var DB = require('../config/Database');



class Content 
{

    static primarykey=`id`;
    static table=`contents`;
    
    static async Exists(id)
    {
        var db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE id='${id}' AND status='1' ) AS existing`);
        return db.existing;
    }   
    
    static async GetAll(locale)
    {
        let query=`SELECT id`;
        query+=`,${locale}_name AS name `;
        query+=`,${locale}_text AS text `;
        query+=`FROM ${this.table} `;
        return await DB.get(query+`WHERE status='1'`);
    }

    
    static async GetById(locale,content_id)
    {
        let query=`SELECT id`;
        query+=`,${locale}_name AS name `;
        query+=`,${locale}_text AS text `;
        query+=`FROM ${this.table} `;
        return await DB.first(query+`WHERE id='${content_id}' AND status='1'`);

    }

    static async GetForListing()
    {
        let query=`SELECT id,status`;
        query+=`,${config.locale}_name AS name `;
        query+=`,CONCAT(LEFT(${config.locale}_text,70),'....')  AS text `;
        query+=`FROM ${this.table} `;
        return await DB.get(query);
    }


    static async GetForView(id)
    {
        let query=`SELECT id`;
        query+=`,${config.locale}_name AS name `;
        query+=`,${config.locale}_text AS text `;
        query+=`FROM ${this.table} `;
        return await DB.first(query+`WHERE id='${id}' `);
    }


    static async GetForEdit(id)
    {
        let query=`SELECT id`;
        query+=`,${config.locale}_name AS name `;
        query+=`,${config.locale}_text AS text `;
        query+=`FROM ${this.table} `;
        return await DB.first(query+`WHERE id='${id}'`);

    }

    
    static async UpdateByAdmin(content)
    {
        let query=`UPDATE ${this.table} SET status='1' `;
        query+=`,en_text='${content.text}' `;
        query+=`,updated_at=CURRENT_TIMESTAMP `;
        query+=`WHERE id='${content.id}' `;
        return await DB.first(query);
    }



}

module.exports = Content;

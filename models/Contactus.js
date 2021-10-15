var config = require('config');
var Image = require('./Image');
var DB = require('../config/Database');



class Contactus 
{

    static primarykey=`id`;
    static table=`contactus`;
    

    static async GetForlist()
    {
        let query=`SELECT id,name,phone,email,user_id,text `;
        query+=`FROM ${this.table} `;
        return await DB.get(query);
    }

    
    static async GetForView(id)
    {
        let query=`SELECT id,name`;
        query+=`,phone,email,user_id,text `;
        query+=`FROM ${this.table} `;
        query+=`WHERE ${this.table}.id='${id}' `;
        return await DB.first(query);
    }


    

    static async ApiSave(contact)
    {
        let query=`INSERT INTO ${this.table} `;
        query+=`SET name='${contact.name}' `;
        query+=`,phone='${contact.phone}' `;
        query+=`,email='${contact.email}' `;
        query+=`,text='${contact.text}' `;
        query+=`,user_id='${contact.user_id}' `;
        query+=`,country_id='${contact.country_id}' `;
        query+=`,created_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP `;
        return await DB.execute(query);
    
    }


}

module.exports = Contactus;

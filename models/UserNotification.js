var config = require('config');
var Image = require('./Image');
var DB = require('../config/Database');



class UserNotification 
{

    static primarykey=`id`;
    static table=`notifications`;
    
    static async Exists(id)
    {
        var db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE id='${id}' ) AS existing`);
        return db.existing;
    }    

    
    
    static async GetSwitch(user_id)
    {
        return (await DB.first(`SELECT notification_switch FROM users WHERE users.id='${user_id}' `)).notification_switch;
    }


    static async SetSwitch(user_id,toggle)
    {
        return await DB.execute(`UPDATE users SET notification_switch='${toggle}' WHERE users.id='${user_id}' `);
    }

    static async Save(user_id,tab,screen,title,body)
    {
        return await DB.execute(`INSERT INTO ${this.table} SET user_id='${user_id}',tab='${tab}',screen='${screen}',title='${title}',body='${body}' `);
    }

    

    static async SetSeen(notify_id)
    {
        return await DB.execute(`UPDATE ${this.table} SET seen='1' WHERE id='${notify_id}' `);
    }

    static async GetCountUnseen(user_id)
    {
        let dbresult = await DB.first(`SELECT COUNT(id) AS countunseen FROM ${this.table} WHERE user_id='${user_id}' AND seen='0' `);
        return dbresult.countunseen;
    }


    static async GetByUser(user_id)
    {
        let query=`SELECT id,seen,tab,screen,title,body `;
        query+=`,DATE_FORMAT(${this.table}.created_at,'%b %d, %Y') AS date `;
        query+=`FROM ${this.table} `;
        query+=`WHERE user_id='${user_id}' `;
        return await DB.get(query);

    }


}

module.exports = UserNotification;

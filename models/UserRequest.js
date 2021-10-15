var config = require('config');
var DB = require('../config/Database');


class UserRequest
{

    static primarykey=`id`;
    static table=`user_requests`;
    
    static async Exists(id)
    {
        var db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE id='${id}' ) AS existing`);
        return db.existing;
    }    

    static async SetCategory(user_id,category)
    {
        return await DB.execute(`INSERT INTO ${this.table} SET user_id='${user_id}',category='${category}',created_at=CURRENT_TIMESTAMP `);
    }

    static async GetForListing()
    {
        let query=`SELECT ${this.table}.id `;
        query+=`,${this.table}.category ,${this.table}.user_id `;
        query+=`,CONCAT(users.fname,' ',users.lname) AS user_name `;
        query+=`FROM ${this.table} `;
        query+=`JOIN users ON users.id=${this.table}.user_id `;
        return await DB.get(query);
    }


    static async DeletedByAdmin(id)
    {
        return await DB.execute(`DELETE FROM ${this.table} WHERE id=${id}`);
    }
    
}

module.exports = UserRequest;

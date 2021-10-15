var config = require('config');
var DB = require('../config/Database');



class EmailTemplate
{

    static primarykey=`id`;
    static table=`email_templates`;

    
    static async GetAll()
    {    
        return await DB.get(`SELECT * FROM ${this.table}`);
    }
    
    static async Exists(id)
    {
        var db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE ${this.primarykey}='${id}' ) AS existing`);
        return db.existing;
    }    


    static async Register(OTP)
    {    
        return await DB.first(`SELECT id,title,REPLACE(template,'[OTP]','[${OTP}]') AS template FROM ${this.table} WHERE ${this.primarykey}='register' `);
    }

    static async updateRegister(row)
    {   return await DB.execute(`UPDATE ${this.table} SET title='${row.register_title}',template='${row.register_template}' WHERE ${this.primarykey}='register' `);
    }

    

}

module.exports = EmailTemplate;

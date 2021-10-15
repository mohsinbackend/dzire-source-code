var config = require('config');
var Image = require('./Image');
var DB = require('../config/Database');


class Admin
{
    
    static table=`admins`;
    

    static async exists(id)
    {
        let db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE id='${id}' ) AS existing`);
        return db.existing;
    }



    static async attempt(email,password)
    {
        
        let data={'auth':false};
        let db = await DB.first(`SELECT id,status FROM ${this.table} WHERE email='${email}' AND password='${password}'`);
        if(!db.id){data.msg=`Invalid Credeantials!`;}
        else if(db.status=='0'){data.msg=`Account has been deactivated.`;}
        else if(db.status=='2'){data.msg=`Account has been deleted by admin.`;}
        else if(db.status=='1'){data.auth=true;data.id=db.id;}
        return data;
    
    }



    static async account(id)
    {
        const url = Image.Url('listing/l/');
        const placeholder = Image.Placeholder('l','user');

        var query=`SELECT ${this.table}.id,name,email `;
        query+=`,IF(image IS NULL OR image='','${placeholder}',CONCAT('${url}',image) ) AS image_url `;
        query+=`FROM ${this.table} `;
        query+=`WHERE ${this.table}.id='${id}' `;
        return await DB.first(query);    
    }
    


}

module.exports = Admin;

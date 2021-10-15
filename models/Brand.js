var config = require('config');
var Image = require('./Image');
var DB = require('../config/Database');



class Brand
{

    static pk=`id`;
    static table=`brands`;
 
    
    static async Exists(id)
    {
        var db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE ${this.pk}='${id}' ) AS existing`);
        return db.existing;
    }    

    static async List()
    {
        return await DB.get(`SELECT id,en_name,ar_name,status FROM ${this.table}`);
    }


    static async GetLookup(locale)
    {
        return await DB.get(`SELECT id,${locale}_name AS name FROM ${this.table} WHERE status='1' `);
    }

    static async Store(row)
    {
        return await DB.execute(`INSERT INTO ${this.table} SET en_name='${row.en_name}',ar_name='${row.ar_name}',status='${row.status}' `);
    }
    
    static async Edit(id)
    {
        return await DB.first(`SELECT id,en_name,ar_name,status FROM ${this.table} WHERE ${this.pk}='${id}' `);
    }

    static async Update(row)
    {
        return await DB.execute(`UPDATE ${this.table} SET en_name='${row.en_name}',ar_name='${row.ar_name}',status='${row.status}' WHERE ${this.pk}='${row.id}' `);
    }

    
    
    static async Delete(id)
    {
        return await DB.first(`DELETE FROM ${this.table} WHERE ${this.pk}='${id}' `);
    }
    

}

module.exports = Brand;

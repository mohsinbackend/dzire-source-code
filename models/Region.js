var config = require('config');
var Image = require('./Image');
var Country = require('./Country');

var DB = require('../config/Database');
const { findIndex } = require('lodash');


class Region
{
    
    
    static primarykey=`id`;
    static table=`regions`;

    static async Exists(id)
    {
        var db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE id='${id}' ) AS existing`);
        return db.existing;
    }    




    static async GetForlist()
    {
        return await DB.get(`SELECT id,status,${config.locale}_name AS name FROM ${this.table} `);
    }

    static async GetForEdit(id)
    {
        return await DB.first(`SELECT id,country_id AS country,ar_name AS ar,en_name AS en,status FROM ${this.table} `);
    }


    static async GetLookup(locale)
    {
        return await DB.get(`SELECT id,${locale}_name AS name FROM ${this.table} WHERE status='1' `);
    }


    static async GetByParent(parent_id,locale)
    {
        return await DB.get(`SELECT id,${locale}_name AS name FROM ${this.table} WHERE country_id='${parent_id}' AND status='1' `);
    }


    static async GetWithParent(locale)
    {
        
        let query=`SELECT `; 
        query+=`${this.table}.id AS region_id`;
        query+=`,${this.table}.${locale}_name AS region_name `;
        query+=`,countries.id AS country_id`;
        query+=`,countries.${locale}_name AS country_name `;
        query+=`FROM ${this.table} `;
        query+=`LEFT JOIN countries ON countries.id=${this.table}.country_id `;
        query+=`WHERE countries.status='1' AND ${this.table}.status='1' `;
        let dbdata = await DB.get(query);
        
        let array=[];
        if(typeof(dbdata)=='object')
        {
            
            
            dbdata.forEach(row1=>{ 

                if(array.findIndex(row=>row.id==row1.country_id)==-1)
                {
                    let regions=[];
                    dbdata.forEach(row2=>{ 
                        if(row1.country_id==row2.country_id)
                        {
                            regions.push({id:row2.region_id,name:row2.region_name});
                        } 
                    });
                    array.push({id:row1.country_id,name:row1.country_name,regions:regions});
      
                }  
      
            });
        
        }
    
        return array;
    
    }
    

    static async StoreByAdmin(obj)
    {
        
        var query =`INSERT INTO ${this.table} SET `; 
        query+=`ar_name='${obj.ar}' `;
        query+=`,en_name='${obj.en}' `;
        query+=`,status='${obj.status}' `;
        query+=`,country_id='${obj.country}' `;
        var storeResult = await DB.execute(query);   
        return storeResult;
    
    }



    static async UpdateByAdmin(obj)
    {

        var query =`UPDATE ${this.table} SET `; 
        query+=`ar_name='${obj.ar}' `;
        query+=`,en_name='${obj.en}' `;
        query+=`,status='${obj.status}' `;
        query+=`,country_id='${obj.country}' `;
        query+=`WHERE ${this.table}.id='${obj.id}' `;
        return await DB.execute(query);   
       
    }

    

}

module.exports = Region;

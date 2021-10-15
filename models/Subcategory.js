var config = require('config');
var DB = require('../config/Database');



class Subcategory
{
    
    static primarykey=`id`;
    static table=`subcategories`;
    

    static async DeleteByCategory(cate_id)
    {
        return  await DB.execute(`DELETE FROM ${this.table} WHERE category_id='${cate_id}' `);
    
    }

    static async Exists(id)
    {
        var db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE id='${id}' ) AS existing`);
        return db.existing;
    }    

    
    static async UpdateAndStore(cate_id,subcategories=[])
    {
        let indexs=[];
        let used_ids=[];
        subcategories.forEach(async (subcate,index)=>
        {
            indexs.push(index);
            
            if(await this.Exists(subcate.id)=='1')
            { 
                used_ids.push(subcate.id);
                let updated = await this.Update(subcate);
                      
            }
            else
            {
                subcate.cate_id=cate_id;
                let stored = await this.Store(subcate);
                if(stored.insertId){ used_ids.push(stored.insertId); }
            }

            if(indexs.length===subcategories.length)
            {
                //console.log('used_ids',used_ids);
                const delresult = await DB.execute(`DELETE FROM ${this.table} WHERE category_id='${cate_id}' AND id NOT IN(${used_ids.toString()})`);   
                //console.log(delresult);
            }


        });
        
        //console.log('used_ids',used_ids);
        
    
    }



    static async GetLookup(locale)
    {
        return await DB.get(`SELECT id,category_id,${locale}_name AS name FROM ${this.table} WHERE status='1' `);
    }


    static async GetForEditByCate(cate_id)
    {
        var query=`SELECT ${this.table}.id `;
        query+=`,status,priority `;
        query+=`,ar_name AS ar ,en_name AS en `;
        query+=`FROM ${this.table} `;
        query+=`WHERE ${this.table}.category_id='${cate_id}' `;
        return await DB.get(query);   
    
    }



    static async Store(subcate)
    {
        var query =`INSERT INTO ${this.table} SET `; 
        query+=`status='${subcate.status}' `;
        query+=`,ar_name='${subcate.ar}' `;
        query+=`,en_name='${subcate.en}' `;
        query+=`,priority='${subcate.priority}' `;
        query+=`,category_id='${subcate.cate_id}' `;
        query+=`,updated_at=CURRENT_TIMESTAMP() `;
        query+=`,created_at=CURRENT_TIMESTAMP() `;
        var storeResult = await DB.execute(query);   
        return storeResult;

    }
    

    static async Update(subcate)
    {
        var query =`UPDATE ${this.table} SET `; 
        query+=`status='${subcate.status}' `;
        query+=`,ar_name='${subcate.ar}' `;
        query+=`,en_name='${subcate.en}' `;
        query+=`,priority='${subcate.priority}' `;
        //query+=`,category_id='${subcate.cate_id}' `;
        query+=`,updated_at=CURRENT_TIMESTAMP() `;
        query+=`WHERE id='${subcate.id}' `;
        var updated = await DB.execute(query);   
        return updated;

    }
    

    
   

    
    static async GetByCategory(locale,category_id)
    {
        return await DB.get(`SELECT id,${locale}_name AS name FROM ${this.table} WHERE category_id='${category_id}' AND  status='1' `);
    }

    


    static async GetForView(id)
    {
        var query=`SELECT ${this.table}.id `;
        query+=`,${this.table}.status `;
        query+=`,${this.table}.en_name AS name `;
        query+=`,categories.en_name AS category `;
        query+=`FROM ${this.table} `;
        query+=`LEFT JOIN categories ON categories.id=${this.table}.category_id `;
        query+=`WHERE ${this.table}.id='${id}' `;
        return  await DB.first(query);   
    
    }



    static async GetForListing(category)
    {
        var query=`SELECT ${this.table}.id `;
        query+=`,${this.table}.status `;
        query+=`,${this.table}.en_name AS name `;
        query+=`,categories.en_name AS category `;
        query+=`FROM ${this.table} `;
        query+=`LEFT JOIN categories ON categories.id=${this.table}.category_id `;
        return  await DB.execute(query);

    }





    static async StoreByAdmin(subcate)
    {
        var query =`INSERT INTO ${this.table} SET `; 
        query+=`status='${subcate.status}' `;
        query+=`,en_name='${subcate.en}' `;
        query+=`,category_id='${subcate.cate_id}' `;
        query+=`,updated_at=CURRENT_TIMESTAMP() `;
        query+=`,created_at=CURRENT_TIMESTAMP() `;
        var storeResult = await DB.execute(query);   
        return storeResult;

    }





    static async GetForEdit(id)
    {
        var query=`SELECT ${this.table}.id `;
        query+=`,${this.table}.status `;
        query+=`,${this.table}.en_name AS name `;
        query+=`,${this.table}.category_id AS cate_id `;
        query+=`FROM ${this.table} `;
        query+=`WHERE ${this.table}.id='${id}' `;
        return  await DB.first(query);   
    
    }

 
    static async UpdateByAdmin(subcate)
    {
        var query =`UPDATE ${this.table} SET `; 
        query+=`status='${subcate.status}' `;
        query+=`,en_name='${subcate.en}' `;
        query+=`,category_id='${subcate.cate_id}' `;
        query+=`,updated_at=CURRENT_TIMESTAMP() `;
        query+=`WHERE ${this.table}.id='${subcate.id}' `; 
        return  await DB.execute(query);   
       
    }
















}

module.exports = Subcategory;

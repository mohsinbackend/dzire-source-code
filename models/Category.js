var config = require('config');
var Image = require('./Image');
var DB = require('../config/Database');


class Category
{
   
    static primarykey=`id`;
    static table=`categories`;
    
    static async Exists(id)
    {
        var db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE id='${id}' ) AS existing`);
        return db.existing;
    }    


    
    static async Edit(id)
    {
        const url = Image.Url('/category/m/');
        const placeholder = Image.Placeholder('m','category');
        let query=`SELECT ${this.table}.id `;
        query+=`,image,status,dashboard,dashboard_priority `;
        query+=`,ar_name AS ar ,en_name AS en `;
        query+=`,IF(image IS NULL OR image='','${placeholder}',CONCAT('${url}',image) ) AS image_url `;
        query+=`FROM ${this.table} `;
        query+=`WHERE id='${id}' `;
        return  await DB.first(query);   
    }
    


    static async Store(category)
    {
       
        var query =`INSERT INTO ${this.table} SET `; 
        query+=`image=NULL `;
        query+=`,ar_name='${category.ar}' `;
        query+=`,en_name='${category.en}' `;
        query+=`,status='${category.status}' `;
        query+=`,dashboard='${category.dashboard}' `;
        query+=`,dashboard_priority='${category.dashboard_priority}' `;
        query+=`,updated_at=CURRENT_TIMESTAMP() `;
        query+=`,created_at=CURRENT_TIMESTAMP() `;
        let stored = await DB.execute(query);   
        if(stored.insertId)
        {
            const image = await Image.Upload('category',category.imgsrc);
            let updated = await DB.execute(`UPDATE ${this.table} SET image='${image}' WHERE id='${stored.insertId}'`)
            return stored;
        }
        
    }


    static async Update(category)
    {
       
        var query =`UPDATE ${this.table} SET `; 
        query+=`ar_name='${category.ar}' `;
        query+=`,en_name='${category.en}' `;
        query+=`,status='${category.status}' `;
        query+=`,dashboard='${category.dashboard}' `;
        query+=`,dashboard_priority='${category.dashboard_priority}' `;
        query+=`,updated_at=CURRENT_TIMESTAMP() `;
        if(category.imgsrc)
        {
            let dbcategory = await DB.first(`SELECT id,image FROM ${this.table} WHERE id='${category.cate_id}' `);
            const image = await Image.Upload('category',category.imgsrc);
            query+=`,image='${image}' `;
            const deleted = await Image.delete('category',dbcategory.image);
        }
        query+=`WHERE id='${category.cate_id}'  `;
        let updated = await DB.execute(query);   
        return updated;

    }



    static async GetLookup(locale)
    {
        return await DB.get(`SELECT id,${locale}_name AS name FROM ${this.table} WHERE status='1' `);
    }


    static async GetForView(id)
    {
        const url = Image.Url('/category/m/');
        const placeholder = Image.Placeholder('m','category');
        var query=`SELECT ${this.table}.id,en_name,status,dashboard,dashboard_priority `;
        query+=`,IF(image IS NULL OR image='','${placeholder}',CONCAT('${url}',image) ) AS image_url `;
        query+=`FROM ${this.table} `;
        query+=`WHERE id='${id}' `;
        return  await DB.first(query);   
    }

    
    
    static async GetForListing()
    {
        const url = Image.Url('/category/s/');
        const placeholder = Image.Placeholder('s','category');
        var query=`SELECT ${this.table}.id,en_name,status,dashboard,dashboard_priority`;
        query+=`,IF(image IS NULL OR image='','${placeholder}',CONCAT('${url}',image) ) AS image_url `;
        //query+=`,IF(dashboard_priority=0 OR dashboard_priority='0',NULL,dashboard_priority) AS order_by_sort `;
        query+=`FROM ${this.table} `;
        //query+=`ORDER BY order_by_sort ASC `;
        return  await DB.execute(query);   
    }






    static async StoreByAdmin(category)
    {

        const image = await Image.Upload('category',category.imgsrc);
        //const image = await Image.SaveForCategory(category.imgsrc);

        var query =`INSERT INTO ${this.table} SET `; 
        query+=`image='${image}' `;
        query+=`,en_name='${category.en}' `;
        query+=`,status='${category.status}' `;
        query+=`,dashboard='${category.dashboard}' `;
        query+=`,dashboard_priority='${category.dashboard_priority}' `;
        query+=`,updated_at=CURRENT_TIMESTAMP() `;
        query+=`,created_at=CURRENT_TIMESTAMP() `;
        var storeResult = await DB.execute(query);   
        return storeResult;

    }





    static async GetForEdit(id)
    {
        const url = Image.Url('/category/m/');
        const placeholder = Image.Placeholder('m','category');
        var query=`SELECT ${this.table}.id,en_name,status,dashboard,dashboard_priority `;
        query+=`,IF(image IS NULL OR image='','${placeholder}',CONCAT('${url}',image) ) AS image_url `;
        query+=`FROM ${this.table} `;
        query+=`WHERE id='${id}' `;
        return  await DB.first(query);   
    }





    static async UpdateByAdmin(category)
    {

        var query =`UPDATE ${this.table} SET `; 
        query+=`en_name='${category.en}' `;

        if(category.imgsrc)
        {
            const uploaded = await Image.Upload('category',category.imgsrc);
            //const uploaded = await Image.SaveForCategory(category.imgsrc);
            let dbcate = await DB.first(`SELECT id,image FROM ${this.table} WHERE id='${category.id}'`);
            let deleted = await Image.delete('category',dbcate.image);
            query+=`,image='${uploaded}' `; 
        }
        
        query+=`,status='${category.status}' `;
        query+=`,dashboard='${category.dashboard}' `;
        query+=`,dashboard_priority='${category.dashboard_priority}' `;
        query+=`,updated_at=CURRENT_TIMESTAMP() `;
        query+=`WHERE id='${category.id}' `;
        var updated = await DB.execute(query);   
        return updated;


    }



    static async DeletedByAdmin(id)
    {
        let dbcate = await DB.first(`SELECT id,image FROM ${this.table} WHERE id='${id}'`);
        const delimg = await Image.delete('category',dbcate.image);
        const delcate = await DB.execute(`DELETE FROM ${this.table} WHERE id='${dbcate.id}' `);
        return dbcate;
        
    }



    
    static async GetForAppDashboard(locale)
    {
        let url = Image.Url('/category/l/');
        const placeholder = Image.Placeholder('l','category');
        let query=`SELECT id `;
        query+=`,${locale}_name AS name `;
        query+=`,IF(image is NULL OR image='','${placeholder}',CONCAT('${url}',image)) AS image_url `;
        query+=`FROM ${this.table} `;
        query+=`WHERE dashboard='1' AND dashboard_priority!='0'`;
        query+=`ORDER BY dashboard_priority  `;
        return await DB.get(query);
    }   




}

module.exports = Category;

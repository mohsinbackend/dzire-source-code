var config = require('config');
var Image = require('./Image');
var DB = require('../config/Database');



class Basket 
{

    static primarykey=`id`;
    static table=`baskets`;
    
    
    static async Exists(id)
    {
        var db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE id='${id}' ) AS existing`);
        return db.existing;
    }    

    
    
    static async GetRow(id)
    {
        let query=`SELECT id,user_id,listing_id`;
        query+=`,DATE_FORMAT(${this.table}.pickup_date,'%Y-%m-%d') AS pickup_date `;
        query+=`,DATE_FORMAT(${this.table}.dropoff_date,'%Y-%m-%d') AS dropoff_date `;   
        return await DB.first(query+` FROM ${this.table} WHERE id='${id}' `);
    }



    static async DelRow(id)
    {
        let result = await DB.execute(`DELETE FROM ${this.table} WHERE id='${id}' `);
        return result;
    }

    
    
    static async IsOwner(user_id,basket_id)
    {
        var db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE id='${basket_id}' AND user_id='${user_id}' ) AS existing`);
        return db.existing;
    }    



    static async Already(basket)
    {
        var db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE user_id='${basket.user_id}' AND listing_id='${basket.listing_id}'  ) AS existing`);
        return db.existing;
    }



    static async GetMy(locale,user_id)
    {


        let url = Image.Url('listing/l/');
        const placeholder = Image.Placeholder('l','listing');
  
        let query=`SELECT listings.id ,listings.name `;
        
        query+=`,${this.table}.id AS basket_id `;
        query+=`,brands.${locale}_name AS brand `;
        query+=`,categories.${locale}_name AS category `;
     
        query+=`,listings.location `;
        query+=`,regions.${locale}_name AS region `;
        query+=`,countries.${locale}_name AS country `;
        query+=`,(charges_amount * timestampdiff(DAY,pickup_date,dropoff_date)) AS days_of_charges `;
        query+=`,DATE_FORMAT(${this.table}.pickup_date,'%D %M, %Y') AS pickup_date `;
        query+=`,DATE_FORMAT(${this.table}.dropoff_date,'%D %M, %Y') AS dropoff_date `;   
        query+=`,IF(listings.image is NULL OR listings.image='','${placeholder}',CONCAT('${url}',listings.image)) AS image_url `;
        query+=`
        ,@days:=TIMESTAMPDIFF(DAY,pickup_date,dropoff_date) AS days 
        ,@weeks:=TIMESTAMPDIFF(WEEK,pickup_date,dropoff_date) AS weeks
        ,@months:=TIMESTAMPDIFF(MONTH,pickup_date,dropoff_date) AS months
        ,CASE
        WHEN @days < 7 THEN (@days * listings.per_day_amount) 
        WHEN @days > 0 AND @weeks > 0 AND @months=0  THEN 
        (@weeks * listings.per_week_amount) + ((@days - (@weeks * 7)) * listings.per_day_amount)  
        WHEN @days > 0 AND @weeks > 0 AND @months > 0 THEN 
        (@months * listings.per_month_amount)+((@weeks - @months * 4) * listings.per_week_amount) +(( @days -((@months * 30) + (@weeks - @months * 4) * 7) ) * listings.per_day_amount)
        ELSE 0 END as calculation `;

        query+=`FROM ${this.table} `;
        
        query+=`LEFT JOIN listings ON listings.id=${this.table}.listing_id `;
        query+=`LEFT JOIN brands ON brands.id=listings.brand_id `;
        query+=`LEFT JOIN categories ON categories.id=listings.category_id `;
        query+=`LEFT JOIN regions ON regions.id=listings.region_id `;       
        query+=`LEFT JOIN countries ON countries.id=listings.country_id `;       
        
        query+=`WHERE ${this.table}.user_id='${user_id}'  AND  listings.status='1' `;
        
        return await DB.get(query);



    }


    static async AddTo(basket)
    {
        let query=`INSERT INTO ${this.table} `;
        query+=`SET user_id='${basket.user_id}' `;
        query+=`,listing_id='${basket.listing_id}' `;
        query+=`,pickup_date='${basket.pickup_date}' `;
        query+=`,dropoff_date='${basket.dropoff_date}' `;
        query+=`,updated_at=CURRENT_TIMESTAMP `;
        query+=`,created_at=CURRENT_TIMESTAMP `;
        let result  = await DB.execute(query);
        return result;
    
    }

   

}

module.exports = Basket;

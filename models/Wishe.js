var config = require('config');
var Image = require('./Image');
var DB = require('../config/Database');
var rand = require("random-key");

var Basket = require('./Basket');
var UserNotification = require('./UserNotification');


class Wishe 
{

    
    static primarykey=`id`;
    static table=`wishes`;
    
    static async Exists(id)
    {
        var db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE id='${id}' ) AS existing`);
        return db.existing;
    }    

    static async Count(id)
    { 
        return await DB.first(`SELECT COUNT(*) as count FROM ${this.table} WHERE ${this.table}.listing_id='${id}' `);
    }
    static async GetForNotify(type,wish_id)
    {
        
        let notify={sound:'default',data:{'section':'Wishe','wish_id':wish_id}};   
        if(type=='torent')
        { 
            let query=`SELECT owner.device_token `; 
            query+=`,owner.id AS owner_id `;
            query+=`,listings.name AS listing_name `;
            query+=`,CONCAT(renter.fname,' ',renter.lname) AS renter_name `;
            query+=`FROM ${this.table} `;
            query+=`LEFT JOIN listings ON listings.id=${this.table}.listing_id `;
            query+=`LEFT JOIN users AS owner ON owner.id=listings.user_id `;
            query+=`LEFT JOIN users AS renter ON renter.id=${this.table}.user_id `;            
            query+=`WHERE ${this.table}.id='${wish_id}' `;

            let row = await DB.first(query);      
            notify.to=row.device_token; 
            notify.data.type='New';
            
            notify.title=`New wish to rent recived`;
            notify.body=`You have just recived a new wish to rent from ${row.listing_name} from ${row.renter_name}.`;
            let saved = await UserNotification.Save(row.owner_id,'0','Wishesrecieved',notify.title,notify.body);
        
        }


        if(type=='togrant')
        { 
            let query=`SELECT renter.device_token `;
            query+=`,renter.id AS renter_id `;
            query+=`,listings.name AS listing_name `;
            query+=`,CONCAT(renter.fname,' ',renter.lname) AS owner_name `;
            query+=`FROM ${this.table} `;
            query+=`LEFT JOIN listings ON listings.id=${this.table}.listing_id `;
            query+=`LEFT JOIN users AS owner ON owner.id=listings.user_id `;
            query+=`LEFT JOIN users AS renter ON renter.id=${this.table}.user_id `;            

            query+=`WHERE ${this.table}.id='${wish_id}' `;
            let row = await DB.first(query);
            notify.to=row.device_token;
            notify.data.type='progress';
            notify.title=`Wish to rent has been granted`;
            notify.body=`Your wish to rent for a ${row.listing_name} has been granted by ${row.owner_name}.`;
            let saved = await UserNotification.Save(row.renter_id,'1','Wishesrequested',notify.title,notify.body);
     
        }


        if(type=='collection')
        { 
            
            let query=`SELECT renter.device_token `;
            query+=`,renter.id AS renter_id `;
            query+=`,listings.name AS listing_name `;
            query+=`,CONCAT(renter.fname,' ',renter.lname) AS owner_name `;
            query+=`FROM ${this.table} `;
            query+=`LEFT JOIN listings ON listings.id=${this.table}.listing_id `;
            query+=`LEFT JOIN users AS owner ON owner.id=listings.user_id `;
            query+=`LEFT JOIN users AS renter ON renter.id=${this.table}.user_id `;
            query+=`WHERE ${this.table}.id='${wish_id}' `;
            let row = await DB.first(query);
            notify.to=row.device_token;
            notify.data.type='progress';
            notify.title=`Item ready for collection`;
            notify.body=`The ${row.listing_name} you wished to rent is ready for collection.`;
            let saved = await UserNotification.Save(row.renter_id,'2','Wishesrequested',notify.title,notify.body);
            

        }


        if(type=='decline')
        { 
            let query=`SELECT renter.device_token `;
            query+=`,renter.id AS renter_id `;
            query+=`,listings.name AS listing_name `;
            query+=`,CONCAT(renter.fname,' ',renter.lname) AS owner_name `;
            query+=`FROM ${this.table} `;
            query+=`LEFT JOIN listings ON listings.id=${this.table}.listing_id `;
            query+=`LEFT JOIN users AS owner ON owner.id=listings.user_id `;
            query+=`LEFT JOIN users AS renter ON renter.id=${this.table}.user_id `;
            query+=`WHERE ${this.table}.id='${wish_id}' `;
            let row = await DB.first(query);
            notify.to=row.device_token;
            notify.data.type='decline';
            notify.title=`Wish decline`;
            notify.body=`Your  ${row.listing_name} wishe decline by ${row.owner_name}.`;
            let saved = await UserNotification.Save(row.renter_id,'3','Wishesrequested',notify.title,notify.body);
           
        }


        if(type=='completed')
        { 
            let query=`SELECT renter.device_token `;
            query+=`,renter.id AS renter_id `;
            query+=`,listings.name AS listing_name `;
            query+=`,CONCAT(renter.fname,' ',renter.lname) AS owner_name `;
            query+=`FROM ${this.table} `;
            query+=`LEFT JOIN listings ON listings.id=${this.table}.listing_id `;
            query+=`LEFT JOIN users AS owner ON owner.id=listings.user_id `;
            query+=`LEFT JOIN users AS renter ON renter.id=${this.table}.user_id `;
            query+=`WHERE ${this.table}.id='${wish_id}' `;
            let row = await DB.first(query);
            notify.to=row.device_token;
            notify.data.type='completed';
            notify.title=`Wish completed`;
            notify.body=`Your wish ${row.listing_name} has been completed by ${row.owner_name}.`;
            let saved = await UserNotification.Save(row.renter_id,'2','Wishesrequested',notify.title,notify.body);
          
        }

        

        return notify;
    
    }


    static async Valid(type,user_id,wish_id)
    {

        if(type=='Rent')
        {


        }

        
        if(type=='Grant')
        {
            let query=`SELECT EXISTS(SELECT ${this.table}.id FROM ${this.table} `;
            query+=`LEFT JOIN listings ON listings.id=${this.table}.listing_id `;
            query+=`WHERE ${this.table}.id='${wish_id}' AND ${this.table}.type='new' `;
            query+=`AND listings.user_id='${user_id}'  AND listings.status='1' ) AS existing  `;
            var db = await DB.first(query);
            return db.existing;        
        }

        if(type=='Decline')
        {
            let query=`SELECT EXISTS(SELECT ${this.table}.id FROM ${this.table} `;
            query+=`LEFT JOIN listings ON listings.id=${this.table}.listing_id `;
            query+=`WHERE ${this.table}.id='${wish_id}' AND ${this.table}.type='new' `;
            query+=`AND listings.user_id='${user_id}'  AND listings.status='1' ) AS existing  `;
            var db = await DB.first(query);
            return db.existing;
        }


        if(type=='Collection')
        {
            let query=`SELECT EXISTS(SELECT ${this.table}.id FROM ${this.table} `;
            query+=`LEFT JOIN listings ON listings.id=${this.table}.listing_id `;
            query+=`WHERE ${this.table}.id='${wish_id}' AND ${this.table}.type='progress' `;
            query+=`AND listings.user_id='${user_id}'  AND listings.status='1' ) AS existing  `;
            var db = await DB.first(query);
            return db.existing;
        }

        
        if(type=='Completed')
        {
            let query=`SELECT EXISTS(SELECT ${this.table}.id FROM ${this.table} `;
            query+=`LEFT JOIN listings ON listings.id=${this.table}.listing_id `;
            query+=`WHERE ${this.table}.id='${wish_id}' AND ${this.table}.type='collection' `;
            query+=`AND listings.user_id='${user_id}'  AND listings.status='1' ) AS existing  `;
            var db = await DB.first(query);
            return db.existing;
        }

       
    
    }




    
    
    static async Collection(wish_id,date_time)
    {
        let query=`UPDATE ${this.table} SET `;
        query+=`type='collection' `;
        query+=`,updated_at=CURRENT_TIMESTAMP `;
        query+=`,collection_datetime='${date_time}' `;
        query+=`WHERE ${this.table}.id='${wish_id}' `;        
        let output = await DB.execute(query);
        return output; 
    } 


    
    static async Completed(wish_id)
    {
        let query=`UPDATE ${this.table} SET `;
        query+=`type='completed' `;
        query+=`,updated_at=CURRENT_TIMESTAMP `;
        query+=`WHERE ${this.table}.id='${wish_id}' `;        
        let output = await DB.execute(query);
        return output;        
    } 


    // static async ToRentMany(str_basket_ids)
    // {

    //     let outputs=[];
    //     let basket_ids=str_basket_ids.split(',');  
        
    //     let varible = basket_ids.forEach(async (basket_id,index)=>
    //     {
    //         let basket = await Basket.GetRow(basket_id);        
    //         let query=`INSERT INTO ${this.table} `;
    //         query+=`SET type='new' `;
    //         query+=`,user_id='${basket.user_id}' `;
    //         query+=`,listing_id='${basket.listing_id}' `;
    //         query+=`,pickup_date='${basket.pickup_date}' `;
    //         query+=`,dropoff_date='${basket.dropoff_date}' `;
    //         query+=`,order_code='${rand.generateDigits(10)}' `;
    //         query+=`,updated_at=CURRENT_TIMESTAMP,created_at=CURRENT_TIMESTAMP `;
    //         let output = await DB.execute(query);
    //         return output;
                
    //     });



    //     return varible;

    // }


    //786
   
   
   
   
    static async ToRent(basket_id)
    {

     
        let basket = await Basket.GetRow(basket_id);        
        let query=`INSERT INTO ${this.table} `;
        query+=`SET type='new' `;
        query+=`,user_id='${basket.user_id}' `;
        query+=`,listing_id='${basket.listing_id}' `;
        query+=`,pickup_date='${basket.pickup_date}' `;
        query+=`,dropoff_date='${basket.dropoff_date}' `;
        query+=`,order_code='${rand.generateDigits(10)}' `;
        query+=`,updated_at=CURRENT_TIMESTAMP,created_at=CURRENT_TIMESTAMP `;
        let output = await DB.execute(query);
        return output;
    

    } 

    
   

     //786
     static async ToGrant(wish_id)
     {
         let query=`UPDATE ${this.table} SET `;
         query+=`type='progress' `;
         query+=`,updated_at=CURRENT_TIMESTAMP `;
         query+=`WHERE ${this.table}.id='${wish_id}' `;        
         let output = await DB.execute(query);
         return output;
         
     } 
 



    //786
    static async Decline(wish_id,reason)
    {
         let query=`UPDATE ${this.table} SET `;
         query+=`type='declined' `;
         query+=`,declined_reason='${reason}' `;
         query+=`,updated_at=CURRENT_TIMESTAMP `;
         query+=`WHERE ${this.table}.id='${wish_id}' `;        
         let output = await DB.execute(query);
         return output;
         
     } 


     






    //786
    static async OwnerNew(locale,user_id)
    {
      
        let url = Image.Url('listing/l/');
        const placeholder = Image.Placeholder('l','listing');
  
        
        let query=`SELECT listings.id ,listings.name `;
        query+=`,${this.table}.id  AS wish_id `;
        query+=`,brands.${locale}_name AS brand `;
        query+=`,categories.${locale}_name AS category `;

        query+=`,CONCAT(renters.fname,' ',renters.lname) AS renter `;
        query+=`,IF(renters.phone IS NULL,'',renters.phone) AS phone `;
        query+=`,IF(renters.email IS NULL,'',renters.email) AS email `;
        //query+=`,(SELECT CONCAT(users.fname,' ',users.lname) FROM users WHERE users.id=${this.table}.user_id) AS renter `;
        
        query+=`,${this.table}.order_code `;
        query+=`,'Pending Acceptance' AS status `;
        query+=`,DATE_FORMAT(${this.table}.created_at,'%d-%m-%Y') AS order_date `;
        query+=`,DATE_FORMAT(${this.table}.pickup_date,'%D %M, %Y') AS pickup_date `;
        query+=`,DATE_FORMAT(${this.table}.dropoff_date,'%D %M, %Y') AS dropoff_date `;
        query+=`,(listings.per_day_amount * timestampdiff(DAY,pickup_date,dropoff_date)) AS days_of_amount `;
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
        query+=`LEFT JOIN users ON users.id=listings.user_id `;
        query+=`LEFT JOIN users renters ON renters.id=${this.table}.user_id `;

        query+=`LEFT JOIN brands ON brands.id=listings.brand_id `;
        query+=`LEFT JOIN categories ON categories.id=listings.category_id `;
        query+=`WHERE listings.user_id='${user_id}' AND ${this.table}.type='new' AND listings.status='1' `;
        query+=`ORDER BY ${this.table}.id DESC `;
        
        return await DB.get(query);

    }

    


    static async OwnerDeclined(locale,user_id)
    {

        let url = Image.Url('listing/l/');
        const placeholder = Image.Placeholder('l','listing');
   
        let query=`SELECT listings.id ,listings.name `;
        query+=`,${this.table}.id  AS wish_id `;
        query+=`,brands.${locale}_name AS brand `;
        query+=`,categories.${locale}_name AS category `;
        
        query+=`,CONCAT(renters.fname,' ',renters.lname) AS renter `;
        query+=`,IF(renters.phone IS NULL,'',renters.phone) AS phone `;
        query+=`,IF(renters.email IS NULL,'',renters.email) AS email `;
        //query+=`,(SELECT CONCAT(users.fname,' ',users.lname) FROM users WHERE users.id=${this.table}.user_id) AS renter `;
        
        query+=`,${this.table}.order_code `;
        query+=`,'Wish declined' AS status ,declined_reason `;
        query+=`,DATE_FORMAT(${this.table}.created_at,'%d-%m-%Y') AS order_date `;
        query+=`,DATE_FORMAT(${this.table}.pickup_date,'%D %M, %Y') AS pickup_date `;
        query+=`,DATE_FORMAT(${this.table}.dropoff_date,'%D %M, %Y') AS dropoff_date `;
        query+=`,(listings.per_day_amount * timestampdiff(DAY,pickup_date,dropoff_date)) AS days_of_amount `;
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
        query+=`LEFT JOIN users ON users.id=listings.user_id `;
        query+=`LEFT JOIN users renters ON renters.id=${this.table}.user_id `;
        query+=`LEFT JOIN brands ON brands.id=listings.brand_id `;
        query+=`LEFT JOIN categories ON categories.id=listings.category_id `;

        query+=`WHERE listings.user_id='${user_id}' AND ${this.table}.type='declined' AND listings.status='1' `;
       
        query+=`ORDER BY ${this.table}.id DESC `;
        return await DB.get(query);

    }

    


    static async OwnerInProgress(locale,user_id)
    {
      
        let url = Image.Url('listing/l/');
        const placeholder = Image.Placeholder('l','listing');
  
        
        let query=`SELECT listings.id ,listings.name `;
        query+=`,${this.table}.id  AS wish_id `;
        query+=`,brands.${locale}_name AS brand `;
        query+=`,categories.${locale}_name AS category `;
        query+=`,CONCAT(renters.fname,' ',renters.lname) AS renter `;
        query+=`,IF(renters.phone IS NULL,'',renters.phone) AS phone `;
        query+=`,IF(renters.email IS NULL,'',renters.email) AS email `;
        //query+=`,(SELECT CONCAT(users.fname,' ',users.lname) FROM users WHERE users.id=${this.table}.user_id) AS renter `;
       
        query+=`,${this.table}.order_code `;
        query+=`,DATE_FORMAT(${this.table}.created_at,'%d-%m-%Y') AS order_date `;
        query+=`,DATE_FORMAT(${this.table}.pickup_date,'%D %M, %Y') AS pickup_date `;
        query+=`,DATE_FORMAT(${this.table}.dropoff_date,'%D %M, %Y') AS dropoff_date `;
        query+=`,(listings.per_day_amount * timestampdiff(DAY,pickup_date,dropoff_date)) AS days_of_amount `;
        query+=`,IF(${this.table}.type='collection','Ready For Collection','Wish Granted') AS status `;
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
        query+=`LEFT JOIN users ON users.id=listings.user_id `;
        query+=`LEFT JOIN users renters ON renters.id=${this.table}.user_id `;
        query+=`LEFT JOIN brands ON brands.id=listings.brand_id `;
        query+=`LEFT JOIN categories ON categories.id=listings.category_id `;
       
        query+=`WHERE listings.user_id='${user_id}' AND (${this.table}.type='progress' OR ${this.table}.type='collection') AND listings.status='1' `;
       
        query+=`ORDER BY ${this.table}.id DESC `;
        return await DB.get(query);




    }





    static async OwnerCompleted(locale,user_id)
    {

       
        const user_url = Image.Url('user/l/');
        const user_ph = Image.Placeholder('l','user');
        
        const listing_url = Image.Url('listing/l/');
        const listing_ph = Image.Placeholder('l','listing');
       
        let query=`SELECT listings.id  `;
        query+=`,${this.table}.id  AS wish_id `;
        query+=`,brands.${locale}_name AS brand `;
        query+=`,categories.${locale}_name AS category `;
       
        query+=`,CONCAT(renters.fname,' ',renters.lname) AS renter `;
        query+=`,IF(renters.phone IS NULL,'',renters.phone) AS phone `;
        query+=`,IF(renters.email IS NULL,'',renters.email) AS email `;
        query+=`,IF(renters.image IS NULL OR renters.image='','${user_ph}',CONCAT('${user_url}',renters.image) ) AS renter_image `;
       
        //query+=`,(SELECT CONCAT(users.fname,' ',users.lname) FROM users WHERE users.id=${this.table}.user_id) AS renter `;
        //query+=`,(SELECT IF(users.image IS NULL OR users.image='','${user_ph}',CONCAT('${user_url}',users.image) ) FROM users WHERE users.id=${this.table}.user_id) AS renter_image `;
         
        query+=`,${this.table}.order_code `;
        query+=`,'Wish completed' AS status `;
        query+=`,DATE_FORMAT(${this.table}.created_at,'%d-%m-%Y') AS order_date `;
        query+=`,DATE_FORMAT(${this.table}.pickup_date,'%D %M, %Y') AS pickup_date `;
        query+=`,DATE_FORMAT(${this.table}.dropoff_date,'%D %M, %Y') AS dropoff_date `;
        query+=`,(listings.per_day_amount * timestampdiff(DAY,pickup_date,dropoff_date)) AS days_of_amount `;
        query+=`,IF(listings.image is NULL OR listings.image='','${listing_ph}',CONCAT('${listing_url}',listings.image)) AS image_url `;
        query+=`,EXISTS( SELECT id FROM reviews WHERE reviews.user_id='${user_id}' AND  reviews.wishe_id=${this.table}.id AND reviews.type='renter') AS reviewed `;
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
        query+=`LEFT JOIN users ON users.id=listings.user_id `;
        query+=`LEFT JOIN users renters ON renters.id=${this.table}.user_id `;

        query+=`LEFT JOIN brands ON brands.id=listings.brand_id `;
        query+=`LEFT JOIN categories ON categories.id=listings.category_id `;
   
        query+=`WHERE listings.user_id='${user_id}' AND ${this.table}.type='completed' AND listings.status='1' `;
       
        query+=`ORDER BY ${this.table}.id DESC `;
        return await DB.get(query);


    
    }








    static async RenterNew(locale,user_id)
    {

        let url = Image.Url('listing/l/');
        const placeholder = Image.Placeholder('l','listing');
  

        let query=`SELECT listings.id ,listings.name `;
        query+=`,${this.table}.id  AS wish_id `;
        query+=`,brands.${locale}_name AS brand `;
        query+=`,categories.${locale}_name AS category `;
        query+=`,CONCAT(users.fname,' ',users.lname) AS owner `;
        query+=`,IF(users.phone IS NULL,'',users.phone) AS phone `;
        query+=`,IF(users.email IS NULL,'',users.email) AS email `;
        query+=`,${this.table}.order_code `;
        query+=`,'Wish pending acceptance' AS status `;

        query+=`,DATE_FORMAT(${this.table}.created_at,'%d-%m-%Y') AS order_date `;
        query+=`,DATE_FORMAT(${this.table}.pickup_date,'%D %M, %Y') AS pickup_date `;
        query+=`,DATE_FORMAT(${this.table}.dropoff_date,'%D %M, %Y') AS dropoff_date `;
        query+=`,(listings.per_day_amount * timestampdiff(DAY,pickup_date,dropoff_date)) AS days_of_amount `;
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
        query+=`LEFT JOIN users ON users.id=listings.user_id `;
        query+=`LEFT JOIN brands ON brands.id=listings.brand_id `;
        query+=`LEFT JOIN categories ON categories.id=listings.category_id `;

        query+=`WHERE ${this.table}.user_id='${user_id}' AND ${this.table}.type='new' AND listings.status='1' `;
       
        query+=`ORDER BY ${this.table}.id DESC `;
  
      
        return await DB.get(query);

        

         
        
    }
        
    



    
    static async RenterDeclined(locale,user_id)
    {

        let url = Image.Url('listing/l/');
        const placeholder = Image.Placeholder('l','listing');
  
        let query=`SELECT listings.id ,listings.name `;
        query+=`,${this.table}.order_code `;
        query+=`,${this.table}.id  AS wish_id `;
        query+=`,brands.${locale}_name AS brand `;
        query+=`,categories.${locale}_name AS category `;
        query+=`,CONCAT(users.fname,' ',users.lname) AS owner`;
        query+=`,IF(users.phone IS NULL,'',users.phone) AS phone `;
        query+=`,IF(users.email IS NULL,'',users.email) AS email `;
        query+=`,'Wish declined' AS status , declined_reason`; 
        query+=`,DATE_FORMAT(${this.table}.created_at,'%d-%m-%Y') AS order_date `;
        query+=`,DATE_FORMAT(${this.table}.pickup_date,'%D %M, %Y') AS pickup_date `;
        query+=`,DATE_FORMAT(${this.table}.dropoff_date,'%D %M, %Y') AS dropoff_date `;
        query+=`,(listings.per_day_amount * timestampdiff(DAY,pickup_date,dropoff_date)) AS days_of_amount `;
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
        query+=`LEFT JOIN users ON users.id=listings.user_id `;
        query+=`LEFT JOIN brands ON brands.id=listings.brand_id `;
        query+=`LEFT JOIN categories ON categories.id=listings.category_id `;

        query+=`WHERE ${this.table}.user_id='${user_id}' AND ${this.table}.type='declined' AND listings.status='1' `;
       
        query+=`ORDER BY ${this.table}.id DESC `;
        
        return await DB.get(query);


    }




    static async RenterAccepted(locale,user_id)
    {
      
        let url = Image.Url('listing/l/');
        const placeholder = Image.Placeholder('l','listing');
  
        let query=`SELECT listings.id ,listings.name `;
        query+=`,${this.table}.id  AS wish_id `;
        query+=`,brands.${locale}_name AS brand `;
        query+=`,categories.${locale}_name AS category `;
        query+=`,CONCAT(users.fname,' ',users.lname) AS owner`;
        query+=`,IF(users.phone IS NULL,'',users.phone) AS phone `;
        query+=`,IF(users.email IS NULL,'',users.email) AS email `;
        query+=`,${this.table}.order_code `;
        
        query+=`,DATE_FORMAT(${this.table}.created_at,'%d-%m-%Y') AS order_date `;
        query+=`,DATE_FORMAT(${this.table}.pickup_date,'%D %M, %Y') AS pickup_date `;
        query+=`,DATE_FORMAT(${this.table}.dropoff_date,'%D %M, %Y') AS dropoff_date `;
        query+=`,(listings.per_day_amount * timestampdiff(DAY,pickup_date,dropoff_date)) AS days_of_amount `;
        query+=`,IF(${this.table}.type='collection','Ready For Collection','Wish Granted') AS status `;
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
        query+=`LEFT JOIN users ON users.id=listings.user_id `;
        query+=`LEFT JOIN brands ON brands.id=listings.brand_id `;
        query+=`LEFT JOIN categories ON categories.id=listings.category_id `;

        query+=`WHERE ${this.table}.user_id='${user_id}' AND (${this.table}.type='progress' OR ${this.table}.type='collection') AND listings.status='1' `;
       
        query+=`ORDER BY ${this.table}.id DESC `;
        
        return await DB.get(query);



    }


    
    static async RenterCompleted(locale,user_id)
    {

            
        const user_url = Image.Url('user/l/');
        const user_ph = Image.Placeholder('l','user');
        
        const listing_url = Image.Url('listing/l/');
        const listing_ph = Image.Placeholder('l','listing');
        

        let query=`SELECT listings.id ,listings.name   `;
        query+=`,${this.table}.id  AS wish_id `;
        query+=`,brands.${locale}_name AS brand `;
        query+=`,categories.${locale}_name AS category `;
        query+=`,CONCAT(users.fname,' ',users.lname) AS owner`;
        query+=`,IF(users.phone IS NULL,'',users.phone) AS phone `;
        query+=`,IF(users.email IS NULL,'',users.email) AS email `;
        query+=`,IF(users.image IS NULL OR users.image='','${user_ph}',CONCAT('${user_url}',users.image) ) AS owner_image `;
        
        query+=`,${this.table}.order_code `;
        query+=`,'Wish completed' AS status `;

        query+=`,DATE_FORMAT(${this.table}.created_at,'%d-%m-%Y') AS order_date `;
        query+=`,DATE_FORMAT(${this.table}.pickup_date,'%D %M, %Y') AS pickup_date `;
        query+=`,DATE_FORMAT(${this.table}.dropoff_date,'%D %M, %Y') AS dropoff_date `;
        query+=`,(listings.per_day_amount * timestampdiff(DAY,pickup_date,dropoff_date)) AS days_of_amount `;
        query+=`,IF(listings.image is NULL OR listings.image='','${listing_ph}',CONCAT('${listing_url}',listings.image)) AS image_url `;
        query+=`,EXISTS( SELECT id FROM reviews WHERE reviews.user_id='${user_id}' AND  reviews.wishe_id=${this.table}.id AND reviews.type='owner') AS reviewed `;
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
        query+=`LEFT JOIN users ON users.id=listings.user_id `;
        query+=`LEFT JOIN brands ON brands.id=listings.brand_id `;
        query+=`LEFT JOIN categories ON categories.id=listings.category_id `;

        query+=`WHERE ${this.table}.user_id='${user_id}' AND ${this.table}.type='completed' AND listings.status='1' `;
       
        query+=`ORDER BY ${this.table}.id DESC `;
        
        return await DB.get(query);


    
    
    }










}

module.exports = Wishe;

var config = require('config');
var Image = require('./Image');
var DB = require('../config/Database');
const { query } = require('express-validator');


class User
{

    static pk=`id`;
    static table=`users`;
    
    static async ChangeLang(lang,user_id)
    {
        return await DB.get(`UPDATE ${this.table} SET lang='${lang}' WHERE ${this.pk}='${user_id}'`);
    }

    static async GetTokensAll()
    {
        return await DB.get(`SELECT device_token FROM ${this.table} WHERE device_token IS NOT NULL AND device_token!='undefined'`);
    }

    static async GetTokens(ids=[])
    {
        return  await DB.get(`SELECT device_token FROM ${this.table} WHERE  id IN (${ids.toString()})`);
    }

    static async GetTokensAll()
    {
        return await DB.get(`SELECT device_token FROM ${this.table} WHERE device_token IS NOT NULL AND device_token!='undefined'`);
    }


    static async first(selects=[],id)
    {
        return await DB.first(`SELECT id,${selects.toString()} FROM ${this.table} WHERE id='${id}' `);
    }

    static async Exists(id)
    {
        var db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE id='${id}' ) AS existing`);
        return db.existing;
    }    

    static async SocialIdExists(social_id)
    {
        var db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE social_id='${social_id}' ) AS existing`);
        return db.existing;
    }


    static async EmailCheck(email)
    {
        let check = await DB.first(`SELECT EXISTS(SELECT id FROM ${this.table} WHERE email='${email}' ) AS existing`);
        if(check.existing==1 || check.existing=='1'){return true;}else{return false;}
    }

    
    static async GetForListing()
    {
        const url = Image.Url('/user/s/');
        const placeholder = Image.Placeholder('s','user');
        let query=`SELECT users.id,users.email,users.status `;
        query+=`,CONCAT(users.fname,' ',users.lname) AS name `;
        query+=`,IF(users.gender='1','Male','Female') AS gender `;
        query+=`,(SELECT COUNT(id) FROM listings WHERE listings.user_id=users.id) AS no_of_items `;
        query+=`,EXISTS( SELECT id FROM web_notifications WHERE web_notifications.user_id=users.id AND web_notifications.type='wantpropics') AS is_propics `;
        //query+=`,(SELECT (SUM(user_rating) / COUNT(user_rating)) FROM reviews WHERE reviews.user_id=users.id) AS total_rating `;
        query+=`,IF(EXISTS(SELECT user_rating FROM reviews WHERE reviews.user_id=users.id)=1,(SELECT (SUM(user_rating) / COUNT(user_rating)) FROM reviews WHERE reviews.user_id=users.id),0)  AS overall_rating `;
        query+=`,IF(users.image IS NULL OR users.image='','${placeholder}',CONCAT('${url}',users.image) ) AS image_url `;
        query+=`FROM ${this.table} `;
        return  await DB.execute(query);   

    }


    static async SocialStore(user)
    {
        
        
        let query=`INSERT INTO ${this.table} `;
        query+=`SET is_social='1' `;
        //query+=`,lat='${user.lat}' `;
        //query+=`,lng='${user.lng}' `;
        query+=`,fname='${user.fname}' `;
        query+=`,lname='${user.lname}' `;
        query+=`,os_id='${user.os_id}' `;
        query+=`,social_id='${user.social_id}' `;
        query+=`,social_type='${user.social_type}' `;
        //query+=`,country_id='${user.country_id}' `;
        query+=`,device_token='${user.device_token}' `;
        //query+=`,full_address='${user.full_address}' `;
        //query+=`,social_avatar='${user.social_avatar}' `;
        query+=`,social_image='${user.social_image}' `;
        if(user.email){query+=`,email='${user.email}' `; }
        query+=`,created_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP `;
        let stored = await DB.execute(query); 
        if(!stored.insertId){return 0;}else{return stored.insertId;} 
    
    }
   
    static async SocialUpdate(user)
    {
        
        let query=`UPDATE ${this.table} `;
        query+=`SET is_social='1' `;
        // query+=`,lat='${user.lat}' `;
        // query+=`,lng='${user.lng}' `;
        query+=`,fname='${user.fname}' `;
        query+=`,lname='${user.lname}' `;
        query+=`,os_id='${user.os_id}' `;
        query+=`,social_id='${user.social_id}' `;
        query+=`,social_type='${user.social_type}' `;
        //query+=`,country_id='${user.country_id}' `;
        query+=`,device_token='${user.device_token}' `;
        //query+=`,full_address='${user.full_address}' `;
        //query+=`,social_avatar='${user.social_avatar}' `;
        if(user.email){query+=`,email='${user.email}' `; }
        query+=`,social_image='${user.social_image}' `;
        query+=`,updated_at=CURRENT_TIMESTAMP `;
        query+=`WHERE social_id='${user.social_id}' `;
        let updated = await DB.execute(query); 
        var first = await DB.first(`SELECT id FROM ${this.table} WHERE social_id='${user.social_id}'`);
        if(!first.id){return 0;}else{return first.id;} 
     


    }


    static async MachedPass(user_id,hashed_pass)
    {
        var db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE id='${user_id}' AND password='${hashed_pass}') AS existing`);
        return db.existing;
    }

    
    static async GetAllForNotification()
    {

       const url = Image.Url('/user/s/');
       const placeholder = Image.Placeholder('s','user');
       let query=`SELECT users.id,users.email,users.status `;
       query+=`,os.name AS os_name `;
       query+=`,CONCAT(users.fname,' ',users.lname) AS name `;
       query+=`,IF(users.gender='1','Male','Female') AS gender `;
       query+=`,IF(users.image IS NULL OR users.image='','${placeholder}',CONCAT('${url}',users.image) ) AS image_url `;
       query+=`FROM ${this.table} `;
       query+=`LEFT JOIN os ON os.id=users.os_id `;
       query+=`WHERE device_token IS NOT NULL AND device_token!='undefined'`;
       return await DB.get(query); 
        // return await DB.get(`SELECT id,CONCAT(' (',id,') ',fname,' ',lname) AS name,device_token FROM ${this.table} WHERE status='1' AND device_token IS NOT NULL AND device_token!='' `);
       
    }
    


    static async GetNotificationDataByParams(title,body,users_ids)
    {
        var query='SELECT device_token AS `to` ';
        query+=`,'${title}' AS title `;
        query+=`,'${body}' AS body `;
        query+=`FROM ${this.table} `;
        query+=`WHERE id IN(${users_ids}) AND notification_switch='1' `;    
        return await DB.get(query);    
    }

    
    static async ChangePass(user_id,hashed_pass)
    {
        return DB.execute(`UPDATE ${this.table} SET password='${hashed_pass}' WHERE id='${user_id}' `);
    }


    static async GetForView(id)
    {
         
        const url = Image.Url('listing/l/');
        const placeholder = Image.Placeholder('l','user');

        var query=`SELECT ${this.table}.id,email,phone,username,status `;
        query+=`,fname,lname,country_id,region_id,zipcode,full_address `;
        query+=`,IF(gender = '1','Male','Female') AS gender `;
        query+=`,IF(users.image IS NULL OR users.image='','${placeholder}',CONCAT('${url}',users.image) ) AS image_url `;
        query+=`FROM ${this.table} `;
        query+=`WHERE ${this.table}.id='${id}' `;    
        return await DB.first(query);    
            
    }    


    static async UpdateByAdmin(user)
    {
        let query=`UPDATE ${this.table} `;
        query+=`SET status='${user.status}' `;
        query+=`WHERE id='${user.id}' `;
        return await DB.execute(query); 
    }

    

    static find(id)
    {
        return DB.execute(`SELECT * FROM ${this.table} WHERE id=${'id'}`);
    }    

    static email(email)
    {
        return DB.execute(`SELECT EXISTS(SELECT id FROM ${this.table} WHERE email='${email}') AS exist `);
    }
   
    
    static id_email(id,email)
    {
        
        return DB.execute(`SELECT EXISTS(SELECT id FROM ${this.table} WHERE id != '${id}' AND email='${email}') AS exist`);
    }


    static async SetCountryRegion(user_id,country_id,region_id)
    {
        return await DB.execute(`UPDATE ${this.table} SET country_id='${country_id}',region_id='${region_id}' WHERE id='${user_id}'`);    
    }


    static update(user)
    {
        var SET="";
        if(user.fname){ SET+= "`fname`='"+user.fname+"' "; }
        if(user.lname){ SET+= ",`lname`='"+user.lname+" ' "; }
        if(user.email){ SET+= ",`email`='"+user.email+" "; }
        DB.execute(`UPDATE ${this.table} SET ${SET} WHERE id='${user.id}'`);
        return true;
    
    }



    
    static async GetAccountEdit(locale,user_id)
    {
        
        const url = Image.Url('user/l/');
        const placeholder = Image.Placeholder('l','user');
        
        var query=`SELECT ${this.table}.id `;
        query+=`,fname,lname,country_id,region_id,phone,zipcode,full_address `;
        //query+=`,IF(users.image IS NULL OR users.image='','${placeholder}',CONCAT('${url}',users.image) ) AS image_url `;
        query+=`,CASE WHEN is_social='1' AND social_image IS NOT NULL AND social_image!=''  THEN users.social_image WHEN users.image IS NOT NULL AND users.image!='' THEN CONCAT('${url}',users.image)  ELSE '${placeholder}' END AS image_url `;
        query+=`FROM ${this.table} `;
        query+=`WHERE ${this.table}.id='${user_id}' `;        
        return await DB.first(query);    

    }





    static async SetAccountUpdate(account)
    {

        var query=`UPDATE ${this.table} SET `;
        query+=`fname='${account.fname}' `;
        query+=`,lname='${account.lname}' `;
        query+=`,zipcode='${account.zipcode}' `;
        query+=`,region_id='${account.region_id}' `;
        query+=`,country_id='${account.country_id}' `;
        query+=`,full_address='${account.address}' `;

        if(account.imgsrc)
        {
           //let uploaded = await Image.SaveforUser(account.imgsrc);
           const imgname = await Image.Upload('user',image);
           let user = await DB.first(`SELECT id,image FROM ${this.table} WHERE id='${account.user_id}'`);
           let deleted = await Image.delete('user',user.image);
           query+=`,image='${uploaded}' `;
        }

        query+=`WHERE ${this.table}.id='${account.user_id}' `;
        return await DB.execute(query);    

    }


    

    
    static async GetForAccount(locale,user_id)
    {

        const url = Image.Url('user/l/');
        const placeholder = Image.Placeholder('l','user');
        var query=`SELECT ${this.table}.id `;
        query+=`,IF(AVG(reviews.user_rating)IS NULL,0,AVG(reviews.user_rating)) AS rating `;
        query+=`,fname,lname,email,phone,zipcode,full_address,region_id,${this.table}.country_id `;
        query+=`,regions.${locale}_name AS region `;
        query+=`,countries.${locale}_name AS country `;
        query+=`,IF(users.image IS NULL OR users.image='','${placeholder}',CONCAT('${url}',users.image) ) AS image_url `;
        query+=`FROM ${this.table} `;
        query+=`LEFT JOIN regions ON regions.id=${this.table}.region_id `;
        query+=`LEFT JOIN countries ON countries.id=${this.table}.country_id `;        
        query+=`LEFT JOIN wishes ON wishes.user_id='${user_id}' `;
        query+=`LEFT JOIN reviews ON reviews.wishe_id=wishes.id `;
        query+=`WHERE ${this.table}.id='${user_id}' `;
        return await DB.first(query);    

    }





    static profile(id)
    {

        const url = Image.Url('user/l/');
        const placeholder = Image.Placeholder('l','user');
        var query="SELECT ";
        query+="id,fname,lname,email,phone ";
        //query+=`,IF(users.image IS NULL OR users.image='','${placeholder}',CONCAT('${url}',users.image) ) AS image_url `;
        query+=`,CASE WHEN is_social='1' AND social_image IS NOT NULL AND social_image!=''  THEN users.social_image WHEN users.image IS NOT NULL AND users.image!='' THEN CONCAT('${url}',users.image)  ELSE '${placeholder}' END AS image_url `;
        query+=` FROM ${this.table} WHERE users.id='${id}' `;
        var dbuser = DB.first(query);    
        return dbuser;

    }

    
    static async TotalEarnings(id)
    {

        let query=`SELECT `;
        //query+=`SUM(listings.charges_amount * timestampdiff(DAY,pickup_date,dropoff_date)) AS totalearnings `;
        query+=`
        @days:=TIMESTAMPDIFF(DAY,pickup_date,dropoff_date) AS days 
        ,@weeks:=TIMESTAMPDIFF(WEEK,pickup_date,dropoff_date) AS weeks
        ,@months:=TIMESTAMPDIFF(MONTH,pickup_date,dropoff_date) AS months
        ,CASE
        WHEN @days < 7 THEN (@days * listings.per_day_amount) 
        WHEN @days > 0 AND @weeks > 0 AND @months=0  THEN 
        (@weeks * listings.per_week_amount) + ((@days - (@weeks * 7)) * listings.per_day_amount)  
        WHEN @days > 0 AND @weeks > 0 AND @months > 0 THEN 
        (@months * listings.per_month_amount)+((@weeks - @months * 4) * listings.per_week_amount) +(( @days -((@months * 30) + (@weeks - @months * 4) * 7) ) * listings.per_day_amount)
        ELSE 0 END as calculation `;
        
        query+=`FROM listings `;
        query+=`JOIN wishes ON wishes.listing_id=listings.id `;
        query+=`WHERE listings.user_id='${id}' AND wishes.type='completed' `;
        let data= await DB.get(query);
        let sum=0;
        if(typeof(data)!="object"){ return data;}
        else
        {
            data.forEach(row=>{ sum=sum+row.calculation; });
        }
        return sum;
        

        // let query=`SELECT `;
        // query+=`SUM(listings.charges_amount * timestampdiff(DAY,pickup_date,dropoff_date)) AS totalearnings `;
        // query+=`FROM listings `;
        // query+=`JOIN wishes ON wishes.listing_id=listings.id `;
        // query+=`WHERE listings.user_id='${id}' AND wishes.type='completed' `;
        // let db = await DB.first(query);
        // return db.totalearnings;
    
    }


    
    static async Login(id)
    {
        return DB.execute(`UPDATE ${this.table} SET is_login='1' WHERE ${this.pk}='${id}'`);
    }
    
    static async Logout(id)
    {
        return DB.execute(`UPDATE ${this.table} SET is_login='0' WHERE ${this.pk}='${id}'`);
    }


}

module.exports = User;

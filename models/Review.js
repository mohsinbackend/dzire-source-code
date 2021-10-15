var config = require('config');
var Image = require('./Image');
var DB = require('../config/Database');



class Review 
{

    static primarykey=`id`;
    static table=`reviews`;
    

    static async Exists(id)
    {
        var db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE id='${id}' ) AS existing`);
        return db.existing;
    }    


    
    static async TypeUserWishAlready(type,user_id,wishe_id)
    {
        var db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE  user_id='${user_id}' AND wishe_id='${wishe_id}' AND type='${type}' ) AS existing`);
        return db.existing;
    }


    static async GetForList()
    {

        let query=`SELECT ${this.table}.id,user_id `;
        query+=`,${this.table}.user_rating AS rating `;
        query+=`,${this.table}.user_review AS review `;
        query+=`,IF(${this.table}.type='owner','Renter','Rentee') AS type `;
        query+=`FROM ${this.table} `;
        //query+=`,user_id,CONCAT(users.fname,' ',users.lname) AS user_name `;
        //query+=`FROM ${this.table} JOIN users ON users.id=${this.table}.user_id `;
        return  await DB.get(query);

    }

    
    static async GetForView(id)
    {
        let query=`SELECT ${this.table}.id `;
        query+=`,user_rating,user_review `;
        query+=`,listing_rating,listing_review `;
        query+=`,CONCAT(fname,' ',lname) AS user `;
        query+=`FROM ${this.table} `;
        query+=`LEFT JOIN users ON users.id=${this.table}.user_id `;
        query+=`WHERE ${this.table}.id='${id}' `;
        return  await DB.first(query);
    }


    


    static async GetOwner(locale,user_id)
    {

        const url = Image.Url('listing/s/');
        const placeholder = Image.Placeholder('s','listing');

        let query=`SELECT reviews.id `;
        query+=`,user_rating,user_review `;
        query+=`,listing_rating,listing_review `;
        query+=`,listings.name ,brands.${locale}_name AS brand ,categories.${locale}_name AS category `;
        query+=`,IF(listings.image is NULL OR listings.image='','${placeholder}',CONCAT('${url}',listings.image)) AS image_url `;
        query+=`FROM wishes `;
        query+=`JOIN reviews ON reviews.wishe_id=wishes.id `;
        query+=`LEFT JOIN listings ON listings.id=wishes.listing_id `;
        query+=`LEFT JOIN brands ON brands.id=listings.brand_id `;
        query+=`LEFT JOIN categories ON categories.id=listings.category_id `;
        query+=`WHERE listings.user_id='${user_id}' AND reviews.type='owner' `;
        
        return  await DB.execute(query);


        

    }


    static async GetRenter(locale,user_id)
    {
        
        const url = Image.Url('listing/s/');
        const placeholder = Image.Placeholder('s','listing');

        let query=`SELECT reviews.id,user_rating,user_review `;
        query+=`,listings.name ,brands.${locale}_name AS brand ,categories.${locale}_name AS category `;
        query+=`,IF(listings.image is NULL OR listings.image='','${placeholder}',CONCAT('${url}',listings.image)) AS image_url `;
        query+=`FROM wishes `;
        query+=`JOIN reviews ON reviews.wishe_id=wishes.id `;
        query+=`LEFT JOIN listings ON listings.id=wishes.listing_id `;
        query+=`LEFT JOIN brands ON brands.id=listings.brand_id `;
        query+=`LEFT JOIN categories ON categories.id=listings.category_id `;
        query+=`WHERE wishes.user_id='${user_id}' AND reviews.type='renter' `;
        return  await DB.execute(query);    



    }







    static async SetOwner(obj)
    {
        let query=`INSERT INTO ${this.table} `;
        query+=`SET type='owner' `;
        query+=`,user_id='${obj.user_id}' `;
        query+=`,wishe_id='${obj.wishe_id}' `;
        query+=`,user_rating='${obj.user_rating}' `;
        query+=`,user_review='${obj.user_review}' `;
        query+=`,listing_rating='${obj.listing_rating}' `;
        query+=`,listing_review='${obj.listing_review}' `;
        query+=`,updated_at=CURRENT_TIMESTAMP `;
        query+=`,created_at=CURRENT_TIMESTAMP `;
        return  await DB.execute(query);    
    }
    


    

    static async SetRenter(obj)
    {
        let query=`INSERT INTO ${this.table} `;
        query+=`SET type='renter' `;
        query+=`,user_id='${obj.user_id}' `;
        query+=`,wishe_id='${obj.wishe_id}' `;
        query+=`,user_rating='${obj.user_rating}' `;
        query+=`,user_review='${obj.user_review}' `;
        query+=`,updated_at=CURRENT_TIMESTAMP `;
        query+=`,created_at=CURRENT_TIMESTAMP `;
        return  await DB.execute(query);    
    
    }

    

    static async Valid(type,user_id,wishe_id)
    {
        
        if(type=='Owner')
        {
            let query=`SELECT EXISTS(SELECT wishes.id FROM wishes `;
            query+=`LEFT JOIN listings ON listings.id = wishes.listing_id `;
            query+=`WHERE wishes.id='${wishe_id}' AND wishes.type='completed' `;
            query+=`AND wishes.user_id='${user_id}' ) AS existing `;
            var db = await DB.first(query);
            return db.existing;
        }

        

        if(type=='Renter')
        {
            let query=`SELECT EXISTS(SELECT wishes.id FROM wishes `;
            query+=`LEFT JOIN listings ON listings.id = wishes.listing_id `;
            query+=`WHERE wishes.id='${wishe_id}' AND wishes.type='completed' `;
            query+=`AND listings.user_id='${user_id}' ) AS existing `;
            var db = await DB.first(query);
            return db.existing;
        }



        if(type=='Listing')
        {
            let query=`SELECT EXISTS(SELECT wishes.id FROM wishes `;
            query+=`LEFT JOIN listings ON listings.id = wishes.listing_id `;
            query+=`WHERE wishes.id='${wishe_id}' AND wishes.type='completed' `;
            query+=`AND wishes.user_id='${user_id}' AND listings.status='1' ) AS existing `;
            var db = await DB.first(query);
            return db.existing;
        }
    

    }    





}

module.exports = Review;

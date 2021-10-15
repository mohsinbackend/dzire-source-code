var config = require('config');
var Image = require('./Image');
var DB = require('../config/Database');
var rand = require("random-key");
var helper = require('../config/Helper');
var AdminSettings = require('./AdminSettings');


class Listing
{
    


    static primarykey=`id`;
    static table=`listings`;
 
    static async Del(id)
    {
        return await DB.execute(`DELETE FROM ${this.table} WHERE id='${id}' `);
    } 

    static async DelWithImage(id)
    { 
        let listing =  await DB.first(`SELECT id,image FROM ${this.table} WHERE id='${id}' `);
        if(listing.id)
        { 
            let delimage = await Image.delete(`listing`,listing.image);  
            let dellisting = await this.Del(listing.id);
            return listing; 
        }
    }
    

    static async Find(id)
    { 
        return await DB.first(`SELECT * FROM ${this.table} WHERE id='${id}' `);
    }
    

    
    

    static async Exists(id)
    {
        var db = await DB.first(`SELECT EXISTS( SELECT id FROM listings WHERE id='${id}' ) AS exist`);
        return db.exist;
    }    

  
    static async GetTaxtOptions(local,user_id)
    {
        let dbamdin = await AdminSettings.GetPolicyInstructions(local)   
        let dbtext = await DB.first(`SELECT id,renting_policy,care_instructions FROM ${this.table} WHERE user_id='${user_id}' ORDER BY id DESC`);
        let renting_policy={use_default:dbamdin.renting_policy,use_previous:dbtext.renting_policy,create_new:''};
        let care_instructions={use_default:dbamdin.renting_policy,use_previous:dbtext.care_instructions,create_new:''};
        return {renting_policy,care_instructions};

    }



    static async GetRelatedById(locale,user_id,listing_id,limit,offset)
    {

        let url = Image.Url('listing/l/');
        const placeholder = Image.Placeholder('l','listing');
        let query=`SELECT listings.id,listings.name `;
        query+=`,brands.${locale}_name AS brand `;
        query+=`,categories.${locale}_name AS category `;
        query+=`,IF(listings.image is NULL OR listings.image='','${placeholder}',CONCAT('${url}',listings.image)) AS image_url `;
        query+=`,EXISTS( SELECT id FROM user_favorite_listings WHERE user_favorite_listings.listing_id = listings.id AND user_favorite_listings.user_id='${user_id}' AND user_favorite_listings.status='1') AS favorited `;

        query+=`FROM ${this.table} `;
        query+=`LEFT JOIN brands ON brands.id=listings.brand_id `;
        query+=`LEFT JOIN categories ON categories.id=listings.category_id `;
        query+=`LEFT JOIN subcategories ON subcategories.id=listings.subcategory_id `;
        query+=`WHERE subcategories.id IN (SELECT subcategory_id FROM ${this.table} WHERE id='${listing_id}') AND ${this.table}.status='1' `; 
        query+=`LIMIT ${limit} OFFSET ${offset} `; 
        return await DB.get(query);    

    }


    static async GetForOwnerNotifyByAdmin(id)
    {
        const url = Image.Url('listing/l/');
        const placeholder = Image.Placeholder('l','listing');
        let query=`SELECT ${this.table}.id,user_id `;
        query+=`,${this.table}.name `;
        query+=`,${this.table}.status `;
        query+=`,CONCAT(users.fname,' ',users.lname) AS owner `;
        query+=`,IF(${this.table}.status='1','Approved','Disapproved') AS status `;
        query+=`,IF(listings.image is NULL OR listings.image='','${placeholder}',CONCAT('${url}',listings.image)) AS image_url `;
        query+=`,users.device_token `;
        query+=`FROM ${this.table} `;
        query+=`LEFT JOIN users ON users.id=${this.table}.user_id `;
        query+=`WHERE ${this.table}.id='${id}' `;
        return await DB.first(query);
        
    }    



    static async GetForViewByAdmin(id)
    {

        const url = Image.Url('listing/l/');
        const placeholder = Image.Placeholder('l','listing');
        let query=`SELECT ${this.table}.id `;
        query+=`,${this.table}.name `;
        query+=`,${this.table}.status `;
        query+=`,${this.table}.location `;
        query+=`,${this.table}.charges_amount `;
        query+=`,${this.table}.deposit_amount `;
        query+=`,CONCAT(users.fname,' ',users.lname) AS owner `;
        query+=`,IF(listings.image is NULL OR listings.image='','${placeholder}',CONCAT('${url}',listings.image)) AS image_url `;
        query+=`FROM ${this.table} `;
        query+=`LEFT JOIN users ON users.id=${this.table}.user_id `;
        query+=`WHERE ${this.table}.id='${id}' `;
        return await DB.first(query);
        

    }    



    
    static async UpdateByAdmin(listing)
    {
        let query=`UPDATE ${this.table} `;
        query+=`SET status='${listing.status}' `;
        query+=`WHERE id='${listing.id}' `;
        return await DB.execute(query); 
    
    }




    static async IsOwner(obj)
    {
        var db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE id='${obj.listing_id}' AND user_id='${obj.user_id}'  ) AS existing`);
        return db.existing;
    }




    static async GetForListing()
    {

        const url = Image.Url('listing/s/');
        const placeholder = Image.Placeholder('s','listing');    
        let query=`SELECT ${this.table}.id `;
        query+=`,${this.table}.name `;
        query+=`,${this.table}.status `;
        query+=`,CONCAT(users.fname,' ',users.lname) AS owner `;
        query+=`,CONCAT(categories.${config.locale}_name,' -> ',subcategories.${config.locale}_name) AS category `;
        query+=`,IF(listings.image is NULL OR listings.image='','${placeholder}',CONCAT('${url}',listings.image)) AS image_url `;
        query+=`FROM ${this.table} `;
        query+=`LEFT JOIN users ON users.id=${this.table}.user_id `;
        query+=`LEFT JOIN categories ON categories.id=${this.table}.category_id `;
        query+=`LEFT JOIN subcategories ON subcategories.id=${this.table}.subcategory_id `;
        query+=`ORDER BY ${this.table}.id DESC `;
        return  await DB.get(query);    

    }



    static async GetNamesByLikeAlpha(alpha)
    {
       return  await DB.get(`SELECT name FROM ${this.table} WHERE status='1' AND name LIKE '%${alpha}%' `);
    }





    static async GetBySubcate(obj)
    {
        
        let url = Image.Url('listing/l/');
        const placeholder = Image.Placeholder('l','listing');
        let query=`SELECT listings.id,listings.name `;
        query+=`,brands.${obj.locale}_name AS brand `;
        query+=`,categories.${obj.locale}_name AS category `;
        query+=`,IF(listings.image is NULL OR listings.image='','${placeholder}',CONCAT('${url}',listings.image)) AS image_url `;
        query+=`,EXISTS( SELECT id FROM user_favorite_listings WHERE user_favorite_listings.listing_id = listings.id AND user_favorite_listings.user_id='${obj.user_id}' AND user_favorite_listings.status='1') AS favorited `;

        query+=`FROM ${this.table} `;
        query+=`LEFT JOIN brands ON brands.id=listings.brand_id `;
        query+=`LEFT JOIN categories ON categories.id=listings.category_id `;
        query+=`LEFT JOIN subcategories ON subcategories.id=listings.subcategory_id `;
        query+=`WHERE subcategories.id='${obj.subcate_id}' AND ${this.table}.status='1' `; 
        query+=`LIMIT ${obj.limit} OFFSET ${obj.listing_len} `; 
        
        return  await DB.get(query);    



    }

    




    static async ApiStore(listing)
    {

        //const image = await Image.SaveforListing(listing.images[0]);
        //return image;
        //return listing.images[0];

        let query=`INSERT INTO ${this.table} `;
        query+=`SET status='0' `;
        //query+=`,image=NULL `
        query+=`,name='${listing.name}' `;
        query+=`,user_id='${listing.user_id}' `;
        query+=`,size_id='${listing.size_id}' `;
        query+=`,color_id='${listing.color_id}' `;
        query+=`,brand_id='${listing.brand_id}' `;
        query+=`,condition_id='${listing.condition_id}' `;
        //query+=`,chargestype_id='${listing.chargestype_id}' `;
        query+=`,category_id='${listing.category_id}' `;
        query+=`,subcategory_id='${listing.subcategory_id}' `;
        query+=`,min_rent_days='${listing.min_rent_days}' `;
        query+=`,location='${listing.location}' `;
        query+=`,region_id='${listing.region_id}' `;
        query+=`,country_id='${listing.country_id}' `;
        query+=`,description='${listing.description}' `;
        query+=`,renting_policy='${listing.renting_policy}' `;
        query+=`,care_instructions='${listing.care_instructions}' `;
        query+=`,is_deposit='${listing.is_deposit}' `;
        query+=`,is_pay_return='${listing.is_pay_return}' `;
        query+=`,is_upon_pickup='${listing.is_upon_pickup}' `;
        query+=`,is_cash_collect='${listing.is_cash_collect}' `;
        //query+=`,charges_amount='${listing.charges_amount}' `;
        query+=`,deposit_amount='${listing.deposit_amount}' `;
        
        query+=`,per_day_amount='${listing.per_day_amount}' `;
        query+=`,per_week_amount='${listing.per_week_amount}' `;
        query+=`,per_month_amount='${listing.per_month_amount}' `;
        query+=`,purchase_amount='${listing.purchase_amount}' `;
        query+=`,created_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP `;
    
        let stored = await DB.execute(query);
          
        if(!stored.insertId || stored.insertId==undefined){ return 'something wrong insertId is undfinded.'; }
        else
        {
            listing.images.forEach(async (image,index)=>
            {
                if(index==0)
                { 
                    const imgname = await Image.Upload('listing',image);
                    let output = await DB.execute(`UPDATE ${this.table} SET image='${imgname}' WHERE id='${stored.insertId}' `);
                    
                }
                else
                {
                    const imgname = await Image.Upload('listing_gallery',image);
                    let output = await DB.execute(`INSERT INTO listing_images SET listing_id='${stored.insertId}',image='${imgname}' `);
                }
    
            });
          
        }

        return stored;
        


    }

    static async CheckItemWithBrandId(id){
        let query=`SELECT COUNT(${this.table}.id) as count `;
        query+=`FROM listings `;
        query+=`WHERE ${this.table}.brand_id='${id}'`;
        return  await DB.get(query);  
    }



    static async GetForAccount(locale,user_id,)
    {
      
        let url = Image.Url('listing/l/');
        const placeholder = Image.Placeholder('l','listing');
        
        let query=`SELECT ${this.table}.id`;
        query+=`,'1' AS favorited  `;
        query+=`,${this.table}.name `;
        query+=`,${this.table}.status `;
        query+=`,brands.${locale}_name AS brand `;
        query+=`,categories.${locale}_name AS category `;
        query+=`,IF(listings.image is NULL OR listings.image='','${placeholder}',CONCAT('${url}',listings.image)) AS image_url `;
        query+=`,( SELECT COUNT(reviews.listing_rating) FROM reviews LEFT JOIN wishes ON wishes.id=reviews.wishe_id WHERE wishes.listing_id=${this.table}.id ) AS reviews_count `;
        query+=`,( SELECT IF( AVG(reviews.listing_rating) IS NULL,0,AVG(reviews.listing_rating)) FROM reviews LEFT JOIN wishes ON wishes.id=reviews.wishe_id WHERE wishes.listing_id=${this.table}.id ) AS rating `;
        query+=`FROM listings `;
        query+=`LEFT JOIN brands ON brands.id=listings.brand_id `;       
        query+=`LEFT JOIN categories ON categories.id=listings.category_id `;
       
        query+=`WHERE listings.user_id='${user_id}' AND (listings.status='1' OR listings.status='0' ) `;
        
        return  await DB.get(query);    


    }



    
    static async GetFavourites(locale,user_id,)
    {
      
        let url = Image.Url('listing/l/');
        const placeholder = Image.Placeholder('l','listing');
        
        let query=`SELECT listings.id,listings.name ,'1' AS favorited `;
        
        query+=`,brands.${locale}_name AS brand `;
        query+=`,categories.${locale}_name AS category `;
        query+=`,IF(listings.image is NULL OR listings.image='','${placeholder}',CONCAT('${url}',listings.image)) AS image_url `;
 
        query+=`FROM user_favorite_listings ufl `;
        query+=`JOIN listings ON listings.id=ufl.listing_id `;
        query+=`LEFT JOIN brands ON brands.id=listings.brand_id `;
        query+=`LEFT JOIN categories ON categories.id=listings.category_id `;
        query+=`WHERE ufl.user_id='${user_id}' AND ufl.status='1' `;
        
        return  await DB.get(query);    


    }
    
    
    

    
    static async SetFavourite(user_id,listing_id)
    {
        var row = await DB.first(`SELECT id,status FROM user_favorite_listings WHERE user_id='${user_id}' AND listing_id='${listing_id}' `);
        
        if((row) && row.id!=undefined)
        { 
            let status = row.status==0 || row.status=='0' ? '1' : '0';
            let result = await DB.execute(`UPDATE user_favorite_listings SET status='${status}' WHERE id='${row.id}'`); 
        }
        else
        {
            let result = await DB.execute(`INSERT INTO user_favorite_listings SET user_id='${user_id}',listing_id='${listing_id}',status='1'`);
        }

        return  await DB.first(`SELECT status FROM user_favorite_listings WHERE user_id='${user_id}' AND listing_id='${listing_id}' `);

    }




    
    static async More(obj)
    {
        
        let data = await AdminSettings.GetColumn('listing_newly_more_limit');
        //let count=`SELECT COUNT(id) AS FROM ${this.table} WHERE listings.status='1'`;
        
        let listings=[];
        let url = Image.Url('listing/l/');
        const placeholder = Image.Placeholder('l','listing');
        let user = await DB.get(`SELECT id,country_id,region_id,city_id FROM users WHERE id='${obj.user_id}' `);
        
        let query=`SELECT listings.id ,listings.name `;
        query+=`,brands.${obj.locale}_name AS brand `;
        query+=`,categories.${obj.locale}_name AS category `;
        query+=`,IF(listings.image is NULL OR listings.image='','${placeholder}',CONCAT('${url}',listings.image)) AS image_url `;
        query+=`,EXISTS( SELECT id FROM user_favorite_listings WHERE user_favorite_listings.listing_id = listings.id AND user_favorite_listings.user_id='${user.id}' AND user_favorite_listings.status='1') AS favorited `;
      
        query+=`FROM ${this.table} `;
        query+=`LEFT JOIN brands ON brands.id=listings.brand_id `;
        query+=`LEFT JOIN categories ON categories.id=listings.category_id `;
        
         
        if(obj.type=='newly')
        { 
            listings = await DB.get(query+`WHERE listings.status='1' AND  listings.region_id='${user.region_id}' ORDER BY listings.id DESC LIMIT ${await AdminSettings.GetColumn('listing_newly_more_limit')}  `);
            if(typeof(listings)=='object' && listings.length==0)
            { 
                listings = await DB.get(query+`WHERE listings.status='1' ORDER BY listings.id DESC LIMIT ${await AdminSettings.GetColumn('listing_newly_more_limit')}`);
            }
        }
        
        
        if(obj.type=='recommend')
        { 
            
        

            let dbrecommendeds = await DB.get(query+` WHERE listings.subcategory_id 
            IN( SELECT subcategories.id FROM user_seen_listings
            JOIN listings ON listings.id = user_seen_listings.listing_id
            JOIN subcategories ON subcategories.id = listings.subcategory_id
            WHERE user_seen_listings.user_id='${obj.user_id}' GROUP BY subcategories.id)  AND  listings.status='1'  LIMIT ${await AdminSettings.GetColumn('listing_recommended_more_limit')} `);
           
                
            if(dbrecommendeds.length > 0 ){ return dbrecommendeds; }
            else
            {
                listings = await DB.get(query+` WHERE listings.status='1' AND listings.recommended= '1' ORDER BY listings.id DESC LIMIT ${await AdminSettings.GetColumn('listing_recommended_more_limit')} `)

            }
            



        }
        
        return  listings;
        

    }  







    static async Search(locale,user_id,sortby,filters)
    {

        let url = Image.Url('listing/l/');
        const placeholder = Image.Placeholder('l','listing');
        
        let query=`SELECT l.id ,l.name `;
        query+=`,brands.${locale}_name AS brand `;
        query+=`,categories.${locale}_name AS category `;
        query+=`,IF(l.image is NULL OR l.image='','${placeholder}',CONCAT('${url}',l.image)) AS image_url `;
        query+=`,EXISTS( SELECT id FROM user_favorite_listings ufl WHERE ufl.listing_id = l.id AND ufl.user_id='${user_id}' AND ufl.status='1') AS favorited `;
        query+=`,l.per_day_amount AS price `;
       

        query+=`FROM listings l `;
        query+=`LEFT JOIN users ON users.id=l.user_id `;
        query+=`LEFT JOIN brands ON brands.id=l.brand_id `;
        query+=`LEFT JOIN categories ON categories.id = l.category_id `;
        query+=`LEFT JOIN subcategories ON subcategories.id=l.subcategory_id `;
        query+=`LEFT JOIN user_seen_listings ON user_seen_listings.listing_id=l.id `;
       
        query+=`WHERE l.status='1' `;
        if(filters.keyword){ query+=`AND l.name LIKE '${filters.keyword}'`; }
        if(filters.size_id){ query+=`AND l.size_id = '${filters.size_id}' `; }
        if(filters.color_id){ query+=`AND l.color_id = '${filters.color_id}' `; }
        if(filters.brand_id){ query+=`AND l.brand_id = '${filters.brand_id}' `; }
        if(filters.category_id){ query+=`AND l.category_id = '${filters.category_id}' `; }
        if(filters.subcategory_id){ query+=`AND l.subcategory_id = '${filters.subcategory_id}' `; }
        if(filters.min && filters.max){ query+=`AND l.charges_amount BETWEEN '${filters.min}' AND '${filters.max}'  `; }
        
        query+="GROUP BY l.id ";

        switch(sortby)
        {
            case 'newest' : query+="ORDER BY l.id DESC "; break;
            case 'low_to_high' : query+="ORDER BY l.per_day_amount ASC "; break;
            case 'high_to_low' : query+="ORDER BY l.per_day_amount DESC "; break;
            case 'most_popular' : query+="ORDER BY user_seen_listings.seen_count DESC "; break;
            default:  break;
        }

        return await DB.get(query); 


    }    


    


    static async GetDetail(locale,user_id,listing_id)
    {

        const url = Image.Url('listing/l/');
        const gallery_url = Image.Url('listing_gallery/l/');
        const placeholder = Image.Placeholder('l','listing');

        let query=`SELECT listings.id `;
        
        query+=`,listings.user_id `;
        query+=`,listings.featured `;
        query+=`,AVG(reviews.listing_rating) AS rating `;
        query+=`,COUNT(reviews.id) AS total_rating `;
        query+=`,IF(listings.user_id='${user_id}','1','0') AS owner `;
        
        //query+=`,listings.deposit_amount ,listings.charges_amount `;
        query+=`,per_day_amount,per_week_amount,per_month_amount,purchase_amount,deposit_amount `;
        //query+=`,IF(chargetypes.${locale}_name IS NULL,'',chargetypes.${locale}_name) AS chargetype `;
        
 
        query+=`,IF(listings.name IS NULL,'',listings.name) AS name `;
        query+=`,IF(users.email IS NULL,'',users.email) AS email `;
        query+=`,IF(users.phone IS NULL,'',users.phone) AS phone `;
        query+=`,IF(listings.about IS NULL,'',listings.about) AS about `;
        query+=`,IF(listings.location IS NULL,'',listings.location) AS location `;
        query+=`,min_rent_days,is_deposit,is_pay_return,is_upon_pickup,is_cash_collect  `;
        query+=`,IF(listings.description IS NULL,'',listings.description) AS description `;
        query+=`,IF(listings.renting_policy IS NULL,'',listings.renting_policy) AS renting_policy `;
        query+=`,IF(listings.care_instructions IS NULL,'',listings.care_instructions) AS care_instructions `;

        query+=`,IF(sizes.${locale}_name IS NULL,'',sizes.${locale}_name) AS size `;
        query+=`,IF(colors.${locale}_name IS NULL,'',colors.${locale}_name) AS color `;
        query+=`,IF(brands.${locale}_name IS NULL,'',brands.${locale}_name) AS brand `;
        query+=`,IF(regions.${locale}_name IS NULL,'',regions.${locale}_name) AS region `;
        query+=`,IF(categories.${locale}_name IS NULL,'',categories.${locale}_name) AS category `;
        query+=`,IF(conditions.${locale}_name IS NULL,'',conditions.${locale}_name) AS 'condition' `;
        
        query+=`,( SELECT GROUP_CONCAT(pickup_date) FROM wishes WHERE listing_id='${listing_id}' AND type='progress' ) AS pickup_min_date `;
        query+=`,( SELECT GROUP_CONCAT(dropoff_date) FROM wishes WHERE listing_id='${listing_id}' AND type='progress' ) AS dropoff_dates `;
        query+=`,IF(listings.image is NULL OR listings.image='','${placeholder}',CONCAT('${url}',listings.image)) AS image_url `;
        query+=`,EXISTS( SELECT id FROM baskets WHERE baskets.user_id='${user_id}' AND baskets.listing_id='${listing_id}') AS is_basket_at `;
        query+=`,EXISTS( SELECT id FROM user_favorite_listings WHERE user_favorite_listings.listing_id='${listing_id}' AND user_favorite_listings.user_id='${user_id}' AND user_favorite_listings.status='1') AS favorited `;
        query+=`,CONCAT(IF(listings.image is NULL OR listings.image='','${placeholder}',CONCAT('${url}',listings.image)),',',GROUP_CONCAT('${gallery_url}',listing_images.image)) AS gallery_urls `;
        //query+=`,(SELECT  CONCAT('[',GROUP_CONCAT('{','pick:',pickup_date,',','drop:',dropoff_date,'}'),']')  AS dats_array FROM wishes WHERE listing_id='${listing_id}' AND wishes.type='progress' OR wishes.type='collection') AS dates_array `;
        //query+=`,(SELECT  GROUP_CONCAT('{''pick:',pickup_date,',','drop:',dropoff_date,'}@')  AS data FROM wishes WHERE listing_id='${listing_id}' AND wishes.type='progress' OR wishes.type='collection' ) AS dates_array `;
        query+=`,(SELECT  GROUP_CONCAT(pickup_date,'@',dropoff_date)  AS data FROM wishes WHERE listing_id='${listing_id}' AND wishes.type='progress' OR wishes.type='collection' ) AS dates_array `;
        

    
        query+=`FROM listings `;
        query+=`LEFT JOIN users ON users.id=listings.user_id `;
        query+=`LEFT JOIN sizes ON sizes.id=listings.size_id `;
        query+=`LEFT JOIN colors ON colors.id=listings.color_id `;
        query+=`LEFT JOIN brands ON brands.id=listings.brand_id `;
        query+=`LEFT JOIN categories ON categories.id=listings.category_id `;
        query+=`LEFT JOIN conditions ON conditions.id=listings.condition_id `;
        //query+=`LEFT JOIN chargetypes ON chargetypes.id=listings.chargestype_id `;
        query+=`LEFT JOIN wishes ON wishes.listing_id=listings.id `;
        query+=`LEFT JOIN reviews ON reviews.wishe_id=wishes.id `;
        query+=`LEFT JOIN regions ON regions.id=listings.region_id `;
        query+=`LEFT JOIN listing_images ON listing_images.listing_id=listings.id `;
       
        query+=`WHERE listings.id =${listing_id} `;


        
        let detail = await DB.first(query);
        
        let array=[];
        if(detail.dates_array && detail.dates_array!=null)
        {
            detail.dates_array.split(',').forEach(str=>{ let arr=str.split('@'); array.push({'pick':arr[0],'drop':arr[1]}); });
        }
        detail.dates_array=array;  
        return detail;

        ///return await DB.first(query);


    }


    
    static async GetForAppDashboard(locale,user_id)
    {
       
        let listings={};
        listings.newlyaddes=[];
        listings.recommendeds=[];
        let url = Image.Url('listing/l/');
        const placeholder = Image.Placeholder('l','listing');
        
        let query=`SELECT listings.id ,listings.name `;
        query+=`,brands.${locale}_name AS brand `;
        query+=`,categories.${locale}_name AS category `;
        query+=`,IF(listings.image is NULL OR listings.image='','${placeholder}',CONCAT('${url}',listings.image)) AS image_url `;
        query+=`,EXISTS( SELECT id FROM user_favorite_listings WHERE user_favorite_listings.listing_id = listings.id AND user_favorite_listings.user_id='${user_id}' AND user_favorite_listings.status='1') AS favorited `;
      
        query+=`FROM listings `;
        query+=`LEFT JOIN brands ON brands.id=listings.brand_id `;
        query+=`LEFT JOIN categories ON categories.id=listings.category_id `;
       
        let user={};
        if(user_id!=0 && user_id!='0'){user= await DB.first(`SELECT region_id FROM users WHERE id='${user_id}'`);}

        
        let listcheck={};
        if(user.region_id!=0 && user.region_id!='0'){listcheck= await DB.first(`SELECT COUNT(id) AS count FROM ${this.table} WHERE region_id='${user.region_id}'`); }
       

       
        let dbnewlyaddes=[];
        let dbrecommendeds=[];
        if(!listcheck.count || listcheck.count==0)
        {  
            dbnewlyaddes = await DB.get(query+` WHERE listings.status='1' ORDER BY listings.id LIMIT ${await AdminSettings.GetColumn('listing_newly_more_limit')} `);        
            dbrecommendeds = await DB.get(query+` WHERE listings.subcategory_id 
            IN( SELECT subcategories.id FROM user_seen_listings
            JOIN listings ON listings.id = user_seen_listings.listing_id
            JOIN subcategories ON subcategories.id = listings.subcategory_id
            WHERE user_seen_listings.user_id='${user_id}' GROUP BY subcategories.id
            )  AND  listings.status='1' LIMIT ${await AdminSettings.GetColumn('listing_recommended_more_limit')} `);
        
        }
        else
        {


            dbnewlyaddes = await DB.get(query+` WHERE listings.status='1' AND (listings.country_id='${user.country_id}' OR listings.region_id='${user.region_id}') 
            ORDER BY listings.id LIMIT ${await AdminSettings.GetColumn('listing_newly_more_limit')} `);             
            dbrecommendeds = await DB.get(query+` WHERE listings.subcategory_id 
            IN( SELECT subcategories.id FROM user_seen_listings
            JOIN listings ON listings.id = user_seen_listings.listing_id
            JOIN subcategories ON subcategories.id = listings.subcategory_id
            WHERE user_seen_listings.user_id='${user_id}' GROUP BY subcategories.id
            )  AND listings.status='1' AND (listings.country_id='${user.country_id}' OR listings.region_id='${user.region_id}')  LIMIT ${await AdminSettings.GetColumn('listing_recommended_more_limit')} `);
        
        }


        
        //return dbnewlyaddes;
        if(dbnewlyaddes.length > 0)
        {
            const min=0;
            const max=dbnewlyaddes.length - 1;
            //listings.newlyaddes.push(dbnewlyaddes[helper.randomDigitRange(0,19)]);
            //listings.newlyaddes.push(dbnewlyaddes[helper.randomDigitRange(0,19)]);    
            listings.newlyaddes.push(dbnewlyaddes[helper.randomDigitRange(min,max)]);
            listings.newlyaddes.push(dbnewlyaddes[helper.randomDigitRange(min,max)]);    
        
        }


        if(dbrecommendeds.length > 0)
        {
            const min=0;
            const max=dbrecommendeds.length - 1;
            listings.recommendeds.push(dbrecommendeds[helper.randomDigitRange(min,max)]);
            listings.recommendeds.push(dbrecommendeds[helper.randomDigitRange(min,max)]);
        }
        else
        {
            let dbrecommendeds = await DB.get(query+` WHERE listings.status='1' AND listings.recommended= '1' ORDER BY listings.id DESC LIMIT 20 `);  
            if(dbrecommendeds.length > 0)
            {
                const min=0;
                const max=dbrecommendeds.length - 1;
                listings.recommendeds.push(dbrecommendeds[helper.randomDigitRange(min,max)]);
                listings.recommendeds.push(dbrecommendeds[helper.randomDigitRange(min,max)]);
            }

        }

        
        
        return listings;


    }  





    // static async GetForAppDashboard(locale,user_id)
    // {
        
    //     let listings={};
    //     listings.newlyaddes=[];
    //     listings.recommendeds=[];
    //     let url = Image.Url('listing/l/');
    //     const placeholder = Image.Placeholder('l','listing');
        
    //     let query=`SELECT listings.id ,listings.name `;
    //     query+=`,brands.${locale}_name AS brand `;
    //     query+=`,categories.${locale}_name AS category `;
    //     query+=`,IF(listings.image is NULL OR listings.image='','${placeholder}',CONCAT('${url}',listings.image)) AS image_url `;
    //     query+=`,EXISTS( SELECT id FROM user_favorite_listings WHERE user_favorite_listings.listing_id = listings.id AND user_favorite_listings.user_id='${user_id}' AND user_favorite_listings.status='1') AS favorited `;
      
    //     query+=`FROM listings `;
    //     query+=`LEFT JOIN brands ON brands.id=listings.brand_id `;
    //     query+=`LEFT JOIN categories ON categories.id=listings.category_id `;
       
    //     let user={};
    //     if(user_id!=0 && user_id!='0'){user= await DB.first(`SELECT country_id,region_id FROM users WHERE id='${user_id}'`);}

    //     let listcheck={};
    //     if(user.country_id!=0 || user.region_id!=0){listcheck= await DB.first(`SELECT COUNT(id) AS count FROM ${this.table} WHERE country_id='${user.country_id}' OR region_id='${user.region_id}'`); }
        
       
    //     let dbnewlyaddes=[];
    //     let dbrecommendeds=[];
    //     if(!listcheck.count || listcheck.count==0)
    //     {  
    //         dbnewlyaddes = await DB.get(query+` WHERE listings.status='1' ORDER BY listings.id LIMIT ${await AdminSettings.GetColumn('listing_newly_more_limit')} `);        
    //         dbrecommendeds = await DB.get(query+` WHERE listings.subcategory_id 
    //         IN( SELECT subcategories.id FROM user_seen_listings
    //         JOIN listings ON listings.id = user_seen_listings.listing_id
    //         JOIN subcategories ON subcategories.id = listings.subcategory_id
    //         WHERE user_seen_listings.user_id='${user_id}' GROUP BY subcategories.id
    //         )  AND  listings.status='1' LIMIT ${await AdminSettings.GetColumn('listing_recommended_more_limit')} `);
        
    //     }
    //     else
    //     {


    //         dbnewlyaddes = await DB.get(query+` WHERE listings.status='1' AND (listings.country_id='${user.country_id}' OR listings.region_id='${user.region_id}') 
    //         ORDER BY listings.id LIMIT ${await AdminSettings.GetColumn('listing_newly_more_limit')} `);             
    //         dbrecommendeds = await DB.get(query+` WHERE listings.subcategory_id 
    //         IN( SELECT subcategories.id FROM user_seen_listings
    //         JOIN listings ON listings.id = user_seen_listings.listing_id
    //         JOIN subcategories ON subcategories.id = listings.subcategory_id
    //         WHERE user_seen_listings.user_id='${user_id}' GROUP BY subcategories.id
    //         )  AND listings.status='1' AND (listings.country_id='${user.country_id}' OR listings.region_id='${user.region_id}')  LIMIT ${await AdminSettings.GetColumn('listing_recommended_more_limit')} `);
        
    //     }


        
    //     //return dbnewlyaddes;
    //     if(dbnewlyaddes.length > 0)
    //     {
    //         const min=0;
    //         const max=dbnewlyaddes.length - 1;
    //         //listings.newlyaddes.push(dbnewlyaddes[helper.randomDigitRange(0,19)]);
    //         //listings.newlyaddes.push(dbnewlyaddes[helper.randomDigitRange(0,19)]);    
    //         listings.newlyaddes.push(dbnewlyaddes[helper.randomDigitRange(min,max)]);
    //         listings.newlyaddes.push(dbnewlyaddes[helper.randomDigitRange(min,max)]);    
        
    //     }


    //     if(dbrecommendeds.length > 0)
    //     {
    //         const min=0;
    //         const max=dbrecommendeds.length - 1;
    //         listings.recommendeds.push(dbrecommendeds[helper.randomDigitRange(min,max)]);
    //         listings.recommendeds.push(dbrecommendeds[helper.randomDigitRange(min,max)]);
    //     }
    //     else
    //     {
    //         let dbrecommendeds = await DB.get(query+` WHERE listings.status='1' AND listings.recommended= '1' ORDER BY listings.id DESC LIMIT 20 `);  
    //         if(dbrecommendeds.length > 0)
    //         {
    //             const min=0;
    //             const max=dbrecommendeds.length - 1;
    //             listings.recommendeds.push(dbrecommendeds[helper.randomDigitRange(min,max)]);
    //             listings.recommendeds.push(dbrecommendeds[helper.randomDigitRange(min,max)]);
    //         }

    //     }

        
        
    //     return listings;


    // }  




}


module.exports = Listing;

var config = require('config');
var DB = require('../config/Database');

const webpush = require('web-push');
const Admin = require('./Admin');

const publicVapidKey="BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo";
const privateVapidKey="3KzvKasA2SoCxsp0iIG_o9B0Ozvl1XDwI63JRKNIWBM";
webpush.setVapidDetails("mailto:test@test.com",publicVapidKey,privateVapidKey);


class WebNotify
{
  
    static primarykey=`id`;
    static table=`web_notifications`;

    static async Exists(id)
    {
        var db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE id='${id}' ) AS existing`);
        return db.existing;
    }    

    static async CountSeen()
    {
        let db =  await DB.first(`SELECT COUNT(id) as count FROM ${this.table} WHERE seen='0'`);
        return db.count;
    }

    static async SetSeen(id)
    {
        return await DB.execute(`UPDATE ${this.table} SET seen='1' WHERE id='${id}'`);
    }

    static async Deleting(id)
    {
        return await DB.execute(`DELETE FROM ${this.table} WHERE id='${id}'`);
    }

    static async Store(obj)
    {
        let query=`INSERT INTO ${this.table} `;
        query+=`SET user_id='${obj.user_id}' `;
        query+=`,type='${obj.type}' `;
        query+=`,title='${obj.title}' `;
        query+=`,body='${obj.body}' `;
        query+=`,updated_at=CURRENT_TIMESTAMP,created_at=CURRENT_TIMESTAMP`;
        return await DB.execute(query);
    }

    static async View(id)
    {
        let query=`SELECT ${this.table}.id `;
        query+=`,${this.table}.seen,${this.table}.title,${this.table}.body`;
        query+=`,CONCAT(users.fname,' ',users.lname) AS sender `;
        query+=`,DATE_FORMAT(${this.table}.created_at,'%r %D %M') AS time `;
        query+=`FROM ${this.table} `;
        query+=`LEFT JOIN users ON users.id=${this.table}.user_id `;
        query+=`WHERE ${this.table}.id='${id}' `;
        return await DB.first(query);
    }


    static async Listing(filter)
    {
        let query=`SELECT ${this.table}.id `;
        query+=`,${this.table}.seen,${this.table}.title `;
        query+=`,CONCAT(users.fname,' ',users.lname) AS sender `;
        query+=`,DATE_FORMAT(${this.table}.created_at,'%r %D %M') AS time `;
        //query+=`,(CASE WHEN TIMESTAMPDIFF(SECOND, NOW(), ${this.table}.created_at) * -1 < 60 THEN CONCAT( TIMESTAMPDIFF(SECOND, NOW(), ${this.table}.created_at) * -1, ' SECONDS AGO') WHEN TIMESTAMPDIFF(SECOND, NOW(), ${this.table}.created_at) * -1 >= 60 && TIMESTAMPDIFF(SECOND, NOW(), ${this.table}.created_at) * -1 < 3600 THEN CONCAT( TIMESTAMPDIFF(MINUTE, NOW(), ${this.table}.created_at) * -1, ' MINUTES AGO') WHEN TIMESTAMPDIFF(SECOND, NOW(), ${this.table}.created_at) * -1 >= 3600 && TIMESTAMPDIFF(SECOND, NOW(), ${this.table}.created_at) * -1 < 86400 THEN CONCAT( TIMESTAMPDIFF(HOUR, NOW(), ${this.table}.created_at) * -1, ' HOURS AGO') WHEN TIMESTAMPDIFF(SECOND, NOW(), ${this.table}.created_at) * -1 >= 86400 && TIMESTAMPDIFF(SECOND, NOW(), ${this.table}.created_at) * -1 < 2628000 THEN CONCAT( TIMESTAMPDIFF(DAY, NOW(), ${this.table}.created_at) * -1, ' DAYS AGO') WHEN TIMESTAMPDIFF(SECOND, NOW(), ${this.table}.created_at) * -1 >= 86400 && TIMESTAMPDIFF(SECOND, NOW(), ${this.table}.created_at) * -1 < 31540000 THEN CONCAT( TIMESTAMPDIFF(MONTH, NOW(), ${this.table}.created_at) * -1, ' MONTHS AGO') WHEN TIMESTAMPDIFF(SECOND, NOW(), ${this.table}.created_at) * -1 >= 31540000 THEN CONCAT( TIMESTAMPDIFF(YEAR, NOW(), ${this.table}.created_at) * -1, ' YEARS AGO') ELSE 'N/A' END ) AS agotime, TIMESTAMPDIFF(SECOND, NOW(), ${this.table}.created_at) AS timePassedInSec `;
        query+=`FROM ${this.table} `;
        query+=`LEFT JOIN users ON users.id=${this.table}.user_id `;
        query+=`ORDER BY ${this.table}.id DESC `;
        return await DB.get(query);
    }


    static async GetSubscription(admin_id)
    {
        let admin = await DB.first(`SELECT web_notify_subscribe FROM admins WHERE id='${admin_id}' `);
        return JSON.parse(admin.web_notify_subscribe);
   
    }

    static async SetSubscription(subscription)
    {
               
        // Send 201 - resource created
         //res.status(201).json({});
        // Create payload
        //const payload = JSON.stringify({ title: "Push Test" });
        // Pass object into sendNotification
        //webpush.sendNotification(subscription,payload).catch(err => console.error(err));
        return await DB.execute(`UPDATE admins SET web_notify_subscribe='${JSON.stringify(subscription)}' WHERE id='1' `);
    
    }  

    static async Send(notify)
    {
        let subscription = await this.GetSubscription(1);
        const icon_url=`${config.url}/assets/img/logo.png`;
        //const icon_url=`https://d3nmt5vlzunoa1.cloudfront.net/phpstorm/files/2015/10/large_v-trans.png`;
        const payload = JSON.stringify({title:notify.title,body:notify.body,icon:icon_url});
        return webpush.sendNotification(subscription,payload).catch(err => console.error(err));
    }



}



module.exports = WebNotify;

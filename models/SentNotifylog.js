var DB = require('../config/Database');

class SentNotifylog
{
    
    static primarykey=`id`;
    static table=`sent_notifications_logs`;

    static async Exists(id)
    {
        const db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE id='${id}' ) AS existing`);
        return db.existing;
    }    

    static async List()
    {
        return DB.get(`SELECT id,title,body,no_of_sent,DATE_FORMAT(created_at,'%r %D %M %Y') AS sent_at FROM ${this.table} `);
    }

    static async Store(notify)
    {
        return DB.execute(`INSERT INTO ${this.table} SET title='${notify.title}',body='${notify.body}',no_of_sent='${notify.no_of_sent}',created_at=CURRENT_TIMESTAMP `);
    }



}

module.exports = SentNotifylog;

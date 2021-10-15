var config = require('config');
var DB = require('../config/Database');

class AdminSettings
{
    
    static id=`id`;
    static table=`admin_settings`;
    

    static async exists(id)
    {
        let db = await DB.first(`SELECT EXISTS( SELECT id FROM ${this.table} WHERE id='${id}' ) AS existing`);
        return db.existing;
    }

    static async GetColumn(column)
    {
        let db = await DB.first(`SELECT ${column} FROM ${this.table} `);   
        return db[column];
    }

    static async GetAll()
    {
        return await DB.first(`SELECT * FROM ${this.table} `);   
        
    }

    static async SetAll(setting)
    {
        let query=`UPDATE ${this.table} `;
        query+=`SET listing_newly_more_limit='${setting.listing_newly_more_limit}' `;
        query+=`,en_renting_policy='${setting.en_renting_policy}' `;
        query+=`,en_care_instructions='${setting.en_care_instructions}' `;
        query+=`,listing_recommended_more_limit='${setting.listing_recommended_more_limit}' `;
        return await DB.execute(query);
        
    }


    static async GetPolicyInstructions(locale)
    {
        let query=`SELECT `;
        query+=`${locale}_renting_policy AS renting_policy `;
        query+=`,${locale}_care_instructions AS care_instructions `;
        query+=`FROM ${this.table} `;
        return await DB.first(query);   
    }



    


}

module.exports = AdminSettings;

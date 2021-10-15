var DB = require('../config/Database');


class Language
{

    static pk=`keyid`;
    static table=`languages`;
 
    
    static async One(keyid,locale)
    {
       return (await DB.first(`SELECT ${locale} AS text FROM ${this.table} WHERE ${this.pk}='${keyid}' `)).text;
    }   


    

}

module.exports = Language;

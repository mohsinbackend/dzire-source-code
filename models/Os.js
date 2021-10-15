var db = require('../config/Database');

class Os
{

    //Old func
    // static GetIdByName(name)
    // {
    //     var row = db.first("SELECT id FROM `os` WHERE `name`='"+name+"'");
    //     return row;
    // }    
    
    static async getIdByName(name)
    {
        var os= await db.first(`SELECT IF(EXISTS(SELECT id FROM os WHERE name='${name}'),(SELECT id FROM os WHERE name='${name}'),0) AS id`);
        return os.id;
    
    }    

   

}

module.exports = Os;

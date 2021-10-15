var config = require('config');
var db = require('../config/Database');



class Dashboard
{


    static statistics()
    {
        var query="";
        query+="SELECT (select COUNT(u.id)  From users u)  as  users ";
        query+=",(select COUNT(r.id)  From reviews r)  as  reviews ";
        query+=",(select COUNT(l.id)  From listings l)  as  listings ";
        query+=",(select COUNT(c.id)  From categories c)  as  categories ";
        return db.first(query);
    }    


    static os()
    {
        var query="";
        query+="SELECT os.name AS name";
        query+=",round(COUNT(os.id) / (SELECT  COUNT(users.id) FROM `os` JOIN users ON users.os_id = os.id) * 100 ) AS percentage ";
        query+="FROM os "; 
        query+="JOIN users ON users.os_id = os.id ";
        query+="GROUP BY os.id ";
        return db.get(query);
    }


    static month()
    {
        var query="";
        query+="SELECT DATE_FORMAT(`created_at`,'%M') AS name "; 
        query+=",round(COUNT(listings.id) / (SELECT  COUNT(listings.id) AS percentage FROM `listings`) * 100 ) AS percentage ";
        query+="FROM `listings` ";
        query+="GROUP BY MONTH(created_at) ";
        return db.get(query);
    }



    static pichart()
    {
        var query="";
        query+=`SELECT categories.${config.locale}_name AS name `; 
        query+=",ROUND(( COUNT(listings.id) / (SELECT COUNT(listings.id) "; 
        query+="FROM categories ";
        query+="JOIN listings ON listings.category_id = categories.id ) * 100 )) AS percentage ";
        query+="FROM categories ";
        query+="JOIN listings ON listings.category_id = categories.id ";
        query+="GROUP BY categories.id ";
        return db.get(query);

    }    




}

module.exports = Dashboard;

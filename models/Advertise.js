var config = require('config');
var Image = require('./Image');
var DB = require('../config/Database');



class Advertise
{

    static async GetAll()
    {
        let url = Image.Url('advertise/l/');
        const placeholder = Image.Placeholder('l','advertise');
        let query=`SELECT `;
        query+=`IF(skipad1 is NULL OR skipad1='','${placeholder}',CONCAT('${url}',skipad1)) AS skipad1 `; 
        query+=`,IF(dashboard1 is NULL OR dashboard1='','${placeholder}',CONCAT('${url}',dashboard1)) AS dashboard1 `;
        query+=`,IF(dashboard2 is NULL OR dashboard2='','${placeholder}',CONCAT('${url}',dashboard2)) AS dashboard2 `;
        query+=`,IF(walkthrough1 is NULL OR walkthrough1='','${placeholder}',CONCAT('${url}',walkthrough1)) AS walkthrough1 `;
        query+=`,IF(walkthrough2 is NULL OR walkthrough2='','${placeholder}',CONCAT('${url}',walkthrough2)) AS walkthrough2 `;
        query+=`,IF(walkthrough3 is NULL OR walkthrough3='','${placeholder}',CONCAT('${url}',walkthrough3)) AS walkthrough3 `;
        query+=`FROM advertise  WHERE id='1' `;
        return await DB.first(query);
    }  


    static async GetForApi()
    {
        let url = Image.Url('advertise/l/');
        const placeholder = Image.Placeholder('l','advertise');
        let query=`SELECT `;
        query+=`IF(skipad1 is NULL OR skipad1='','${placeholder}',CONCAT('${url}',skipad1)) AS skipad1 `; 
        query+=`,IF(dashboard1 is NULL OR dashboard1='','${placeholder}',CONCAT('${url}',dashboard1)) AS dashboard1 `;
        query+=`,IF(dashboard2 is NULL OR dashboard2='','${placeholder}',CONCAT('${url}',dashboard2)) AS dashboard2 `;
        query+=`,IF(walkthrough1 is NULL OR walkthrough1='','${placeholder}',CONCAT('${url}',walkthrough1)) AS walkthrough1 `;
        query+=`,IF(walkthrough2 is NULL OR walkthrough2='','${placeholder}',CONCAT('${url}',walkthrough2)) AS walkthrough2 `;
        query+=`,IF(walkthrough3 is NULL OR walkthrough3='','${placeholder}',CONCAT('${url}',walkthrough3)) AS walkthrough3 `;
        query+=`FROM advertise  WHERE id='1' `;
        return await DB.first(query);
    }   

    
    static async GetForAppDashboard(locale)
    {
        let url = Image.Url('advertise/l/');
        const placeholder = Image.Placeholder('l','advertise');
        let query=`SELECT id `;
        query+=`,${locale}_name AS name `;
        query+=`,IF(image is NULL OR image='','${placeholder}',CONCAT('${url}',image)) AS image_url `;
        query+=`FROM advertises WHERE dashboard='1' LIMIT 2`;
        return await DB.get(query);
    }   




}

module.exports = Advertise;

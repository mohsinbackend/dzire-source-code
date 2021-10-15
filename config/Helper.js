var mysql = require('mysql');
var config = require('config');


class Helper
{


    static randomDigitRange(min,max)
    { 
        return  Math.round(Math.random() * (max - min) + min);  
    }






}

module.exports=Helper;





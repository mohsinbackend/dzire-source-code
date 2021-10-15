var mysql = require('mysql');
var config = require('config');


class Database
{


    static get(query)
    {

        return  new Promise(function(resolve,reject)
        {
       
            var db = mysql.createConnection(config.db)
            db.connect(function(err)
            {   
                if(err){ resolve(err); }  
                else
                {
                    db.query(query,function(err,data) 
                    {
                        db.end();
                        if(err){ resolve(err.sqlMessage); }
                        else{ resolve(data); } 

                    });
                
                }
            
            });

        });
        
        
    }



    static first(query)
    {

        return  new Promise(function(resolve,reject)
        {
       
            var db = mysql.createConnection(config.db)
            db.connect(function(err)
            {   
                if(err){ resolve(err); }  
                else
                {
                    //return Object but error not showing
                    //db.query(query,function(err,[data])
                    db.query(query,function(err,data) 
                    {
                        db.end();
                        if(err){ resolve(err.sqlMessage); }
                        else
                        { 
                            if(!data[0]){resolve(data);}
                            else{resolve(data[0]);}
                        } 
                    });
                }
            
            });

        });
        
        
    }

   
    static execute(query)
    {

        return  new Promise(function(resolve,reject)
        {
       
            var db = mysql.createConnection(config.db)
            db.connect(function(err)
            {   
                if(err){ resolve(err); }  
                else
                {
                    db.query(query,function(err,data) 
                    {
                        db.end();
                        if(err){ resolve(err.sqlMessage); }
                        else{ resolve(data); } 

                    });
                
                }
            
            });

        });
        
        
    }


}




module.exports=Database;





//var db = require('../config/Database');
var fs = require('fs');
var Jimp = require('jimp');
var rand = require("random-key");
var config = require('config');
var sharp = require('sharp');


class Image
{


    static Url(url='')
    {   
        return config.url+`images/${url}`;
    }

    
    static Placeholder(size='',type='')
    {   
        let url = config.url+'images/'

        switch (type) 
        {
            case 'user': url+='placeholder.jpg'; break;  
            case 'category': url+='no-images-placeholder.png'; break;  
            default: url+='no-images-placeholder.png';  break;
        }

        return url;
    }

    
    //Sharp function use
    static async Resizer(width, height, size, type, imgsrc, randfile) 
    {
        sharp(imgsrc.data)
            .resize({
                width: width,
                height: height,
                fit: sharp.fit.inside,
                withoutEnlargement: true

            }).toFile(`public/images/${type}/${size}/${randfile}`, (err, info) => {
        });
    }



    static async UploadViaBase64(type,base64) 
    {
        var file = ''
        var randfile = rand.generate(20)+".png";
        var buffered = new Buffer(base64,'base64');   
        switch (type) 
        {

            case 'user':    
                file = this.Resizer(512,512,'l','user',buffered,randfile);
                file = this.Resizer(256,256,'m','user',buffered,randfile);
                file = this.Resizer(128,128,'s','user',buffered,randfile);
            break;

            case 'listing':    
                file = this.Resizer(512,512,'l','listing',buffered,randfile);
                file = this.Resizer(256,256,'m','listing',buffered,randfile);
                file = this.Resizer(128,128,'s','listing',buffered,randfile);
            break;

            case 'advertise':    
                file = this.Resizer(512,512,'l','advertise',buffered,randfile);
                file = this.Resizer(256,256,'m','advertise',buffered,randfile);
                file = this.Resizer(128,128,'s','advertise',buffered,randfile);
            break;

            case 'category':    
                file = this.Resizer(512,512,'l','category',buffered,randfile);
                file = this.Resizer(256,256,'m','category',buffered,randfile);
                file = this.Resizer(128,128,'s','category',buffered,randfile);
            break;

            case 'listing_gallery':    
                file = this.Resizer(512,512,'l','listing_gallery',buffered,randfile);
            break;
            
            default: return "Image upload function switch case not exitst."; break;
            
        }

        return randfile

    }




    //Sharp function use
    static async Upload(type,imgsrc) 
    {
        var file = ''
        var randfile = rand.generate(20) + "." + imgsrc.mimetype.split("/")[1];   
        switch (type) 
        {

            case 'user':    
                file = this.Resizer(512,512,'l','user',imgsrc,randfile);
                file = this.Resizer(256,256,'m','user',imgsrc,randfile);
                file = this.Resizer(128,128,'s','user',imgsrc,randfile);
            break;

            case 'listing':    
                file = this.Resizer(512,512,'l','listing',imgsrc,randfile);
                file = this.Resizer(256,256,'m','listing',imgsrc,randfile);
                file = this.Resizer(128,128,'s','listing',imgsrc,randfile);
            break;

            case 'advertise':    
                file = this.Resizer(512,512,'l','advertise',imgsrc,randfile);
                file = this.Resizer(256,256,'m','advertise',imgsrc,randfile);
                file = this.Resizer(128,128,'s','advertise',imgsrc,randfile);
            break;

            case 'category':    
                file = this.Resizer(512,512,'l','category',imgsrc,randfile);
                file = this.Resizer(256,256,'m','category',imgsrc,randfile);
                file = this.Resizer(128,128,'s','category',imgsrc,randfile);
            break;

            case 'listing_gallery':    
                file = this.Resizer(512,512,'l','listing_gallery',imgsrc,randfile);
            break;
            
            default: return "Image upload function switch case not exitst."; break;
            
        }

        return randfile

    }





    //Sharp function use
    static async UnlinkFile(type,size,name) 
    {

        return new Promise(function(resolve,reject)
        {
            var delpath=`./public/images/${type}/${size}/${name}`;            
            if(fs.existsSync(delpath))
            {
                fs.unlink(delpath,(err)=>{ console.log(err); return resolve(err); });
            }
            return resolve(true);
        
        });
    

    }



    //Sharp function use
    static async delete(type,name)
    {
        let result;
        switch (type) 
        {
            case 'user':     
                result = await this.UnlinkFile('user','l',name);
                result = await this.UnlinkFile('user','m',name);
                result = await this.UnlinkFile('user','s',name);
            break;

            case 'listing':  
                result = await this.UnlinkFile('listing','l',name);
                result = await this.UnlinkFile('listing','m',name);
                result = await this.UnlinkFile('listing','s',name);  
            break;
            
            case 'category':  
                result = await this.UnlinkFile('category','l',name);
                result = await this.UnlinkFile('category','m',name);
                result = await this.UnlinkFile('category','s',name);  
            break;

            
            case 'advertise':  
                result = await this.UnlinkFile('advertise','l',name);
                result = await this.UnlinkFile('advertise','m',name);
                result = await this.UnlinkFile('advertise','s',name);  
            break;

            case 'listing_gallery':    
                result = await this.UnlinkFile('listing_gallery','l',name);
            break;
            
            default: result='Delete folder is not available.'; break;
            
        }

        return result

        
    }




    // static Save(size,path,imgsrc)
    // {
    //     return  new Promise(function(resolve,reject)
    //     {    
    //         var file=rand.generate(20)+"."+imgsrc.mimetype.split("/")[1];
            
    //         var save_path=path+file;
    //         var temp_path=config.img_path+'temp/'+file;
            
    //         imgsrc.mv(temp_path);    
    //         Jimp.read(temp_path,(err,lenna) => {
    //             if (err){ return reject(err); } 
    //             else 
    //             {
    //                 lenna.resize(size,Jimp.AUTO).write(save_path);
    //                 if (fs.existsSync(temp_path))
    //                 {
    //                     fs.unlink(temp_path,(err) => { return resolve(file); });
    //                 }
    //                 return resolve(file);
    //             }
    //         });

    //     });

    // }




    // static async SaveNewAdvertise(imgsrc)
    // {
    //     return  new Promise(function(resolve,reject)
    //     {  
    //         var file=rand.generate(20)+"."+imgsrc.mimetype.split("/")[1];
    //         var temp_path='./public/advertise/temp/'+file;
    //         imgsrc.mv(`./public/images/advertise/l/${file}`); 
    //         return resolve(file);
    //     });


    // }


    // static async SaveForUser(imgsrc)
    // {


    //     return  new Promise(function(resolve,reject)
    //     {  

    //         var file=rand.generate(20)+"."+imgsrc.mimetype.split("/")[1];

    //         var temp_path='./public/images/temp/'+file;
    //         //imgsrc.mv(temp_path); 

    //         imgsrc.mv(`./public/images/user/l/${file}`); 
    //         return resolve(file);
           

    //         // Jimp.read(temp_path,(err,lenna) => {
                
    //         //     if (err){return resolve(err); }
    //         //     else 
    //         //     {
    //         //         lenna.resize(512,Jimp.AUTO).write(`./public/images/user/l/`+file);
    //         //         lenna.resize(256,Jimp.AUTO).write(`./public/images/user/m/`+file);
    //         //         lenna.resize(128,Jimp.AUTO).write(`./public/images/user/s/`+file);
    //         //         if (fs.existsSync(temp_path))
    //         //         { fs.unlink(temp_path,(err) => { return resolve(err); }); }
    //         //         return resolve(file);
    //         //     }

    //         // });



    //     });


    // }




    


    // static async SaveForCategory(imgsrc)
    // {
    //     return  new Promise(function(resolve,reject)
    //     {    
            
    //         var file=rand.generate(20)+"."+imgsrc.mimetype.split("/")[1];
    //         var temp_path='./public/images/temp/'+file;
    //         imgsrc.mv(temp_path);    
    //         Jimp.read(temp_path,(err,lenna) => {
    //             if (err){return resolve(err); }
    //             else 
    //             {
    //                 lenna.resize(512,Jimp.AUTO).write(`./public/images/category/l/`+file);
    //                 lenna.resize(256,Jimp.AUTO).write(`./public/images/category/m/`+file);
    //                 lenna.resize(128,Jimp.AUTO).write(`./public/images/category/s/`+file);
    //                 if (fs.existsSync(temp_path))
    //                 {
    //                     fs.unlink(temp_path,(err) => { return resolve(err); });
    //                 }
    //                 return resolve(file);
    //             }
    //         });

    //     });

    // }



    



    // static async SaveforListing(imgsrc)
    // {

    //     return  new Promise(function(resolve,reject)
    //     {    
    //         var file=rand.generate(20)+"."+imgsrc.mimetype.split("/")[1];
    //         var temp_path='./public/images/temp/'+file;
    //         imgsrc.mv(temp_path);    
    //         Jimp.read(temp_path,(err,lenna) => {
    //             if (err){return reject(err); }
    //             else 
    //             {
    //                 lenna.resize(512,Jimp.AUTO).write(`./public/images/listing/l/`+file);
    //                 lenna.resize(256,Jimp.AUTO).write(`./public/images/listing/m/`+file);
    //                 lenna.resize(128,Jimp.AUTO).write(`./public/images/listing/s/`+file);
    //                 if (fs.existsSync(temp_path))
    //                 {
    //                     fs.unlink(temp_path,(err) => { return reject(err); });
    //                 }
    //                 return resolve(file);
    //             }
    //         });

    //     });


    // }




    // static SaveforAdvertise(imgsrc)
    // {
    //     return  new Promise(function(resolve,reject)
    //     {    
    //         var file=rand.generate(20)+"."+imgsrc.mimetype.split("/")[1];
    //         var temp_path='./public/images/temp/'+file;
    //         imgsrc.mv(temp_path);    
    //         Jimp.read(temp_path,(err,lenna) => {
    //             if (err){return reject(err); }
    //             else 
    //             {
    //                 lenna.resize(512,Jimp.AUTO).write(`./public/images/advertise/l/`+file);
    //                 lenna.resize(256,Jimp.AUTO).write(`./public/images/advertise/m/`+file);
    //                 lenna.resize(128,Jimp.AUTO).write(`./public/images/advertise/s/`+file);
    //                 if (fs.existsSync(temp_path))
    //                 {
    //                     fs.unlink(temp_path,(err) => { return reject(err); });
    //                 }
    //                 return resolve(file);
    //             }
    //         });

    //     });

    // }




    // static async delete(type,name)
    // {
    //     return  new Promise(function(resolve,reject)
    //     {
    
    //         let temppath=`./public/images/temp/${name}`;
    //         let lpath=`./public/images/${type}/l/${name}`;
    //         let mpath=`./public/images/${type}/m/${name}`;
    //         let spath=`./public/images/${type}/s/${name}`;
    //         if (fs.existsSync(temppath)){ fs.unlink(lpath,(err) => {  }); }
    //         if (fs.existsSync(lpath)){ fs.unlink(lpath,(err) => {  }); }
    //         if (fs.existsSync(mpath)){ fs.unlink(mpath,(err) => {  }); }
    //         if (fs.existsSync(spath)){ fs.unlink(spath,(err) => {  }); }
            
    //         resolve(true);

    //     });

    // }


   

    
    // static async SaveBase64(type,base64)
    // {

    //     return  new Promise(function(resolve,reject)
    //     {

    //         var randfile = rand.generate(20)+'.png';
    //         Jimp.read(base64,(err,lenna) => {
                   
    //             if (err) throw err;
    //             else 
    //             {
    //                 lenna.resize(512,Jimp.AUTO).write(`./public/images/${type}/l/`+randfile);
    //                 lenna.resize(256,Jimp.AUTO).write(`./public/images/${type}/m/`+randfile);
    //                 lenna.resize(128,Jimp.AUTO).write(`./public/images/${type}/s/`+randfile);
    //                 if (fs.existsSync(temp_path)){ fs.unlink(temp_path,(err) => { return resolve(err); }); }
    //                 else{   return resolve(randfile); }
                
    //             }
           
    //         });
   

    //     });

    // }






}


module.exports = Image;

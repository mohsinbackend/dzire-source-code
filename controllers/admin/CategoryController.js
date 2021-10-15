var express = require('express');
var router = express.Router();
var validator = require('validator');
var config = require('config');

var DB = require('../../config/Database');
var Category = require('../../models/Category');
var Subcategory = require('../../models/Subcategory');
var UserRequest = require('../../models/UserRequest');




router.get('/requested', async function(req, res) 
{     
    let reqcategories = await UserRequest.GetForListing();
    return res.render('admin/category/requested',{reqcategories});
});


router.get('/delreqcate/:id?', async function(req, res) 
{

    let get = {};
    let errors = {};   

    if(!req.params.id || validator.isEmpty(req.params.id)){ errors.id="ID is required.";req.flash('id_err',`${errors.id}`); }
    else if(!validator.isInt(req.params.id) ){ errors.id="ID must be integer.";req.flash('id_err',`${errors.id}`); }
    else if( await UserRequest.Exists(req.params.id)=='0'){errors.id="ID is not exists.";req.flash('id_err',`${errors.id}`);}
    else{get.id=req.params.id.trim();}  

    if (Object.keys(errors).length > 0){req.flash('error',`${errors.id}`); return res.redirect(`category/requested`); }
	else
	{
        const deleted = await UserRequest.DeletedByAdmin(get.id);
        req.flash('success','Requested category has been successfully deleted.'); 
        return res.redirect(`/admin/category/requested`);    

    }

    
    
 
});





router.get('/edit/:id?', async function(req, res) 
{     
    
    let category = await Category.Edit(req.params.id);
    let subcategories = await Subcategory.GetForEditByCate(req.params.id);     
    category.subcategories= JSON.stringify(subcategories);
    //return res.json(category);
    return res.render('admin/category/edit',{category:category});

});



router.post('/update', async function(req, res) 
{

    
    let post = {};
    let errors = {};   

    if (!req.body.ar || validator.isEmpty(req.body.ar)){errors.ar="Arabic name is required.";req.flash('ar_err',`${errors.ar}`); }
    else{ post.ar=req.body.ar.trim(); req.flash('ar',`${post.ar}`); }
    
    if (!req.body.en || validator.isEmpty(req.body.en)){errors.en="English name is required.";req.flash('en_err',`${errors.en}`); }
    else{ post.en=req.body.en.trim(); req.flash('en',`${post.en}`); }
  
    if (!req.body.status || validator.isEmpty(req.body.status)){errors.status="Status is required.";req.flash('status_err',`${errors.status}`); }
    else{ post.status=req.body.status.trim();req.flash('status',`${post.status}`); }
 
    if (!req.body.dashboard || validator.isEmpty(req.body.dashboard)) { errors.dashboard = "Dashboard Appear/Disappear is required."; req.flash('dashboard_err',`${errors.dashboard}`); }
    else if(!['0','1'].includes(req.body.dashboard)){ errors.dashboard=`Dashboard  must be 0 or 1.`; req.flash('dashboard_err',`${errors.dashboard}`); }
    else{ post.dashboard=req.body.dashboard.trim(); req.flash('dashboard',`${post.dashboard}`);  }
    
    if (!req.body.dashboard_priority||validator.isEmpty(req.body.dashboard_priority)){errors.dashboard_priority="Priority of dashboard  is required.";req.flash('dashboard_priority_err',`${errors.dashboard_priority}`); }
    else if(!validator.isInt(req.body.dashboard_priority) ){ errors.dashboard_priority=`Priority of dashboard must be integer.`; req.flash('dashboard_priority_err',`${errors.dashboard_priority}`); }
    else{  post.dashboard_priority=req.body.dashboard_priority; req.flash('dashboard_priority',`${post.dashboard_priority}`);  }

    if(!req.body.cate_id || validator.isEmpty(req.body.cate_id)){ errors.cate_id="Category is required.";req.flash('cate_id_err',`${errors.cate_id}`); }
    else if(!validator.isInt(req.body.cate_id) ){ errors.cate_id="Category must be integer.";req.flash('cate_id_err',`${errors.cate_id}`); }
    else if( await Category.Exists(req.body.cate_id)=='0'){errors.cate_id="Category is not exists.";req.flash('cate_id_err',`${errors.cate_id}`);}
    else{post.cate_id=req.body.cate_id.trim(); req.flash('cate_id',`${post.cate_id}`) }  


    if(req.files && req.files.image && typeof(req.files.image)=='object' )
    { 
        //errors.image=`Image is required.`;req.flash('image_err',`${errors.image}`);
        if(config.imgobjstr!=Object.keys(req.files.image).toString()){ errors.image=`Image object not valid. should be ${config.imgobjstr}.`;req.flash('image_err',`${errors.image}`); }
        else if(!config.image_upload_types.includes(req.files.image.mimetype.split("/")[1])){ errors.image=`Image is not allow must be ${config.image_upload_types.toString()}.`;req.flash('image_err',`${errors.image}`); }
        else if( Math.round(req.files.image.size / 1024) > 5120 ){errors.image="Image size should be less than 5 Mb.";req.flash('image_err',`${errors.image}`);}
        else{post.imgsrc=req.files.image;} 
    }
    
    

    if (!req.body.subcategories || validator.isEmpty(req.body.subcategories)){errors.subcategories="Subcategories name is required.";req.flash('subcategories_err',`${errors.subcategories}`); }
    else if (req.body.subcategories=='[]'||typeof(JSON.parse(req.body.subcategories))!="object"||JSON.parse(req.body.subcategories).length==0){errors.subcategories="Subcategories is empty.";req.flash('subcategories_err',`${errors.subcategories}`); }
    else{ post.subcategories = JSON.parse(req.body.subcategories); req.flash('subcategories',`${JSON.stringify(post.subcategories)}`);  }



    if (Object.keys(errors).length > 0){ return res.redirect(`edit/${req.body.cate_id}`); }
	else
	{

        let updated = await Category.Update(post);

        if(!updated.changedRows){ req.flash('error','Category could not update unspected error.');}
        else 
        {

            try
            {
                let indexs=[];
                let status=[];
                let exists=[];
                let subcate_ids=[];
                
                //post.subcategories.map(row=>row.id);
                
                let subcateupdated = await Subcategory.UpdateAndStore(post.cate_id,post.subcategories);
                req.flash('success','Category has been successfully updated.');     
                return res.redirect(`edit/${req.body.cate_id}`);

                //return res.json(subcateupdated);
            
            }catch(error){return res.json({status:'error','message':error.message});}

            
            // post.subcategories.forEach(async function(subcate,index)
            // {
            //     indexs.push(index);
            //     subcate.cate_id=post.cate_id;
                
            //     let exist = await Subcategory.Exists(parseInt(subcate.id));
                
            //     exists.push(exist);
                
            //     if(exist==1 || exist=='1' )
            //     { 
            //         status.push('updated');
            //         let updated_subcate = await Subcategory.Update(subcate);
            //         subcate_ids.push(subcate.id);
            //         //if(updated_subcate.changedRows){subcate_ids.push(subcate.id); }
            //     }
            //     else
            //     { 
            //         status.push('stored');
            //         let stored_subcate = await Subcategory.Store(subcate);
            //         if(stored_subcate.insertId){ subcate_ids.push(stored_subcate.insertId); }  
            //     }

            //     if(post.subcategories.length==indexs.length)
            //     { 
            //         //return res.json({exists,status,subcate_ids});
            //         req.flash('success','Category has been successfully updated.'); 
            //         return res.json(subcate_ids);    
            //         return res.redirect(`edit/${post.cate_id}`);
            //     }
            
            // });
            


            
            
            //     
            // let result=[];
            // post.subcategories.forEach(async (subcate,index)=>
            // {
            //     subcate.cate_id=post.cate_id;
            //     let existing = await Subcategory.Exists(subcate.id);
            //     result.push(existing);
            //     // if(existing==1||existing=='1')
            //     // { 
            //     //     result.push('if');
            //     //     //await Subcategory.Update(subcate); 
            //     // }
            //     // else
            //     // { 
            //     //     result.push('else');
            //     //     //await Subcategory.Store(subcate); 
            //     // }

            // });

            //return res.json(post.subcategories);
            //await DB.execute(`DELETE FROM subcategories WHERE category_id='${category.cate_id}' AND id NOT IN('${subcate_ids.toString()}')`);
            //req.flash('success','Category has been successfully updated.');     
            //return res.redirect(`edit/${req.body.cate_id}`);

        }
        
        
    }



});






router.get('/create', function(req, res) 
{          
    return res.render('admin/category/create');
});




router.post('/store', async function(req, res) 
{

    
    let post = {};
    let errors = {};   

    if (!req.body.ar || validator.isEmpty(req.body.ar)){errors.ar="Arabic name is required.";req.flash('ar_err',`${errors.ar}`); }
    else{ post.ar=req.body.ar.trim(); req.flash('ar',`${post.ar}`); }
    
    if (!req.body.en || validator.isEmpty(req.body.en)){errors.en="English name is required.";req.flash('en_err',`${errors.en}`); }
    else{ post.en=req.body.en.trim(); req.flash('en',`${post.en}`); }
  
    if (!req.body.status || validator.isEmpty(req.body.status)){errors.status="Status is required.";req.flash('status_err',`${errors.status}`); }
    else{ post.status=req.body.status.trim();req.flash('status',`${post.status}`); }
 
    if (!req.body.dashboard || validator.isEmpty(req.body.dashboard)) { errors.dashboard = "Dashboard Appear/Disappear is required."; req.flash('dashboard_err',`${errors.dashboard}`); }
    else if(!['0','1'].includes(req.body.dashboard)){ errors.dashboard=`Dashboard  must be 0 or 1.`; req.flash('dashboard_err',`${errors.dashboard}`); }
    else{ post.dashboard=req.body.dashboard.trim(); req.flash('dashboard',`${post.dashboard}`);  }
    
    if (!req.body.dashboard_priority||validator.isEmpty(req.body.dashboard_priority)){errors.dashboard_priority="Priority of dashboard  is required.";req.flash('dashboard_priority_err',`${errors.dashboard_priority}`); }
    else if(!validator.isInt(req.body.dashboard_priority) ){ errors.dashboard_priority=`Priority of dashboard must be integer.`; req.flash('dashboard_priority_err',`${errors.dashboard_priority}`); }
    else{  post.dashboard_priority=req.body.dashboard_priority; req.flash('dashboard_priority',`${post.dashboard_priority}`);  }


    if(!req.files || !req.files.image || typeof(req.files.image)!='object' ){ errors.image=`Image is required.`;req.flash('image_err',`${errors.image}`);}
    else if(config.imgobjstr!=Object.keys(req.files.image).toString()){ errors.image=`Image object not valid. should be ${config.imgobjstr}.`;req.flash('image_err',`${errors.image}`); }
    else if(!config.image_upload_types.includes(req.files.image.mimetype.split("/")[1])){ errors.image=`Image is not allow must be ${config.image_upload_types.toString()}.`;req.flash('image_err',`${errors.image}`); }
    else if( Math.round(req.files.image.size / 1024) > 5120 ){errors.image="Image size should be less than 5 Mb.";req.flash('image_err',`${errors.image}`);}
    else{post.imgsrc=req.files.image;} 
  

    if (!req.body.subcategories || validator.isEmpty(req.body.subcategories)){errors.subcategories="Subcategories name is required.";req.flash('subcategories_err',`${errors.subcategories}`); }
    else if (req.body.subcategories=='[]'||typeof(JSON.parse(req.body.subcategories))!="object"||JSON.parse(req.body.subcategories).length==0){errors.subcategories="Subcategories is empty.";req.flash('subcategories_err',`${errors.subcategories}`); }
    else{ post.subcategories = JSON.parse(req.body.subcategories); req.flash('subcategories',`${JSON.stringify(post.subcategories)}`);  }



    if (Object.keys(errors).length > 0){ return res.redirect("create"); }
	else
	{

        let stored = await Category.Store(post);
        if(!stored.insertId){ req.flash('error','Category could not store unspected error.');}
        else 
        {
            post.subcategories.forEach(async (subcate,index)=>
            {
                subcate.cate_id=stored.insertId;
                await Subcategory.Store(subcate);
            });
            req.flash('success','Category has been successfully stored.');     
        }
        
        return res.redirect("create");

    }



});





// router.post('/store', async function(req, res) 
// {
        
//     let post = {};
//     let errors = {};   

//     if (!req.body.en || validator.isEmpty(req.body.en)){errors.en="Category name is required.";req.flash('en_err',`${errors.en}`); }
//     else{ post.en=req.body.en.trim(); req.flash('en',`${post.en}`); }
    
//     if (!req.body.status || validator.isEmpty(req.body.status)){errors.status="Status is required.";req.flash('status_err',`${errors.status}`); }
//     else{ post.status=req.body.status.trim();req.flash('status',`${post.status}`); }

 
//     if (!req.body.dashboard || validator.isEmpty(req.body.dashboard)) { errors.dashboard = "Dashboard Appear/Disappear is required."; req.flash('dashboard_err',`${errors.dashboard}`); }
//     else if(!['0','1'].includes(req.body.dashboard)){ errors.dashboard=`Dashboard  must be 0 or 1.`; req.flash('dashboard_err',`${errors.dashboard}`); }
//     else{ post.dashboard=req.body.dashboard.trim(); req.flash('dashboard',`${post.dashboard}`);  }
    
//     if (!req.body.dashboard_priority || validator.isEmpty(req.body.dashboard_priority)){errors.dashboard_priority="Priority of dashboard  is required.";req.flash('dashboard_priority_err',`${errors.dashboard_priority}`); }
//     else if(!validator.isInt(req.body.dashboard_priority) ){ errors.dashboard_priority=`Priority of dashboard must be integer.`; req.flash('dashboard_priority_err',`${errors.dashboard_priority}`); }
//     else{ post.dashboard_priority=req.body.dashboard_priority.trim();req.flash('dashboard_priority',`${post.dashboard_priority}`);  }


//     if(!req.files ||  !req.files.image || typeof(req.files.image)!='object' ){ errors.image=`Image is required.`;req.flash('image_err',`${errors.image}`);}
//     else if(config.imgobjstr!=Object.keys(req.files.image).toString()){ errors.image=`Image object not valid. should be ${config.imgobjstr}.`;req.flash('image_err',`${errors.image}`); }
//     else if(!config.image_upload_types.includes(req.files.image.mimetype.split("/")[1])){ errors.image=`Image is not allow must be ${config.image_upload_types.toString()}.`;req.flash('image_err',`${errors.image}`); }
//     else if( Math.round(req.files.image.size / 1024) > 5120 ){errors.image="Image size should be less than 5 Mb.";req.flash('image_err',`${errors.image}`);}
//     else{post.imgsrc=req.files.image;} 
    

//     if (Object.keys(errors).length > 0){ return res.redirect("create"); }
// 	else
// 	{

//         const result = await Category.StoreByAdmin(post);
//         if(!result.insertId){ req.flash('error','Category could not store unspected error.');}
//         else 
//         {
//             req.flash('success','Category has been successfully stored.');     
//         }
        
//         return res.redirect("create");

//     }



// });













router.get('/view/:id?', async function (req, res) 
{
    let category = await Category.GetForView(req.params.id);
    return res.render('admin/category/view',{category:category});
});



router.get('/list', async function(req, res) 
{
    let categories = await Category.GetForListing();
    return res.render('admin/category/list',{categories:categories});
});














// router.post('/update', async function(req, res) 
// {
        

    
//     let post = {};
//     let errors = {};   


    
//     if(!req.body.id || validator.isEmpty(req.body.id)){ errors.id="ID is required.";req.flash('id_err',`${errors.id}`); }
//     else if(!validator.isInt(req.body.id) ){ errors.id="ID must be integer.";req.flash('id_err',`${errors.id}`); }
//     else if( await Category.Exists(req.body.id)=='0'){errors.id="ID is not exists.";req.flash('id_err',`${errors.id}`);}
//     else{post.id=req.body.id.trim();}  

//     if (!req.body.en || validator.isEmpty(req.body.en)){errors.en="Category name is required.";req.flash('en_err',`${errors.en}`); }
//     else{ post.en=req.body.en.trim(); req.flash('en',`${post.en}`); }
    

//     if (!req.body.dashboard || validator.isEmpty(req.body.dashboard)) { errors.dashboard = "Dashboard Appear/Disappear is required."; req.flash('dashboard_err',`${errors.dashboard}`); }
//     else if(!['0','1'].includes(req.body.dashboard)){ errors.dashboard=`Dashboard  must be 0 or 1.`; req.flash('dashboard_err',`${errors.dashboard}`); }
//     else{ post.dashboard=req.body.dashboard.trim(); req.flash('dashboard',`${post.dashboard}`);  }
   
    
//     if (!req.body.dashboard_priority || validator.isEmpty(req.body.dashboard_priority)){errors.dashboard_priority="Priority of dashboard  is required.";req.flash('dashboard_priority_err',`${errors.dashboard_priority}`); }
//     else if(!validator.isInt(req.body.dashboard_priority) ){ errors.dashboard_priority=`Priority of dashboard must be integer.`; req.flash('dashboard_priority_err',`${errors.dashboard_priority}`); }
//     else{ post.dashboard_priority=req.body.dashboard_priority.trim();req.flash('dashboard_priority',`${post.dashboard_priority}`);  }

    
//     if (!req.body.status || validator.isEmpty(req.body.status)){errors.status="Status is required.";req.flash('status_err',`${errors.status}`); }
//     else{ post.status=req.body.status.trim();req.flash('status',`${post.status}`); }

//     if(req.files &&  req.files.image && typeof(req.files.image)=='object' )
//     {
//         if(config.imgobjstr!=Object.keys(req.files.image).toString()){ errors.image=`Image object not valid. should be ${config.imgobjstr}.`;req.flash('image_err',`${errors.image}`); }
//         else if(!config.image_upload_types.includes(req.files.image.mimetype.split("/")[1])){ errors.image=`Image is not allow must be ${config.image_upload_types.toString()}.`;req.flash('image_err',`${errors.image}`); }
//         else if( Math.round(req.files.image.size / 1024) > 5120 ){errors.image="Image size should be less than 5 Mb.";req.flash('image_err',`${errors.image}`);}
//         else{post.imgsrc=req.files.image;} 
//     }
      

//     if (Object.keys(errors).length > 0){ return res.redirect(`edit/${req.body.id}`); }
// 	else
// 	{
//         //return res.json(post);
//         const updated = await Category.UpdateByAdmin(post);
//         req.flash('success','Category has been successfully updated.');     
//         return res.redirect(`edit/${post.id}`);

//     }



// });







router.get('/delete/:id?', async function(req, res) 
{

    let get = {};
    let errors = {};   

    if(!req.params.id || validator.isEmpty(req.params.id)){ errors.id="ID is required.";req.flash('id_err',`${errors.id}`); }
    else if(!validator.isInt(req.params.id) ){ errors.id="ID must be integer.";req.flash('id_err',`${errors.id}`); }
    else if( await Category.Exists(req.params.id)=='0'){errors.id="ID is not exists.";req.flash('id_err',`${errors.id}`);}
    else{get.id=req.params.id.trim();}  

    if (Object.keys(errors).length > 0){req.flash('error',`${errors.id}`); return res.redirect(`category/list`); }
	else
	{
        const delcate = await Category.DeletedByAdmin(get.id); 
        const delsubcate = await Subcategory.DeleteByCategory(get.id);
        req.flash('success','Category has been successfully deleted.'); 
        return res.redirect(`/admin/category/list`);    

    }

    
    
 
});


module.exports = router;

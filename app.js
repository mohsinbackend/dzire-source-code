var createError = require('http-errors');
var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('express-flash-messages');
var config = require('config');
var dotenv = require('dotenv/config');





//Begin File Upload Confige Code
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
//End File Upload Confige Code




var indexRouter = require('./routes/index');

var WisheController = require('./controllers/api/WisheController');
var BasketController = require('./controllers/api/BasketController');
var ContactusController = require('./controllers/api/ContactusController');
var MyAccountController = require('./controllers/api/MyAccountController');



var AuthController = require('./controllers/api/AuthController');
var GuestController = require('./controllers/api/GuestController');
var UserController = require('./controllers/api/UserController');
var ContentController = require('./controllers/api/ContentController');
var CategoryController = require('./controllers/api/CategoryController');
var SubcategoryController = require('./controllers/api/SubcategoryController');
var ListingController = require('./controllers/api/ListingController');
var ReviewController = require('./controllers/api/ReviewController');
var DashboardController = require('./controllers/api/DashboardController');
var ApiTranslationController = require('./controllers/api/TranslationController');

var ApiSocialController = require('./controllers/api/SocialController');
var ApiKeywordController = require('./controllers/api/KeywordController');
var ApiAdvertiseController = require('./controllers/api/AdvertiseController');
var ApiNotificationController = require('./controllers/api/NotificationController');
var ApiLocationController = require('./controllers/api/LocationController');






//Admin Controllers
var AdminAuthController = require('./controllers/admin/AuthController');
var AdminMainController = require('./controllers/admin/MainController');
var AdminUserController = require('./controllers/admin/UserController');
var AdminReviewController = require('./controllers/admin/ReviewController');
var AdminContentController = require('./controllers/admin/ContentController');
var AdminListingController = require('./controllers/admin/ListingController');
var AdminCategoryController = require('./controllers/admin/CategoryController');
var AdminSubcategoryController = require('./controllers/admin/SubcategoryController');
var AdminAdvertiseController = require('./controllers/admin/AdvertiseController');
var AdminTranslationController = require('./controllers/admin/TranslationController');
var AdminKeywordController = require('./controllers/admin/KeywordController');
var AdminContactController = require('./controllers/admin/ContactController');
var NotificationController = require('./controllers/admin/NotificationController');

var AdminRegionController = require('./controllers/admin/RegionController');
var AdminCountryController = require('./controllers/admin/CountryController');
var AdminSettingController = require('./controllers/admin/SettingController');




//Models 
var WebNotify = require('./models/WebNotify');










// Begin Session
app.use(cookieParser());
//app.use(session({secret: "Shh, its a secret!"}));
// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  key: 'admin_sid',
  secret: 'somerandonstuffs',
  resave: false,
  saveUninitialized: false,
  //cookie: { expires: 600000 }
  cookie: { expires: 24 * 60 * 60 * 1000 } // 24 hours

}));
// initialize express-session to allow us track the logged-in user across sessions.

// // app.use(function(req, res, next) {
// //   if(req.session.admin && req.cookies.admin_sid)
// //   {
// //      res.locals.admin_name = req.session.admin.name;
// //      //res.locals.authenticated = !req.user.anonymous
// //      next()
// //   }
  


// });
// End Session





// Begin Fash
app.use(flash())
// End Fash


//Begin File Upload Confige Code
  // enable files upload
  app.use(fileUpload({ createParentPath: true }));

  //add other middleware
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(morgan('dev'));

//End File Upload Confige Code

 







// view engine setup
//app.set('views', path.join(__dirname, 'views'));

//app.set('view engine', 'jade');
//set the view engine to ejs
app.set('view engine', 'ejs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(fileUpload({
//   limits: { fileSize: 10 * 1024 * 1024 },
// }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//API Middleware
app.get('/api*',function(req, res, next) 
{

  
  return next();

});





//Admin Middleware
app.get('/admin*', async function(req, res, next) 
{

 
  if(req.url=="/admin/study"){ return next(); }
  
  res.locals.db={}
  res.locals.admin={};
  res.locals.url=config.url;
  res.locals.originalUrl=req.originalUrl;
  res.locals.db.web_notify_count =  await WebNotify.CountSeen();

  
  let title="";
  const originalUrl = res.locals.originalUrl;
  
  if(originalUrl=="/admin"){title="Dashboard";}
  else if(res.locals.originalUrl.includes("user")){title="Users";}
  else if(res.locals.originalUrl.includes("/listing/list")){title="Items";}
  else if(res.locals.originalUrl.includes("review")){title="Reviews";}
  else if(res.locals.originalUrl.includes("content")){title="Content";}
  else if(res.locals.originalUrl.includes("advertise")){title="Advertise";}
  else if(res.locals.originalUrl.includes("contactus")){title="Messages";}
  else if(res.locals.originalUrl.includes("category")){title="Categories";}
  else if(res.locals.originalUrl.includes("region")){title="Regions";}
  else if(res.locals.originalUrl.includes("content")){title="Content";}
  else if(res.locals.originalUrl.includes("country")){title="Countries";}
  else if(res.locals.originalUrl.includes("webnotify")){title="Web Notify";}
  else if(res.locals.originalUrl.includes("notification")){title="App Notify";} 
  else if(res.locals.originalUrl.includes("setting")){title="Setting";}
  else if(res.locals.originalUrl.includes("brand")){title="Brand";}
    
  res.locals.title=title;

    //Local Developemnt Security Breaked
    // return next();

  
  if( req.url === '/admin/auth/login')
  { 
      if(req.session.admin && req.cookies.admin_sid)
      { 
       req.flash('info', 'Admin has been Successfully logouted.');
       return res.redirect("/admin");  
      }

  }else if(!req.session.admin || !req.cookies.admin_sid){ return res.redirect("/admin/auth/login"); }
  

  if(req.session.admin && req.cookies.admin_sid)
  {  
       res.locals.admin=req.session.admin;
       return next()
  }

  
  return next();


});


app.use('/', indexRouter);
app.use('/api/auth',AuthController);
app.use('/api/user',UserController);
app.use('/api/guest',GuestController);
app.use('/api/contactus',ContactusController);
app.use('/api/myaccount',MyAccountController);


app.use('/api/location',ApiLocationController);
app.use('/api/wishe',WisheController);
app.use('/api/basket',BasketController);
app.use('/api/review',ReviewController);
app.use('/api/content',ContentController);
app.use('/api/listing',ListingController);
app.use('/api/category',CategoryController);
app.use('/api/subcategory',SubcategoryController);
app.use('/api/dashboard',DashboardController);
app.use('/api/translation',ApiTranslationController);
app.use('/api/keyword',ApiKeywordController);
app.use('/api/advertise',ApiAdvertiseController);
app.use('/api/notification',ApiNotificationController);
app.use('/api/social',ApiSocialController);
app.use('/api/tenant',require('./controllers/api/TenantController'));





app.use('/admin',AdminMainController);
app.use('/admin/auth',AdminAuthController);
app.use('/admin/user',AdminUserController);
app.use('/admin/review',AdminReviewController);
app.use('/admin/content',AdminContentController);
app.use('/admin/listing',AdminListingController);
app.use('/admin/category',AdminCategoryController);
app.use('/admin/advertise',AdminAdvertiseController);
app.use('/admin/subcategory',AdminSubcategoryController);
app.use('/admin/translation',AdminTranslationController);
app.use('/admin/keyword',AdminKeywordController);
app.use('/admin/contactus',AdminContactController);
app.use('/admin/notification',NotificationController);
app.use('/admin/region',AdminRegionController);
app.use('/admin/country',AdminCountryController);
app.use('/admin/setting',AdminSettingController);
app.use('/admin/brand',require('./controllers/admin/BrandController'));
app.use('/admin/webnotify',require('./controllers/admin/WebNotifyController'));



// catch 404 and forward to error handler
app.use(function(req, res, next) 
{

  res.locals.url=config.url;
  return res.render('admin/page/404');   
  next(createError(404));

});




// error handler
app.use(function(err, req, res, next) 
{
 
  if(req.originalUrl.includes('/api/')){ return res.json({status:'error',message:err.message}); }
  else
  {
      res.locals.url=config.url;
    // set locals, only providing error in development
      res.locals.err = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      return res.render('admin/page/error');   
      

  }
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');



});



const PORT = process.env.PORT || 786;

app.listen(PORT,()=>{
    console.log("--------------------------------------------");
    console.log(`|********[Dzire Server Running.. PORT:${PORT}]********|`);
    console.log("--------------------------------------------");
});



module.exports = app;


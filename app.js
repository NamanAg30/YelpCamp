var express=require('express');
var app=express();
var mongoose=require('mongoose');
    methodOverride=require('method-override');
mongoose.connect(process.env.DATABASEURL,{useNewUrlParser: true});
//mongoose.connect("mongodb://localhost:27017/yelp_camp_v9",{useNewUrlParser: true});
// mongoose.connect("mongodb+srv://Naman:n30998r91275@cluster0-6tugk.mongodb.net/test?retryWrites=true&w=majority");
var passport=require('passport'),
	localStrategy=require('passport-local'),
	passportLocalMongoose=require('passport-local-mongoose');

var commentRoutes=require('./routes/comments'),
	campgroundRoutes=require('./routes/campgrounds'),
	authRoutes=require('./routes/index');

var User=require('./models/user')

var camp=require('./models/campground');
var seedDb=require('./seed');
var Comment=require('./models/comment');

var flash=require('connect-flash');
// camp.create({name:"Granite Hill",image:"https://www.easemytrip.com/travel/img/camping-places-ind.jpg",desc:"Beautiful Hill"},function(err,campground)
// 		   {
// 			if(err)
// 				console.log(err);
// 			   else console.log(campground);
// 		   });
// // var request=require('request');
//seedDb();

app.use(require('express-session')({
	secret: " My name is Naman!!",
	resave:false,
	saveUninitialized:false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.set("view engine","ejs");
var bp=require('body-parser');
app.use(bp.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(function(req,res,next)
{
	res.locals.currentUser=req.user;
	res.locals.errormessage=req.flash("error");
	res.locals.successmessage=req.flash("success");
	next();
})

app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use(authRoutes);
app.get("/",function(req,res)
	   {
	res.render("landing");
	   });


app.listen(process.env.PORT||3000,process.env.IP,function(){
	console.log("Server has started!!!!");
});
//--------------------SET UP--------------------
//Instead of writing "var" over and over we can just use a "," and list all required
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");
    

//Requires our routes
var commentRoutes  = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")

//Connects to production DB (mlab)
mongoose.connect(process.env.MLAB_CONNECTION, {useMongoClient: true});

//Replaces Mongoose's default promise library with JS's native promise library (S27.5 in course)
mongoose.Promise = global.Promise;

//Convert body (string) to a JS object
app.use(bodyParser.urlencoded({extended: true}));
//Set .ejs as the default extention for our files
app.set("view engine", "ejs");
//Lets the app access files in the public folder (css, JS), "__dirname" automatically refers to the directory path app.js was run in
app.use(express.static(__dirname + "/public"));
//Uses method override (turns POST to PUT requests used in UPDATES)
app.use(methodOverride("_method"));
//Uses connect flash in our app.ks
app.use(flash());

//Executes the above seedDB which has a function passed from seeds.js that deletes all campgrounds
// seedDB();


//-----PASSPORT CONFIG-----
//We dont have to do all the steps for "connect-flash" as we have done it for passport
app.use(require("express-session")({
    secret: "THIS IS USED TO ENCODE",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//"".authenticate" method comes with passport local mongoose, used as middleware for login/sign up
passport.use(new LocalStrategy(User.authenticate()));
//Takes decoded data, encodes it and puts it back into the session (method comes with passport local mongoose)
passport.serializeUser(User.serializeUser());
//Takes data from the session and decodes it (method comes with passport local mongoose)
passport.deserializeUser(User.deserializeUser());


//"currentUser: req.user" - take req.user and store in variable currentUser, when logging in passport will create req.user which contains the user ID and username (used to determine what to show in the nav bar e.g "Login" and "Sign up" or "Logout")
//Using this means we dont have to specify "currentUser: req.user" in every route, it will be passed on every route
app.use(function(req, res, next){
    //Passes currentUser to every single template
    res.locals.currentUser = req.user;
    //Displays flash messages on every page - req.flash("error") "error" is the key in the k/v pair, passes the text to every template
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    //Proceed to the callback, nothing we happen next if we dont state this
    next();
});



//Uses our route pages (required above)
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);


//--------------------LISTENER--------------------
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("YelpCamp Server has startd") 
});








//-------------IRRELEVANT CODE (FYI)-------------------

//For the model "Campground" call the ".create" function and create a new camp
// Campground.create({
//     name: "Granite Hill", 
//     image: "http://www.photosforclass.com/download/7878880968",
//     description: "This is a huge granite hill, no bathrooms, no water, beautiful granite"
// }, function(err, campground){
//     //If there is an error print the error
//     if(err){
//         console.log(err)
//     //else display text and campground info (function is always executed)    
//     } else {
//         console.log("NEWLY CREATED CAMPGROUND");
//         console.log(campground);
//         }
//     }
// );

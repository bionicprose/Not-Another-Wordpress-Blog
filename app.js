var express         = require('express'),
    app             = express(),
    passport        = require('passport'),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    morgan          = require('morgan'),
    cookieParser    = require('cookie-parser'),
    flash           = require('express-flash'),
    session         = require('express-session'),
    methodOverride  = require('method-override'),
    LocalStrategy   = require('passport-local'),
    back            = require("express-back"),
    router          = express.Router({mergeParams:true}),
    myAPIKey        = process.env.MYAPIKEY;

var commentRoutes   = require('./routes/commentRoutes'),
    blogRoutes      = require('./routes/blogRoutes'),
    indexRoutes     = require('./routes/indexRoutes'),
    userRoutes      = require('./routes/userRoutes');

mongoose.connect('mongodb://localhost:27017/bionicprose', {useNewUrlParser: true});

require('./config/passport')(passport);

app.use(morgan('dev'));


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'pug');
app.use(methodOverride('_method'));


// secrets should be set as an environment variable and not in the code
// figure out how to do that.
app.use(cookieParser(myAPIKey));
app.use(session({
    secret:             myAPIKey,
    // cookie: {maxAge: 6000}, this line really fucked up sessions. need to figure out why and how to fix
    resave:             false,
    saveUninitialized:  false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use(function(req, res, next) {
    res.locals.currentUser  = req.user;

    next();
});




app.use(blogRoutes);
app.use(commentRoutes);
app.use(indexRoutes);
app.use(userRoutes);

//// error handling

app.use(function(req, res, next) {
    const error = new Error('Not found ' + req.params);
    error.status = 404;
    next(error);
});

app.use(function(error, req, res, next){
    res.status(error.status || 500);
    console.error(error.stack);
    res.json({
        error: {
            message: error.message
        }
    });
});



app.listen(3000, function() {
    console.log('BionicProse is running!');
});

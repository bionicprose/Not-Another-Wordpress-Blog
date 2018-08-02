var express         = require('express'),
    app             = express(),
    passport        = require('passport'),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    User            = require('./models/user.js'),
    blog            = require('./models/blog.js'),
    passport        = require('passport'),
    flash           = require('connect-flash'),
    methodOverride  = require('method-override'),
    LocalStrategy   = require('passport-local');

var commentRoutes   = require('./routes/comments'),
    blogRoutes      = require('./routes/blogRoutes'),
    indexRoutes     = require('./routes/indexRoutes');

mongoose.connect('mongodb://localhost:27017/bionicprose', {useNewUrlParser: true});

app.use(express.static(_dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'pug');
app.use(methodOverride('_method'));

app.listen(3000, function() {
    console.log('BionicProse is running!');
});

app.use(require('express-session')({
    secret:             'Yo yo, hinky-ho, hinky-ho. No mo dough',
    resave:             false,
    saveUninitialized:  false
}));

app.use(flash());

app.use(function(req, res, next) {
    res.locals.currentUser  = req.user;
    res.locals.error        = req.flash('error');
    res.locals.success      = req.flash('success');
    next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


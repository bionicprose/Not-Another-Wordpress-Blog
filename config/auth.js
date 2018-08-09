// config/auth.js

// facebook, twitter, and google auth

module.exports = {

    'facebookAuth' : {
        'clientID'      :'1905109646218883',
        'clientSecret'  : 'e148861b3d97d1775ccbdb3a27728f9b',
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['emails', 'first_name', 'last_name']
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:3000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '572495506682-d73a9mq3sa1nt84627o9u03t1li12k6p.apps.googleusercontent.com',
        'clientSecret'  : '3KjU0IREojzBFby_FsX89Fdo',
        'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    }

};
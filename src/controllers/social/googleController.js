require('dotenv').config('.env')
import passport from 'passport';
import loginService from '../../services/loginService';
const GoogleStrategy = require('passport-google-oauth20').Strategy;

let configloginwithGoogle = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_APP_CLIENT_ID,
        clientSecret: process.env.GOOGLE_APP_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_APP_REDIRECT_LOGIN
    },

        async function (accessToken, refreshToken, profile, cb) {
            const typeAcc = 'GOOGLE';
            let dataRaw = {
                lastName: profile.displayName,
                email: profile.emails && profile.emails.length > 0 ?
                    profile.emails[0].value : "",
                googleId: profile.id
            }
            let user = await loginService.upsertUserSocialMedia(typeAcc, dataRaw);
            return cb(null, user);

            // console.log('Huynh check abc: ', profile)
            // User.findOrCreate({ googleId: profile.id }, function (err, user) {
            //     return cb(err, user);
            // });

        }

    ));
}

module.exports = {
    configloginwithGoogle: configloginwithGoogle
}
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
	function(username, password, done) {
		// Done gets called once we have either accpeted or rejected the login request
		// Before that, we must make our database call to see if we can find a user with a matching username/password combo
		// TODO: Implement query to authenticate username/password combo
		succesfulLogin = true;
		if (succesfulLogin) {
			return done(null, {username: 'admin'}); // The null here is in the err feild...There was no error so remains null
		}
		// Return this if the authentication failed (Incorrect username/password combo)
		return done(null, false); // The null here is in the err feild...There was no error so remains null
	}
));

passport.serializeUser(function(user, done) {
	done(null, user.username);
});

passport.deserializeUser(function(username, done) {
	done(null, {username: username});
});

module.exports = passport;
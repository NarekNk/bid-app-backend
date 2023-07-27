const passport = require("passport");
const passportJwt = require("passport-jwt");

const { JWT_SECRET_KEY } = require("../utils/constants");
const { User } = require("../models");

const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;

passport.use(
  new StrategyJwt(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET_KEY,
    },
    (jwtPayload, done) => {
      return User.findOne({ where: { id: jwtPayload.id } })
        .then((user) => {
          return done(null, user);
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);

module.exports = passport;

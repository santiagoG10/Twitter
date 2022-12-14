const LocalStrategy = require("passport-local");
const User = require("../models/User"); // Aqui requerimos el modelo User para poder hacerle consultas al modelo en este Archivo.

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async function (
      username,
      password,
      done
    ) {
      let user;

      try {
        user = await User.findOne({
          $or: [{ email: username }, { username: username }],
        });
      } catch (error) {
        return done(error);
      }
      if (!user) {
        return done(null, false, { message: "Credenciales incorrectas" });
      }
      const checkPassword = await user.comparePassword(password); // comparePassword proviene de la funcion que creamos en el Archivo User.js llamada userSchema.methods.comparePassword
      if (!checkPassword) {
        return done(null, false, { message: "Credenciales incorrectas" });
      }
      return done(null, user);
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      const user = await User.findById(id);

      done(null, user);
    } catch (error) {
      console.log(error);
      done(error);
    }
  });
};

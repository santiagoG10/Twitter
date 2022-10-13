const express = require("express"); // Aqui le decimos a la pagina que utilizaremos Express
const app = express(); // Aqui guardamos dentro de la constante app las funciones de Express

app.set("view engine", "ejs"); // Aqui mostramos que el motor de vistas sera EJS

app.get("/", function (req, res) {
  return res.render("home");
});

app.get("/login", function (req, res) {
  return res.render("login");
});

app.get("/register", function (req, res) {
  return res.render("register");
});

app.listen(3000, function () {
  console.log("Servidor corriendo en el puerto 3000");
  console.log("http://localhost:3000");
});

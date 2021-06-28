const express = require("express");
const https = require("https");
const session = require("express-session");
const parseData = require(__dirname + "/parseData.js");


const NUM_POKEMON = 1118;
// let pokemonList = [];
const statNames = ["HP", "Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"];


const app = express();
// Allows us to use body-parser
app.use(express.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(session({
    secret: "hello",
    resave: false,
    saveUninitialized: false
}));


// We need the names of all pokemon for the pokemon selection dropdown
const allPokemonURL = "https://pokeapi.co/api/v2/pokemon?limit=" + NUM_POKEMON;
let allPokemonNames = "";
https.get(allPokemonURL, function (response) {
    response.on("data", function (data) {
        allPokemonNames += data;
    });

    response.on("end", function () {
        allPokemonNames = JSON.parse(allPokemonNames);
        allPokemonNames.results.sort(function (a, b) {
            if (a.name < b.name) {
                return -1;
            } else {
                return 1;
            }
        });
    });
});


app.get("/", function (req, res) {
    req.session.pokemonList = [];

    res.render("index.ejs", {
        allPokemonNames: allPokemonNames,
        pokemonList: req.session.pokemonList,
        statNames: statNames
    });
});


app.post("/", function (req, res) {
    const name = req.body.name;
    const gender = req.body.gender;
    const form = req.body.form;
    const url = "https://pokeapi.co/api/v2/pokemon/" + name.toLowerCase();

    https.get(url, function (response) {
        let pokemonData = "";

        response.on("data", function (data) {
            pokemonData += data;
        });

        response.on("end", function () {
            req.session.pokemonList.push(parseData.getPokemon(name, gender, form, JSON.parse(pokemonData)));
            res.render("index.ejs", {
                allPokemonNames: allPokemonNames,
                pokemonList: req.session.pokemonList,
                statNames: statNames
            });
        });
    });
});


app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port 3000.");
});
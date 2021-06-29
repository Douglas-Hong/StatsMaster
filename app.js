const express = require("express");
const https = require("https");
const session = require("express-session");
const parseData = require(__dirname + "/parseData.js");


const numPokemon = 1118;
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
const allPokemonURL = "https://pokeapi.co/api/v2/pokemon?limit=" + numPokemon;
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


function render(request, response, error) {
    response.render("index.ejs", {
        allPokemonNames: allPokemonNames,
        pokemonList: request.session.pokemonList,
        statNames: statNames,
        errorMessage: error
    });
}


app.get("/", function (req, res) {
    if (!req.session.pokemonList) {
        req.session.pokemonList = [];
    }

    render(req, res, "");
});


app.post("/", function (req, res) {
    if (req.body.name === "") {
        render(req, res, "You did not select a Pokémon yet!");
    } else {
        const name = req.body.name;
        const form = req.body.form;
        const url = "https://pokeapi.co/api/v2/pokemon/" + name.toLowerCase();

        https.get(url, function (response) {
            if (response.statusCode === 404) {
                render(req, res, "This Pokémon could not be retrieved because we searched for the data in the wrong place! Please report this in the feedback form!");
            } else if (response.statusCode !== 200) {
                render(req, res, "We currently cannot retrieve the data for this Pokémon. Please try again!");
            } else {
                let pokemonData = "";

                response.on("data", function (data) {
                    pokemonData += data;
                });

                response.on("end", function () {
                    req.session.pokemonList.push(parseData.getPokemon(name, form, JSON.parse(pokemonData)));
                    render(req, res, "");
                });
            }
        });
    }
});


app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port 3000.");
});
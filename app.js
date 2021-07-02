const express = require("express");
const https = require("https");
const session = require("express-session");
const mongoose = require("mongoose");
const parseData = require(__dirname + "/parseData.js");


const statNames = ["HP", "Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"];


const app = express();
// Allows us to use body-parser
app.use(express.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(express.static("public"));
// Allows us to give users different session IDs so that their teams are different
app.use(session({
    secret: "hello",
    resave: false,
    saveUninitialized: false
}));


mongoose.connect("mongodb+srv://admin-douglas:test123@cluster0.udvqp.mongodb.net/statsmaster?retryWrites=true&w=majority", {useNewUrlParser: true});
const teamSchema = new mongoose.Schema ({
    username: String,
    team: [{
        name: String,
        form: String,
        spriteURL: String,
        stats: [Number],
        types: [String],
        abilities: [{
            ability: String,
            url: String
        }],
        height: String,
        weight: Number,
        notableMoves: [{
            name: String,
            moveLevel: Number,
            url: String
        }]
    }]
});
const Team = mongoose.model("Team", teamSchema);


// This function renders index.ejs with the appropriate data (pokemonList, statNames, 
// errorMessage, warningMessage)
function render(request, response, error, warning) {
    response.render("index.ejs", {
        pokemonList: request.session.pokemonList,
        statNames: statNames,
        errorMessage: error,
        warningMessage: warning
    });
}


app.get("/", function (req, res) {
    // If a user has already opened the website, opening the website on a new tab with
    // the same session ID should not reset their team
    if (!req.session.pokemonList) {
        req.session.pokemonList = [];
    }

    render(req, res, "", "");
});


app.get("/about", function (req, res) {
    res.render("about.ejs");
});


app.get("/announcements", function (req, res) {
    res.render("announcements.ejs");
});


app.get("/feedback", function (req, res) {
    res.render("feedback.ejs");
});


app.post("/", function (req, res) {
    const name = req.body.name;
    const form = req.body.form;
    const url = "https://pokeapi.co/api/v2/pokemon/" + name;

    https.get(url, function (response) {
        if (response.statusCode === 404) {
            render(req, res, "This Pokémon could not be retrieved because we searched" +
                "for the data in the wrong place! Please report this in the feedback form!", "");
        } else if (response.statusCode !== 200) {
            render(req, res, "We currently cannot retrieve the data for this Pokémon. Please try again!", "");
        } else {
            let pokemonData = "";

            response.on("data", function (data) {
                pokemonData += data;
            });

            response.on("end", function () {
                pokemonData = JSON.parse(pokemonData);
                req.session.pokemonList.push(parseData.getPokemon(name, form, pokemonData));

                if (pokemonData.moves.length === 0) {
                    render(req, res, "", "All Generation 8 Pokémon have a blank Notable Moves " +
                        "section because our data source currently does not provide any moves for " +
                        "these Pokémon. Hopefully this issue will be resolved soon!");
                } else {
                    render(req, res, "", "");
                }
            });
        }
    });
});


app.post("/remove", function (req, res) {
    req.session.pokemonList.splice(req.body.removeButton, 1);
    res.redirect("/");
});


app.post("/save-team", function (req, res) {
    res.render("saveTeam.ejs");
})


app.post("/save", function (req, res) {
    if (req.body.saveButton === "save") {
        let currentUsername = req.body.username;
    
        Team.findOne({username: currentUsername}, function(err, team) {
            if (err) {
                console.log(err);
            } else if (!team) {
                const newTeam = new Team ({
                    username: currentUsername,
                    team: req.session.pokemonList
                });
                newTeam.save();
            } else {
                Team.updateOne({username: currentUsername}, {team: req.session.pokemonList}, function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        })
    }

    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port 3000.");
});
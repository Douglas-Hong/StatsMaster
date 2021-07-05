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
function render(request, response, error, warning, success) {
    response.render("index.ejs", {
        pokemonList: request.session.pokemonList,
        statNames: statNames,
        errorMessage: error,
        warningMessage: warning,
        successMessage: success
    });
}


app.get("/", function (req, res) {
    // If a user has already opened the website, opening the website on a new tab with
    // the same session ID should not reset their team
    if (!req.session.pokemonList) {
        req.session.pokemonList = [];
    }

    if (req.session.savedSuccessfully) {
        req.session.savedSuccessfully = false;
        render(req, res, "", "", "Your team was saved! Please remember your username so you can load the team in the future!");
    } else if (req.session.loadedSuccessfully) {
        req.session.loadedSuccessfully = false;
        render(req, res, "", "", "Your team has been loaded! If this is not your team, it is highly likely someone else is using " +
            "your username; in that case, please use another username!");
    } else {
        render(req, res, "", "", "");
    }
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


app.get("/save-team", function (req, res) {
    res.render("saveTeam.ejs");
});


app.get("/load-team", function (req, res) {
    if (req.session.usernameNotFound) {
        req.session.usernameNotFound = false;
        res.render("loadTeam.ejs", {errorMessage: "That username does not exist!"});
    } else {
        res.render("loadTeam.ejs", {errorMessage: ""});
    } 
});


function pokemonAlreadyExists(name, form, pokemonList) {
    if (form === "shiny") {
        name += "-shiny";
    }

    for (let i = 0; i < pokemonList.length; i++) {
        if (pokemonList[i].originalName === name) {
            return true;
        }
    }
    
    return false;
}


function handleHTTPResponse(req, res, name, form, url) {
    https.get(url, function (response) {
        if (response.statusCode === 404) {
            render(req, res, "This Pokémon could not be retrieved because we searched" +
                "for the data in the wrong place! Please report this in the feedback form!", "", "");
        } else if (response.statusCode !== 200) {
            render(req, res, "We currently cannot retrieve the data for this Pokémon. Please try again!", "", "");
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
                        "these Pokémon. Hopefully this issue will be resolved soon!", "");
                } else {
                    render(req, res, "", "", "");
                }
            });
        }
    });
}


app.post("/", function (req, res) {
    const name = req.body.name;
    const form = req.body.form;
    const url = "https://pokeapi.co/api/v2/pokemon/" + name;

    if (pokemonAlreadyExists(name, form, req.session.pokemonList)) {
        render(req, res, "You already added that exact Pokémon! Try a shiny or non-shiny form instead!", "", "");
    } else {
        handleHTTPResponse(req, res, name, form, url);
    }
});


app.post("/remove", function (req, res) {
    req.session.pokemonList.splice(req.body.removeButton, 1);
    res.redirect("/");
});


app.post("/team-action", function (req, res) {
    if (req.body.submitButton === "save") {
        res.redirect("/save-team");
    } else if (req.body.submitButton === "load"){
        res.redirect("/load-team");
    } else {
        req.session.pokemonList = [];
        res.redirect("/");
    }
})


app.post("/save", function (req, res) {
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
            req.session.savedSuccessfully = true;
        } else {
            Team.updateOne({username: currentUsername}, {team: req.session.pokemonList}, function(err) {
                if (err) {
                    console.log(err);
                }
            });
            req.session.savedSuccessfully = true;
        }
        res.redirect("/");
    });
});


app.post("/load", function (req, res) {
    let currentUsername = req.body.username;

    Team.findOne({username: currentUsername}, function(err, team) {
        if (err) {
            console.log(err);
        } else if (!team) {
            req.session.usernameNotFound = true;
            res.redirect("/load-team");
        } else {
            req.session.pokemonList = team.team;
            req.session.loadedSuccessfully = true;
            res.redirect("/"); 
        }
    });
});


app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port 3000.");
});
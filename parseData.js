exports.getPokemon = getPokemon;


class Pokemon {
    constructor(name, form, spriteURL, stats, types, abilities, height, weight, notableMoves) {
        this.name = name;
        this.form = form;
        this.spriteURL = spriteURL;
        this.stats = stats;
        this.types = types;
        this.abilities = abilities;
        this.height = height;
        this.weight = weight;
        this.notableMoves = notableMoves
    }
}


class Ability {
    constructor(ability, url) {
        this.ability = ability;
        this.url = url
    }
}


class Move {
    constructor(name, moveLevel, url) {
        this.name = name;
        this.moveLevel = moveLevel;
        this.url = url
    }
}


function getPokemon(name, form, pokemonData) {
    name = parseName(name);

    let spriteURL = "";
    if (form === "not-shiny") {
        spriteURL = pokemonData.sprites.front_default;
    } else {
        spriteURL = pokemonData.sprites.front_shiny;
        name += " (Shiny)";
    }

    let stats = [];
    for (let i = 0; i < pokemonData.stats.length; i++) {
        stats.push(Number(pokemonData.stats[i].base_stat));
    }

    let types = [];
    for (let i = 0; i < pokemonData.types.length; i++) {
        types.push(pokemonData.types[i].type.name);
    }

    let abilities = [];
    for (let i = 0; i < pokemonData.abilities.length; i++) {
        abilities.push(parseAbility(pokemonData.abilities[i].ability.name));
    }

    let moves = [];
    for (let i = 0; i < pokemonData.moves.length; i++) {
        moves.push(parseMove(pokemonData.moves[i]));
    }

    const height = Number(pokemonData.height) * 10; // decimeters to cm
    const weight = Number(pokemonData.weight) / 10; // hectograms to kg

    return new Pokemon(name, form, spriteURL, stats, types, abilities, height, weight, getNotableMoves(moves, abilities.length));
}


function parseName(name) {
    let newName = name[0].toUpperCase() + name.slice(1, name.length);

    if (newName.endsWith("-mega")) {
        newName = "Mega " + newName.slice(0, newName.length - 5);
    } else if (newName.endsWith("-mega-x")) {
        newName = "Mega " + newName.slice(0, newName.length - 7) + "-X";
    } else if (newName.endsWith("-mega-y")) {
        newName = "Mega " + newName.slice(0, newName.length - 7) + "-Y";
    } else if (newName.endsWith("-alola")) {
        newName = "Alolan " + newName.slice(0, newName.length - 6);
    } else if (newName.endsWith("-galar")) {
        newName = "Galarian " + newName.slice(0, newName.length - 6);
    }

    return formatCapitalization(newName);
}


function formatCapitalization(text) {
    let newText = text[0].toUpperCase() + text.slice(1, text.length).replace("-", " ");

    for (let i = 0; i < newText.length; i++) {
        if (newText[i] === " ") {
            newText = newText.slice(0, i + 1) + newText[i + 1].toUpperCase() + newText.slice(i + 2, newText.length);
        }
    }

    return newText;
}


function formatForURL(url) {
    let newURL = url;

    for (let i = 0; i < newURL.length; i++) {
        if (newURL[i] === "-") {
            newURL = newURL.slice(0, i) + newURL.slice(i + 1, newURL.length);
        }
    }

    return newURL;
}


function parseAbility(ability) {
    let abilityURL = "https://www.serebii.net/abilitydex/" + formatForURL(ability) + ".shtml";
    return new Ability(formatCapitalization(ability), abilityURL);
}


function parseMove(move) {
    let moveLevel = Number(move.version_group_details[0].level_learned_at);
    let moveURL = "https://www.serebii.net/attackdex-swsh/" + formatForURL(move.move.name) + ".shtml";
    return new Move(formatCapitalization(move.move.name), moveLevel, moveURL);
}


function getNotableMoves(moves, numAbilities) {
    // Sort from greatest move level to smallest move level
    moves.sort(function (a, b) {
        if (a.moveLevel > b.moveLevel) {
            return -1;
        } else {
            return 1;
        }
    });

    // The abilities section is right above the notable moves section,
    // so the more abilities the pokemon has, the less notable moves we should show
    if (numAbilities >= 3) {
        return moves.slice(0, 4);
    } else {
        return moves.slice(0, 5);
    }
}
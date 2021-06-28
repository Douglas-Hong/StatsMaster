exports.getPokemon = getPokemon;


class Pokemon {
    constructor(name, gender, form, spriteURL, stats, types, abilities, height, weight) {
        this.name = name;
        this.gender = gender;
        this.form = form;
        this.spriteURL = spriteURL;
        this.stats = stats;
        this.types = types;
        this.abilities = abilities;
        this.height = height;
        this.weight = weight;
    }
}


class Ability {
    constructor(ability, url) {
        this.ability = ability;
        this.url = url
    }
}


function getPokemon(name, gender, form, pokemonData) {
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

    const height = Number(pokemonData.height) * 10; // decimeters to cm
    const weight = Number(pokemonData.weight) / 10; // hectograms to kg

    return new Pokemon(name, gender, form, spriteURL, stats, types, abilities, height, weight);
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

    for (let i = 0; i < newName.length; i++) {
        if (newName[i] === "-") {
            newName = newName.slice(0, i + 1) + newName[i + 1].toUpperCase() + newName.slice(i + 2, newName.length);
        }
    }

    return newName;
}


function parseAbility(ability) {
    let newAbility = ability[0].toUpperCase() + ability.slice(1, ability.length).replace("-", " ");

    for (let i = 0; i < newAbility.length; i++) {
        if (newAbility[i] === " ") {
            newAbility = newAbility.slice(0, i + 1) + newAbility[i + 1].toUpperCase() + newAbility.slice(i + 2, newAbility.length);
        }
    }

    let abilityURL = "https://www.serebii.net/abilitydex/" + ability + ".shtml";

    for (let i = 0; i < abilityURL.length; i++) {
        if (abilityURL[i] === "-") {
            abilityURL = abilityURL.slice(0, i) + abilityURL.slice(i + 1, abilityURL.length);
        }
    }

    return new Ability(newAbility, abilityURL);
}
exports.getPokemon = getPokemon;


// Given the name, form (shiny/not shiny), and parsed JSON data for a specific
// Pokémon, this function returns a Pokémon object that contains various
// amounts of interesting data
function getPokemon(name, form, pokemonData) {
    // The original name is necessary because we are going to use it as the name 
    // for certain classes and IDs
    originalName = name;
    if (form === "shiny") {
        originalName += "-shiny";
    }
    
    name = formatName(name);

    let spriteURL = "";
    if (form === "not-shiny") {
        spriteURL = pokemonData.sprites.front_default;
    } else {
        spriteURL = pokemonData.sprites.front_shiny;
        name += " (Shiny)";
    }

    let stats = [];
    for (let i = 0; i < pokemonData.stats.length; i++) {
        stats.push(pokemonData.stats[i].base_stat);
    }

    let types = [];
    for (let i = 0; i < pokemonData.types.length; i++) {
        types.push(pokemonData.types[i].type.name);
    }

    let abilities = [];
    for (let i = 0; i < pokemonData.abilities.length; i++) {
        abilities.push(getAbility(pokemonData.abilities[i].ability.name, pokemonData.abilities[i].is_hidden));
    }

    const heightInches = pokemonData.height * 3.937; // decimeters to in
    const height = Math.floor(heightInches / 12) + "'" + Math.floor(heightInches -
        (Math.floor(heightInches / 12) * 12)) + "''"; // in to ft
    const weight = (pokemonData.weight / 4.536).toFixed(1); // hectograms to lbs

    let moves = [];
    for (let i = 0; i < pokemonData.moves.length; i++) {
        moves.push(getMove(pokemonData.moves[i]));
    }

    return {
        originalName: originalName,
        name: name,
        form: form,
        spriteURL: spriteURL,
        iconURL: pokemonData.sprites.versions["generation-viii"].icons.front_default,
        stats: stats,
        types: types,
        abilities: abilities,
        height: height,
        weight: weight,
        notableMoves: getNotableMoves(moves, abilities.length)
    };
}


// This function fixes the capitalization of the Pokémon's name (i.e., 
// every word will have its first letter capitalized); if the Pokémon is
// a Mega Evolution, Mega Evolution-X, Mega-Evolution-Y, Alolan, or Galarian,
// the name will be slightly different
function formatName(name) {
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

    return formatCapitalization(newName, "-");
}


// This function fixes the capitalization of the given piece of text; if 
// the delimiter (a single character that denotes the end of one word) is seen, 
// then the next character will be capitalized
function formatCapitalization(text, delimiter) {
    let newText = text;

    for (let i = 0; i < newText.length; i++) {
        if (newText[i] === delimiter) {
            newText = newText.slice(0, i + 1) + newText[i + 1].toUpperCase() +
                newText.slice(i + 2, newText.length);
        }
    }

    return newText;
}


// This function formats the given piece of text so that it can be inserted
// into a valid Serebii URL; to this, we have to convert all the characters to lowercase,
// and all dashes will be replaced with deleted
function formatForURL(text) {
    let newText = text;

    for (let i = 0; i < newText.length; i++) {
        if (newText[i] === "-") {
            newText = newText.slice(0, i) + newText.slice(i + 1, newText.length);
        }
    }

    return newText;
}


// This function returns a new Ability object with a formatted name and valid URL
function getAbility(ability, isHidden) {
    let newAbility = ability[0].toUpperCase() + ability.slice(1, ability.length).replace(/\-/g, " ");
    let abilityURL = "https://www.serebii.net/abilitydex/" + formatForURL(ability) + ".shtml";
    return {
        ability: formatCapitalization(newAbility, " "),
        url: abilityURL,
        isHidden: isHidden
    };
}


// This function returns a new Move object with a formatted name, move level, and valid URL
function getMove(move) {
    let moveName = move.move.name[0].toUpperCase() + move.move.name.slice(1, move.move.name.length).replace(/\-/g, " ");
    let moveLevel = move.version_group_details[0].level_learned_at;
    let moveURL = "https://www.serebii.net/attackdex-swsh/" + formatForURL(move.move.name) + ".shtml";
    return {
        name: formatCapitalization(moveName, " "),
        moveLevel: moveLevel,
        url: moveURL
    };
}


// This function returns an array of the most notable moves, given an array of Move objects.
// The algorithm is based on the move level of each Move object; the higher the move level,
// the more notable the move is
function getNotableMoves(moves, numAbilities) {
    // Sort from greatest move level to smallest move level
    moves.sort((a, b) => (a.moveLevel > b.moveLevel) ? -1 : 1);

    // The abilities section is right above the notable moves section,
    // so the more abilities the pokemon has, the less notable moves we should show
    return numAbilities >= 3 ? moves.slice(0, 4) : moves.slice(0, 5);
}
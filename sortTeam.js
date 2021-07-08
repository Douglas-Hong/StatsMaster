exports.sort = sort;


function sort(order, pokemonList) {
    if (order === "a-z") {
        sortAlphabetical(pokemonList);
    } else if (order === "z-a") {
        sortAlphabetical(pokemonList, true);
    } else if (order === "low-high-stat") {
        sortBaseStatTotal(pokemonList);
    } else {
        sortBaseStatTotal(pokemonList, true);
    }
}


function sortAlphabetical(pokemonList, reverse = false) {
    pokemonList.sort(function (a, b) {
        if (a.name < b.name) {
            return -1;
        } else {
            return 1;
        }
    });

    if (reverse) {
        pokemonList.reverse();
    }
}


function sortBaseStatTotal(pokemonList, reverse = false) {
    pokemonList.sort(function (a, b) {
        if (a.stats.reduce((s1, s2) => s1 + s2, 0) < b.stats.reduce((s1, s2) => s1 + s2, 0)) {
            return -1;
        } else {
            return 1;
        }
    });

    if (reverse) {
        pokemonList.reverse();
    }
}
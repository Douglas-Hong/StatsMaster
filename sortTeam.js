exports.sort = sort;


function sort(order, pokemonList) {
    if (order === "a-z") {
        sortAlphabetical(pokemonList);
    } else if (order === "z-a") {
        sortAlphabetical(pokemonList, true);
    } else if (order === "low-high-stat") {
        sortBaseStatTotal(pokemonList);
    } else if (order === "high-low-stat") {
        sortBaseStatTotal(pokemonList, true);
    } else if (order === "short-tall"){
        sortHeight(pokemonList);
    } else if (order === "tall-short") {
        sortHeight(pokemonList, true);
    } else if (order === "light-heavy") {
        sortWeight(pokemonList);
    } else if (order === "heavy-light") {
        sortWeight(pokemonList, true);
    } else if (order.startsWith("low-high")) {
        sortByStat(order[order.length - 1], pokemonList);
    } else if (order.startsWith("high-low")) {
        sortByStat(order[order.length - 1], pokemonList, true);
    }
}


function sortAlphabetical(pokemonList, reverse = false) {
    pokemonList.sort(function (a, b) {
        if (a.name < b.name) return -1;
        else return 1;
    });

    if (reverse) pokemonList.reverse();
}


function sortBaseStatTotal(pokemonList, reverse = false) {
    pokemonList.sort(function (a, b) {
        if (a.stats.reduce((s1, s2) => s1 + s2, 0) < b.stats.reduce((s1, s2) => s1 + s2, 0)) return -1;
        else return 1;
    });

    if (reverse) pokemonList.reverse();
}


function sortHeight(pokemonList, reverse = false) {
    pokemonList.sort(function (a, b) {
        if (a.height < b.height) return -1;
        else return 1;
    });

    if (reverse) pokemonList.reverse();
}


function sortWeight(pokemonList, reverse = false) {
    pokemonList.sort(function (a, b) {
        if (a.weight < b.weight) return -1;
        else return 1;
    });

    if (reverse) pokemonList.reverse();
}


function sortByStat(statIndex, pokemonList, reverse = false) {
    pokemonList.sort(function (a, b) {
        if (a.stats[statIndex] < b.stats[statIndex]) return -1;
        else return 1;
    });

    if (reverse) pokemonList.reverse();
}
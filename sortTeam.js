exports.sort = sort;


// This function sorts a pokemon list based on the given order/characteristic
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


// Sorts all pokemon in the given list in ABC order; if reverse is specified as true,
// this will sort all pokemon in reverse ABC order
function sortAlphabetical(pokemonList, reverse = false) {
    pokemonList.sort((a, b) => (a.name < b.name) ? -1 : 1);
    if (reverse) pokemonList.reverse();
}


// Sorts all pokemon in the given list by their base stat total (i.e., the sum of all
// their base stats); if reverse is true, then this will sort the pokemon from
// highest base stat total to lowest base stat total
function sortBaseStatTotal(pokemonList, reverse = false) {
    pokemonList.sort((a, b) => {
        return (a.stats.reduce((s1, s2) => s1 + s2, 0) < b.stats.reduce((s1, s2) => s1 + s2, 0)) ? -1 : 1;
    });
    if (reverse) pokemonList.reverse();
}


// Sorts all pokemon in the given list by their height (in feet and inches); if reverse
// is true, then this will sort the pokemon from tallest height to shortest height
function sortHeight(pokemonList, reverse = false) {
    pokemonList.sort((a, b) => (a.height < b.height ? -1 : 1));
    if (reverse) pokemonList.reverse();
}


// Sorts all pokemon in the given list by their weight (in pounds); if reverse is true,
// then this will sort the pokemon from highest weight to lowest weight
function sortWeight(pokemonList, reverse = false) {
    pokemonList.sort((a, b) => (a.weight < b.weight ? -1 : 1));
    if (reverse) pokemonList.reverse();
}


// Sorts all pokemon in the given list by a specific base stat; if reverse is true,
// then this will sort the pokemon from highest stat to lowest stat
// The stat indices are as follows: HP = 0, Attack = 1, Defense = 2, Sp. Atk = 3,
// Sp. Def = 4, Speed = 5
function sortByStat(statIndex, pokemonList, reverse = false) {
    pokemonList.sort((a, b) => (a.stats[statIndex] < b.stats[statIndex]) ? -1 : 1);
    if (reverse) pokemonList.reverse();
}
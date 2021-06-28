// As of generation 8, the highest individual base stat is 255 (Blissey's HP stat);
// this number will help us calculate the width of each stat bar;
const MAX_STAT = 255;

// For extremely small stats (less than or equal to 5), we set the width to 3%
for (let i = 1; i <= 5; i++) {
    $(".stat-value-" + i + " > .progress > .progress-bar").css("width", "3%");
}

for (let i = 6; i <= MAX_STAT; i++) {
    $(".stat-value-" + i + " > .progress > .progress-bar").css("width", Math.round((i / MAX_STAT) * 100) + "%");
}
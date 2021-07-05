$(".icon-button").on("click", function() {
    const pokemonName = $(this).attr("name");

    $("html, body").animate(
        { scrollTop: $("#" + pokemonName).offset().top }, 50
    );
});

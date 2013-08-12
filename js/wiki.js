$("#query").keyup(function(event) {
    // FIXME
    // Keyup triggeres too many requests !
    var data = {
        format: "json",
        action: "query",
        titles: encodeURIComponent($("#query").val().replace(/ /g, "_")),
        prop: "revisions",
        rvprop: "content",
        rvsection: 0,
        rvparse: "",
    }
    $.ajax({
        url: 'http://en.wikipedia.org/w/api.php?callback=?',
        dataType: 'json',
        data: data,
        success: successHandler,
        error: errorHandler
    });
});

function successHandler (data) {
    for (name in data.query.pages) {
        var page = data.query.pages;
        $("#info").html(page[name].revisions[0]["*"]);
    }
}

function errorHandler (err) {
    console.error(err);
}

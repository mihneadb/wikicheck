var action;

$("#query").keyup(function(event) {
    var input = $("#query").val().trim();
    if (!input) {
        $("#info").html("");
        return;
    }

    var data = {
        format: "json",
        action: "query",
        titles: encodeURIComponent(input.replace(/ /g, "_")),
        prop: "revisions",
        rvprop: "content",
        rvsection: 0,
        rvparse: "",
    }

    if (action) {
        window.clearTimeout(action);
    }
    action = window.setTimeout(function() {
        $.ajax({
            url: 'http://en.wikipedia.org/w/api.php?callback=?',
            dataType: 'json',
            data: data,
            success: successHandler,
            error: errorHandler
        });
    }, 250);
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

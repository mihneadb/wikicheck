$("#query").focus();
$(document).click(function() {
    $("#query").focus();
});


//http://stackoverflow.com/a/5574446
String.prototype.toProperCase = function () {
        return this.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
};

var action;

$("#query").keyup(function(event) {
    if (action) {
        window.clearTimeout(action);
    }

    var input = $("#query").val().trim().toProperCase();
    if (input === "") {
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
        rvparse: true,
        rvexpandtemplates: true,
        redirects: true,
        iwurl: true,
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
        if ("revisions" in page[name]) {
            content = page[name].revisions[0]["*"];
            $("#info").html(content);

            // fix all the links
            $("a").each(function() {
                this.href = this.href.replace(window.location.origin, "http://en.wikipedia.org");
            });

            // remove errors
            $(".error").remove();
            return;
        }
    }
    $("#info").html("<p>Not found.</p>");
}

function errorHandler (err) {
    console.error(err);
}

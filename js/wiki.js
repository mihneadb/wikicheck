var height = $(window).height() - $("#info").offset().top;
$("#info").height(height);

$(window).resize(function() {
    var height = $(window).height() - $("#info").offset().top;
    $("#info").height(height);
});

$("#images").change(queryWiki);
$("#infobox").change(queryWiki);
$("#links").change(queryWiki);

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

$("#query").on("input", queryWiki);

function queryWiki() {
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
        $("#info").html("<img src='img/spinner.gif'>").addClass("text-center");
        $.ajax({
            url: 'http://en.wikipedia.org/w/api.php?callback=?',
            dataType: 'json',
            data: data,
            success: successHandler,
            error: errorHandler
        });
    }, 350);
}

function successHandler (data) {
    $("#info").removeClass("text-center");
    for (name in data.query.pages) {
        var page = data.query.pages;
        if ("revisions" in page[name]) {
            content = page[name].revisions[0]["*"];
            $("#info").html(content);

            if ($("#links").is(":checked")) {
                // fix all the links
                $("a").each(function() {
                    this.href = this.href.replace(window.location.origin, "http://en.wikipedia.org");
                });
            } else {
                // change links to <em>
                content = content.replace(/<a/g, "<em");
                content = content.replace(/<\/a/g, "</em");
                $("#info").html(content);
            }

            // strip content
            $(".error").remove();
            if (!$("#infobox").is(":checked")) {
                $(".infobox").remove();
            }
            if (!$("#images").is(":checked")) {
                $(".thumb").remove();
            }
            return;
        }
    }
    $("#info").html("<p>Not found.</p>");
}

function errorHandler (err) {
    console.error(err);
}

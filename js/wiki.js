$(document).ready(function() {

$("#query").keyup(function(event) {
    $.ajax({
        type: "GET",
        url: "http://en.wikipedia.org/w/api.php?callback=?",
        data: {
            format: "json",
            action: "query",
            titles: encodeURIComponent($("#query").val().replace(/ /g, "_")),
            prop: "revisions",
            rvprop: "content",
            rvsection: 0,
            rvparse: "",
        },
        success:
            function(data) {
                console.log("data!!");

                for (name in data.query.pages) {
                    $("#info").html(data.query.pages[name].revisions[0]["*"]);
                }
            },
        dataType: "json",
        error: function(a, b, c) {
            $("#debug").html(b);
        }
    });
});

});

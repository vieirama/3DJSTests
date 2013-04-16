$(document).ready(function () {

    $("#submit").die("click").live("click", function () {
        callPost();
    });

    function callPost() {
        $("#warning").text("");
        $("#warning").hide();
        var json = $("#jsonString").val();

        if (json == "") {
            $("#warning").text("String can not be empty");
            $("#warning").show();
        }
        else {

            //Insert code here...
            var jsonObject = eval('(' + json + ')');

            // Will display the string 'someValue'
            console.log(jsonObject);
        }
    }

    d3.selectAll("p").style("color", function () {
        return "hsl(" + Math.random() * 360 + ",100%,50%)";
    });

    d3.selectAll("#testId").style("color", function () {
        return "hsl(" + Math.random() * 360 + ",100%,50%)";
    });

    d3.select("#colorId").transition().style("color", function () {
        return "hsl(" + Math.random() * 360 + ",100%,50%)";
    });

    d3.selectAll("#circle").transition().style("color", function () {
        return "hsl(" + Math.random() * 360 + ",100%,50%)";
    });

    d3.selectAll("#circle").transition().style("background-color", function () {
        return "hsl(" + Math.random() * 360 + ",100%,50%)";
    });
});

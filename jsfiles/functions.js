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


        //Insert code here...
    }


});

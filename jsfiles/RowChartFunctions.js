
$("#submit").die("click").live("click", function () {
    if($('input[name=chartOption]:checked').val() == "pieChart") {
        $("#warning").text("");
        $("#warning").hide();
        clearGraphs();

        var json = $("#jsonString").val();

        if (json == "") {
            $("#warning").text("String can not be empty");
            $("#warning").show();
        }
        else {
            var jsonObject = eval('(' + json + ')');
            console.log(jsonObject);
            //drawRowChart(jsonObject);
        }
    }
});



drawRowChart(null);

function drawRowChart(JSONData){
 var margin = { top: 30, right: 10, bottom: 10, left: 10 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    var dataset = []
    //var jsonObject = eval('(' + json + ')');


    var x = d3.scale.linear() .range([5, width])

    var y = d3.scale.ordinal().rangeRoundBands([0, height], .2);

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top");

    var yAxis = d3.svg.axis().scale(y).orient("down");

    var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    d3.tsv("data.tsv", type, function (error, data) {
        x.domain(d3.extent(data, function (d) { return d.value; })).nice();
        y.domain(data.map(function (d) { return d.name; }));

        svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class",  "bar" )
        .attr("x", function (d) { return x(Math.min(0, d.value)); })
        .attr("y", function (d) { return y(d.name); })
        .attr("width", function (d) { return Math.abs(x(d.value) - x(0)); })
        .attr("height", y.rangeBand());

        svg.append("g")
        .attr("class", "x axis")
        .call(xAxis);

        svg.append("g")
        .attr("class", "y axis")
        .append("line")
        .attr("x1", x(0))
        .attr("x2", x(0))
        .attr("y1", y(0))
        .attr("y2", 500)
        ;

    });
}

    function type(d) {
        d.value = +d.value;
        return d;
    }

    function clearGraphs() {
        $("#graph svg").remove();
        $("#d3portfolio svg").remove();
    }
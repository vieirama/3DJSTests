$(document).ready(function () {
    $("#submit").click(function () {
        if($('input[name=chartOption]:checked').val() == "newLineChart") {
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
                drawNewLineChart(jsonObject);
            }
        }
    });
});

var margin = 40;

var w = 800 - margin * 2;
var h = 400 - margin * 2;

//var data = d3.range(11).map(function () { return Math.random() * 9 })
function drawNewLineChart(data) {
  
  var svg = d3.select("#graph")
  .append("svg")
  .attr("width", w + margin * 2)
  .attr("height", h + margin * 2)
  .append("g")
  .attr("transform", "translate(" + margin + "," + margin + ")")
  .attr("xmlns", "http://www.w3.org/2000/svg");

  //      var x = d3.scale.linear().domain([0, 10]).range([0, w]);
  //      var y = d3.scale.linear().domain([0, 10]).range([h, 0]);     

  var	x = d3.scale.ordinal().rangeRoundBands([0, w]);					// scales the range of values on the x axis to fit between 0 and 'width'
  var	y = d3.scale.linear().range([h, 0]);				// scales the range of values on the y axis to fit between 'height' and 0
       
  var values = [];

  x.domain(data.dataset.map(function(d) { return d.label; }));		// set the x domain so be as wide as the range of dates we have.
  y.domain([0, d3.max(data.dataset, function(d) { values.push(d.value); return d.value; })]);	// set the y domain to go from 0 to the maximum value of d.close

  var line = d3.svg.line()
  .interpolate("cardinal")
  .x(function (d, i) { return x(i); })
  .y(function (d) { return y(d); })

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  svg.append("g")
  .attr("class", "x lineaxis")
  .attr("transform", "translate(0," + h + ")")
  .text("x")
  .call(xAxis);

  svg.append("g")
  .attr("class", "y lineaxis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("y");

  var path = svg.append("path")
  .attr("d", line(values))
  .attr("stroke", "steelblue")
  .attr("stroke-width", "2")
  .attr("fill", "none")
  .attr("transform", "translate(40,0)");

  var totalLength = path.node().getTotalLength();

  path
  .attr("stroke-dasharray", totalLength + " " + totalLength)
  .attr("stroke-dashoffset", totalLength)
  .transition()
    .duration(2000)
    .ease("linear")
    .attr("stroke-dashoffset", 0);


  svg.on("click", function () {
      path
    .transition()
    .duration(2000)
    .ease("linear")
    .attr("stroke-dashoffset", totalLength);
  })
}
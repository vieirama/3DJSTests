$(document).ready(function () {
    $("#submit").click(function () {
        if($('input[name=chartOption]:checked').val() == "trendGraphChart") {
            $("#warning").text("");
            $("#warning").hide();
            clearGraphs();
            chart1();
           /* var json = $("#jsonString").val();

            if (json == "") {
                $("#warning").text("String can not be empty");
                $("#warning").show();
            }
            else {
                var jsonObject = eval('(' + json + ')');
                console.log(jsonObject);
                drawStackChart(jsonObject.dataset);
            }*/
        }
    });
});

function chart1() {
  var width = 960,
      height = 500;

  var color = d3.scale.category20();

//  var fisheye = d3.fisheye.circular()
//      .radius(120);

  var force = d3.layout.force()
      .charge(-240)
      .linkDistance(40)
      .size([width, height]);

  var svg = d3.select("#graph").append("svg")
      .attr("width", width)
      .attr("height", height);

  svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height);

  d3.json("miserables.json", function(data) {
    var n = data.nodes.length;

    force.nodes(data.nodes).links(data.links);

    // Initialize the positions deterministically, for better results.
    data.nodes.forEach(function(d, i) { d.x = d.y = width / n * i; });

    // Run the layout a fixed number of times.
    // The ideal number of times scales with graph complexity.
    // Of course, don't run too long—you'll hang the page!
    force.start();
    for (var i = n; i > 0; --i) force.tick();
    force.stop();

    // Center the nodes in the middle.
    var ox = 0, oy = 0;
    data.nodes.forEach(function(d) { ox += d.x, oy += d.y; });
    ox = ox / n - width / 2, oy = oy / n - height / 2;
    data.nodes.forEach(function(d) { d.x -= ox, d.y -= oy; });

    var link = svg.selectAll(".link")
        .data(data.links)
      .enter().append("line")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
        .style("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = svg.selectAll(".node")
        .data(data.nodes)
      .enter().append("circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", 4.5)
        .style("fill", function(d) { return color(d.group); })
        .call(force.drag);

  var texts = svg.selectAll("g")
                .data(data.nodes)
                .enter().append("text")
               // .attr("class", "stackChartAxisText")
                .attr("fill", "black")
                .attr("x", function(d){ return d.x; })
                .attr("y", function(d){ return d.y; })
                .text(function(d) { return d.name })
                .style("font-family", "Arial")
                .style("font-size", 12);


  /*    node.append("svg:text")
  
          .text("nome")
          .style("font-color", "red")
          .style("font-family", "Arial")
          .style("font-size", 12);
*/
     /*   svg.append("svg:text")
        .text("name")
        .style("fill", "#555")
        .style("font-family", "Arial")
        .style("font-size", 12);
*/

/*    svg.on("mousemove", function() {
      fisheye.focus(d3.mouse(this));

      node.each(function(d) { d.fisheye = fisheye(d); })
          .attr("cx", function(d) { return d.fisheye.x; })
          .attr("cy", function(d) { return d.fisheye.y; })
          .attr("r", function(d) { return d.fisheye.z * 4.5; });

      link.attr("x1", function(d) { return d.source.fisheye.x; })
          .attr("y1", function(d) { return d.source.fisheye.y; })
          .attr("x2", function(d) { return d.target.fisheye.x; })
          .attr("y2", function(d) { return d.target.fisheye.y; });
    });*/
  });
}

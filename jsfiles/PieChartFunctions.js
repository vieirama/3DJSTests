$(document).ready(function () {
    $("#submit").click(function () {
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
                updateChart(jsonObject);
            }
        }
    });
});
var w = 1000,                       // width and height, natch
h = 600,
r = Math.min(w, h) / 2-100,        // arc radius
dur = 2000,                     // duration, in milliseconds
delay = 500,
color = d3.scale.category10(),
donut = d3.layout.pie().sort(null),
arc = d3.svg.arc().innerRadius(r - 10).outerRadius(0),
arcOver = d3.svg.arc().innerRadius(r + 30).outerRadius(0);


// --------- "PAY NO ATTENTION TO THE MAN BEHIND THE CURTAIN" ---------

// Store the currently-displayed angles in this._current.
// Then, interpolate from this._current to the new angles.
function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function (t) {
        return arc(i(t));
    };
}

// update chart
function updateChart(JSONdata) {

    inc = { labels: [], pct: [], id: [] };
    
    values = { labels: [], pct: [], id:[] }

    for (var i = 0; i < JSONdata.dataset.length; i++) {
        inc.labels[i] = JSONdata.dataset[i].X;
        values.labels[i] = inc.labels[i];

        values.id[i] = JSONdata.dataset[i].Xid;
        
        inc.pct[i] = 0;
        values.pct[i] = JSONdata.dataset[i].Y;
    }

    inc.pct[inc.pct.length - 1] = Math.max.apply(null, values.pct);
    
    data = inc;        
    h = 600;
    // ---------------------------------------------------------------------
    var svg = d3.select("#graph").append("svg:svg")
    .attr("width", w).attr("height", h);

    //Title
    var title = svg.append("text")
    .attr("class", "legend")
    .attr("height", 100)
    .attr("width", 100)
    .text("A Pie chart")
    .attr("x", w / 2 + 100)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .attr("font-size", "36px");

    var arc_grp = svg.append("svg:g")
    .attr("class", "arcGrp")
    .attr("transform", "translate(" + (w / 2 + 100) + "," + (h / 2) + ")");

    var label_group = svg.append("svg:g")
    .attr("class", "lblGroup")
    .attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")");

    // GROUP FOR CENTER TEXT
    var center_group = svg.append("svg:g")
    .attr("class", "ctrGroup")
    .attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")");
    
    // DRAW ARC PATHS
    var arcs = arc_grp.selectAll("path")
    .data(donut(data.pct));
    arcs.enter().append("svg:path")
    .attr("stroke", "white")
    .attr("stroke-width", 0.5)
    .attr("fill", function (d, i) { return color(i); })
    .attr("d", arc)
    .each(function (d) { this._current = d })
    .style("cursor", "pointer");


    
    var legend = svg.append("g")
	  .attr("class", "legend")
	  .attr("height", 100)
	  .attr("width", 100)
    .attr('transform', 'translate(-20,50)')


    var legendRects = legend.selectAll('rect')
      .data(donut(data.pct))
      .enter()
      .append("rect")
	  .attr("x", 25)
      .attr("y", function (d, i) { return i * 30; })
	  .attr("width", 10)
	  .attr("height", 10)
	  .style("fill", function (d, i) { return color(i); })
      .on("mouseover", function (d, i) {
          d3.select(arcs[0][i]).transition()
                   .duration(300)
                   .attr("d", arcOver);
          d3.select(this).transition().ease("").duration(200)
                .attr("width", 20)
                .attr("height", 20)
	          .attr("x", 20)
              .attr("y", (i * 30) - 5);
          d3.select(legendTexts[0][i]).transition().ease("").duration(200)
            .style("font-size", "20px")
            .attr("y", i * 30 + 12);
      })
        .on("mouseout", function (d, i) {
            d3.select(arcs[0][i]).transition()
                .ease("elastic")
               .duration(600)
               .attr("d", arc);
            d3.select(this).transition().ease("").duration(200)
                .attr("width", 10)
                .attr("height", 10)
	          .attr("x", 25)
              .attr("y", i * 30);
            d3.select(legendTexts[0][i]).transition().ease("").duration(200)
            .style("font-size", "15px")
            .attr("y", i * 30 + 9);
        });

    var legendTexts = legend.selectAll('text')
      .data(donut(data.pct))
      .enter()
      .append("text")
	  .attr("x", 45)
      .attr("y", function (d, i) { return i * 30 + 9; })
	  .text(function (d, i) {
	      return values.labels[i] + " ( " + values.pct[i] + " )";
	  })
      .style("font", "15px sans-serif")
      .on("mouseover", function (d, i) {
          d3.select(arcs[0][i]).transition()
                   .duration(300)
                   .attr("d", arcOver);
          d3.select(legendRects[0][i]).transition().ease("").duration(200)
                .attr("width", 20)
                .attr("height", 20)
	          .attr("x", 20)
              .attr("y", (i * 30) - 5);
          d3.select(this).transition().ease("").duration(200)
            .style("font-size", "20px")
            .attr("y", i * 30 + 12);
      })
        .on("mouseout", function (d, i) {
            d3.select(arcs[0][i]).transition()
                .ease("elastic")
               .duration(600)
               .attr("d", arc);
            d3.select(legendRects[0][i]).transition().ease("").duration(200)
                .attr("width", 10)
                .attr("height", 10)
	          .attr("x", 25)
              .attr("y", i * 30);
            d3.select(this).transition().ease("").duration(200)
            .style("font-size", "15px")
            .attr("y", i * 30 + 9);
        });

	  arcs.on("click", function (d, i) {
	      alert("ID to link is: " + values.id[i]);
	  })
        .on("mouseover", function (d, i) {
            d3.select(this).transition()
                   .duration(300)
                   .attr("d", arcOver);
            d3.select(legendRects[0][i]).transition().ease("").duration(200)
                .attr("width", 20)
                .attr("height", 20)
	          .attr("x", 20)
              .attr("y", (i * 30) - 5);
            d3.select(legendTexts[0][i]).transition().ease("").duration(200)
            .style("font-size", "20px")
            .attr("y", i * 30 + 12);
        })
        .on("mouseout", function (d, i) {
            d3.select(this).transition()
                .ease("elastic")
               .duration(600)
               .attr("d", arc);
            d3.select(legendRects[0][i]).transition().ease("").duration(200)
                .attr("width", 10)
                .attr("height", 10)
	          .attr("x", 25)
              .attr("y", i * 30);
            d3.select(legendTexts[0][i]).transition().ease("").duration(200)
            .style("font-size", "15px")
            .attr("y", i * 30 + 9 );
        });

//    // DRAW SLICE LABELS
//    var sliceLabel = label_group.selectAll("text")
//    .data(donut(data.pct));
//    sliceLabel.enter().append("svg:text")
//    .attr("class", "arcLabel")
//    .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
//    .attr("text-anchor", "middle")
//    .attr("stroke", "black")

        arcs.data(donut(values.pct)); // recompute angles, rebind data
    arcs.transition().ease("elastic").duration(dur).delay(delay).attrTween("d", arcTween);

//    sliceLabel.data(donut(JSONdata.pct));
//    sliceLabel.transition().ease("elastic").duration(dur).delay(delay)
//    .attr("transform", function (d) { 
//        var c = arc.centroid(d),
//            x = c[0],
//            y = c[1],
//            // pythagorean theorem for hypotenuse
//            hh = Math.sqrt(x*x + y*y);
//        return "translate(" + (x/hh * (r+30)) +  ',' +
//           (y / hh * (r + 30)) + ")";
//        //return "translate(" + arc.centroid(d) + ")"; 
//    })
//    .style("fill-opacity", function (d) { return d.value == 0 ? 1e-6 : 1; })
//    .text(function (d, i) {
//        return JSONdata.labels[i];
//    });





}

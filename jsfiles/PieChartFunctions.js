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
var w = 600,                       // width and height, natch
h = 600,
r = Math.min(w, h) / 2,        // arc radius
dur = 2000,                     // duration, in milliseconds
delay = 500,
color = d3.scale.category10(),
donut = d3.layout.pie().sort(null);        
arc = d3.svg.arc().innerRadius(r - 10).outerRadius(0);


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

    inc = { labels: [], pct: [] };

    var MaxValue = Math.max.apply(null, JSONdata.pct);

    for (var i = 0; i < JSONdata.pct.length; i++) {
        inc.labels[i] = JSONdata.labels[i];
        inc.pct[i] = 0;

        if (i == JSONdata.pct.length - 1)
            inc.pct[i] = MaxValue;            
    }
    
    data = inc;        

    // ---------------------------------------------------------------------
    var svg = d3.select("#d3portfolio").append("svg:svg")
    .attr("width", w).attr("height", h);

    var arc_grp = svg.append("svg:g")
    .attr("class", "arcGrp")
    .attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")");

    var label_group = svg.append("svg:g")
    .attr("class", "lblGroup")
    .attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")");

    // GROUP FOR CENTER TEXT
    var center_group = svg.append("svg:g")
    .attr("class", "ctrGroup")
    .attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")");

    //    // CENTER LABEL
    //    var pieLabel = center_group.append("svg:text")
    //    .attr("dy", ".35em").attr("class", "chartLabel")
    //    .attr("text-anchor", "middle")
    //    .text(data.label);

    // DRAW ARC PATHS
    var arcs = arc_grp.selectAll("path")
    .data(donut(data.pct));
    arcs.enter().append("svg:path")
    .attr("stroke", "white")
    .attr("stroke-width", 0.5)
    .attr("fill", function (d, i) { return color(i); })
    .attr("d", arc)
    .each(function (d) { this._current = d })
    .on("click", function (d) {
        alert(d.data);
    });

    // DRAW SLICE LABELS
    var sliceLabel = label_group.selectAll("text")
    .data(donut(data.pct));
    sliceLabel.enter().append("svg:text")
    .attr("class", "arcLabel")
    .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
    .attr("text-anchor", "middle")

    arcs.data(donut(JSONdata.pct)); // recompute angles, rebind data
    arcs.transition().ease("elastic").duration(dur).delay(delay).attrTween("d", arcTween);

    sliceLabel.data(donut(JSONdata.pct));
    sliceLabel.transition().ease("elastic").duration(dur).delay(delay)
    .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
    .style("fill-opacity", function (d) { return d.value == 0 ? 1e-6 : 1; })
    .text(function (d, i) {
        return JSONdata.labels[i]; 
    });

}

function clearGraphs() {
    $("#graph svg").remove();
    $("#d3portfolio svg").remove();
}
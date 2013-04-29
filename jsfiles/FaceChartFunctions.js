$(document).ready(function () {
    $("#submit").click(function () {
        if ($('input[name=chartOption]:checked').val() == "faceChart") {
            callPostFaceChart();
        }
    });

    function parseDate(input) {
        var b = ("" + input).substr(0, 4),
            c = ("" + input).substr(4, 2),
            d = ("" + input).substr(6, 2);
        return new Date(b, c, d);
    }

    // Various accessors that specify the four dimensions of data to visualize.
    function x(d) { return d.fulldate; }
    function y(d) { return d.rMVOP; }
    function radius(d) { return d.rMVOP; }

    function callPostFaceChart() {

        var dataJSON = eval('(' + $("#jsonString").val() + ')');

        clearGraphs();

        var minCirclesRadius = 0.6;
        // Chart dimensions.
        var w = 960;
        var h = 500;
        var margin = { top: 100, right: 19.5, bottom: 19.5, left: 50 },
        width = w - margin.right,
        height = h - margin.top - margin.bottom;

        for (var i = 0; i < dataJSON.length; i++) {
            dataJSON[i].fulldate = parseDate(dataJSON[i].fulldate);
        }

        var minValue = d3.min(dataJSON, function (d) { return d.rMVOP; });
        var maxValue = d3.max(dataJSON, function (d) { return d.rMVOP; });

        var minValueradius = d3.min(dataJSON, function (d) { return d.rMVMP; });
        var maxValueradius = d3.max(dataJSON, function (d) { return d.rMVMP; });

        var minValuedate = d3.min(dataJSON, function (d) { return d.fulldate; });
        var maxValuedate = d3.max(dataJSON, function (d) { return d.fulldate; });

        // Various scales. These domains make assumptions of data, naturally.

        var xScale = d3.time.scale().domain([minValuedate, maxValuedate]).range([0, 825]);
        //var xScale = d3.scale.ordinal().domain([minValuedate, maxValuedate]).rangeRoundBands([0, width]),
        yScale = d3.scale.linear().domain([minValue, maxValue / 4]).range([height, 0]),
        radiusScale = d3.scale.linear().domain([minValueradius, maxValueradius]).range([0, 50]),
        colorScale = d3.time.scale().domain([minValuedate, maxValuedate]).range(["red", "blue"]);

        // The x & y axes.
        var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(12),
        yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .tickSize(10, 10, 3);

        // Create the SVG container and set the origin.
        var svg = d3.select("#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Add the x-axis.
        svg.append("g")
        .attr("class", "covAxisX")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        // Add the y-axis.
        svg.append("g")
        .attr("class", "covAxisY")
        .call(yAxis);

        // Add an x-axis label.
        svg.append("text")
        .attr("class", "covlabelX")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("Year of I.P.O.");

        // Add a y-axis label.
        svg.append("text")
        .attr("class", "covlabelY")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "translate(0," + (-h - h / 2) + ")rotate(-90)")
        .text("Company value (billions of today's dollars)");

        // Add a dot per nation. Initialize the data at 1800, and set the colors.
        var dot = svg.append("g")
              .attr("class", "dots")
              .selectAll(".dot")
              .data(interpolateData(1950))
              .enter().append("circle")
              .attr("class", "dot")
              .call(position)
              .sort(order)
              .style("fill", function (d) { return colorScale(x(d)); })
              .style("opacity", 0.7)
              .on("mouseover", function () {
                  d3.select(this).style("stroke-width", 2);
              })
              .on("mouseout", function () {
                  d3.select(this).style("stroke-width", 0);
              })
        .attr("title", function (d) { return d.NAME; });

        // Add a title.
        //              dot.append("title").text(function (d) { return d.NAME; });

            $("circle").tooltip({
                    effect: 'bouncy',
            tipClass: 'covTooltip',
            position: 'top center',
            onBeforeShow: function () {
                debugger;
                this.getConf().offset[1] = this.getTrigger()[0].r.baseVal.value;               
            }
        });

        // Positions the dots based on data.
        function position(dot) {
            dot.attr("cx", function (d) { return xScale(x(d)); })
        .attr("cy", function (d) { return yScale(y(d)); })
        .attr("r", function (d) { return radiusScale(radius(d)); });
        }

        // Defines a sort order so that the smallest dots are drawn on top.
        function order(a, b) {
            return radius(b) - radius(a);
        }

        // Interpolates the dataset for the given (fractional) year.
        function interpolateData() {
            return dataJSON
            .filter(function (d) { //Filter to soft the animation (can be removed)
                if (radiusScale(radius(d)) < minCirclesRadius) {
                    return false;
                } else {
                    return true;
                }
            });
        }

        svg.call(changestate);

        function changestate() {
            yScale.domain([minValue, maxValue]);

            var t = svg.transition().duration(3000);
            t.select(".covAxisY").call(yAxis);
            t.select(".covlabelY").attr("transform", "rotate(-90)translate(0,0)");
            t.selectAll(".dot").call(position);
        }

    }
});

$.easing.bouncy = function (x, t, b, c, d) {
    var s = 1.70158;
    if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
}

// create custom tooltip effect for jQuery Tooltip
$.tools.tooltip.addEffect(
        "bouncy",

// opening animation
	function (done) {
	    this.getTip().animate({ top: '+=15' }, 500, 'bouncy', done).show();
	},

// closing animation
	function (done) {
	    this.getTip().animate({ top: '-=15' }, 500, 'bouncy', function () {
	        $(this).hide();
	        done.call();
	    });
	}
    );

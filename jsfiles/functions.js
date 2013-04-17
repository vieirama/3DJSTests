$(document).ready(function () {
    $("#submit").die("click").live("click", function () {

        if($('input[name=chartOption]:checked').val() == "barChart")
            callPostBarChart();
        if($('input[name=chartOption]:checked').val() == "pieChart")
            callPostPieChart();
    });

    function callPostBarChart() {
        $("#warning").text("");
        $("#warning").hide();
        var json = $("#jsonString").val();

        if (json == "") {
            $("#warning").text("String can not be empty");
            $("#warning").show();
        }
        else {
            var jsonObject = eval('(' + json + ')');
            console.log(jsonObject);

            //The result should go to $("#graph")
            var dataset = [];
            var w = 800;
            var h = 600;
            var barPadding = 0;
            var columnPadding = 5;
            $(".bar").remove();
            $(".label").remove();
            $("svg").remove();
            dataset = jsonObject.dataset;

            var xScale = d3.scale.ordinal()
							 .domain(dataset.map(function (d) { return d.label; }))
							 .rangeRoundBands([0, w], 0.05);
            var yScale = d3.scale.linear()
                     .domain([0, d3.max(dataset, function (d) { return d.value; })])
					   .range([h - 30, 0]);

            var svg = d3.select("#graph")
						.append("svg")
                        .attr("width", w)
						.attr("height", h);

            svg.selectAll("rect")
				.data(dataset)
				.enter()
				.append("rect")
				.attr("class", "bar")

				.attr("height", function (d) {
				    var barHeight = yScale(d.value);
				    return h - barHeight + "px";
				})
                .attr("width", function () {
                    var barWidth = 800 / dataset.length - columnPadding;
                    return barWidth + "px";
                })
                .attr("x", function (d, i) {
                    return i * (w / dataset.length) + 20;
                })
			    .attr("y", function (d) {
			        return yScale(d.value) - columnPadding - 20; //h - yScale(d.value)-20;
			    })
                .style("fill", function (d) {
                    return "rgb(" + d.color[0].R + "," + d.color[0].G + "," + d.color[0].B + ")";
                });

            svg.selectAll("text")
			   .data(dataset)
			   .enter()
			   .append("text")
               .attr("class", "label")
			   .text(function (d) {
			       return d.value;
			   })
			   .attr("text-anchor", "middle")
			   .attr("x", function (d, i) {
			       return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2 + 20;
			   })
			   .attr("y", function (d) {
			       return yScale(d.value) - columnPadding + 20;
			   })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")
			   .attr("fill", "white");

            //   //AXIS


            var xAxis = d3.svg.axis()
			                .scale(xScale)
			                .orient("bottom");

            svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + (h - columnPadding - 20) + ")")
			.call(xAxis);



            var yAxis = d3.svg.axis()
			                .scale(yScale)
			                .orient("left")
			                .ticks(5);

            svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + 25 + ",20)")
			.call(yAxis);
        }
    }


    function callPostPieChart() {
        //var agg = { labels: ['LCAP', 'MCAP', 'SCAP', 'Intl', 'Alt', 'Fixed'], pct: [5, 10, 6, 5, 14, 50] },

        //inc = { labels: ['LCAP', 'MCAP', 'SCAP', 'Intl', 'Alt', 'Fixed'], pct: [0, 0, 0, 0, 0, 100] },

        //data = inc;
        $("#warning").text("");
        $("#warning").hide();

        var json = $("#jsonString").val();

        if (json == "") {
            $("#warning").text("String can not be empty");
            $("#warning").show();
        }
        else {
            var jsonObject = eval('(' + json + ')');
            console.log(jsonObject);

            inc = { labels: ['LCAP', 'MCAP', 'SCAP', 'Intl', 'Alt', 'Fixed'], pct: [0, 0, 0, 0, 0, 100] },

            data = inc;    

            var w = 750,                       // width and height, natch
            h = 750,
            r = Math.min(w, h) / 2,        // arc radius
            dur = 2000,                     // duration, in milliseconds
            color = d3.scale.category10(),
            donut = d3.layout.pie().sort(null),
            arc = d3.svg.arc().innerRadius(r - 10).outerRadius(0);

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
            .attr("text-anchor", "middle");

            updateChart(jsonObject, arcs, sliceLabel, donut, dur, arc);
        }
       
    }
    
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
    function updateChart(data, arcs, sliceLabel, donut, dur, arc) {        

        arcs.data(donut(data.pct)); // recompute angles, rebind data
        arcs.transition().ease("elastic").duration(dur).attrTween("d", arcTween);

        sliceLabel.data(donut(data.pct));
        sliceLabel.transition().ease("elastic").duration(dur)
        .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
        .style("fill-opacity", function (d) { return d.value == 0 ? 1e-6 : 1; })
        .text(function (d, i) {
            return data.labels[i]; 
        });

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

    //Load text area values
    var barChartExample = "{\"dataset\": \n[{\"value\": 42,\"label\": \"pos1\",\"color\": [ { \"R\": \"254\", \"G\":\"0\", \"B\":\"0\" } ]   },\n{\"value\": 12,\"label\": \"pos2\",\"color\": [ { \"R\": \"0\", \"G\":\"254\", \"B\":\"0\" } ]},\n{\"value\": 51,\"label\": \"pos3\",\"color\": [ { \"R\": \"0\", \"G\":\"0\", \"B\":\"0\" } ]},\n{\"value\": 67,\"label\": \"pos4\",\"color\": [ { \"R\": \"0\", \"G\":\"0\", \"B\":\"254\" } ]},\n{\"value\": 48,\"label\": \"pos5\",\"color\": [ { \"R\": \"254\", \"G\":\"254\", \"B\":\"0\" } ]}]}";

    var pieChartExample = "{\"labels\": [\"LCAP\",\"MCAP\",\"SCAP\",\"Intl\",\"Alt\",\"Fixed\"],\"pct\": [5,10,6,5,14,50]}";

    $("#jsonString").text(barChartExample);
    
    $("input[name=chartOption]").die("click").live("click", function () {
        if($('input[name=chartOption]:checked').val() == "barChart")
            $("#jsonString").text(barChartExample);
        if($('input[name=chartOption]:checked').val() == "pieChart")
            $("#jsonString").text(pieChartExample);
    });

    // From http://mkweb.bcgsc.ca/circos/guide/tables/
    //    var matrix = [
    //  [11975, 5871, 8916, 2868],
 //  [1951, 10048, 2060, 6171],
    //  [8010, 16145, 8090, 8045],
    //  [1013, 990, 940, 6907]
    //];

    //    var chord = d3.layout.chord()
    //    .padding(.05)
    //    .sortSubgroups(d3.descending)
    //    .matrix(matrix);

    //    var width = 960,
    //    height = 500,
    //    innerRadius = Math.min(width, height) * .41,
    //    outerRadius = innerRadius * 1.1;

    //    var fill = d3.scale.ordinal()
    //    .domain(d3.range(4))
    //    .range(["#000000", "#FFDD89", "#957244", "#F26223"]);

    //    var svg = d3.select(".liveExample").append("svg")
    //    .attr("width", width)
    //    .attr("height", height)
    //    .attr("id", "chartId")
    //  .append("g")
    //    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    //    svg.append("g").selectAll("path")
    //    .data(chord.groups)
    //  .enter().append("path")
    //    .style("fill", function (d) { return fill(d.index); })
    //    .style("stroke", function (d) { return fill(d.index); })
    //    .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
    //    .on("mouseover", fade(.1))
    //    .on("mouseout", fade(1));

    //    var ticks = svg.append("g").selectAll("g")
    //    .data(chord.groups)
    //  .enter().append("g").selectAll("g")
    //    .data(groupTicks)
    //  .enter().append("g")
    //    .attr("transform", function (d) {
    //        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
    //          + "translate(" + outerRadius + ",0)";
    //    });

    //    ticks.append("line")
    //    .attr("x1", 1)
    //    .attr("y1", 0)
    //    .attr("x2", 5)
    //    .attr("y2", 0)
    //    .style("stroke", "#000");

    //    ticks.append("text")
    //    .attr("x", 8)
    //    .attr("dy", ".35em")
    //    .attr("transform", function (d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
    //    .style("text-anchor", function (d) { return d.angle > Math.PI ? "end" : null; })
    //    .text(function (d) { return d.label; });

    //    svg.append("g")
    //    .attr("class", "chord")
    //  .selectAll("path")
    //    .data(chord.chords)
    //  .enter().append("path")
    //    .attr("d", d3.svg.chord().radius(innerRadius))
    //    .style("fill", function (d) { return fill(d.target.index); })
    //    .style("opacity", 1);

    //    // Returns an array of tick angles and labels, given a group.
    //    function groupTicks(d) {
    //        var k = (d.endAngle - d.startAngle) / d.value;
    //        return d3.range(0, d.value, 1000).map(function (v, i) {
    //            return {
    //                angle: v * k + d.startAngle,
    //                label: i % 5 ? null : v / 1000 + "k"
    //            };
    //        });
    //    }

    //    // Returns an event handler for fading a given chord group.
    //    function fade(opacity) {
    //        return function (g, i) {
    //            svg.selectAll(".chord path")
    //        .filter(function (d) { return d.source.index != i && d.target.index != i; })
    //      .transition()
    //        .style("opacity", opacity);
    //        };
    //    }




    //    var dataset = [];  						 //Initialize empty array
    //    for (var i = 0; i < 25; i++) {			 //Loop 25 times
    //        var newNumber = Math.random() * 30;  //New random number (0-30)
    //        dataset = dataset.concat(newNumber); //Add new number to array
    //    }

});

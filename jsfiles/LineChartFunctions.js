$(document).ready(function () {
    $("#submit").die("click").live("click", function () {
        if ($('input[name=chartOption]:checked').val() == "lineChart")
            callPostLineChart();
        if ($('input[name=chartOption]:checked').val() == "lineDateChart")
            callPostLineDateChart();
    });

    function parseDate(input) {
        var parts = input.match(/(\d+)/g);
        // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
        return new Date(parts[2], parts[1], parts[0]); // months are 0-based
    }


    function callPostLineDateChart() {
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

            var values = [];
            var w = 960;
            var h = 600;
            var margin = 130;
            $(".bar").remove();
            $(".label").remove();
            $("svg").remove();

            for (var i = 0; i < jsonObject.dataset.length; i++) {
                jsonObject.dataset[i].X = parseDate(jsonObject.dataset[i].X);
            }

            data = jsonObject.dataset;
            data.sort(function (a, b) { return d3.ascending(a.X, b.X); });

            var y = d3.scale.linear().domain([0, d3.max(data, function (d) { return d.Y; })]).range([0 + margin, h - margin]),
            yInv = d3.scale.linear().domain([0, d3.max(data, function (d) { return d.Y; })]).range([h - margin, 0 + margin]),
            //x = d3.scale.linear().domain([0, data.length - 1]).range([0 + margin, w - margin]);
            x = d3.scale.ordinal().rangeRoundBands([0 + margin, w - margin])
	            .domain(data.map(function (d) { return d.X; }));   

            var vis = d3.select("#graph")
						.append("svg")
                        .attr("width", w)
						.attr("height", h);


            //AXIS
            var xAxis = d3.svg.axis()
			                .scale(x)
            //.ticks(24)
                            .tickFormat(d3.time.format('%m-%d-%Y'))
                            .tickSize(0, 0, 3)
			                .orient("bottom");

            vis.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + (h - margin) + ")")
			.call(xAxis)
            .append("text")
            .attr("transform", "translate(" + ((w - margin) / 2) + "," + margin + ")")
            .text("Received Date"); //Has to be passed on JSON
            
            vis.selectAll(".tick text")
            .attr("transform", function (d) { return "translate(" + this.getBBox().height * -1.5 + "," + (this.getBBox().height + 40) + ")rotate(-90)"; })
            .on("mouseover", function (d, i) {
                d3.select(points[0][i]).transition()
                            .duration(300)
                            .attr("r", 7);             
                d3.select(this).transition().ease("").duration(200)
                            .style("font-size", "20px");
            })
            .on("mouseout", function (d, i) {
                d3.select(points[0][i]).transition()
                    .ease("elastic")
                    .duration(600)
                    .attr("r", 4);
                d3.select(this).transition().ease("").duration(200)
                .style("font-size", "15px");
            });

            var yAxis = d3.svg.axis()
                            .tickSize(-w + 2 * margin, 50, 3)
			                .scale(yInv)
			                .orient("left");
                            
            vis.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + margin + ",0)")
			.call(yAxis)
            .append("text")
            .attr("transform", "translate(" + (-margin / 2) + "," + ((h + margin) / 2) + ")rotate(-90)")
            .text("Number of Articles");  //Has to be passed on JSON
            
            var g = vis.append("svg:g")
            .attr("transform", "translate(0, " + (h) + ")");

            var line = d3.svg.line()
            .x(function (d, i) { return x(d.X); })
            .y(function (d) { return -1 * margin; });
            //.y(function (d) { return -1 * y(d.value); });

            g.append("svg:path")
            .attr("d", line(data))
            .attr("stroke", "red")
            .attr("stroke-width", "2")
            .attr("fill", "none");

            var points = g.selectAll('circle.mark').data(data).enter().append('svg:circle')
            .attr('class', 'mark')
            .attr('cx', function (d, i) { return x(d.X); })
            .attr('cy', function (d) { return -1 * margin; })
            .attr('r', 4)
            .on("click", function (d, i) {
                alert("ID to link is: " + data[i].XId);
            })


            line = d3.svg.line()
                        .x(function (d, i) { return x(d.X); })
                        .y(function (d) { return -1 * y(d.Y); });


            g.selectAll("path").transition().ease("").duration(2000).attr("d", line(data))

            points.transition().ease("").duration(2000)
            .attr('cx', function (d, i) { return x(d.X); })
            .attr('cy', function (d) { return -1 * y(d.Y); })

        }
    }



    function callPostLineChart() {
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

            var values = [];
            var w = 400;
            var h = 400;
            var margin = 40;
            $(".bar").remove();
            $(".label").remove();
            $("svg").remove();

            data = jsonObject.dataset;

            var y = d3.scale.linear().domain([0, d3.max(data)]).range([0 + margin, h - margin]),
            yInv = d3.scale.linear().domain([0, d3.max(data)]).range([h - margin, 0 + margin]),
            x = d3.scale.linear().domain([0, data.length - 1]).range([0 + margin, w - margin]);


            var vis = d3.select("#graph")
						.append("svg")
                        .attr("width", w)
						.attr("height", h);

            var g = vis.append("svg:g")
            .attr("transform", "translate(0, " + (h) + ")");

            var line = d3.svg.line()
            .x(function (d, i) { return x(i); })
            .y(function (d) { return -1 * margin; });

            g.append("svg:path")
            .attr("d", line(data))
            .attr("stroke", "red")
            .attr("stroke-width", "2")
            .attr("fill", "none");

            //AXIS
            var xAxis = d3.svg.axis()
			                .scale(x)
            //.ticks(5)
			                .orient("bottom");
            vis.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + (h - margin) + ")")
			.call(xAxis);

            var yAxis = d3.svg.axis()
			                .scale(yInv)
			                .orient("left");
            vis.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + margin + ",0)")
			.call(yAxis);

            line = d3.svg.line()
            .x(function (d, i) { return x(i); })
            .y(function (d) { return -1 * y(d); });
            g.selectAll("path").transition().ease("").duration(2000).attr("d", line(data))

        }
    }



});

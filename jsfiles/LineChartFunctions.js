$(document).ready(function () {
    $("#submit").die("click").live("click", function () {
        if ($('input[name=chartOption]:checked').val() == "lineChart")
            callPostLineChart();
        if ($('input[name=chartOption]:checked').val() == "lineDateChart")
            callPostLineDateChart();
    });


    function callPostLineDateChart() {
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

            var values = [];
            var w = 1200;
            var h = 300;
            var margin = 40;
            $(".bar").remove();
            $(".label").remove();
            $("svg").remove();

            data = jsonObject.dataset;
            data.sort(function (a, b) { return d3.ascending(a.date, b.date); });

            var y = d3.scale.linear().domain([0, d3.max(data, function (d) { return d.value; })]).range([0 + margin, h - margin]),
            yInv = d3.scale.linear().domain([0, d3.max(data, function (d) { return d.value; })]).range([h - margin, 0 + margin]),
            //x = d3.scale.linear().domain([0, data.length - 1]).range([0 + margin, w - margin]);
            x = d3.time.scale()
	            .domain([d3.min(data, function (d) {
	                //var dt = new Date(d.date);
	                return d.date*1000;
	            }), d3.max(data, function (d) { return d.date * 1000; })])    // values between for month of january
		        .range([0 + margin, w - margin])
            //.ticks(d3.time.day, 15);

            var vis = d3.select("#graph")
						.append("svg")
                        .attr("width", w)
						.attr("height", h);

            var g = vis.append("svg:g")
            .attr("transform", "translate(0, " + (h) + ")");

            var line = d3.svg.line()
            .x(function (d, i) { return x(d.date * 1000); })
            .y(function (d) { return -1 * margin; });
            //.y(function (d) { return -1 * y(d.value); });

            g.append("svg:path")
            .attr("d", line(data))
            .attr("stroke", "red")
            .attr("stroke-width", "2")
            .attr("fill", "none");

            //AXIS
            var xAxis = d3.svg.axis()
			                .scale(x)
    //.ticks(d3.time.months, 1)
    .tickFormat(d3.time.format('%m %Y'))
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
                        .x(function (d, i) { return x(d.date * 1000); })
                        .y(function (d) { return -1 * y(d.value); });
                        g.selectAll("path").transition().ease("").duration(2000).attr("d", line(data))

        }
    }



    function callPostLineChart() {
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

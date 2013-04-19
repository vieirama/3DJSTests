$(document).ready(function () {
    $("#submit").click(function () {
        if ($('input[name=chartOption]:checked').val() == "barChart3D") {
            clearGraphs();
            callPostBarChart3D();
        }
    });

    function callPostBarChart3D() {
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
            color = d3.scale.category10(),
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
            //.append("svg")
                        .append("x3d")
                        .attr("width", w)
						.attr("height", h);


            var scene = svg.append("scene");
            scene.append("orthoviewpoint")
            ///.attr("centerOfRotation", "3.75 0 10")
                .attr("centerOfRotation", "0 0 0")
            //.attr("position", "13.742265188709691 -27.453522975182366 16.816062840792625")
                .attr("position", "0 0.8 10")
            //.attr("orientation", "0.962043810961999 0.1696342804961945 0.21376603254551874 1.379433089729343");
            //.attr("orientation", "0 1 0 0.8")
            //.attr("fieldOfView", "-7 -7 7 7")
            //.attr("retainuseroffsets", "FALSE")
                ;
            scene.append("directionallight")
            .attr("direction", "0 -1 -0.8");

            shapes = scene.selectAll("transform").data(dataset);
            shapesEnter = shapes
             .enter()
             .append("transform")
             .append("shape")
             ;


            // Enter and update
            shapes.transition()
              .attr("translation", function (d, i) {

                  return i * 0.2 - 1 + " " + (d.value / 200.0) + " " + "1.0";
              })//d.value / 2.0; })
              .attr("rotation", function (d, i) { return " 0.6 -1.0 0.0 0.4"; })//d.value / 2.0; })
              .attr("scale", function (d) { return "0.1 " + (d.value * 0.01) + " 0.1"; })
              ;

            shapesEnter
            .append("appearance")
              .append("material")
            //.attr("diffuseColor", "steelblue");
            .attr("diffuseColor", function (d, i) {
                return color(i);
            });

            shapesEnter.append("box")
          .attr("size", "1.0 1.0 1.0");

            x3dom.reload();

        }
    }


});


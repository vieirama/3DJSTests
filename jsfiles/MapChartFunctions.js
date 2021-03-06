$(document).ready(function () {
    $("#submit").click(function () {
        if($('input[name=chartOption]:checked').val() == "USAStatesMapChart"
              || $('input[name=chartOption]:checked').val() == "CanadaMapChart"
              || $('input[name=chartOption]:checked').val() == "EuropeMapChart") {
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
                drawMapChart(jsonObject.dataset, $('input[name=chartOption]:checked').val());
            }
        }
    });
});

  var div = null;

  function drawMapChart(data, chartOption) {
      var formatTime = d3.time.format("%e %B");


      var width = (chartOption == "USAStatesMapChart" ? 960 : 800),
      height = (chartOption == "USAStatesMapChart" ? 500 : 700),
      centered;
      div = d3.select("#graph").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

      var path = d3.geo.path();


      var svg = d3.select("#graph").append("svg")
      .attr("width", width)
      .attr("height", height)
    ;

      
      svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height);
      //.on("click", click);

      var g = svg.append("g")
      //.attr("transform", "translate(" + (width / 2-200) + "," + height / 2 + ")scale(1.7,1.2)") //Canada 
      //.attr("transform", "translate(" + (-800) + "," + 50 + ")scale(2.5,2.5)") //Europe
      .attr("id", "states");

      if (chartOption == "USAStatesMapChart") {
          d3.json("USACoverageMap.json", function (json) {
              g.selectAll("path")
          .data(json.features)
          .enter().append("path")
          .attr("d", path)
          .on("click", click)
          .on("mouseover", hover)
          .on("mouseout", out);
          });
      }
      else if (chartOption == "CanadaMapChart") {
          var projection = d3.geo.mercator();
          projection.scale(300).translate([850, 900]);
          d3.json("CanadaCoverageMap.json", function (json) {
              g.selectAll("path")
          .data(json.features)
          .enter().append("path")
          .attr("d", path.projection(projection))
          .on("click", click)
          .on("mouseover", hover)
          .on("mouseout", out);
          });
      }
      else if (chartOption == "EuropeMapChart") {
          var projection = d3.geo.mercator(); 
          projection.scale(500).translate([350, 950]);

          //g.attr("transform", "translate(" + (-1400) + "," + 100 + ")scale(3.5,3.5)"); //Europe
          d3.json("europeMap.json", function (json) {

              var color = d3.scale.linear()
                .domain([
              0,
                    d3.min(json.features, function (d) { return ((d.properties.POP2005 != 0 && d.properties.AREA != 0) ? (d.properties.POP2005 /*/ (d.properties.AREA)*/) : undefined); }),
                    d3.max(json.features, function (d) { 
                    return ((d.properties.POP2005!=0 && d.properties.AREA!=0) ?(d.properties.POP2005 /*/ (d.properties.AREA )*/):undefined); })])
                .range(["white", "yellow", "red"]);

              g.selectAll("path")
              .data(json.features)
              .enter().append("path")
              .attr("d", path.projection(projection))
              .style("fill", function (d) { return color(d.properties.POP2005/*/(d.properties.AREA)*/);})
              .on("click", click)
              .on("mouseover", hover)
                .on("mouseout", out);
          });
          
      }


    if (chartOption != "USAStatesMapChart") {

        var resetButton = $("#graph").append("<input style=\"vertical-align: top;\" value=\"Reset Zoom\" type=\"button\" name=\"resetPosition\"/>");
        resetButton.on("click", function (d) {
            g.attr("transform", "translate(0,0)scale(1)");
            g.selectAll("path").attr("d", path.projection(projection));

            var zoom = d3.behavior.zoom()
                .on("zoom", function () {
                    g.attr("transform", "translate(" + d3.event.translate.join(",") + ")scale(" + (d3.event.scale) + ")");
                    g.selectAll("path").attr("d", path.projection(projection));
                });
            svg.call(zoom);
        });

        var zoom = d3.behavior.zoom()
        .on("zoom", function () {
            g.attr("transform", "translate(" + d3.event.translate.join(",") + ")scale(" + (d3.event.scale) + ")"); // (d3.event.translate[0]) + "," + (d3.event.translate[1])
            g.selectAll("path").attr("d", path.projection(projection));
        });
        svg.call(zoom);
      }
  }
function click(d) {
  var x, y, k;
  if(d){
	   alert(d.properties["name"]+" Here!");
  }
}

function hover(d){
 div.transition()        
     .duration(200)      
     .style("opacity", .9);      
  div .html(d.properties["name"])  
      .style("left", (d3.event.pageX) + "px")     
      .style("top", (d3.event.pageY - 28) + "px");
}

function out(d) {
    div.transition()
     .duration(200)
     .style("opacity", .0);
}

 
$(document).ready(function () {
    $("#submit").click(function () {
        if($('input[name=chartOption]:checked').val() == "mapChart") {
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
                drawMapChart(jsonObject.dataset);
            }
        }
    });
});

  var div = null;
  
function drawMapChart(data){
  var formatTime = d3.time.format("%e %B");


  var width = 960,
      height = 500,
      centered;
 div = d3.select("#graph").append("div") 
      .attr("class", "tooltip")
      .style("opacity", 0);

 var projection = d3.geo.mercator()
//    .translate([height / 4, width/4])
//    .scale(width / 2);
 var path = d3.geo.path()
    .projection(projection)
    ;
    
  var svg = d3.select("#graph").append("svg")
      .attr("width", width)
      .attr("height", height);
   
  svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height);
      //.on("click", click);

  var g = svg.append("g")
  //.attr("transform", "translate(" + (width / 2-200) + "," + height / 2 + ")scale(1.7,1.2)") //Canada 
  //.attr("transform", "translate(" + (-800) + "," + 50 + ")scale(2.5,2.5)") //Europe
      .attr("id", "states");
     //g.selectAll("path")
        
  d3.json("readme.json", function(json) {
    g.selectAll("path")
        .data(json.features)
      .enter().append("path")
        .attr("d", path)
  	  //.attr("class",  function(d) { return (d.properties["name"] == "Illinois" ? "active" : ".features"); })
        .on("click", click)
        .on("mouseover",hover );


         //hover(div));
   });
}
function click(d) {
  var x, y, k;
  if(d){
	   alert("Portugal Here!");
  }
}

function hover(d){
 div.transition()        
     .duration(200)      
     .style("opacity", .9);      
  div .html(d.properties["NAME"])  
      .style("left", (d3.event.pageX) + "px")     
      .style("top", (d3.event.pageY - 28) + "px");                
}
 
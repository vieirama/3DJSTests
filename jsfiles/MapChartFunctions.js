$(document).ready(function () {
    $("#submit").click(function () {
        if($('input[name=chartOption]:checked').val() == "rowChart") {
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
                //drawMapChart(jsonObject.dataset);
            }
        }
    });
});

  var div = null;
  
drawMapChart(null);
function drawMapChart(data){
  var formatTime = d3.time.format("%e %B");

  var width = 960,
      height = 500,
      centered;
 div = d3.select("body").append("div") 
      .attr("class", "tooltip")               
      .style("opacity", 0);

  var path = d3.geo.path();
   
  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);
   
  svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height);
      //.on("click", click);
   
  var g = svg.append("g")
      .attr("id", "states");
     g.selectAll("path")
        
  d3.json("readme.json", function(json) {
    g.selectAll("path")
        .data(json.features)
      .enter().append("path")
        .attr("d", path)
  	  .attr("class",  function(d) { return (d.properties["name"] == "Illinois" ? "active" : ".features"); })
        .on("click", click)
        .on("mouseover",hover );


         //hover(div));
   });
}
function click(d) {
  var x, y, k;
  if(d){
	   alert(d.id);
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
 
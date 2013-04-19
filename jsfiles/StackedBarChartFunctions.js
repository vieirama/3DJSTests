$(document).ready(function () {
    $("#submit").click(function () {
        if($('input[name=chartOption]:checked').val() == "stackBarChart") {
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
                drawStackChart(jsonObject.dataset);
            }
        }
    });
});

function drawStackChart(data){

    var margin = {top: 20, right: 20, bottom: 130, left: 40},
        width = 960 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .rangeRound([height, 0]);

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    var svg = d3.select("#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "stackChartAxisText")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data = transformData(data);    
    //d3.csv("data.csv", function(error, data) {
          color.domain(d3.keys(data[0]).filter(function(key) { return key !== "X"; }));

         data.forEach(function(d) {
            var y0 = 0;
            d.items = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
            d.total = d.items[d.items.length - 1].y1;
          });

          //data.sort(function(a, b) { return b.total - a.total; });

          x.domain(data.map(function(d) { return d.X; }));
          y.domain([0, d3.max(data, function(d) { return d.total; })]);


          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);
          
          svg.selectAll(".tick text") 
          .attr("transform", function(d) {return "translate(" + this.getBBox().height * -2 + "," + (this.getBBox().height + 40) + ")rotate(-45)";});
        
          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
              .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("News Items");

          var item = svg.selectAll(".item")
              .data(data)
              .enter().append("g")
              .attr("class", "g")
              .attr("transform", function(d) { return "translate(" + x(d.X) + ",0)"; });

          item.selectAll("rect")
              .data(function(d) { return d.items; })
              .enter().append("rect")
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y(d.y1); })
              .attr("height", function(d) { return y(d.y0) - y(d.y1); })
              .style("fill", function(d) { return color(d.name); });

          var legend = svg.selectAll(".legend")
              .data(color.domain().slice().reverse())
              .enter().append("g")
              .attr("class", "legend")
              .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

          legend.append("rect")
              .attr("x", width - 18)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color);

          legend.append("text")
              .attr("x", width - 24)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function(d) { return d; });


          var legendRects = item.selectAll("rect");
          //var legendTexts = legend.selectAll("text");
          
          legendRects.on("click", function (d, i) {
              alert(d.name);
          })
          .on("mouseover", function (d, i) {
            d3.select(this).transition()
                   .duration(300);
                   //.attr("d", arcOver);
            //d3.select(legendRects[0][i]).transition().ease("").duration(200)
              //  .attr("width", 20)
              //  .attr("height", 20)
              //  .attr("x", 20)
              //  .attr("y", (i * 30) - 5);
            d3.select(legend[0][legend[0].length - i - 1]).transition().ease("").duration(300)
                .style("font-size", "15px");
        })
        .on("mouseout", function (d, i) {
            d3.select(this).transition()
                .ease("elastic")
               .duration(600)
               //.attr("d", arc);
           // d3.select(legendRects[0][i]).transition().ease("").duration(200)
           //     .attr("width", 10)
           //     .attr("height", 10)
           // .attr("x", 25)
           //   .attr("y", i * 30);
            d3.select(legend[0][legend[0].length - i - 1]).transition().ease("").duration(300)
                .style("font-size", "10px");
        })
        .style("cursor", "pointer");
    //});

}

function transformData(data) {

    var returnData = [];

    var xRef = {};
    var zRef = {};
    var xzRef = [];

    xRef = buildXRef(data);
    zRef = buildZRef(data);
    XZRef = buildXZRef(data, xRef, zRef);

    //returnData = buildDataset(xRef, zRef, XZRef);

    return XZRef;
    /*var returnData = [];
    var currentXId;
    var nextXId;
    var currentElement;

    for(var i = 0; i < data.length; i++) {
        if(checkMainNodeExistReturnData (data[i].Xid, returnData)) {
            returnData = AddNodeToReturnData(returnData, data[i]);
        }
        else {
            returnData = CreateNewNode(returnData, data[i]);
        }
    }
    return returnData;*/

}

function buildXRef(data) {
    var xRef = {};

    for(var i = 0; i < data.length; i++) {
        if(xRef[data[i].X] == undefined) {
            xRef[data[i].X] = data[i].XId;
        }
    }
    return xRef;
}

function buildZRef(data) {
    var zRef = {};

    for(var i = 0; i < data.length; i++) {
        if(zRef[data[i].Z] == undefined) {
            zRef[data[i].Z] = data[i].ZId;
        }
    }
    return zRef;
}

function buildXZRef(data, xRef, zRef) {
    var xzRef = [];
    var newObject = {};

    for (var xRefKey in xRef) {
        newObject = {};
        newObject["X"] = xRefKey;
        for (var zRefKey in zRef) {


            var newxRefEntry = getXZRefValue(data, xRef[xRefKey], zRef[zRefKey]);

            

            if (newxRefEntry != undefined && xRefEntryNotInResult(xzRef, newxRefEntry)) {
              //  xzRef.push(newxRefEntry);
              newObject[zRefKey] = newxRefEntry;
            }
        }
        xzRef.push(newObject);
    }

    return xzRef;
}

function getXZRefValue(data, xRef, zRef) {
    for(var i = 0; i < data.length; i++) {
        if(data[i].XId == xRef && data[i].ZId == zRef)
            //return [xRef, zRef, data[i].Y];
        return data[i].Y;
    }
    return 0;
}

function xRefEntryNotInResult(xzRef, newxRefEntry) {
    for(var i = 0; i < xzRef.length; i++) {
        for(var j = 0; j < xzRef[i].length; j++) {
            if(xzRef[i][0] == newxRefEntry[0] && xzRef[i][1] == newxRefEntry[1]) {
                return false;
            }
        }
    }
    return true;
}

function buildDataset(xRef, zRef, xzRef) {
    var returnData = [];
    var newObj = {};

    for(var i = 0; j < xzRef.length; i++) {
        newObj["X"] = 
        returnData.push(newObj); 
    }

    return returnData;
}

/*
for(var i = 0; i < data.length; i++) {
        currentXId = data[i].Xid;
        for(var j = i; j < data.length; j++) {
            nextXId = data[j].Xid;
            if(nextXId == currentXId && !checkExistReturnData(data[j].ZId, returnData)) {
                if(checkMainNodeExistReturnData (currentXId, returnData)) {
                    returnData = AddNodeToReturnData(returnData, data[j]);
                }
                else {
                    returnData = CreateNewNode(returnData, data[j]);
                }
            }
        }
    }
*/
/*
function checkMainNodeExistReturnData (XId, data) {
    for(var i = 0; i < data.length; i++) {
        if(data[i].XId == XId)
            return true;
    }
    return false;
}

function checkExistReturnData (ZId, returnData) {
    for(var i = 0; i < returnData.length; i++) {
        for(var j = 0; j < returnData[i].accessValuesList.length; j++) {
            if(returnData[i].accessValuesList[j] == ZId)
                return true;
        }
    }
    return false;
}

function AddNodeToReturnData (returnData, node) {
    var index;

    for(var i = 0; i < returnData.length; i++) {
        if(returnData[i].XId == node.Xid)
            index = i;
    }

    returnData[index].valuesList.push(node.Y);
    returnData[index].namesList.push(node.Z);
    returnData[index].accessValuesList.push(node.ZId);

    return returnData;
}

function CreateNewNode (returnData, node) {
    var newNode = {};
    newNode.valuesList = [];
    newNode.namesList = [];
    newNode.accessValuesList = [];

    newNode.label = node.X;
    newNode.XId = node.Xid;
    newNode.valuesList.push(node.Y);
    newNode.namesList.push(node.Z);
    newNode.accessValuesList.push(node.ZId);
    returnData.push(newNode);

    return returnData;
}
*/
/*var x;
var y;
var yGroupMax;
var yStackMax;
var rect;
var n;
var height;

function drawStackChart(data){
    $("#graph").append("<label><input type=\"radio\" name=\"stackMode\" value=\"grouped\" checked=\"checked\"> Grouped</label><label><input type=\"radio\" name=\"stackMode\" value=\"stacked\"> Stacked</label>");
    n = 4;//data[0].value.length, // number of layers
    var m = 58,//data.length, // number of samples per layer
        stack = d3.layout.stack(),
        layers = stack(d3.range(n).map(function() { return bumpLayer(m, .1); }));

    yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); });
    yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

    var margin = {top: 40, right: 10, bottom: 20, left: 10},
        width = 800 - margin.left - margin.right;
    height = 600 - margin.top - margin.bottom;

    x = d3.scale.ordinal()
            .domain(d3.range(m))
            .rangeRoundBands([0, width], .08);

    y = d3.scale.linear()
            .domain([0, yStackMax])
            .range([height, 0]);

    var color = d3.scale.linear()
                .domain([0, n - 1])
                .range(["#aad", "#556"]);

    var xAxis = d3.svg.axis()
                .scale(x)
                .tickSize(0)
                .tickPadding(6)
                .orient("bottom");

    var svg = d3.select("#graph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var layer = svg.selectAll(".layer")
                .data(layers)
                .enter().append("g")
                .attr("class", "layer")
                .style("fill", function(d, i) { return color(i); });

    rect = layer.selectAll("rect")
                .data(function(d) { return d; })
                .enter().append("rect")
                .attr("x", function(d) { return x(d.x); })
                .attr("y", height)
                .attr("width", x.rangeBand())
                .attr("height", 0);

    rect.transition()
    .delay(function(d, i) { return i * 10; })
    .attr("y", function(d) { return y(d.y0 + d.y); })
    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    d3.selectAll('input[name="stackMode"]').on("change", change);

    

}

var timeout = setTimeout(function() {
        d3.select("input[value=\"grouped\"]").property("checked", true).each(change);
        }, 2000);

function change() {
  clearTimeout(timeout);
  if (this.value === "grouped") transitionGrouped();
  else transitionStacked();
}

function transitionGrouped() {
  y.domain([0, yGroupMax]);

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("x", function(d, i, j) { return x(d.x) + x.rangeBand() / n * j; })
      .attr("width", x.rangeBand() / n)
      .transition()
      .attr("y", function(d) { return y(d.y); })
      .attr("height", function(d) { return height - y(d.y); });
}

function transitionStacked() {
  y.domain([0, yStackMax]);

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d.y0 + d.y); })
      .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
      .transition()
      .attr("x", function(d) { return x(d.x); })
      .attr("width", x.rangeBand());
}

function bumpLayer(n, o) {

  function bump(a) {
    var x = 1 / (.1 + Math.random()),
        y = 2 * Math.random() - .5,
        z = 10 / (.1 + Math.random());
    for (var i = 0; i < n; i++) {
      var w = (i / n - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }

  var a = [], i;
  for (i = 0; i < n; ++i) a[i] = o + o * Math.random();
  for (i = 0; i < 5; ++i) bump(a);
  return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
}*/
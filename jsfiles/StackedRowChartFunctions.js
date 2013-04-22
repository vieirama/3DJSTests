$(document).ready(function () {
    $("#submit").click(function () {
        if($('input[name=chartOption]:checked').val() == "stackedRowChart") {
            $("#warning").text("");
            $("#warning").hide();
            clearGraphs();

            var json = $("#jsonString").val();
           //var json = "{ \"dataset\": [  {\"X\": \"C1-CP Flow\",\"Xid\": \"2328305010\",\"Y\": \"359.0\",\"YId\": \"0\",\"Z\": \"TV\",\"ZId\": \"36539757\"  },  {\"X\": \"C1-CP Flow\",\"Xid\": \"2328305010\",\"Y\": \"1898.0\",\"YId\": \"0\",\"Z\": \"News Web Sites\",\"ZId\": \"36539760\"  },  {\"X\": \"C1-CP Flow\",\"Xid\": \"2328305010\",\"Y\": \"1458.0\",\"YId\": \"0\",\"Z\": \"Daily Newspapers\",\"ZId\": \"36539762\"  },  {\"X\": \"P-C1 testing 1-iphone\",\"Xid\": \"69216626\",\"Y\": \"24.0\",\"YId\": \"0\",\"Z\": \"Blogs\",\"ZId\": \"36539759\"  },  {\"X\": \"CP-C1 testing 1-iphone\",\"Xid\": \"69216626\",\"Y\": \"10.0\",\"YId\": \"0\",\"Z\": \"Online Version\",\"ZId\": \"36539761\"  },  {\"X\": \"CP-C1 testing 2-Storm\",\"Xid\": \"69216627\",\"Y\": \"211.0\",\"YId\": \"0\",\"Z\": \"News Web Sites\",\"ZId\": \"36539760\"  },  {\"X\": \"CP-C1 testing 4-Samsung\",\"Xid\": \"70759437\",\"Y\": \"33.0\",\"YId\": \"0\",\"Z\": \"News Web Sites\",\"ZId\": \"36539760\"  },  {\"X\": \"MDW Test - CP\",\"Xid\": \"60904693\",\"Y\": \"5.0\",\"YId\": \"0\",\"Z\": \"Radio\",\"ZId\": \"36539758\"  } ]}"
            if (json == "") {
                $("#warning").text("String can not be empty");
                $("#warning").show();
            }
            else {
                var jsonObject = eval('(' + json + ')');
                console.log(jsonObject);
                drawStackRowChart(jsonObject.dataset);
            }
        }
    });
});

function drawStackRowChart(data){

    var margin = {top: 120, right: 250, bottom: 30, left: 40},
        width = 960 - margin.top - margin.bottom;
        height = 1000 - margin.left - margin.right;


    var y = d3.scale.ordinal().rangeRoundBands([width, 0], .1);

    var x = d3.scale.linear().rangeRound([0, height]);

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top")
        .tickFormat(d3.format(".2s"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#graph").append("svg")
        .attr("width", height + margin.left + margin.right)
        .attr("height",  width + margin.top + margin.bottom)
        .attr("class", "stackChartAxisText")
        .append("g")
        .attr("transform", "translate(" + 200 + "," + margin.top  + ")");

     var lgdSVG = d3.select("#legend")
                  .append("svg")
                  .append("g")
                  .attr("transform", "translate(" + 10 + "," + margin.top  + ")"); 

    data = transformData(data);    
    //d3.csv("data.csv", function(error, data) {
          color.domain(d3.keys(data[0]).filter(function(key) { return key !== "X"; }));

         data.forEach(function(d) {
            var x0 = 0;
            d.items = color.domain().map(function(name) { return {name: name, x0: x0, x1: x0 += +d[name]}; });
            d.total = d.items[d.items.length - 1].x1;
          });

          //data.sort(function(a, b) { return b.total - a.total; });

          y.domain(data.map(function(d) { return d.X; }));
          x.domain([0, d3.max(data, function(d) { return d.total; })]);


          svg.append("g")
              .attr("class", "y axis")
              .attr("transform", "translate(0," + 10 + ")")
              .call(yAxis);

          svg.append("g")
              .attr("class", "x axis")
              .call(xAxis)
            .append("text")
              //.attr("transform", "rotate(-90)")
              .attr("x", 600)
              .attr("dx", ".71em")
              .style("text-anchor", "end");
              //.text("News Items");



          var state = svg.selectAll(".item")
              .data(data)
            .enter().append("g")
              .attr("class", "g")
              .attr("transform", function(d) { return "translate(0," + y(d.X) + ")"; });

          state.selectAll("rect")
              .data(function(d) { return d.items; })
                .enter().append("rect")
              .attr("height", y.rangeBand())
              .attr("x", function(d) { return x(d.x0); })
              .attr("width", function(d) { return x(d.x1) - x(d.x0); })
              .style("fill", function(d) { return color(d.name); });

        var constHeightLegendRect = 45;
        var constHeightLegendText = 37;
        var totalWidth = 0;

        var aux = 0;
        var cont = 0;
        var elems = 0;
        var legend = svg.selectAll(".legend")
              .data(color.domain().slice().reverse())
              .enter().append("g")
              .attr("class", "legend")
              .attr("transform", function(d, i) { 
                      totalWidth = ( i % 6 )  * 150;
                       if(totalWidth >= 750){
                          aux = ( i  % 6 )  + 30;
                          cont++;
                          totalWidth = 600;
                       }  
                       
                      return "translate(" + totalWidth + ", " + aux + ")"; }
                );


          legend.append("rect")
             .attr("x", 0 )
              .attr("y" , - ( constHeightLegendRect * ( Math.ceil(legend[0].length / 5 ))))
              .attr("height", 18)
              .attr("width", 18)
              .style("fill", color);

       legend.append("text")
              .attr("x", 25 )
              .attr("y", - ( constHeightLegendText * ( Math.ceil(legend[0].length / 5 ))))
              .attr("d", ".35em")
              .text(function(d) { return d; });

}

function transformData(data) {

    var returnData = [];

    var xRef = {};
    var zRef = {};
    var xzRef = [];

    xRef = buildXRef(data);
    zRef = buildZRef(data);
    XZRef = buildXZRef(data, xRef, zRef);


    return XZRef;

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

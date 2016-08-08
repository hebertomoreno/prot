//Width, Height and padding
var margin = {top: 20, right: 50, bottom: 0, left: 50},
    w = 1200 - margin.left - margin.right,
    h = 500 - margin.top - margin.bottom;

var padding = 20;
var barPadding = 0.1;

var makeLineGraph = function(data) {

  /***Draw SVG***/
  var svg = d3.select("#section3")
              .append("svg")
              .attr("width",w + margin.left + margin.right)
              .attr("height",h + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  /***Useful Domain Variables***/
  var xDom = d3.extent(data, function(d){
              return d.Time;
            })
  var yDom = d3.extent(data,function(d)
            {
              return d.Open;
            })
  var vDom = d3.extent(data, function(d)
            {
              return d.Volume;
            })

  /***Scales***/
  var xScale = d3.scaleTime()
                  .domain(xDom)
                  .range([0, w]);
  var yScale = d3.scaleLinear()
                  .domain(yDom)
                  .range([h,0]);
  var vScale = d3.scaleLinear()
                  .domain(vDom)
                  .range([h,0]);
  var cScale = d3.scaleLinear()
                  .domain(vDom)
                  .range([1,0]);

  /****Axes Declaration****/
  var xAxis = d3.axisBottom()
                     .scale(xScale)
                     .ticks(16);
  var yAxis = d3.axisLeft()
                    .scale(yScale)
                    .ticks(5);

  /***Open Line Declaration***/
  var openLine = d3.line()
                  .curve(d3.curveLinear)
                .x(function(d) {
                  return xScale(d.Time);
                })
                .y(function(d) {
                  return yScale(d.Close);
                });

  /***Low Line Declaration***/
  var lowLine = d3.line()
                .x(function(d) {
                  return xScale(d.Time);
                })
                .y(function(d) {
                  return yScale(d.High);
                });

  /***Draw Volume Squares***/
  svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d,i)
                {
                  var rectPos = w/data.length;
                  return i*rectPos;
                })
      .attr("y", function(d,i)
                  {
                    return h-vScale(d.Volume);
                  })
      .attr("width", function(d){
                    return (w/data.length);
                    })
      .attr("height",function(d){
                      return vScale(d.Volume);
                    })
      .attr("fill", function(d)
                    {
                      return "rgba(0,255,0," + cScale(d.Volume) + ")";
                    });
  /***Draw Axes***/
  svg.append("g")
     .attr("class","xaxis")
     .attr("transform", "translate(0," + h + ")")
       .call(xAxis);

 svg.append("g")
       .attr("class", "yaxis")
       .call(yAxis)
       .append("text");
      /*.attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Open");*/

  svg.selectAll(".domain")
     .style("display", "none");

  /***Draw Open Line***/
  svg.append("path")
      .datum(data)
      .attr("class", "openLine")
      .attr("d", openLine);

  /***Draw Low Line***/
  /*svg.append("path")
      .datum(data)
      .attr("class", "lowLine")
      .attr("d", lowLine);*/
}

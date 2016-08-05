var margin = {top: 20, right: 50, bottom: 0, left: 50},
    w = 1100 - margin.left - margin.right,
    h = 400 - margin.top - margin.bottom;
var padding = 20;
var barPadding = 2;
var radio = 10;

var dataset = [
	["01/01/2016", 50],
	["02/02/2016", 100],
	["03/03/2016", 84],
	["14/05/2016", 31],
	["04/04/2016", 89],
	["05/03/2016", 78],
	["31/04/2016", 99],
	["05/05/2016", 63],
	["06/06/2016", 45],
	["07/07/2016", 120],
	["08/08/2016", 50],
	["11/02/2016", 112],
	["09/09/2016", 62],
	["10/10/2016", 23],
	["11/11/2016", 12],
	["12/12/2016", 34]
];

var dateParser = d3.timeParse("%d/%m/%Y");

var adjData = function(dataset) {
	data = dataset.map(function(d) {
		var parDate = dateParser(d[0]);
		var value = d[1];
		return {
			"date": parDate,
			"value": value
		}
	})
	function sortByDateAscending(a, b) {
    // Dates will be cast to numbers automagically:
    	return a.date - b.date;
	}

	data = data.sort(sortByDateAscending);
	section2(data);
}
//data = data.sort(sortByDateAscending);
var section2 = function(data) {
	var svg = d3.select("#section2")
				.append("svg")
				.attr("width", w + margin.left + margin.right)
				.attr("height", h + margin.bottom + margin.top)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	/*Domains*/
	var xDom = d3.extent(data, function(d) {
		return d.date;
	})
	console.log(xDom);
	var yDom = d3.extent(data, function(d) {
		return d.value;
	})
	console.log(yDom);
	/*Scales*/
	var xScale = d3.scaleTime()
					.domain(xDom)
					.range([0, w]);
	var yScale = d3.scaleLinear()
					.domain(yDom)
					.range([h-padding,0]);
	/*Axes*/
	var xAxis = d3.axisBottom()
					.scale(xScale)
					.ticks(10);
	var yAxis = d3.axisLeft()
					.scale(yScale)
					.ticks(5);
	/*Draw Dots*/
	svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function(d) {
			return (xScale(d.date)+padding);
		})
		.attr("cy", function(d) {
			return yScale(d.value);
		})
		.attr("r", 2)
		.attr("fill", function(d){
			var rgbR = Math.round(Math.random() * 255);
			var rgbR = rgbR.toString(16);
			var rgbG = Math.round(Math.random() * 255);
			var rgbG = rgbG.toString(16);
			var rgbB = Math.round(Math.random() * 255);
			var rgbB = rgbG.toString(16);
			return "#"+rgbR+rgbG+rgbB;
		});
	/*Draw Path*/
	var openLine = d3.line()
					.curve(d3.curveLinear)
					.x(function(d) {
						return xScale(d.date)+padding;
					})
					.y(function(d) {
						return yScale(d.value);
					});
	svg.append("path")
		.datum(data)
		.attr("class", "openLine")
		.attr("d", openLine);
	/*Draw Axes*/
	console.log("Drawing Axes");
	svg.append("g")
		.attr("class","axis")
		.attr("transform", "translate(0," + (h-padding) + ")")
		.call(xAxis);
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + padding + ",0)")
		.call(yAxis);

}

$(document).ready(adjData(dataset));
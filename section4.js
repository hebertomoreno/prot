var margin = {top: 20, right: 50, bottom: 50, left: 50},
    w = 1000 - margin.left - margin.right,
    h = 500 - margin.top - margin.bottom;
var padding = 50;

var section4 = function() {
	var svg = d3.select("#section1")
				.append("svg")
				.attr("width",w + margin.left + margin.right)
				.attr("height",h + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	var dataset = [
					[0,0],
					[5, 20],
					[480, 90],
					[250, 50],
					[100, 33],
					[330, 95],
					[410, 12],
					[475, 44],
					[25, 67],
					[85, 21],
					[220, 88] ];
	/*Domains*/
	var xDom = d3.extent(dataset, function(d){
		return d[0];
	})
	var yDom = d3.extent(dataset,function(d)
	{
		return d[1];
	})
	/*Scales*/
	var xScale = d3.scaleLinear()
					.domain(xDom)
					.range([0, w]);
	var yScale = d3.scaleLinear()
					.domain(yDom)
					.range([h-padding,0]);
	/*Axes*/
	var xAxis = d3.axisBottom()
					.scale(xScale)
					.ticks(5);
	var yAxis = d3.axisLeft()
					.scale(yScale)
					.ticks(5);
	/*Draw Circles*/
	svg.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("cx", function(d) {
			return xScale(d[0]);
		})
		.attr("cy", function(d) {
			return yScale(d[1]);
		})
		.attr("r", function(d){
			if( (d[0] && d[1]) === 0)
			{
				return 0;
			} else {
				return 5;
			}
		});
	/***Brush Declaration***/
	var brush = d3.brush().on("end", brushended),
	idleTimeout,
	idleDelay = 350;
	/***Brushended function***/
	function brushended()
	{
		var s = d3.event.selection;
		if (!s) {
			if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);

			xScale.domain(xDom);
			yScale.domain(yDom);

		} else {
			xScale.domain([s[0][0], s[1][0]].map(xScale.invert, xScale));
			yScale.domain([s[1][1], s[0][1]].map(yScale.invert, yScale));

			svg.select(".brush").call(brush.move, null);
		}
		zoom();
	}
	function zoom()
	{
	    var t = svg.transition().duration(750);

	    svg.select(".xaxis").transition(t).call(xAxis);
	    svg.select(".yaxis").transition(t).call(yAxis);

	    svg.selectAll("circle").transition(t)
								.attr("class", "circles")
								.attr("cx", function(d) {
									return xScale(d[0]);
								})
								.attr("cy", function(d) {
									return yScale(d[1]);
								});
		svg.selectAll("text").transition(t)
								.attr("class", "text")
								.attr("x",function(d) {
									return xScale(d[0]);
								})
								.attr("y", function(d) {
									return yScale(d[1]);
								});
	}
	/***Idle function***/
	function idled()
	{
		idleTimeout = null;
	}
	/*Draw Text*/
	svg.selectAll("text")
		.data(dataset)
		.enter()
		.append("text")
		.text(function(d) {
			if((d[0] && d[1]) === 0)
			{
				return " ";
			} else {
				return d[0] + "," + d[1];
			}
		})
		.attr("x", function(d) {
			return xScale(d[0]+5);
			})
		.attr("y", function(d) {
			return yScale(d[1]);
		})
		.attr("font-family", "sans-serif")
		.attr("font-size", "11px")
		.attr("fill", "red");
	svg.append("g")
	    .attr("class", "brush")
	    .call(brush);
	/*Draw Axes*/
	svg.append("g")
		.attr("class","xaxis")
		.attr("transform", "translate(0," + (h-padding) + ")")
		.call(xAxis);
	svg.append("g")
		.attr("class", "yaxis")
		.call(yAxis);
}

$(document).ready(section4);
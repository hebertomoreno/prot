var mexicojs = function() {

	var width = 705,
		height = 500;

	var active = d3.select(null);

	var svg = d3.select("#section4")
				.append("svg")
				.attr("width", width)
				.attr("height", height);

	var projection = d3.geoConicConformal()
							.rotate([102, 0])
							.center([0, 24])
							.parallels([17.5, 29.5])
							.scale(1400)
							.translate([width / 2, height / 2]);

	var path = d3.geoPath()
				.projection(projection);

	svg.append("rect")
		.attr("class", "backgroundMex")
		.attr("width", width)
		.attr("height", height)
		.on("click", reset);

	var g = svg.append("g")
				.style("stroke-width", "1.5px");

	d3.json("mexico.json", function(error, mexico) {

		if (error) return console.error(error);
		var states = topojson.feature(mexico, mexico.objects.states);

		/*svg.append("path")
			.datum(states)
			.attr("d", d3.geoPath().projection(d3.geoMercator()));*/
		g.selectAll("path")
			.data(states.features)
			.enter()
			.append("path")
			.attr("class", function(d) { 
				return "state id" + d.id;
			})
			.on("click", clicked)
			.attr("d", path);
		g.append("path")
			.datum(topojson.mesh(mexico, mexico.objects.states, function(a, b) { return a !== b; }))
			.attr("class", "mesh")
			.attr("d", path);
		g.selectAll(".stateLabel")
			.data(states.features)
			.enter().append("text")
			.attr("class", function(d) { return "stateLabel id" + d.id; })
			.attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
			.attr("dy", ".35em")
			.text(function(d) { return d.properties.name; });
	});
	function clicked(d) {
		if (active.node() === this) return reset();
		active.classed("active", false);
		active = d3.select(this).classed("active", true);

		var bounds = path.bounds(d),
		dx = bounds[1][0] - bounds[0][0],
		dy = bounds[1][1] - bounds[0][1],
		x = (bounds[0][0] + bounds[1][0]) / 2,
		y = (bounds[0][1] + bounds[1][1]) / 2,
		scale = .9 / Math.max(dx / width, dy / height),
		translate = [width / 2 - scale * x, height / 2 - scale * y];

		g.transition()
			.duration(750)
			.style("stroke-width", 1.5 / scale + "px")
			.attr("transform", "translate(" + translate + ")scale(" + scale + ")");

	}

	function reset() {
		active.classed("active", false);
		active = d3.select(null);

		g.transition()
		.duration(750)
		.style("stroke-width", "1.5px")
		.attr("transform", "");
	}
}

$(document).ready(mexicojs);
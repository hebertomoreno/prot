var stockLineChart = (function (window, d3) {

	var xDom, yDom, xScale, yScale, xAxis, yAxis,svg, closeLine, chartWrapper;
	var parser = d3.timeParse("%Y-%m-%d");
	var data;

	/*Populate the data variable with table.csv*/
	d3.csv("table.csv", function(dataset) {
		data = dataset.map(function(d) {
			var parDate = parser(d.Date);
			var f = d3.format(".2");

			d.Open = +f(+d.Open);
			d.High = +d.High;
			d.Low = +f(+d.Low);
			d.Close = +d.Close;
			d.Volume = +d.Volume;
			d["Adj Close"] = +d["Adj Close"];

			return{"Date": parDate,
			"Open": d.Open,
			"High": d.High,
			"Low": d.Low,
			"Close": d.Close,
			"Volume": d.Volume,
			"AdjClose": d["Adj Close"]};
		})
		init();
	})
	function init() {
		//console.log(data);
		/*Domains*/
		xDom = d3.extent(data, function(d) {
			return d.Date;
		})
		yDom = d3.extent(data, function(d) {
			return d.Close;
		})

		/*Scales*/
		xScale = d3.scaleTime()
					.domain(xDom);
		yScale = d3.scaleLinear()
					.domain(yDom);

		/*Axes*/
		xAxis = d3.axisBottom();
		yAxis = d3.axisLeft();

		/*Path generator for the closeLine*/
		closeLine = d3.line()
						.curve(d3.curveLinear)
						.x(function(d) {
							return xScale(d.Date);
						})
						.y(function(d) {
							return yScale(d.Close);
						});
		/*initialize svg*/
		svg = d3.select("#section3")
		chartWrapper = svg.append("g");
		path = chartWrapper.append('path').datum(data).classed('closeLine', true);
	    chartWrapper.append('g').classed('x axis', true);
	    chartWrapper.append('g').classed('y axis', true);

	    /*Call render*/
    	render();
	}

	function render() {
		//Get dimensions based on window size
		updateDimensions(window.innerWidth);
		xScale.range([0,width]);
		yScale.range([height,0]);

		//Update svg elements to new dimensions
		svg
			.attr('width', width + margin.right + margin.left)
			.attr('height', height + margin.top + margin.bottom);
		chartWrapper.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
		//update the axis and line
		xAxis.scale(xScale);
		yAxis.scale(yScale);

		svg.select('.x.axis')
			.attr('transform', 'translate(0,' + height + ')')
			.call(xAxis);

		svg.select('.y.axis')
			.call(yAxis);

		path.attr('d', closeLine);
	}

	function updateDimensions(winWidth) {
		margin.top = 20;
		margin.right = 50;
		margin.left = 50;
		margin.bottom = 50;

		width = winWidth - margin.left - margin.right;
		height = 700 - margin.top - margin.bottom;
	}

	return {
		render: render 
	}

})(window,d3);

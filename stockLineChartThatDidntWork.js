var stockLineChart = (function (window, d3) {

	var xDom, yDom, xScale, yScale, xAxis, yAxis,svg, closeLine, chartWrapper,locator;
	var focus;
	var parser = d3.timeParse("%Y-%m-%d");
	var breakPoint = 768;
	var data;
	var bisectDate = d3.bisector(function(d) { return d.Date; }).left;
	var formatValue = d3.format(",.2f"),
	formatCurrency = function(d) { return "$" + formatValue(d); };

	/*Populate the data variable with table.csv*/
	d3.csv("table.csv", function(data) {
		data.forEach(function(d) {
			d.Date = parser(d.date);
			d.Close = +d.close;
		});
		data.sort(function(a, b) {
			return a.date - b.date;
		});
		/*data = dataset.map(function(d) {
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
		})*/
		init(data);
	})
	function mousemove() {
		console.log("Mouse position is:" +d3.mouse(this)[0]);
		var x0 = xScale.invert(d3.mouse(this)[0]);
		console.log("X is: "+x0);
		var i = bisectDate(data, x0);
		console.log(" i equals " + i);
		var d1 = data[i];
		console.log(d1);
		var d0 = data[i - 1];
		console.log(d0);
		var d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
		focus.attr("transform", "translate(" + xScale(d.Date) + "," + yScale(d.Close) + ")");
		focus.select("text").text(formatCurrency(d.Close));
	}

	function init(data) {
		/*Domains*/
		xDom = ([data[0].Date, data[data.length - 1].Date]);
		/*xDom = d3.extent(data, function(d) {
			return d.Date;
		})*/
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
				.append("svg");
		/*Chart Wrapper*/
		chartWrapper = svg.append("g");
		path = chartWrapper.append('path').datum(data).classed('closeLine', true);
	    chartWrapper.append('g').classed('x axis', true);
	    chartWrapper.append('g').classed('y axis', true);

	    /*Focus is the little circle showing information*/
		focus = chartWrapper.append("g")
					.attr("class", "focus")
					.style("display", "none");

		focus.append("circle")
			.attr("r", 4.5);

		focus.append("text")
			.attr("x", 9)
			.attr("dy", ".35em");
		//var testBis = bisectDate(data, )
		updateDimensions(window.innerWidth);

		svg
			.attr('width', width + margin.right + margin.left)
			.attr('height', height + margin.top + margin.bottom);
		

		overlayRect();

	    /*Call render*/
    	render(data);
	}
	var overlayRect = function() {
		chartWrapper.append("rect")
			.attr("class", "overlay")
			.attr("width", width)
			.attr("height", height)
			.on("mouseover", function() { focus.style("display", null); })
			.on("mouseout", function() { focus.style("display", "none"); })
			.on("mousemove", mousemove);
	}
	var sw = 0;
	function render(data) {
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

		if(window.innerWidth < breakPoint) {
			yAxis = d3.axisRight().scale(yScale);
			xAxis.ticks(d3.timeYear.every(2));
		} else {
			yAxis = d3.axisLeft().scale(yScale);
			xAxis.ticks(d3.timeYear.every(1));
		}
		/*Draw xAxis*/
		svg.select('.x.axis')
			.attr('transform', 'translate(0,' + height + ')')
			.call(xAxis);
		/*Draw yAxis*/
		svg.select('.y.axis')
			.call(yAxis);

		/*Draw closeLine*/
		path.attr('d', closeLine);

		/*Function to show the values in the focus circle*/

	}
	
	function updateDimensions(winWidth) {
		margin.top = 20;
		margin.right = winWidth < breakPoint ? 0 : 100;
		margin.left = winWidth < breakPoint ? 0 : 50;
		margin.bottom = 50;

		width = winWidth - margin.left - margin.right;
		height = .7 * width;
		console.log(width);
		//height = 700 - margin.top - margin.bottom;
	}

	return {
		render: render 
	}

})(window,d3);

window.addEventListener('resize', stockLineChart.render);
$(document).ready(stockLineChart);
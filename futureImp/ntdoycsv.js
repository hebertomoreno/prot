
var ntdoycsv = function()
{
  var parser = d3.timeParse("%Y-%m-%d");
  var tFormat = d3.timeFormat("%d/%m/%y");
  d3.csv("table.csv", function(dataset)
  {
    data = dataset.map(function(d)
    {
      var parDate = parser(d.Date);
      var f = d3.format(".2");

      d.Open = +f(+d.Open);
      d.High = +d.High;
      d.Low = +f(+d.Low);
      d.Close = +d.Close;
      d.Volume = +d.Volume;
      d["Adj Close"] = +d["Adj Close"];

      return{"Time": parDate,
             "Open": d.Open,
             "High": d.High,
             "Low": d.Low,
             "Close": d.Close,
             "Volume": d.Volume,
             "AdjClose": d["Adj Close"]};
    })
    makeLineGraph(data);
  })

}

$(document).ready(ntdoycsv());
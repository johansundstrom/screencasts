function BarChart(div){
  var margin = {top: 20, right: 20, bottom: 30, left: 40},

      x = d3.scale.ordinal(),

      y = d3.scale.linear(),

      xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom"),

      yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10, "%"),

      svg = d3.select(div).append("svg"),
      g = svg.append("g"),

      xAxisG = g.append("g")
        .attr("class", "x axis"),

      yAxisG = g.append("g")
        .attr("class", "y axis"),

      yAxisLabel = yAxisG.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

  // Call once to initialize visualization
  updateSize();

  function updateSize(){
    var outerWidth = div.clientWidth,
        outerHeight = div.clientHeight,
        width = outerWidth - margin.left - margin.right,
        height = outerHeight - margin.top - margin.bottom;

    y.range([height, 0]);
    x.rangeRoundBands([0, width], .1);

    svg.attr("width", outerWidth)
       .attr("height", outerHeight);

    g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv("data.tsv", type, function(error, data) {
      var bars;

      x.domain(data.map(function(d) { return d.letter; }));
      y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

      xAxisG
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      yAxisG.call(yAxis);

      // Create the D3 selection with data binding
      bars = g.selectAll(".bar").data(data);

      // Enter: stuff that happens only once when DOM elements are created.
      // Should be independent of data and visualization size.
      bars.enter().append("rect").attr("class", "bar");

      // Update: stuff that may happen many times,
      // and may change based on the data or visualization size.
      bars.attr("x", function(d) { return x(d.letter); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.frequency); })
          .attr("height", function(d) { return height - y(d.frequency); });

    });
  }

  function type(d) {
    d.frequency = +d.frequency;
    return d;
  }

  // Return a public API with updateSize()
  return { updateSize: updateSize };
}

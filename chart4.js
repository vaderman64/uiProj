function createChart4(data) {
  // Set up chart dimensions
  const margin = { top: 25, right: 42, bottom: 40, left: 70 };
  const width = 570 - margin.left - margin.right;
  const height = 280 - margin.top - margin.bottom;

  // Create the SVG container
  const svg = d3
    .select("#chart4")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create scales
  const xScale = d3.scaleLinear().domain([0, 5]).range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, (d) => d["Total Departure and Arrival Delay in Minutes"]),
    ])
    .nice()
    .range([height, 0]);

  // Color scale for delay severity
  const colorScale = d3
    .scaleSequential()
    .domain([
      0,
      d3.max(data, (d) => d["Total Departure and Arrival Delay in Minutes"]),
    ])
    .interpolator(d3.interpolateReds);

  // Tooltip functionality
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid #ccc")
    .style("padding", "5px")
    .style("border-radius", "3px")
    .style("pointer-events", "none");

  // Add scatter plot points
  const dots = svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(d["Departure/Arrival time convenient"]))
    .attr("cy", (d) =>
      yScale(d["Total Departure and Arrival Delay in Minutes"])
    )
    .attr("r", 5)
    .attr("fill", "#ED1C24")

    .attr("opacity", 0)
    .transition()
    .duration(1000)
    .attr("opacity", 0.7);

  // Add mouseover and mouseout events for tooltips
  svg
    .selectAll(".dot")
    .on("mouseover", function (event, d) {
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip
        .html(
          `Time Convenience: ${d["Departure/Arrival time convenient"]}<br>Total Delay: ${d["Total Departure and Arrival Delay in Minutes"]} mins`
        )
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      tooltip.transition().duration(200).style("opacity", 0);
    });

  // Add X axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("font-size", "12px");

  // Add Y axis
  svg
    .append("g")
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .style("font-size", "12px");

  // Add chart title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Delay Minutes vs Time Convenience");

  // X-axis label
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Departure/Arrival Time Convenience Rating");

  // Y-axis label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -margin.left + 20)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Total Delay Minutes");
}

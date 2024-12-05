function createChart8(data) {
  // Calculate total flight distance
  const totalFlightDistance = d3.sum(data, (d) => +d["Flight Distance"] || 0);

  // Set dimensions
  const width = 300;
  const height = 300;
  const radius = Math.min(width, height) / 2;

  // Create SVG container
  const svg = d3
    .select("#chart8")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // Define color scale
  const colorScale = d3.scaleOrdinal().range(["#FF9800", "#E0E0E0"]); // Primary color and background

  // Define dummy data for donut chart
  const chartData = [
    { label: "Total Distance", value: totalFlightDistance },
    { label: "Remaining", value: 0 }, // If you want to show the remaining to a max
  ];

  // Create pie generator
  const pie = d3
    .pie()
    .value((d) => d.value)
    .sort(null);

  // Create arc generator
  const arc = d3
    .arc()
    .innerRadius(radius * 0.6) // Inner radius for donut
    .outerRadius(radius);

  // Add arcs
  svg
    .selectAll("path")
    .data(pie(chartData))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => colorScale(d.data.label));

  // Add text in the center
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.3em")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .text(`${totalFlightDistance.toLocaleString()} miles`);
}

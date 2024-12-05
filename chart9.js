function createChart9(data) {
  // Count customers with and without delays
  const noDelayCount = data.filter(
    (d) =>
      +d["Departure Delay in Minutes"] === 0 &&
      +d["Arrival Delay in Minutes"] === 0
  ).length;
  const totalCustomers = data.length;
  const delayedCount = totalCustomers - noDelayCount;

  // Prepare data for pie chart
  const pieData = [
    { label: "No Delays", value: noDelayCount },
    { label: "With Delays", value: delayedCount },
  ];

  // Set dimensions
  const width = 300;
  const height = 300;
  const radius = Math.min(width, height) / 2;

  // Create SVG container
  const svg = d3
    .select("#chart9")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // Define color scale
  const colorScale = d3.scaleOrdinal().range(["#FFC000", "#ED1C24"]); // Green for no delays, red for delays

  // Create pie generator
  const pie = d3
    .pie()
    .value((d) => d.value)
    .sort(null);

  // Create arc generator
  const arc = d3
    .arc()
    .innerRadius(0) // Full pie chart
    .outerRadius(radius);

  // Add arcs
  svg
    .selectAll("path")
    .data(pie(pieData))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => colorScale(d.data.label));

  // Add labels
  svg
  .selectAll("text")
  .data(pie(pieData))
  .enter()
  .append("text")
  .attr("transform", (d) => `translate(${arc.centroid(d)})`)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("font-weight", "bold")
  .html(
    (d) =>
      `<tspan>${d.data.label}</tspan><tspan x="0" dy="1.2em" style="font-weight:normal">${d.data.value}%</tspan>`
  );
}

function createChart1(data) {
    // Set up chart dimensions
    const margin = { top: 25, right: 42, bottom: 40, left: 70 };
    const width = 570 - margin.left - margin.right;
    const height = 280 - margin.top - margin.bottom;

    // Create the SVG container
    const svg = d3.select("#chart1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set up scales
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.id)])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d['Flight Distance'])])
        .nice()
        .range([height, 0]);

    // Create line generator function
    const line = d3.line()
        .x(d => xScale(d.id))
        .y(d => yScale(d['Flight Distance']));

    // Append the line path
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "#FF0000")
        .attr("stroke-width", 2)
        .attr("opacity", 0)
        .transition()
        .duration(1000)
        .attr("opacity", 1);

    // Add small circles for each data point with transition
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.id))
        .attr("cy", d => yScale(d['Flight Distance']))
        .attr("r", 4)
        .attr("fill", d => "#FFC000")
        .attr("opacity", 0)
        .transition()
        .duration(1000)
        .attr("opacity", 1);

    // Tooltip functionality
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("border-radius", "3px")
        .style("pointer-events", "none");

    // Add mouseover and mouseout events for tooltips
    svg.selectAll(".dot")
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 1);
            tooltip.html(`Customer ID: ${d.id}<br>Flight Distance: ${d['Flight Distance']} km`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function () {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        });

    // Add X axis with ticks and labels
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("font-size", "12px");

    // Add Y axis with ticks and labels
    svg.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .style("font-size", "12px");

    // Add chart title and axis labels
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Distance Travelled by Each Customer");

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Customer ID");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2) + 15)
        .attr("y", -margin.left + 10)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Flight Distance (km)");
}

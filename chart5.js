function createChart5(data) {
    // Set up chart dimensions
    const margin = { top: 25, right: 42, bottom: 40, left: 70 };
    const width = 370 - margin.left - margin.right;
    const height = 280 - margin.top - margin.bottom;

    // Ensure all seat classes are represented
    const seatClasses = ['Business', 'Eco', 'Eco Plus'];

    // Group data by seat class and calculate average satisfaction
    const satisfactionBySeatClass = new Map(
        seatClasses.map(seatClass => {
            const filteredData = data.filter(d => d['Class'] === seatClass);
            
            const avgSatisfaction = filteredData.length > 0 
                ? d3.mean(filteredData, d => d.satisfaction)
                : 0;
            
            return [seatClass, avgSatisfaction];
        })
    );

    // Convert map to array for D3 processing
    const processedData = seatClasses.map(seatClass => ({
        seatClass, 
        avgSatisfaction: satisfactionBySeatClass.get(seatClass)
    }));

    // Create the SVG container
    const svg = d3.select("#chart5")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create X scale
    const xScale = d3.scaleBand()
        .domain(seatClasses)
        .range([0, width])
        .padding(0.1);

    // Create Y scale 
    const yScale = d3.scaleLinear()
        .domain([-1, 1])
        .range([height, 0]);

    // Color scale based on satisfaction
    const colorScale = d3.scaleLinear()
        .domain([-1, 0, 1])
        .range(["#FFC000", "#FFC000", "#FFFF00"]);

    // Create bars with transition
    svg.selectAll(".bar")
        .data(processedData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.seatClass))
        .attr("width", xScale.bandwidth())
        .attr("y", height)
        .attr("height", 0)
        .attr("fill", d => colorScale(d.avgSatisfaction))
        .transition()
        .duration(1000)
        .attr("y", d => yScale(Math.max(-1, Math.min(1, d.avgSatisfaction))))
        .attr("height", d => Math.abs(height - yScale(d.avgSatisfaction)));

    // Add value labels on top of bars
    svg.selectAll(".bar-label")
        .data(processedData)
        .enter().append("text")
        .attr("class", "bar-label")
        .attr("x", d => xScale(d.seatClass) + xScale.bandwidth() / 2)
        .attr("y", height)
        .attr("text-anchor", "middle")
        .attr("opacity", 0)
        .text(d => d.avgSatisfaction.toFixed(2))
        .transition()
        .duration(1000)
        .attr("y", d => yScale(d.avgSatisfaction) - 5)
        .attr("opacity", 1);

    // Add X axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("font-size", "12px");

    // Add Y axis
    svg.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .style("font-size", "12px");

    // Add chart title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Satisfaction by Seat Class");

    // Add Y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", -margin.left + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Average Satisfaction");
}
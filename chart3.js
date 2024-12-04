function createChart3(data) {
    const categorySelector = d3.select("#categorySelector");
    const chartContainer = d3.select("#chart3");

    // Define the categories and their corresponding data fields
    const categories = {
        "Checkin Service": "Checkin service",
        "Ease of Online Booking": "Ease of Online booking",
        "Gate Location": "Gate location",
        "On-board Service": "On-board service",
        "Baggage Handling": "Baggage Handling"
    };

    // Function to update the chart
    function updateChart(selectedCategory) {
        const field = categories[selectedCategory];

        // Group and count data by satisfaction level
        const satisfactionCounts = d3.rollups(
            data,
            v => v.length,
            d => d[field]
        ).sort((a, b) => d3.ascending(a[0], b[0]));

        const maxCount = d3.max(satisfactionCounts, d => d[1]);

        // Clear existing chart
        chartContainer.html("");

        const svgWidth = 400;
        const svgHeight = 300;
        const margin = { top: 40, right: 30, bottom: 50, left: 60 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        const svg = chartContainer
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        const chartGroup = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Scales
        const xScale = d3
            .scaleBand()
            .domain(satisfactionCounts.map(d => d[0]))
            .range([0, width])
            .padding(0.2);

        const yScale = d3.scaleLinear().domain([0, maxCount]).range([height, 0]);

        // Axes
        const xAxis = chartGroup
            .append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        const yAxis = chartGroup.append("g").call(d3.axisLeft(yScale));

        // Bars
        chartGroup
            .selectAll(".bar")
            .data(satisfactionCounts)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d[0]))
            .attr("y", d => yScale(d[1]))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - yScale(d[1]))
            .attr("fill", "#FF0000");

        // X-axis Label
        svg.append("text")
            .attr("x", svgWidth / 2)
            .attr("y", svgHeight - 10)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .text(`${selectedCategory} Levels`);

        // Y-axis Label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -svgHeight / 2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .text("Number of Customers");

        // Title
        svg.append("text")
            .attr("x", svgWidth / 2)
            .attr("y", margin.top / 2)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .text(`Satisfaction Levels for ${selectedCategory}`);
    }

    // Initial rendering with default category
    updateChart(categorySelector.property("value"));

    // Update chart on category change
    categorySelector.on("change", function () {
        const selectedCategory = d3.select(this).property("value");
        updateChart(selectedCategory);
    });
}
function createChart6(data) {
    // Filter first 15 disloyal customers (e.g., customers with lowest satisfaction scores)
    const disloyalCustomers = data
        .sort((a, b) => a.satisfaction - b.satisfaction)
        .slice(0, 15);

    // Prepare the ticket price data for stacked bars
    const categories = ['1st Ticket Price', '2nd Ticket Price', '3rd Ticket Price', '4th Ticket Price'];
    const preparedData = disloyalCustomers.map(d => ({
        id: d['Customer ID'],
        ...Object.fromEntries(categories.map(cat => [cat, d[cat]]))
    }));

    // Set dimensions
    const margin = { top: 40, right: 30, bottom: 5, left: 35 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create scales
    const xScale = d3.scaleBand()
        .domain(preparedData.map(d => d.id))
        .range([0, width])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(preparedData, d => 
            categories.reduce((acc, key) => acc + d[key], 0)
        )])
        .range([height, 0]);

    const colorScale = d3.scaleOrdinal()
        .domain(categories)
        .range(['#FFF9C4', '#FFEB3B', '#FFC107', '#FFA000']);

    // Create SVG
    const svg = d3.select('#chart6')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create stack generator
    const stack = d3.stack().keys(categories);
    const stackedData = stack(preparedData);

    // Add stacked bars
    svg.selectAll('.layer')
        .data(stackedData)
        .enter()
        .append('g')
        .attr('class', 'layer')
        .attr('fill', d => colorScale(d.key))
        .selectAll('rect')
        .data(d => d)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.data.id))
        .attr('y', d => yScale(d[1]))
        .attr('height', d => yScale(d[0]) - yScale(d[1]))
        .attr('width', xScale.bandwidth());

    // Add X-axis
    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')
        .style('font-size', '10px');

    // Add Y-axis
    svg.append('g')
        .call(d3.axisLeft(yScale).ticks(5));

    // Add legend
    const legend = svg.append('g')
        .attr('transform', `translate(${width - 100}, 0)`);

    categories.forEach((category, i) => {
        const legendRow = legend.append('g')
            .attr('transform', `translate(0, ${i * 20})`);

        legendRow.append('rect')
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', colorScale(category));

        legendRow.append('text')
            .attr('x', 15)
            .attr('y', 10)
            .attr('text-anchor', 'start')
            .style('font-size', '12px')
            .text(category);
    });

    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text('Ticket Prices of First 15 Disloyal Customers');
}

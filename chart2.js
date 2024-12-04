function createChart2(data) {
    // Calculate satisfaction proportions
    const satisfactionCounts = d3.rollup(
        data, 
        v => v.length, 
        d => d.satisfaction > 0 ? 'Satisfied' : 'Neutral / Dissatisfied'
    );

    // Convert rollup to array for pie chart
    const satisfactionData = Array.from(satisfactionCounts, ([key, value]) => ({
        category: key,
        count: value
    }));

    // Set up chart dimensions
    const margin = { top: 20, right: 40, bottom: 20, left: 50 };
    const width = 300 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    // Create SVG
    const svg = d3.select('#chart2')
        .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
        .append('g')
            .attr('transform', `translate(${width/2 + margin.left},${height/2 + margin.top})`);

    // Color scale
    const color = d3.scaleOrdinal()
        .domain(['Satisfied', 'Neutral / Dissatisfied'])
        .range(['#FFC000', '#FF0000']);

    // Pie layout
    const pie = d3.pie()
        .value(d => d.count)
        .sort(null);

    const path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    const label = d3.arc()
        .outerRadius(radius + 30)
        .innerRadius(radius + 10);

    // Create pie chart
    const arcs = svg.selectAll('.arc')
        .data(pie(satisfactionData))
        .enter()
        .append('g')
            .attr('class', 'arc');

    // Add colored slices
    arcs.append('path')
        .attr('d', path)
        .attr('fill', d => color(d.data.category))
        .attr('stroke', 'white')
        .style('stroke-width', '2px');

    // Add percentage labels
    arcs.append('text')
        .attr('transform', d => `translate(${label.centroid(d)})`)
        .attr('dy', '0.35em')
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text(d => `${((d.data.count / data.length) * 100).toFixed(1)}%`);

    // Add category labels
    arcs.append('text')
    .attr('transform', d => `translate(${label.centroid(d)})`)
    .attr('y', 15)
    .style('text-anchor', 'middle')
    .style('font-size', '10px')
    .selectAll('tspan')
    .data(d => d.data.category.split(' '))
    .enter()
    .append('tspan')
    .attr('x', 0)
    .attr('dy', (d, i) => i === 0 ? '0em' : '1em')
    .text(d => d);
}
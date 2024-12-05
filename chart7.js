function createChart7(data) {
    // Filter for loyal customers (satisfaction > 0)
    const loyalCustomers = data.filter(d => d.satisfaction > 0);

    // Count loyal customers by gender
    const genderCounts = d3.rollup(
        loyalCustomers, 
        v => v.length, 
        d => d.Gender
    );

    // Convert the rollup to an array of objects
    const genderData = Array.from(genderCounts, ([key, value]) => ({
        gender: key,
        count: value
    }));

    // Set up chart dimensions
    const margin = { top: 40, right: 40, bottom: 30, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select('#chart7')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale
    const x = d3.scaleBand()
        .domain(genderData.map(d => d.gender))
        .range([0, width])
        .padding(0.1);

    // Y Scale
    const y = d3.scaleLinear()
        .domain([0, d3.max(genderData, d => d.count)])
        .nice()
        .range([height, 0]);

    // Define the colors
    const colors = ['#FFC000', '#ED1C24'];

    // Create bars
    svg.selectAll('.bar')
        .data(genderData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.gender))
        .attr('y', d => y(d.count))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.count))
        .attr('fill', (d, i) => colors[i % colors.length]);

    // Add x-axis
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('text-anchor', 'middle');

    // Add y-axis
    svg.append('g')
        .call(d3.axisLeft(y));
}

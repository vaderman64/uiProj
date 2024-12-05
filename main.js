// Load the CSV data
d3.csv("data.csv")
  .then((data) => {
    // Process the data
    data.forEach((d) => {
      // Parse numerical values
      d.Age = +d.Age;
      d["Flight Distance"] = +d["Flight Distance"];
      d["Departure Delay in Minutes"] = +d["Departure Delay in Minutes"];
      d["Arrival Delay in Minutes"] = +d["Arrival Delay in Minutes"];
      d["Total Departure and Arrival Delay in Minutes"] =
        +d["Total Departure and Arrival Delay in Minutes"];
      d["Average Satisfaction"] = +d["Average Satisfaction"];
      d["Departure/Arrival time convenient"] =
        +d["Departure/Arrival time convenient"];
      d["1st Ticket Price"] = +d["1st Ticket Price"];
      d["2nd Ticket Price"] = +d["2nd Ticket Price"];
      d["3rd Ticket Price"] = +d["3rd Ticket Price"];
      d["4th Ticket Price"] = +d["4th Ticket Price"];

      // Map satisfaction to a numeric value (e.g., "satisfied" = 1, "neutral" = 0, "dissatisfied" = -1)
      d.satisfaction =
        d.satisfaction === "satisfied"
          ? 1
          : d.satisfaction === "neutral"
          ? 0
          : -1;
    });
    console.log("Data Loaded Successfully");
    // Pass data to individual chart functions
    createChart1(data);
    createChart2(data);
    createChart3(data);
    createChart4(data);
    createChart5(data);
    createChart6(data);
    createChart7(data);
    createChart8(data);
    createChart9(data);
  })
  .catch((error) => {
    console.error("Error loading the CSV data:", error);
  });
  function switchColors() {
    // Select all bars
    d3.selectAll('#chart7 .bar')
        .each(function(d, i) {
            // Get the current color of the bar
            const currentColor = d3.select(this).attr('fill');

            // Switch to the other color
            const newColor = currentColor === '#FFC000' ? '#ED1C24' : '#FFC000';

            // Set the new color
            d3.select(this).attr('fill', newColor);
        });
}
  function switchStyle(){
    console.log("Switcha");
    d3.select('#chart7 svg').style('background-color', d3.event.target.checked? 'white' : '#F2F2F2');
    d3.selectAll('.bar').style('fill', d => colors[d.count % colors.length]);
}

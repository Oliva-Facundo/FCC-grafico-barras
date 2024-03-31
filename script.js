document.addEventListener("DOMContentLoaded", function () {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  )
    .then((res) => res.json())
    .then((data) => {
      const dataset = data.data;

      const w = 1000;
      const h = 500;
      const p = 40;
      const barWidth = (w - 2 * p) / dataset.length;

      const svg = d3.select("#chart").attr("width", w).attr("height", h);

      const years = dataset.map((d) => new Date(d[0]));

      const xScale = d3
        .scaleTime()
        .domain([d3.min(years), d3.max(years)])
        .range([p, w - p]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, (d) => d[1])])
        .range([h - p, p]);

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      d3.select("#title").text("United States GDP");

      svg
        .append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${h - p})`);

      svg
        .append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", `translate(${p}, 0)`);

      svg
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])
        .attr("x", (d) => xScale(new Date(d[0])))
        .attr("y", (d) => yScale(d[1]))
        .attr("width", barWidth)
        .attr("height", (d) => h - p - yScale(d[1]))
        .on("mouseover", (event, d) => {
          const tooltip = document.getElementById("tooltip");
          tooltip.style.display = "block";
          tooltip.innerHTML = `<div>Date: ${d[0]}</div><div>GDP: ${d[1]}</div>`;
          tooltip.setAttribute("data-date", d[0]);
          tooltip.style.left = event.pageX + 10 + "px";
          tooltip.style.top = event.pageY - 30 + "px";
        })
        .on("mouseout", () => {
          document.getElementById("tooltip").style.display = "none";
        });
    });
});

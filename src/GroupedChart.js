import React, { useRef, useEffect, useState } from "react";
import "./GroupedChart.css";
import { select, axisBottom, axisRight, scaleLinear, scaleBand, csv } from "d3";

function GroupedChart() {
  const [data, setData] = useState([25, 30, 45, 60, 10, 65, 75,100]);
  const svgRef = useRef();

  const [dataTeste, setDataTeste] = useState();
  useEffect(() => {
    csv('./dados.csv').then(dataAux => {
        setDataTeste(dataAux);
    });
    
  },[]);

  console.log(dataTeste);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    const xScale = scaleBand()
      .domain(data.map((value, index) => index))
      .range([0, 600])
      .padding(0.5);

    const yScale = scaleLinear()
      .domain([0, 300])
      .range([300, 0]);

    const colorScale = scaleLinear()
      .domain([150, 200, 300])
      .range(["green", "yellow", "red"])
      .clamp(true);

    const xAxis = axisBottom(xScale).ticks(data.length);
    
    svg
      .select(".x-axis")
      .style("transform", "translateY(300px)")
      .call(xAxis);

    const yAxis = axisRight(yScale);
    svg
      .select(".y-axis")
      .style("transform", "translate(600px,0px)")
      .call(yAxis);

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")

      .style("transform", "scale(1, -1)")
      .attr("x", (value, index) => xScale(index))
      .attr("y", -300)
      .attr("width", xScale.bandwidth())
      .transition()
      .attr("fill", colorScale)
      .attr("height", value => 300 - yScale(value));
  }, [data]);

  return (
    <React.Fragment>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
      <button onClick={() => setData(data.map(value => value >= 300 ? value : value+10))}>
        Update data
      </button>
      <button onClick={() => setData(data.filter(value => value < 200))}>
        Filter data
      </button>
    </React.Fragment>
  );
}

export default GroupedChart;

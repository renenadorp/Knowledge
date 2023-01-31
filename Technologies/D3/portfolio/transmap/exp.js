
const YEARS = [2022, 2023, 2024]
const CircleState = {"radius": 50}
const SVG = {
                  "width" : 800, 
                  "height": 800
            }

// SVG Container            
var svgContainer = d3.select("body").append("svg")
      .attr("height", SVG.height)
      .attr("width", SVG.width)

var circleWithText = svgContainer.append('g')
    .attr("transform", "translate(300, 300) rotate(0)");


circleWithText.append("circle")
            .attr("cx", 100)
            .attr("cy", 100)
            .attr("r", 100)
            .classed("CurrentState", true);

circleWithText.append('text')
            .attr("dx", "0")
            .attr("dy", "0")
            .classed('text', true)
            .text('what ever you want')
            ;
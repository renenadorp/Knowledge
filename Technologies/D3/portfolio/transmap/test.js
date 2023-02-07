
//MARGIN CONVENTION
var MARGIN = {  LEFT  : 100, RIGHT: 100, TOP: 100, BOTTOM: 100 }
var CANVAS = {  WIDTH : 1200  - MARGIN.LEFT - MARGIN.RIGHT,
                HEIGHT: 1000  - MARGIN.TOP  - MARGIN.BOTTOM}

var W2H    = +(CANVAS.WIDTH/CANVAS.HEIGHT)
var H2W    = +(CANVAS.HEIGHT/CANVAS.WIDTH)

const STATE   = { RX: 50, RY: 50 }
const YEARBOX = {HEIGHT: 40, WIDTH:CANVAS.WIDTH}
const DIM     = {WIDTH: 160, HEIGHT: 40}
const svg     = d3.select("#viz-area").append("svg")
  					.attr("width" , CANVAS.WIDTH  + MARGIN.LEFT + MARGIN.RIGHT)
  					.attr("height", CANVAS.HEIGHT + MARGIN.TOP  + MARGIN.BOTTOM)
const svgCanvas = svg.append("g")
  					.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
const myRequest = new Request('data/data.json');

fetch(myRequest, {method: 'GET',  
                  mode: 'no-cors', 
                  headers: {"Content-type": "application/json" } })
  .then((response) => response.json())
  .then((data) => {

    s= svgCanvas.selectAll('.Box').data([data[0].number])
    console.log(data[0].number)
    console.log(s)
    s.enter().append('g').attr('id', d=>d);
    console.log(s)
    s.exit().remove();


  }
  )
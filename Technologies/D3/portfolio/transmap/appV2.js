
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

//YEARBOX
//TMAP
const TMAP = {HEIGHT: CANVAS.HEIGHT-YEARBOX.HEIGHT, 
            WIDTH : CANVAS.WIDTH}

const gMap = svgCanvas.append("g").attr("id", "gMap")
            .attr("transform", `translate(${0},${YEARBOX.HEIGHT})`)

gMap.append("rect")
      .attr("width" , TMAP.WIDTH)
      .attr("height", TMAP.HEIGHT)


const myRequest = new Request('data/data.json');
fetch(myRequest, {method: 'GET',  
                  mode: 'no-cors', 
                  headers: {"Content-type": "application/json" } })
  .then((response) => response.json())
  .then((data) => {

      var number=0
	t =	d3.interval(() => {
            updateTMap(data[number])
		if (number+1 >= 3) {number=0;t.stop()}
		number++

	}
	,1000
	)


  })

function updateTMap(data){

      const sYearBox = svgCanvas.selectAll('.gYearBox').data([data.number])
      //console.log([data.number])
      gYearBox = sYearBox.enter().append('g')
            .attr('class', 'gYearBox')
            .attr('id', d=>`YearBox-${d}`)
      sYearBox.exit().remove()
      console.log(sYearBox)
      const DIMCOUNT  = data.dims.names.length
      const YEARCOUNT = data.years.length
      const TLINES    = []
      const YEARPAD   = 2
      const YEARWIDTH = (YEARBOX.WIDTH / YEARCOUNT)-YEARPAD 

      //TRANSITION
      const t = d3.transition()
      .duration(3000)
      .ease(d3.easeLinear);

      //YEARS
      const gYear     = gYearBox.selectAll('.gYear').data(data["years"])      
      gYear.exit().remove()//.transition(t)

      const gYearEnter= gYear.enter().append('g')
            .attr('id', (d,i)=> {console.log(d); `year-${d}`})
            .attr('class', 'gYear')
            .attr('transform', (d,i)=> {return `translate(${(i*(YEARWIDTH+YEARPAD))},${5   })`})
      
      //gYearEnter.merge(gYear).transition(t)

      gYearEnter.append('rect')

                  .attr('width', YEARWIDTH)
                  .attr('height', YEARBOX.HEIGHT)
                  .attr('rx', 5)
                  .attr('ry', 5)

                  
      gYearEnter.append('text')
                  .text(d=> d)
                  .attr('dx', YEARWIDTH/2)
                  .attr('dy', (YEARBOX.HEIGHT/2) +2)
                  .attr('text-anchor', 'middle')
                
 
      // //TRANSFORMATION CURVES      
      // const gCurve = gMap.append('g').attr('class', 'gCurve')

      // const sCurve = gCurve.selectAll('TCurve').data(data.years)
      // sCurve.enter().append('path')
      //       .attr('d', (d,i)=>TCurve(d,i,YEARCOUNT))
      //       //.attr('class', (d,i) => {return `TCurve-${i+1}`})
            
      // var Angle = 90 / DIMCOUNT //Divide 90 degree angle by number of dimensions

      // function r2d(radians){
      //       return (180/Math.PI)*radians
      // }
      // function d2r(degrees){
      //       return (Math.PI/180)*degrees
      // }

      // //console.log(Math.tan(d2r(45))*WIDTH) // [VERIFIED] Using 45 degrees, the HEIGHT should be the same as WIDTH
      // //console.log(r2d(Math.atan(1)))       // [VERIFIED] 1 is the value when both sides have the same length. The angle should be 45 


      // //TODO: This loop needs to be rewritten to a form using d3.selectAll().data().append..... 
      // for (var i = 1; i <= DIMCOUNT; i++) {
      //       var sumAngle = (Angle*i)
      //       var radian, A, O, X1, X2, Y1, Y2, C

      //       CutoverAngle = r2d(Math.atan(H2W))
      //       //console.log(`Dims:${Dims} i:${i}, Angle:${Angle}, SumAngle:${sumAngle}, CutoverAngle: ${CutoverAngle}`)

      //       if (sumAngle <= CutoverAngle) {
      //             A  = TMAP.WIDTH
      //             O  = TMAP.WIDTH*Math.tan(d2r(sumAngle))
      //             X1 = TMAP.WIDTH
      //             Y1 = 0
      //             X2 = 0
      //             Y2 = O
      //       }
      //       else {            
      //             A  = TMAP.HEIGHT
      //             O  = TMAP.HEIGHT*Math.tan(d2r(90-sumAngle))
      //             X1 = TMAP.WIDTH
      //             Y1 = 0
      //             X2 = TMAP.WIDTH - O
      //             Y2 = TMAP.HEIGHT
      //       }
      //       //Store coordinates to use for axis Dimension
      //       TLINES.push({Number:  i, 
      //                   Name  : data.dims.names[i-1], //VERY UGLY! I KNOW.
      //                   x1    : X1, 
      //                   y1    : Y1, 
      //                   x2    : X2, 
      //                   y2    : Y2
      //                   })  
      //       //}, Y1:${Y1}, X2:${X2}, Y2:${Y2}`)
      //       //console.log(`Angle: ${r2d(Math.atan(O/A))}`)
      //       gMap.append("line")
      //             .attr("x1", X1)
      //             .attr("y1", Y1)
      //             .attr("x2", X2)
      //             .attr("y2", Y2)
      //             .attr('class', 'dimension')
      //       }


      // //TRANSFORMATION CURVES      
      // function TCurve(d,i,c) {
      //       //console.log('called')
      //       const x0  = (TMAP.WIDTH/c) * (i+1),
      //             y0  = 0,
      //             cpx = (TMAP.WIDTH/c)*(i+1),
      //             cpy = (TMAP.HEIGHT/c)*(c-(i+1)),
      //             x   = TMAP.WIDTH,
      //             y   = (TMAP.HEIGHT/c)*(c-(i+1));
            
      //       const path = d3.path();
      //       path.moveTo(TMAP.WIDTH, 0)
      //       path.lineTo(x0, y0)
      //       path.quadraticCurveTo(cpx, cpy, x, y);
      //       path.lineTo(TMAP.WIDTH, 0)
      //       const curve = `${path}Z`
            
      //       return curve;
      //       }

      // //AXIS
      // //console.log(TLINES)
      // const sAxisDim = gMap.selectAll('.gAxisDim').data(TLINES)
      // const gAxisDim = sAxisDim.enter().append('g')
      //       .attr('class','gAxisDim')
      //       .attr('transform', (d,i,n) => transformDim(d,i,n))
      // gAxisDim.append('rect')
      //       .attr('width', (d,i,n) => DIM.WIDTH)
      //       .attr('height', (d,i,n) => DIM.HEIGHT)
      //       .attr('rx', 20)
      //       .attr('ry', 20)

      // gAxisDim.append('text').text(d=>d.Name)
      //       .attr('text-anchor', 'middle')//.attr('transform', (d,i,n) => transformDim(d,i,n))
      //       .attr('dy', DIM.HEIGHT/2 +5)
      //       .attr('dx', DIM.WIDTH/2)

      // //Function to calculate location and rotation of Dimension
      // function transformDim(d,i,n){
      //       var X = undefined
      //       var Y = undefined
      //       var svg =''
      //       if (i==0) {
      //             X = d.x2 == 0 ? -DIM.HEIGHT-5                   : 0
      //             Y = d.x2 == 0 ? (d.y2 / 2) + (DIM.WIDTH/2)      : CANVAS.HEIGHT
      //             R = d.x2 == 0 ? -90                             : 0
      //       }
      //       else
      //       {
      //             X = d.x2 == 0 ? -DIM.HEIGHT -5                  :  TLINES[i-1].x2 + ((d.x2 - TLINES[i-1].x2 ) /2) - (DIM.WIDTH/2)
      //             Y = d.x2 == 0 ? TLINES[i-1].y2 + 
      //                               ((d.y2-TLINES[i-1].y2)/2) + 
      //                               (DIM.WIDTH/2)                 : CANVAS.HEIGHT - DIM.HEIGHT+5 
      //             R = d.x2 == 0 ? -90                             : 0
      //       }
      //       //console.log(i, TLINES[i].y2, d.y2)
      //       svg = `translate (${X},${Y}) rotate(${R})`
      //       return svg
      // }

      // //CURRENT - FUTURE 
      // const gCurrent=gMap.append('g').attr('class','gState').attr('transform', `translate(${0},${TMAP.HEIGHT})`)
      // const gFuture =gMap.append('g').attr('class','gState').attr('transform', `translate(${TMAP.WIDTH},${0})`)

      // gCurrent.append('ellipse')
      //       .attr('rx', STATE.RX)
      //       .attr('ry', STATE.RY)
      //       .attr('class', 'CurrentState')

      // gCurrent.append('text')
      //       .attr('text-anchor', 'middle') 
      //       .text('CURRENT')
      //       .attr('class', 'State')
      //       .attr('dy', 5)

      // gFuture.append('ellipse')
      //       .attr('rx', STATE.RX)
      //       .attr('ry', STATE.RY)
      //       .attr('class', 'FutureState')

      // gFuture.append('text')
      //       .attr('text-anchor', 'middle') 
      //       .text('FUTURE')
      //       .attr('class', 'State')
      //       .attr('dy', 5)


      // const gProjects = gMap.append('g').attr('class', 'gProjects')
      // const sProjects = gProjects.selectAll('.gProject').data(data.dims.details)


      // //console.log(data.dims.details)

      // //HSO LOGO
      // gHSO = gMap.append('g').attr('id', 'HSO').attr('transform',`translate(${TMAP.WIDTH +2},${TMAP.HEIGHT}) rotate(-90)`)
      // gHSO.append('image')
      //       .attr('href', 'assets/hso.png')
      //       .attr('width', 145)

}
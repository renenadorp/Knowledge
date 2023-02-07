//MARGIN CONVENTION
var MARGIN = {  LEFT  : 100, RIGHT: 100, TOP: 100, BOTTOM: 1 }
var CANVAS = {  WIDTH : 1200  - MARGIN.LEFT - MARGIN.RIGHT,
                HEIGHT: 600  - MARGIN.TOP  - MARGIN.BOTTOM}
var GRAPH = {  	WIDTH : CANVAS.WIDTH,
				HEIGHT: CANVAS.HEIGHT - 80}

const svg     = d3.select("#viz-maturity").append("svg")
  					.attr("width" , CANVAS.WIDTH  + MARGIN.LEFT + MARGIN.RIGHT)
  					.attr("height", CANVAS.HEIGHT + MARGIN.TOP  + MARGIN.BOTTOM)
const svgCanvas = svg.append("g")
  					.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
//SCALES
let xScale = d3.scaleLinear()
		.range([0, CANVAS.WIDTH])

//AXES
const gAxisX = svgCanvas.append('g')
		.attr('transform', `translate(${0}, ${GRAPH.HEIGHT})`)
const gAxisMaturity = svgCanvas.append('g')
		.attr('transform', `translate(${0}, ${GRAPH.HEIGHT+5})`)

//LABELS
const xAxisLabel = svgCanvas.append('g').attr('class', 'xAxisLabel')
xAxisLabel.append('text').text('Maturity of Analytics Capabilities').attr('text-anchor', 'end').attr('class', 'label')
xAxisLabel.attr('transform', `translate(${GRAPH.WIDTH}, ${GRAPH.HEIGHT+60})`)

// GRID
const xAxisGrid = d3.axisBottom(xScale).tickSize(-GRAPH.HEIGHT).tickFormat('').ticks(5);
gAxisX.call(xAxisGrid)


//
const SHAPES = {"AXISMATURITY": {HEIGHT: 35, PAD:10, ARROWSIZE: 10}}

// MATURITY CURVE
p1=[0,GRAPH.HEIGHT/3*2.5];
p2=[GRAPH.WIDTH, 100];
cp=[GRAPH.WIDTH/5*4, GRAPH.HEIGHT/3*2];
let pathMaturityCurve = d3.path();
pathMaturityCurve.moveTo(p1[0], p1[1])
pathMaturityCurve.quadraticCurveTo(cp[0], cp[1], p2[0], p2[1]);


// MATURITY CIRCLES POSITION
var xPosCircles = [	
	GRAPH.WIDTH/5*0,   	//None
	GRAPH.WIDTH/5*0.5, 	//Raw data
	GRAPH.WIDTH/5*1,   	//Cleaned data
	GRAPH.WIDTH/5*1.5, 	//Standard Reports	
	GRAPH.WIDTH/5*2,	//Adhoc & Olap	
	GRAPH.WIDTH/5*2.5,	//Self Service	
	GRAPH.WIDTH/5*3.1,	//Predictive
	GRAPH.WIDTH/5*4.1,	//Prescriptive
	GRAPH.WIDTH/5*5		//Autonomous
];

//DATA
const LINK = "data/data.json"
d3.json(LINK)
.then(data => update(data));

	
function update (data){  
	//console.log(data)
	drawMaturityGraph(data.maturity);

	return svg.node();
}
const axisColours = ['#99B0BF', '#00B294', '#00BCD4', '#F58974', '#00395F']
function drawMaturityGraph(data){
	const AxisMaturity = gAxisMaturity.selectAll('.AxisMaturity').data(data);
	const MaturityLevels = data.length;
	const MaturityWidth = CANVAS.WIDTH / MaturityLevels
	
	AxisMaturity
	.join(
		function(enter) {
	
		gAxisMaturityEnter=  
			enter.append('g')
				.attr('class', 'AxisMaturity')
				.attr( 'transform', (d,i)=>`translate(${(i)*MaturityWidth },${0})`);

		gAxisMaturityEnter.append('svg:polygon').attr('points', (d,i) =>  AxisMaturityShape(i, MaturityWidth))
		.attr('fill', (d,i) => 
					//d3.schemeBlues[8][i]
					axisColours[i]
					);
		gAxisMaturityEnter.append('text').text( (d,i)=> `Level ${d.Level}: ${d.Name}`)
			.attr('dx', MaturityWidth/2)
			.attr('dy', SHAPES.AXISMATURITY.HEIGHT/2 + 5)
			.attr('class', 'AxisMaturity')
			.attr('text-anchor', 'middle')
		},
		function(update){return},

		function(exit) {
			return exit.remove();
		  }
		
	)
	drawVerticalLine(MaturityWidth); 
	drawMaturityCurve();
	drawMaturityCircles();
	//animateMaturityCircle();
	return svg.node();

}
function AxisMaturityShape(i, MaturityWidth){
	const MATURITYWIDTH = MaturityWidth;
	const maturity_start=
	[
		[0, 0],
		[MATURITYWIDTH-SHAPES.AXISMATURITY.ARROWSIZE, 0],
		[MATURITYWIDTH, SHAPES.AXISMATURITY.HEIGHT/2],
		[MATURITYWIDTH-SHAPES.AXISMATURITY.ARROWSIZE, SHAPES.AXISMATURITY.HEIGHT],
		[0, SHAPES.AXISMATURITY.HEIGHT]
	];
	const maturity_end=
	[
		[0, 0],
		[MATURITYWIDTH-SHAPES.AXISMATURITY.ARROWSIZE, 0],
		[MATURITYWIDTH, SHAPES.AXISMATURITY.HEIGHT/2],
		[MATURITYWIDTH-SHAPES.AXISMATURITY.ARROWSIZE, SHAPES.AXISMATURITY.HEIGHT],
		
		[0, SHAPES.AXISMATURITY.HEIGHT],
		[SHAPES.AXISMATURITY.ARROWSIZE, SHAPES.AXISMATURITY.HEIGHT/2]
	];

	return i==0 ? maturity_start : maturity_end
}

function drawMaturityCurve() {
	
	svgCanvas.append('path').attr('d', pathMaturityCurve).attr('class', 'maturity-line')

	return svg.node();
	

}


var circleText = ['None', 'Raw Data','Cleaned Data','Standard Reports','Adhoc & Olap','Self Service','Predictive','Prescriptive','Autonomous']
function drawMaturityCircles(){
	const xCircleScale = d3.scaleLinear().domain([0, GRAPH.WIDTH]).range([0,1])
	const svgDetached = d3.create("svg");

	svgDetached
	.attr("width", GRAPH.WIDTH)
	.attr("height", GRAPH.HEIGHT);
	pathCopy = svgDetached.append('path').attr('d', pathMaturityCurve)
	var l = pathCopy.node().getTotalLength();
	//xPosCircles.map(item => {console.log(xCircleScale(item))})
	xPosCircles.map((item, i) => {
		p = getPoint(pathCopy, l, xCircleScale(item))
				
		svgCanvas.append('circle').attr('r', i/xPosCircles.length*30 + 20)
			.attr('cx', p.x)
			.attr('cy', p.y)
			.attr('class','maturity')	
		svgCanvas.append('text')
			.text(circleText[i])
			.attr('x',p.x)
			.attr('y',p.y - i/xPosCircles.length*30 - 25)
			.attr('class', 'callout')
			.attr('text-anchor', 'start')
			.attr('transform', 'rotate(-45)')
			.attr('transform-origin', `${p.x+5} ${p.y - 40}`)
		})

	return svg.node();
}
function drawMaturityLines() {

	var bezierLine = d3.line()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return d[0]; })
    .y(function(d) { return d[1]; }); 

	svgCanvas.append('path')
    .attr("d", bezierLine([		[GRAPH.WIDTH/5 * 0, GRAPH.HEIGHT - 65], 
								[GRAPH.WIDTH/5 * 1, GRAPH.HEIGHT - 70], 
								[GRAPH.WIDTH/5 * 2, GRAPH.HEIGHT - 80], 
								[GRAPH.WIDTH/5 * 3, GRAPH.HEIGHT - 100], 
								[GRAPH.WIDTH/5 * 4, GRAPH.HEIGHT - 160], 
								[GRAPH.WIDTH/5 * 5, GRAPH.HEIGHT - 280]]))
    .attr("stroke", "steelblue")
    .attr("stroke-width", 10)
	.attr("stroke-opacity", .4)
    .attr("fill", "none");
	
	return svg.node();
	}

function drawVerticalLine (MaturityWidth) {
	const horizontalPosition = MaturityWidth*3.1;

	p = [[horizontalPosition,0],[horizontalPosition,GRAPH.HEIGHT]]
	svgCanvas.append("line")
	.attr("x1", p[0][0])
	.attr("y1", p[0][1])
	.attr("x2", p[1][0])
	.attr("y2", p[1][1])
	.attr('class', 'vertical')
	const MATURITYWIDTH = MaturityWidth;
	const future=
	[
		[0, 0],
		[MATURITYWIDTH-SHAPES.AXISMATURITY.ARROWSIZE, 0],
		[MATURITYWIDTH, SHAPES.AXISMATURITY.HEIGHT/2],
		[MATURITYWIDTH-SHAPES.AXISMATURITY.ARROWSIZE, SHAPES.AXISMATURITY.HEIGHT],
		[0, SHAPES.AXISMATURITY.HEIGHT]
	]	
	
	const past=
	[
		[SHAPES.AXISMATURITY.ARROWSIZE, 0],
		[MATURITYWIDTH, 0],
		[MATURITYWIDTH, SHAPES.AXISMATURITY.HEIGHT],
		[SHAPES.AXISMATURITY.ARROWSIZE, SHAPES.AXISMATURITY.HEIGHT],
		[0, SHAPES.AXISMATURITY.HEIGHT/2],
	]
	gPast = svgCanvas.append('g').attr("transform", `translate(${p[0][0]-MATURITYWIDTH},${0})`);
	gPast.append('svg:polygon').attr('points', past).attr('class', 'past').attr('fill', axisColours[1]);
	gPast.append('text').text('Looking back')
		.attr('dx', MATURITYWIDTH / 2)
		.attr('text-anchor', 'middle')
		.attr('dy', SHAPES.AXISMATURITY.HEIGHT /2 + 5)
		.attr('class', 'past-future')

	gFuture = svgCanvas.append('g').attr("transform", `translate(${p[0][0]},${0})`);
	gFuture.append('svg:polygon').attr('points', future).attr('class', 'future').attr('fill', axisColours[1]);
	gFuture.append('text').text('Predicting')
			.attr('dx', MATURITYWIDTH / 2)
			.attr('text-anchor', 'middle')
			.attr('dy', SHAPES.AXISMATURITY.HEIGHT /2 + 5)
			.attr('class', 'past-future')
	return svg.node();

}	

function drawMaturityCurveCirclesOLD(data)
{
	var n_segments = 100;
	var path = svg.select("path#TCurve-0");
	var pathEl = path.node();
	//console.log(pathEl)

	var pathLength = pathEl.getTotalLength();
	var line = gMap.select("line#TLine-1");

	pts_i = path_line_intersections(pathEl,line)
	for (i=0; i< pts_i.length; i++){
		if (pts_i[i].x!==1000){
			gMap.append('circle')
				.attr('r', 5)
				.attr('cx', pts_i[i].x)
				.attr('cy', pts_i[i].y).attr('stroke', 'none').attr('fill', 'none')
		}
	}



	function btwn(a, b1, b2) {
		if ((a >= b1) && (a <= b2)) { return true; }
		if ((a >= b2) && (a <= b1)) { return true; }
		return false;
	}

	function line_line_intersect(line1, line2) {
		var x1 = line1.x1, x2 = line1.x2, x3 = line2.x1, x4 = line2.x2;
		var y1 = line1.y1, y2 = line1.y2, y3 = line2.y1, y4 = line2.y2;
		var pt_denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		var pt_x_num = (x1*y2 - y1*x2) * (x3 - x4) - (x1 - x2) * (x3*y4 - y3*x4);
		var pt_y_num = (x1*y2 - y1*x2) * (y3 - y4) - (y1 - y2) * (x3*y4 - y3*x4);
		if (pt_denom == 0) { return "parallel"; }
		else { 
		var pt = {'x': pt_x_num / pt_denom, 'y': pt_y_num / pt_denom}; 
		if (btwn(pt.x, x1, x2) && btwn(pt.y, y1, y2) && btwn(pt.x, x3, x4) && btwn(pt.y, y3, y4)) { return pt; }
		else { return "not in range"; }
		}
	}

	function path_line_intersections(pathEl, line) {

		var pts = []
		for (var i=0; i<n_segments; i++) {
		var pos1 = pathEl.getPointAtLength(pathLength * i / n_segments);
		var pos2 = pathEl.getPointAtLength(pathLength * (i+1) / n_segments);
		var line1 = {x1: pos1.x, x2: pos2.x, y1: pos1.y, y2: pos2.y};
		var line2 = {x1: line.attr('x1'), x2: line.attr('x2'), 
					y1: line.attr('y1'), y2: line.attr('y2')};
		var pt = line_line_intersect(line1, line2);
		if (typeof(pt) != "string") {
			pts.push(pt);
		}
		}
		
		return pts;
	
	}
	return svg.node();
}

function pathVerticalLines(){
	var xPosCircles = [	GRAPH.WIDTH/5*1,
						GRAPH.WIDTH/5*2,
						GRAPH.WIDTH/5*3,
						GRAPH.WIDTH/5*4
					];

	var line = d3.line()
	.x(function(d){ return d.x; })
	.y(function(d){ return d.y; });

	xPosCircles.map((d)=>svgCanvas.append('path').attr('d', line([{x:d,y:0},{x:d,y:GRAPH.HEIGHT}]))
	.attr('class', 'line-vertical'));
	
	return svg.node();
}

function getPoint(path, l, t) {
	point = path.node().getPointAtLength(t * l)
	//console.log(point)
	return point
  };


function animateMaturityCircle() {
	p1=[0,GRAPH.HEIGHT/3*2.5];
	p2=[GRAPH.WIDTH, 100];
	cp=[GRAPH.WIDTH/5*4, GRAPH.HEIGHT/3*2];
	let path = d3.path();
	path.moveTo(p1[0], p1[1])
	path.quadraticCurveTo(cp[0], cp[1], p2[0], p2[1]);

	// Calculate path length without showing it	
	//const xCircleScale = d3.scaleLinear().domain([0, GRAPH.WIDTH]).range([0,1])
	const svgDetached = d3.create("svg");

	svgDetached
	.attr("width", GRAPH.WIDTH)
	.attr("height", GRAPH.HEIGHT);
	pathCopy = svgDetached.append('path').attr('d', path)
	var l = pathCopy.node().getTotalLength();
	var t=0;
	p0 = getPoint(pathCopy, length,t);
	// draw circle at initial location
	const maturityCircle = svgCanvas.append('circle')
	.attr('class', 'maturity')
	//.attr('r', 100)
	.attr('transform', `translate(${p0.x},${p0.y})`);
	
	maturityCircle.transition()
		.ease(d3.easeLinear)
		.duration(5000)
		.attrTween('transform', translateAlong(pathCopy.node()))
		.attrTween('r', tweenCircleRadius())
	return;

}
function translateAlong(path) {
	const length = path.getTotalLength();
	return function() {
	  return function(t) {
		const {x, y} = path.getPointAtLength(t * length);
		return `translate(${x},${y})`;
	  }
	}
  }
  function tweenCircleRadius() {
	return function() {
	  return function(t) {
		//console.log('tweencircle:', t)
		return t*25+20;
	  }
	}
  }
  
function showMaturityCallouts(){



}
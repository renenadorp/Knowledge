// code based on https://observablehq.com/@sjengle/java-11-api-hierarchy-visualization


LINK ="https://docs.google.com/spreadsheets/d/e/2PACX-1vS-WMdDjr9hcAJrhiiJlpCybwNUKqWwbWVd125xH6z-Eamzp_DuQllP9dtKcbhXR2SD3rElX3dSoNdm/pub?gid=0&single=true&output=csv";

//MARGIN CONVENTION
var MARGIN = {  LEFT  : 1, RIGHT: 1, TOP: 1, BOTTOM: 1 }
var CANVAS = {  WIDTH : 50000  - MARGIN.LEFT - MARGIN.RIGHT,
                HEIGHT: 400  - MARGIN.TOP  - MARGIN.BOTTOM}

const STATE   = { RX: 50, RY: 50 }
const NODE 	  = {HEIGHT: 20, WIDTH:200, PAD: {LEFT: 1700, TOP: 10}}
const svg     = d3.select("#viz-area").append("svg")
  					.attr("width" , CANVAS.WIDTH  + MARGIN.LEFT + MARGIN.RIGHT)
  					.attr("height", CANVAS.HEIGHT + MARGIN.TOP  + MARGIN.BOTTOM)
const svgCanvas = svg.append("g")
  					.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

const r = 5;
//TIP
/*
var tip = d3.tip().attr('class', 'd3-tip').html(d=>{ 
                let text =`
                
                <div class="container">
                <div class="row"><div class="col-sm"> ${d.dim}</div></div>
                <div class="row"><div class="col-sm"> ${d.number}.${d.name}</div></div>
                <div class="row"><div class="col-sm"> ${d.descr}</div></div>
                </div>                        
                        
                        `
                
                return text;      })
svgCanvas.call(tip)
*/
//DATA.then(

const myRequest = new Request(LINK);

d3.csv(LINK)
.then(raw => update(raw));

	
function update (raw){  
	const raw_active = raw.filter(link => link.Active==='1')

	// Returns
	pc_root=[];
	pc_tab=[];
	pc_group=[];
	pc_link=[];
	raw_active.map((row, i)=>{
	//Clear arrays
	if (i==0) {
	  pc_root.length=0;
	  pc_tab.length=0;
	  pc_group.length=0;
	  pc_link.length=0;
	}
	const r ={Level: "Root", pId: undefined, cId: "Root", pName: undefined, cName: "Root"} //root
	const t ={Level: "Tab", pId: "Root", cId: row.TabKey, pName: "Root", cName: row.Tab}; //tab
	const g ={Level: "Group", pId: row.TabKey, cId: row.GroupKey, pName: row.Tab, cName: row.Group}; //group
	const l ={Level: "Link", pId: row.GroupKey, cId: row.LinkKey, pName: row.Group, cName: row.Link, cUrl: row.Url}; //link
  
	//Root
	const r_found = pc_root.find(el => { if (el.cId == r.cId) return true; return false;})
	if (!r_found) {
	  pc_root.push(r);
	  //console.log('found');
	}
	//console.log(s.cId);
	//Tab
	const t_found = pc_tab.find(el => { if (el.cId == t.cId) return true; return false;})
	if (!t_found) {
	  pc_tab.push(t);
	  //console.log('found');
	}
  
	//Group
	const g_found = pc_group.find(el => { if (el.cId == g.cId) return true; return false;})
	if (!g_found) {
	  pc_group.push(g);
	  //console.log('found');
	}
	//Link
	const l_found = pc_link.find(el => { if (el.cId == l.cId) return true; return false;})
	if (!l_found) {
	  pc_link.push(l);
	  //console.log('found');
	}
  
  });
  
  pc=  [...pc_root, ...pc_tab, ...pc_group, ...pc_link];
  
  root = d3.stratify()
    .id(function(row) { return row.cId; })
    .parentId(function(row) {
      return row.pId;
    })
    (pc);
	console.log('pc:',pc)
	console.log('root:',root)
  
	color = d3.scaleSequential([10, root.height], d3.interpolateBlues) //)interpolateBlues)//interpolateViridis)
	let data = root;//findModule();
	
	data.sort(function(a, b) { 
	  return b.height - a.height || b.count - a.count; 
	});
	let width = pc_link.length * NODE.WIDTH + (NODE.PAD.LEFT);
	let layout = d3.tree().size([width , CANVAS.HEIGHT - 2 * NODE.PAD.TOP]);
	//console.log(data)
	layout(data);
	
	let plot = svgCanvas.append("g")
	  .attr("id", "plot")
	  .attr("transform", translate(MARGIN.LEFT, MARGIN.TOP));
	
	drawLinks(plot.append("g"), data.links(), curvedLine());
	drawNodes(plot.append("g"), data.descendants(), 'rect',true);
	
	return svg.node();
  }

  //console.log(root)
function drawLinks(g, links, generator) {
	let paths = g.selectAll('path')
		.data(links)
		.enter()
		.append('path')
		.attr('d', generator)
		.attr('class', 'link');
}
function drawNodes(g, nodes, type, raise) {
//console.log('drawNodes/nodes:', nodes, 'drawnodes/g:',g);

	let g_nodes = g.selectAll(type)
		.data(nodes, node => {//console.log(node.data); 
			return node.data})
		.enter().append('g');
	let svg_nodes = g_nodes
		.append(type)
		.attr('r',  r)
		.attr('cx', d => d.x)
		.attr('cy', d => d.y)
		.attr('x', d => d.x - (NODE.WIDTH/2))
		.attr('y', d => d.y)
		.attr('width', NODE.WIDTH)
		.attr('height', NODE.HEIGHT)
		.attr('id', d => d.data.cName)
		.attr('class', 'node')
		.style('fill', d => color(d.depth))
	g_nodes
		.append('a')
			.attr('xlink:href',d=>{ //console.log('href:',d); 
			return d.data.cUrl;})
			.attr('target', '_blank')
		.append('text')
			.text(d=>d.data.cName)
			.attr('x', d => d.x)
			.attr('y', d => d.y)			
			.attr('dy', (NODE.HEIGHT/2) + 5)
			.attr('class', 'nodetext')
			.attr('text-anchor', 'middle')
	//g_nodes.attr('transform', `translate(${d.x},${d.y})`)

setupEvents(g, g_nodes, raise);
}  	  
function setupEvents(g, selection, raise) {
//console.log('setupEvents', selection, g);
selection.on('mouseover.highlight', function(d) {
	// https://github.com/d3/d3-hierarchy#node_path
	// returns path from d3.select(this) node to selection.data()[0] root node
	let path = d3.select(this).datum().path(selection.data()[0]);
	
	// select all of the nodes on the shortest path
	let update = selection.data(path, node => node.data.name);

	// highlight the selected nodes
	update.classed('selected', true);
	
	if (raise) {
	update.raise();
	}
});

selection.on('mouseout.highlight', function(d) {
	let path = d3.select(this).datum().path(selection.data()[0]);
	let update = selection.data(path, node => node.data.name);
	update.classed('selected', false);
});

// show tooltip text on mouseover (hover)
selection.on('mouseover.tooltip', function(d) {
	showTooltip(g, d3.select(this));


});

// remove tooltip text on mouseout
selection.on('mouseout.tooltip', function(d) {
	g.select("#tooltip").remove();
}); 
}
function showTooltip(g, node) {
let gbox = g.node().getBBox();     // get bounding box of group BEFORE adding text
let nbox = node.node().getBBox();  // get bounding box of node

// calculate shift amount
let dx = nbox.width / 2;
let dy = nbox.height / 2;

// retrieve node attributes (calculate middle point)
let x = nbox.x + dx;
let y = nbox.y + dy;

// get data for node
let datum = node.datum();
//console.log('Datum',datum);

// remove "java.base." from the node name
let name = datum.data.cName;

// use node name and total size as tooltip text
let text = `${name} (${datum.data.pName})`;

// create tooltip
let tooltip = g.append('text')
	.text(text)
	.attr('x', x)
	.attr('y', y)
	.attr('dy', -dy - 4) // shift upward above circle
	.attr('text-anchor', 'middle') // anchor in the middle
	.attr('id', 'tooltip');

// it is possible the tooltip will fall off the edge of the
// plot area. we can detect when this happens, and set the
// text anchor appropriately

// get bounding box for the text
let tbox = tooltip.node().getBBox();

// if text will fall off left side, anchor at start
if (tbox.x < gbox.x) {
	tooltip.attr('text-anchor', 'start');
	tooltip.attr('dx', -dx); // nudge text over from center
}
// if text will fall off right side, anchor at end
else if ((tbox.x + tbox.width) > (gbox.x + gbox.width)) {
	tooltip.attr('text-anchor', 'end');
	tooltip.attr('dx', dx);
}

// if text will fall off top side, place below circle instead
if (tbox.y < gbox.y) {
	tooltip.attr('dy', dy + tbox.height);
}
}	  
function straightLine()  {
let line = d3.line()
	.curve(d3.curveLinear)
	.x(d => d.x)
	.y(d => d.y);

let generator = function(node) {
	return line([node.source, node.target]);
}

return generator;
}
function curvedLine()  {
	let generator = d3.linkVertical()
	.x(d => d.x)
	.y(d => d.y);

	return generator;
}
function radialLine () {
	let generator = d3.linkRadial()
		.angle(d => d.theta + Math.PI / 2) // rotate, 0 angle is mapped differently here
		.radius(d => d.radial);

	return generator;
}
function translate(x, y) {
	return 'translate(' + String(x) + ',' + String(y) + ')';
}
	numberFormat = d3.format(".2~s");
	// viewof r = slider({
	// 	min: 1,
	// 	max: 100,
	// 	step: 1,
	// 	value: 5,
	// 	title: 'r',
	// 	description: 'radius of circles'
	//   })	
	  //import {table} from "@tmcw/tables@513"
	  //import {slider,select} from "@jashkenas/inputs"

	  	  	  	  			
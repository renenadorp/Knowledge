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
const dy = CANVAS.WIDTH / 7; 
const dx = 27;
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
.then(raw => {
    let data = prepareData(raw);
   console.log('data:',data)
    //updateViz(data);
});
	
function prepareData (raw){  
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

	color = d3.scaleSequential([10, root.height], d3.interpolateBlues) //)interpolateBlues)//interpolateViridis)
	//let data = root;//findModule();
	
	root.sort(function(a, b) { 
	  return b.height - a.height || b.count - a.count; 
	});
  //console.log('root: ',root)
	return root;
 
  }


function updateViz(data) {
    const root = d3.hierarchy(data);

    //console.log('root:',root);
    root.x0 = dy / 2;
    root.y0 = 0;
    root.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
      //if (d.depth && d.data.name.length !== 7) d.children = null;
    });
  

    const gLink = svgCanvas.append("g")
        .attr("fill", "none")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 1)
        .attr("stroke-width", 1.5);
  
    const gNode = svg.append("g")
        .attr("cursor", "pointer")
        .attr("pointer-events", "all");
  
    function update(source) {
      const duration = d3.event && d3.event.altKey ? 2500 : 250;
      const nodes = root.descendants().reverse();
      const links = root.links();
  
      // Compute the new tree layout.
      tree(root);
  
      let left = root;
      let right = root;
      root.eachBefore(node => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
      });
  
      //const height = right.x - left.x + margin.top + margin.bottom;
  
      const transition = svgCanvas.transition()
          .duration(duration)
          //.attr("viewBox", [-margin.left, left.x - margin.top, width, height])
          .tween("resize", window.ResizeObserver ? null : () => () => svgCanvas.dispatch("toggle"));
  
      // Update the nodes…
      const node = gNode.selectAll("g")
        .data(nodes, d => d.id);
  
      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node.enter().append("g")
          .attr("transform", d => `translate(${source.y0},${source.x0})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0)
          .on("click", d => {
            d.children = d.children ? null : d._children;
            update(d);
          });
  
      nodeEnter.append("rect")
          .attr("y", -11)
          .attr("height", 22)
          .attr("fill", "white")
          .attr("rx", 3)
          .attr("ry", 3)
          .attr("stroke-opacity", 0.5)
          .attr("stroke", "#999")
      nodeEnter.append("text")
          .attr("dy", "0.31em")
          //.attr("x", d => d._children ? -6 : 6)
          .attr("x", 6)
          .attr("text-anchor", "start")
          //.attr("text-anchor", d => d._children ? "end" : "start")
          .text(d => d.data.name)
        .clone(true).lower()
          .attr("stroke-linejoin", "round")
          .attr("stroke-width", 3)
          .attr("stroke", "white");
      
     setTimeout(() => {
        nodeEnter.each(function() {
          const _this = d3.select(this);
          const width = _this.select('text').node().getBBox().width + 10;
          _this.select('rect')
             .attr('width', width)
             //.attr("x", d => d._children ? -width : 0)
        })
      }, 0)
  
      // Transition nodes to their new position.
      const nodeUpdate = node.merge(nodeEnter).transition(transition)
          .attr("transform", d => `translate(${d.y},${d.x})`)
          .attr("fill-opacity", 1)
          .attr("stroke-opacity", 1);
      
  
      // Transition exiting nodes to the parent's new position.
      const nodeExit = node.exit().transition(transition).remove()
          .attr("transform", d => `translate(${source.y},${source.x})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0);
  
      // Update the links…
      const link = gLink.selectAll("path")
        .data(links, d => d.target.id);
  
      // Enter any new links at the parent's previous position.
      const linkEnter = link.enter().append("path")
          .attr("d", d => {
            const o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
          });
  
      // Transition links to their new position.
      link.merge(linkEnter).transition(transition)
          .attr("d", d => {
              const x0 = d.source.y;
              const y0 = d.source.x;
              const x1 = d.target.y;
              const y1 = d.target.x;
              return `M${x0} ${y0} L${x0 + 80} ${y0} L${x0 + 80} ${y1} L${x1} ${y1}`
           });
  
      // Transition exiting nodes to the parent's new position.
      link.exit().transition(transition).remove()
          .attr("d", d => {
              const o = {x: source.x, y: source.y};
              const x0 = source.y;
              const y0 = source.x;
              const x1 = source.y;
              const y1 = source.x;
              return `M${x0} ${y0} L${x0 + 80} ${y0} L${x0 + 80} ${y1} L${x1} ${y1}`
            //return diagonal({source: o, target: o});
          });
  
      // Stash the old positions for transition.
      root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }
  
    update(root);

  
    return svg.node();
  } 

function tree(){ return d3.tree().nodeSize([dx, dy])}

function  diagonal() {
  return d3.linkHorizontal().x(d => {
                                    //console.log(d.y); 
                                    return d.y;}).y(d => d.x)
}
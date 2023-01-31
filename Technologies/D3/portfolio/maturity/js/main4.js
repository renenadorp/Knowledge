
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
const dy = NODE.WIDTH / 6
const dx = 20;
margin = ({ top: 40, right: 60, bottom: 40, left: 60 }) 
width = window.innerWidth - margin.left - margin.right - 40
parentColumn = 'pId'
childColumn = 'cId'


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
    strat=update(raw);
    chart(strat);
});

	
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
  
  strat = d3.stratify()
  .id(d => d[childColumn])
  .parentId(d => d[parentColumn])
    (pc).each(function(d) {
        d.name = d.id;
        d.size = 10;
      });

	color = d3.scaleSequential([10, strat.height], d3.interpolateBlues) //)interpolateBlues)//interpolateViridis)
	//let data = root;//findModule();
	
	strat.sort(function(a, b) { 
	  return b.height - a.height || b.count - a.count; 
	});
    console.log('strat:', strat)
    return strat;
  }


  function diagonal(){
     return d3.linkHorizontal().x(d => d.y).y(d => d.x)
  }

  function tree (){
    return d3.tree().nodeSize([dx, dy])
  }
  
  function chart (data) {
    console.log('data:',data)
    root = d3.hierarchy(data);//, (d) => d.children);
    root.x0 = 3;//dy / 2;
    root.y0 = 0;
    root.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
      if (d.depth && d.data.name !== undefined) d.children = null;
      // if (d.depth && d.data.name !== selected_unit) d.children = null;
    });
  
    // handle the search select inputs
    // find the data node to be shown
    // var dn = root
    //   .descendants()
    //   .map(function(d) {
    //     return { name: d.data.name, node: d.data.node };
    //   })
    //   .filter(function(d) {
    //     return d.name === selected_unit;
    //   });
  
    // var node_path = root.path(dn[0].node);
    // console.log(node_path);
  
    // const svg = d3
    //   .create("svg")
    //   .attr("viewBox", [-margin.left, -margin.top, width, dx])
    //   .style("font-size", "0.45em")
    //   .style("user-select", "none");
  
    const gLink = svgCanvas
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);
  
    const gNode = svg
      .append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");
  
    function update(source) {
      const duration = d3.event && d3.event.altKey ? 2500 : 500;
  
      // capture the source input
      // source =
      //   selected_unit === ""
      //     ? root
      //     : gNode.selectAll("g").filter(d => d.data.name === selected_unit);
  
      const nodes = root.descendants().reverse();
      const links = root.links();
  
      // Normalize for fixed-depth.
      nodes.forEach(function (d) {
        d.y = (d.depth * width) / 2;
      });
  
      // Compute the new tree layout.
      tree(root);
  
      let left = root;
      let right = root;
      root.eachBefore((node) => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
      });
  
      const height = right.x - left.x + margin.top + margin.bottom;
  
      const transition = svg
        .transition()
        .duration(duration)
        .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
        .tween(
          "resize",
          window.ResizeObserver ? null : () => () => svg.dispatch("toggle")
        );
  
      // Update the nodes…
      const node = gNode.selectAll("g").data(nodes, (d) => d.id);
  
      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (d) => {
          d.children = d.children ? null : d._children;
          update(d);
        });
  
      nodeEnter
        .append("circle")
        .attr("r", 6)
        .attr("fill", (d) => (d._children ? "lightsteelblue" : "#fff"))
        .attr("stroke", "steelblue")
        .attr("stroke-width", "1px");
  
      nodeEnter
        .append("text")
        .attr("dy", "0.31em")
        .attr("x", (d) => (d._children ? -10 : 10))
        .attr("text-anchor", (d) => (d._children ? "end" : "start"))
        .text((d) => d.data.name)
        .clone(true)
        .lower()
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("stroke", "white");
  
      // Transition nodes to their new position.
      const nodeUpdate = node
        .merge(nodeEnter)
        .transition(transition)
        .attr("transform", (d) => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);
  
      // Transition exiting nodes to the parent's new position.
      const nodeExit = node
        .exit()
        .transition(transition)
        .remove()
        .attr("transform", (d) => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);
  
      // Update the links…
      const link = gLink.selectAll("path").data(links, (d) => d.target.id);
  
      // Enter any new links at the parent's previous position.
      const linkEnter = link
        .enter()
        .append("path")
        .attr("d", (d) => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });
  
      // Transition links to their new position.
      link.merge(linkEnter).transition(transition).attr("d", diagonal);
  
      // Transition exiting nodes to the parent's new position.
      link
        .exit()
        .transition(transition)
        .remove()
        .attr("d", (d) => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        });
  
      // Stash the old positions for transition.
      root.eachBefore((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }
  
    update(root);
    console.log('root: ',root)

    return svg.node();
  }
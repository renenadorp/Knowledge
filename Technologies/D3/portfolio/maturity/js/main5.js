//https://observablehq.com/@howardyao/conceptual-model-collapsible-tree
LINK ="https://docs.google.com/spreadsheets/d/e/2PACX-1vS-WMdDjr9hcAJrhiiJlpCybwNUKqWwbWVd125xH6z-Eamzp_DuQllP9dtKcbhXR2SD3rElX3dSoNdm/pub?gid=0&single=true&output=csv";

const myRequest = new Request(LINK);
margin = ({top: 20, right: 60, bottom: 20, left: 120})
width = (850 - margin.right - margin.left)
height = 460 ;
d3.csv(LINK)
.then(raw => {
   chart( tree(getData(raw)));


});

	
function getData (raw){  
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
  
  flatData =  [...pc_root, ...pc_tab, ...pc_group, ...pc_link];
  return flatData;
}


function tree(flatData) {
    const tree = d3
      .stratify()
      .id(d => d.cId)
      .parentId(d => d.pId)(flatData);
  
    tree.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
    });
    console.log('tree:',tree)
    return tree;
  }

function chart(treeData){
        // Set the dimensions and margins of the diagram
        var margin = {top: 20, right: 90, bottom: 30, left: 150},
            width = 700 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;
        
        // append the svg object to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
         var container = 'svg';
        
         var svg = d3.select(container)
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate("
                  + margin.left + "," + margin.top + ")");
        
        var i = 0,
            duration = 750,
            root;
        
        // declares a tree layout and assigns the size
        var treemap = d3.tree().size([height, width]);
        
        // Assigns parent, children, height, depth
        console.log('treeData:', treeData)
        root = d3.hierarchy(treeData, function(d) {  return d.children; });
        root.x0 = height / 2;
        root.y0 = 0;
        
        // Collapse after the second level
        root.children.forEach(collapse);
        
        update(root);
        
        // Collapse the node and all it's children
        function collapse(d) {
          if(d.children) {
            d._children = d.children
            d._children.forEach(collapse)
            d.children = null
          }
        }
        
        function update(source) {
        
          // Assigns the x and y position for the nodes
          var treeData = treemap(root);
        
          // Compute the new tree layout.
          var nodes = treeData.descendants(),
              links = treeData.descendants().slice(1);
          
          console.log(treeData);
        
          // Normalize for fixed-depth.
          nodes.forEach(function(d){ d.y = d.depth * 130});
        
          // ****************** Nodes section ***************************
        
          // Update the nodes...
          var node = svg.selectAll('g.node')
              .data(nodes, function(d) {return d.id || (d.id = ++i); });
        
          // Enter any new modes at the parent's previous position.
          var nodeEnter = node.enter().append('g')
              .attr('class', 'node')
              .attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on('click', click);
        
          // Add Circle for the nodes
          nodeEnter.append('circle')
              .attr('class', 'node')
              .attr('r', 1e-6)
              .style("fill", function(d) {
                  return d._children ? "lightsteelblue" : "#fff";
              });
        
          // Add labels for the nodes
          nodeEnter
              .append("a")
              .attr("href", function(d) {return d.data.cUrl;})
              .append('text')
              .attr("dy", ".35em")
              .attr("x", function(d) {
                  return d.children || d._children ? -13 : 13;
              })
              .attr("text-anchor", function(d) {
                  return d.children || d._children ? "end" : "start";
              })
              .text(function(d) { return d.data.name; })
              .style('font-weight', function(d) {return d.data.name=='Basic LRT'? 'bold':null });
        
          // UPDATE
          var nodeUpdate = nodeEnter.merge(node);
        
          // Transition to the proper position for the node
          nodeUpdate.transition()
            .duration(duration)
            .attr("transform", function(d) { 
                return "translate(" + d.y + "," + d.x + ")";
             });
        
          // Update the node attributes and style
          nodeUpdate.select('circle.node')
            .attr('r', 10)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            })
            .attr('cursor', 'pointer');
        
        
          // Remove any exiting nodes
          var nodeExit = node.exit().transition()
              .duration(duration)
              .attr("transform", function(d) {
                  return "translate(" + source.y + "," + source.x + ")";
              })
              .remove();
        
          // On exit reduce the node circles size to 0
          nodeExit.select('circle')
            .attr('r', 1e-6);
        
          // On exit reduce the opacity of text labels
          nodeExit.select('text')
            .style('fill-opacity', 1e-6);
        
          // ****************** links section ***************************
        
          // Update the links...
          var link = svg.selectAll('path.link')
              .data(links, function(d) { return d.id; });
        
          // Enter any new links at the parent's previous position.
          var linkEnter = link.enter().insert('path', "g")
              .attr("class", "link")
              .attr('d', function(d){
                var o = {x: source.x0, y: source.y0}
                return diagonal(o, o)
              });
        
          // UPDATE
          var linkUpdate = linkEnter.merge(link);
        
          // Transition back to the parent element position
          linkUpdate.transition()
              .duration(duration)
              .attr('d', function(d){ return diagonal(d, d.parent) });
        
          // Remove any exiting links
          var linkExit = link.exit().transition()
              .duration(duration)
              .attr('d', function(d) {
                var o = {x: source.x, y: source.y}
                return diagonal(o, o)
              })
              .remove();
        
          // Store the old positions for transition.
          nodes.forEach(function(d){
            d.x0 = d.x;
            d.y0 = d.y;
          });
        
          // Creates a curved (diagonal) path from parent to the child nodes
          function diagonal(s, d) {
        
            var path2 = `M ${s.y} ${s.x}
                    C ${(s.y + d.y) / 2} ${s.x},
                      ${(s.y + d.y) / 2} ${d.x},
                      ${d.y} ${d.x}`
        
            return path2
          }
        
          // Toggle children on click.
          function click(d) {
            console.log('d:', d)
            if (d.children) {
                d._children = d.children;
                d.children = null;
              } else {
                d.children = d._children;
                d._children = null;
              }
            update(d);
          }
        }
          return(container);
        }


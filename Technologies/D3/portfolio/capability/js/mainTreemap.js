/*
  Adapted from https://codepen.io/stopyransky/pen/EXdrOo
*/
/*
var data = {
    "name": "A1",
    "children": [
      {
        "name": "B1",
        "children": [
          {
            "name": "C1",
            "value": 100
          },
          {
            "name": "C2",
            "value": 300
          },
          {
            "name": "C3",
            "value": 200
          }
        ]
      },
      {
        "name": "B2",
        "value": 200
      }
    ]
  };
*/
//const LINK = 'data/capabilities.json'
//const LINK = 'data/flare.json'
//d3.json(LINK)
const LINK = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRsPYbjoqHYm3bFzi6wCVO0ucGbyIcXG6z6ylGpuINMY5IFoZxMcslDowOavp1A4g/pub?output=csv'

d3.csv(LINK)
.then(data => {
      //console.log('data:', data)
      if (LINK != 'data/flare.json') {
        prepData = prepareData(data)
        //console.log('prepData:', prepData)

        stratData = stratify(prepData)
        //console.log('stratify:', stratData)
      }
      else stratData = data;
          
      globalThis.root = d3.hierarchy(stratData);

      updateTreeMapLayout();
      updateTreeLayout();
      updatePackLayout();
      updatePartitionLayout();
      updateSunburstLayout();
    }
    );

  const child  = 'ChildId';
  const parent = 'ParentId';
  
  var prepareData = function(data) {
    data.map(r => {r.Value=  +r.Value; r.value=+r.Value; r.Score = +r.Score})
    return data

  }
  var stratify = d3.stratify()
    .id(d => d[child])
    .parentId(d => d[parent]);

  var handleEvents = function( selection ) {
    selection.on('mouseover', function() {
      let g = d3.select(this);
      let n = g.select('.the-node');
  
      if(n.classed('solid')) {
        n.transition().duration(400)
        .style('fill', "rgba(211,0,0,0.8)" )
        .attr('r', 18);
      } else {
        n.transition().duration(400)
        .style('fill', "rgba(211,0,0,0.8)" );
      }
      
      g.select('.label')
        .transition().duration(700)
        .style('fill', 'white')
      
    })
    .on('mouseout', function() {
      let g = d3.select(this);
      let n = g.select('.the-node');
   
      if(n.classed('solid')) {
        n.transition().duration(400)
        .style('fill', "#696969" )
        .attr('r',14);
      }  else {
       n.transition().duration(400)
        .style('fill', "rgba(255,255,255,0.2)" )
      }
      g.select('.label')
        .transition().duration(700)
        .style('fill', "black")
    });
  } 

  /* TREE LAYOUT */
  function updateTreeLayout(){
    var treeLayout = d3.tree()
    treeLayout.size([400,200]);
    treeLayout(root);
    
    var tree = d3.select('#tree g.nodes')
    
    var treeNodes = tree.selectAll('g.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .classed('node', true)
      .call(handleEvents)
      
    
    treeNodes.append('circle')
      .classed('the-node solid', true)
      .attr('cx', d=> d.x)
      .attr('cy', d=> d.y)
      .attr('r', d => 14)
      .style("fill", "#696969");
    
    
    treeNodes.append('text')
      .attr('class', 'label')
      .attr('dx', d => d.x)
      .attr('dy', d => d.y+4)
      .text(d => d.data.name)
    
    var treeLinks = d3.select('#tree g.links')
      .selectAll('line.link')
      .data(root.links())
      .enter()
      .append('line')
      .classed('link', true)
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .style("stroke", "#5f5f5f")
    return ;
  }

  /* CLUSTER LAYOUT */
  function updateClusterLayout(){
  var clusterLayout = d3.cluster()
      .size([400,200])
      (root);
  
  var cluster = d3.select('#cluster g.nodes')
  
  var clusterNodes = cluster.selectAll('g.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .classed('node', true)
    .call(handleEvents)
  
  clusterNodes.append('circle')
    .classed('the-node solid', true)
    .attr('cx', d=> d.x)
    .attr('cy', d=> d.y)
    .attr('r', 14)
    .style("fill", "#696969");
  
  clusterNodes.append('text')
    .attr('class', 'label')
    .attr('dx', d=> d.x)
    .attr('dy', d=> d.y+4)
    .text( d => d.data.name)
  
  var clusterLinks = d3.select('#cluster g.links')
    .selectAll('line.link')
    .data(root.links())
    .enter()
    .append('line')
    .classed('link', true)
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y)
    .style("stroke", "#5f5f5f");
    return ;
  }
  
  /* TREEMAP LAYOUT  */
  function updateTreeMapLayout(){
    var treemapLayout = d3.treemap(); 
    treemapLayout.size([1000,400]);
    treemapLayout.paddingOuter(15);
    treemapLayout.paddingInner(20);
    /* paddingTop, paddingRight, Left and Bottom available */
    treemapLayout.tile(d3.treemapSquarify.ratio(3))
    // treemapLayout.tile(d3.treemapSliceDice)
    //treemapLayout.tile(d3.treemapSquarify.ratio(2))
    /* .tile allows different tiling strategies:
      - treemapSquarify.ratio(n) (default) - using rect aspect ratio 
      - treemapSlice - tile horizontally
      - treemapDice - tile vertically
      - treemapSliceDice - alter each layer horizontal/vertical
    */
    root.eachAfter(d => 
        {
          if (d.children) {
            d.SumScore = d3.sum(d.children.map(r => r.SumScore))
            d.CountScore = d3.sum(d.children.map(r => r.CountScore))
          }
          else {
            d.SumScore = d.data.data.Score;
            d.CountScore = 1;
          }
      }
      )

    root.sum(d => d.data.Value);
    //root.sum(d => d.data.Score);
    //console.log('root:', root)
    // root=root.copy().sum(d => d.data.Score);
    // console.log('rootScore:', root)
    treemapLayout(root);
    var treemapNodes = d3.select("#treemap g")
    .selectAll("g")
    .data(root.descendants())
    .enter()
    .append('g').attr('class', 'node')
    .attr('transform', d => 'translate('+[d.x0, d.y0]+')')
    //.call(handleEvents)
    
    treemapNodes
    .append('rect')
    .attr('class', d=> {if (!d.parent) ScoreColour ="";else if (d.SumScore/d.CountScore > 8) ScoreColour = ' green'; else if (d.SumScore/d.CountScore > 6) ScoreColour = ' yellow'; else ScoreColour = ' red'; return `the-node${ScoreColour}`})
    .attr("width", d => { //console.log(d.x1-d.x0); 
      return d.x1 - d.x0})
    .attr("height", d => d.y1 - d.y0)
    //.style("fill", "rgba(255,255,255,0.2)")
    .style('stroke', "#2f2f2f")
    
    treemapNodes
    .append('text')
    .attr('class', 'label')
    .attr('dx', d => 2)
    .attr('dy', d => 8)
    .text( d => d.data.data.ChildName)
    .attr('text-anchor', 'start');
    return ;
  }

  
  /* PACK LAYOUT */
  function updatePackLayout(){
    var packLayout = d3.pack();
    packLayout.size([800,600]);
    packLayout.padding(10);
    
    root.sum(d => d.data.value);
    packLayout(root);
    
    var packNodes = d3.select('#pack g')
    .selectAll('g')
    .data(root.descendants())
    .enter()
    .append('g').attr('class', 'node')
    .attr('transform', d => 'translate('+[d.x, d.y]+')')
    .call(handleEvents)
    packNodes
    .append('circle')
    .classed('the-node', true)
    .attr('r', d => d.r)
    .style('fill', "rgba(255,255,255,0.2)")
    .style('stroke', '#2f2f2f')
    
    packNodes
      .append('text')
      .attr('class', 'label')
      .attr('dy', 4 )
      .attr('dx', 0 )
      .text( d => d.children === undefined ? d.data.name : '');
    return ;
  }
  
  /* PARTITION LAYOUT */
  function updatePartitionLayout(){

    var partitionLayout = d3.partition();
    partitionLayout.size([400,200]);
    partitionLayout.padding(2);
    root.sum(d  => d.data.value);
    partitionLayout(root);
    
    var partitionNodes = d3.select('#partition g') 
    .selectAll("g")
    .data(root.descendants())
    .enter()
    .append('g').attr('class', 'node')
    .attr('transform', d => 'translate('+[d.x0, d.y0]+')')
    .call(handleEvents);
    
    partitionNodes
    .append('rect')
    .classed('the-node', true)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .style('fill', 'rgba(255,255,255,0.2)')
    .style('stroke', '#2f2f2f')
    
    partitionNodes
    .append('text')
      .attr('class', 'label')
      .attr('dx', 12)
      .attr('dy', 8)
      .text( d =>  d.data.name )
    return ;
  }
  
  /* SUNBURST LAYOUT */
  function updateSunburstLayout(){
    var sunburstLayout = d3.partition();
    
    var radius = 100;
    sunburstLayout.size([2*Math.PI, radius]);
    // sunburstLayout.padding(2);
    
    var arc= d3.arc()
    .startAngle( function(d) { return d.x0 })
    .endAngle(   function(d) { return d.x1 })
    .innerRadius(function(d) { return d.y0 })
    .outerRadius(function(d) { return d.y1 })
    
    root.sum(d  => d.data.value);
    
    sunburstLayout(root);
    
    var main = d3.select('#partition-sunburst g')
    
    var sunburstNodes = main.selectAll('g')
        .data(root.descendants())
        .enter()
        .append('g').attr("class", "node")
        .call(handleEvents)
    var paths = sunburstNodes.append('path')
        .attr('d', arc)
        .classed('the-node', true)
        .style('fill', 'rgba(255,255,255,0.2)')
        .style('stroke', '#2f2f2f')
    
    var labels = sunburstNodes.append("text") 
        .attr('class', 'label')
        .attr("transform", function(d) {
              return "translate(" + arc.centroid(d) 
              /*+ ") rotate(" + computeTextRotation(d) */+ ")"; }) 
        .attr("dx", "-4")  
        .attr("dy", ".5em") 
        .text(function(d) { return d.parent ? d.data.name : "" }); 
    return ;
  }
  // https://bl.ocks.org/denjn5/f059c1f78f9c39d922b1c208815d18af
  function computeTextRotation(d) {
      var angle = (d.x0 + d.x1) / Math.PI * 90; 
      return (angle < 180) ? angle - 90 : angle + 90;  
  }
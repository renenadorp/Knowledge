//MARGIN CONVENTION
var MARGIN = {  LEFT  : 100, RIGHT: 100, TOP: 10, BOTTOM: 100 }
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
const gYearBox  = svgCanvas.append('g').attr('id', 'gYearBox')

var gMap = svgCanvas.append("g").attr("class", "gMap")
                      .attr("transform", `translate(${0},${YEARBOX.HEIGHT})`)

//TIP

var tip = d3.tip().attr('class', 'd3-tip').html((EVENT,d)=> {
                let text =`
                
                <div class="container">
                <div class="row"><div class="col-sm"> ${d.dim}</div></div>
                <div class="row"><div class="col-sm"> ${d.number}.${d.name}</div></div>
                <div class="row"><div class="col-sm"> ${d.descr}</div></div>
                </div>                        
                        
                        `
                
                return text;      })
svgCanvas.call(tip)

//DATA
const myRequest = new Request('data/data.json');

fetch(myRequest, {method: 'GET',  
                  mode: 'no-cors', 
                  headers: {"Content-type": "application/json" } })
  .then((response) => response.json())
  .then((data) => {
    globalThis.updatedData = data;
    updateTMap(updatedData);
    updateProjects(updatedData);
    updateProjectList(updatedData);

  })
function updateTMap(data){
    const DIMCOUNT  = data.dims.names.length
    const YEARCOUNT = data.years.length
    const TLINES    = []
    const YEARPAD   = 2
    const YEARWIDTH = (YEARBOX.WIDTH / YEARCOUNT)-YEARPAD 

    //YEARS
    const gYear     = gYearBox.selectAll().data(data.years)
    const gYearEnter= gYear.enter().append('g').attr('transform', (d,i)=> {return `translate(${(i*(YEARWIDTH+YEARPAD))},${5   })`})

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
            
    //TMAP
    const TMAP = {    HEIGHT: CANVAS.HEIGHT-YEARBOX.HEIGHT, 
                    WIDTH : CANVAS.WIDTH}


    gMap.append("rect")
        .attr("width" , TMAP.WIDTH)
        .attr("height", TMAP.HEIGHT)

    //TRANSFORMATION CURVES      
    const gCurve = gMap.append('g').attr('class', 'gCurve')

    const sCurve = gCurve.selectAll('TCurve').data(data.years)
    sCurve.enter().append('path')
        .attr('d', (d,i)=>TCurve(d,i,YEARCOUNT))
        .attr('id', (d,i)=> `TCurve-${i}`)
        //.attr('class', (d,i) => {return `TCurve-${i+1}`})
        
    var Angle = 90 / DIMCOUNT //Divide 90 degree angle by number of dimensions

    function r2d(radians){
        return (180/Math.PI)*radians
    }
    function d2r(degrees){
        return (Math.PI/180)*degrees
    }

    //console.log(Math.tan(d2r(45))*WIDTH) // [VERIFIED] Using 45 degrees, the HEIGHT should be the same as WIDTH
    //console.log(r2d(Math.atan(1)))       // [VERIFIED] 1 is the value when both sides have the same length. The angle should be 45 


    //TODO: This loop needs to be rewritten to a form using d3.selectAll().data().append..... 
    for (var i = 1; i <= DIMCOUNT; i++) {
        var sumAngle = (Angle*i)
        var radian, A, O, X1, X2, Y1, Y2, C

        CutoverAngle = r2d(Math.atan(H2W))
        //console.log(`Dims:${Dims} i:${i}, Angle:${Angle}, SumAngle:${sumAngle}, CutoverAngle: ${CutoverAngle}`)

        if (sumAngle <= CutoverAngle) {
                A  = TMAP.WIDTH
                O  = TMAP.WIDTH*Math.tan(d2r(sumAngle))
                X1 = TMAP.WIDTH
                Y1 = 0
                X2 = 0
                Y2 = O
        }
        else {            
                A  = TMAP.HEIGHT
                O  = TMAP.HEIGHT*Math.tan(d2r(90-sumAngle))
                X1 = TMAP.WIDTH
                Y1 = 0
                X2 = TMAP.WIDTH - O
                Y2 = TMAP.HEIGHT
        }
        //Store coordinates to use for axis Dimension
        TLINES.push({Number:  i, 
                    Name  : data.dims.names[i-1], //VERY UGLY! I KNOW.
                    x1    : X1, 
                    y1    : Y1, 
                    x2    : X2, 
                    y2    : Y2
                    })  
        //}, Y1:${Y1}, X2:${X2}, Y2:${Y2}`)
        //console.log(`Angle: ${r2d(Math.atan(O/A))}`)
        gMap.append("line")
                .attr("x1", X1)
                .attr("y1", Y1)
                .attr("x2", X2)
                .attr("y2", Y2)
                .attr('class', 'dimension')
                .attr('id', `TLine-${i}`)
        }

    //TRANSFORMATION CURVES      
    function TCurve(d,i,c) {
        //console.log('called')
        const x0  = (TMAP.WIDTH/c) * (i+1),
                y0  = 0,
                cpx = (TMAP.WIDTH/c)*(i+1),
                cpy = (TMAP.HEIGHT/c)*(c-(i+1)),
                x   = TMAP.WIDTH,
                y   = (TMAP.HEIGHT/c)*(c-(i+1));
        
        const path = d3.path();
        path.moveTo(TMAP.WIDTH, 0)
        path.lineTo(x0, y0)
        path.quadraticCurveTo(cpx, cpy, x, y);
        path.lineTo(TMAP.WIDTH, 0)
        const curve = `${path}Z`
        
        return curve;
        }

    //AXIS
    //console.log(TLINES)
    const sAxisDim = gMap.selectAll('.gAxisDim').data(TLINES)
    const gAxisDim = sAxisDim.enter().append('g')
        .attr('class','gAxisDim')
        .attr('transform', (d,i,n) => transformDim(d,i,n))
    gAxisDim.append('rect')
        .attr('width', (d,i,n) => DIM.WIDTH)
        .attr('height', (d,i,n) => DIM.HEIGHT)
        .attr('rx', 20)
        .attr('ry', 20)

    gAxisDim.append('text').text(d=>d.Name)
        .attr('text-anchor', 'middle')//.attr('transform', (d,i,n) => transformDim(d,i,n))
        .attr('dy', DIM.HEIGHT/2 +5)
        .attr('dx', DIM.WIDTH/2)

    //Function to calculate location and rotation of Dimension
    function transformDim(d,i,n){
        var X = undefined
        var Y = undefined
        var svg =''
        if (i==0) {
                X = d.x2 == 0 ? -DIM.HEIGHT-5                   : 0
                Y = d.x2 == 0 ? (d.y2 / 2) + (DIM.WIDTH/2)      : CANVAS.HEIGHT
                R = d.x2 == 0 ? -90                             : 0
        }
        else
        {
                X = d.x2 == 0 ? -DIM.HEIGHT -5                  :  TLINES[i-1].x2 + ((d.x2 - TLINES[i-1].x2 ) /2) - (DIM.WIDTH/2)
                Y = d.x2 == 0 ? TLINES[i-1].y2 + 
                                ((d.y2-TLINES[i-1].y2)/2) + 
                                (DIM.WIDTH/2)                 : CANVAS.HEIGHT - DIM.HEIGHT+5 
                R = d.x2 == 0 ? -90                             : 0
        }
        //console.log(i, TLINES[i].y2, d.y2)
        svg = `translate (${X},${Y}) rotate(${R})`
        return svg
    }

    //CURRENT - FUTURE 
    const gCurrent=gMap.append('g').attr('class','gState').attr('transform', `translate(${0},${TMAP.HEIGHT})`)
    const gFuture =gMap.append('g').attr('class','gState').attr('transform', `translate(${TMAP.WIDTH},${0})`)

    gCurrent.append('ellipse')
        .attr('rx', STATE.RX)
        .attr('ry', STATE.RY)
        .attr('class', 'CurrentState')

    gCurrent.append('text')
        .attr('text-anchor', 'middle') 
        .text('CURRENT')
        .attr('class', 'State')
        .attr('dy', 5)

    gFuture.append('ellipse')
        .attr('rx', STATE.RX)
        .attr('ry', STATE.RY)
        .attr('class', 'FutureState')

    gFuture.append('text')
        .attr('text-anchor', 'middle') 
        .text('FUTURE')
        .attr('class', 'State')
        .attr('dy', 5)

  
    //console.log(data.dims.details)

    //HSO LOGO
    gHSO = gMap.append('g').attr('id', 'HSO').attr('transform',`translate(${TMAP.WIDTH +2},${TMAP.HEIGHT}) rotate(-90)`)
    gHSO.append('image')
        .attr('href', 'assets/hso.png')
        .attr('width', 145)

    globalThis.gProjects = gMap.append('g').attr('id', 'gProjects');

    //******************************************************************************************************************* */
    // INTERSECTIONS: LINE-CURVE
    // Credits: https://bl.ocks.org/bricof
    // Link: https://bl.ocks.org/bricof/f1f5b4d4bc02cad4dea454a3c5ff8ad7
    
    var n_segments = 100;
    var path = svg.select("path#TCurve-0");
    var pathEl = path.node();
    //console.log(pathEl)

    var pathLength = pathEl.getTotalLength();
    var line = gMap.select("line#TLine-1");

    // console.log(line.attr('x1'), line.attr('y1'), line.attr('x2'), line.attr('y2') )
    // console.log(pathLength)
    // console.log(TLINES)

    pts_i = path_line_intersections(pathEl,line)
    //console.log(pts_i)
    for (i=0; i< pts_i.length; i++){
        if (pts_i[i].x!==1000){
            gMap.append('circle')
                .attr('r', 5)
                .attr('cx', pts_i[i].x)
                .attr('cy', pts_i[i].y).attr('stroke', 'none').attr('fill', 'none')
        }
    }
    function positionLine(line) {
        line
            .attr("x1", function(d) { return d[0][0]; })
            .attr("y1", function(d) { return d[0][1]; })
            .attr("x2", function(d) { return d[1][0]; })
            .attr("y2", function(d) { return d[1][1]; });
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

    return;
    }

function updateProjects(data){
    //console.log('data:', data);

    const t = d3.transition()
    .duration(4000)
    .ease(d3.easeLinear);

    var Projects = gProjects.selectAll('.gProject').data(data.projects)
    Projects
        .join(
            function(enter) {
                gProjectEnter = enter.append('g').attr('class', 'gProject').call(drag());

                gProjectEnter
                    .attr('id', d => {return 'Project-' + String(d.number).padStart(2, '0')})
                    .attr( 'transform', d=>{ //console.log('here'); 
                        return `translate(${d.cx },${d.cy})`})//.transition(t)
                gProjectEnterRect = 
                    gProjectEnter.append('rect')
                    .attr('class', d => `Project ${d.status}`)
                    .attr('id', d => `Project-${String(d.number).padStart(2, '0')}`)
                    //.attr('width', d=>{console.log(d.name.length); return d.name.length *7 + 40})
                    .attr('height', 30)
                    .attr('x', d => -20)
                    .attr('y', d => - 15)
                    ;
                gProjectEnterText = 
                gProjectEnter.append('text')
                    .attr('class', 'Project')
                    .text(d=>{return `${d.number}.${d.name}`})
                    .attr('fill', 'white').attr('dx', -5).attr('dy', 5)
                    .attr('text-anchor', 'start');

                gProjectEnterRect.attr('width',  d=>BrowserText.getWidth(`${d.number}.${d.name}`, '14', 'Arial')+25)
                //console.log('textlength:', gProjectEnterText.node().getComputedTextLength());

/*
                gProjectEnterCircle = 
                gProjectEnter.append('circle')
                .attr('cx', -10)
                .attr('cy', -15)
                .attr('r', 3)
                .attr('class', 'project-hinge')
                
              gProjectEnterPushPin = 
                gProjectEnter.append('image')
                .attr('class', 'project-hinge')
                .attr( 'x', -200)
                .attr('y', -200)
                .attr('href', "assets/pushpin.svg" )
                .attr("transform",   'scale(.15)');
*/
       

                Projects = gProjectEnter.merge(Projects)


            },
            function(update){
                gProjectUpdate = update
                 .attr( 'transform', d=>{ console.log('update'); 
                    return `translate(${d.cx },${d.cy})`}).transition(t)
                update.select('text.Project').text(d=>{return `${d.number}.${d.name}`})
                .attr('fill', 'white').attr('dx', -5).attr('dy', 5)
                .attr('text-anchor', 'start')
            },

            function(exit) {
                return exit.remove();
              }
        )
}

function moveProject(id, x, y){
    
    const projectArrayIndex = +id.substring(8,10)-1
    updatedData.projects[projectArrayIndex].cx = x;
    updatedData.projects[projectArrayIndex].cy = y;
    
}

function changeProject(what, e){
    projectSelector = `rect#${e.id.substring(0, 10)}`; //
    projectArrayIndex = +e.id.substring(9,10)-1 //    Project-01-Name
    //console.log(what, ' ' , e, updatedData, 'id:', e.id, 'number:', projectArrayIndex )

    if (what=="Name") {
        updatedData.projects[projectArrayIndex].name = e.value;
        updateProjects(updatedData)

    }
    if (what=="Status") {
        updatedData.projects[projectArrayIndex].status = e.value;
        //console.log( projectSelector)
        var SelectedStatus = document.getElementById( e.id );
        var SelectedStatusValue = SelectedStatus.options[ SelectedStatus.selectedIndex ].value
        var SelectedProject =document.querySelector(projectSelector)
        SelectedProject.className.baseVal = 'Project ' + SelectedStatusValue;
        console.log('Status:' ,SelectedStatus, SelectedStatusValue, SelectedProject)

    }

    return;
}
function updateProjectList(data)  {
    const tableStringStart = 
    `
    <div class="row">
    <div class="col-1"></div>
        <div class="col-6"><H1> Transformation Map</H1></div>
    </div>
    
    <div class="row">
    <div class="col-1"></div>
    <div class="col-6">
    <details>     
        <summary>Click here to update Projects</summary>                

    <table class="table table-sm table-light" id="project-list">
                    <thead>
                        <tr>
                        <th scope="col" class="text-right">Nbr</th>
                        <th scope="col" class="text-left">Name</th>
                        <th scope="col" class="text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    var tableStringRows = '';
    data.projects.map(row=> {
    tableStringRows += `
    <tr>
    <th scope="row" class="text-right">${row.number}</th>
    <td><input type="text" id="Project-${String(row.number).padStart(2, '0')}-Name" class="form-control project-name" value="${row.name}"></input></td>    
    <td><select name="status" id="Project-${String(row.number).padStart(2, '0')}-Status" class="form-control form-select-lg project-status" aria-label=".form-select-sm form-control project-status" value="${row.status}">
            <option name="completed" value="completed" ${row.status=='completed' ? "selected" : null }>Completed</option>
            <option name="inprogress" value="inprogress" ${row.status=='inprogress' ? "selected" : null }>In Progress</option>
            <option name="future" value="future" ${row.status=='future' ? "selected" : null }>Future</option>
        
        </select></td>    
    

    </tr>
    `});
    
    const tableStringEnd =
        `
        <tr><td></td><td><a href="" id="a"></a>
        <button type="button" class="btn btn-primary" onclick="saveMap()" id="saveMap" >Save Map</button>
       </td></tr>
        </tbody>
        </table>
        </details>
        </div>
        </div>

        `;

    const html = tableStringStart + tableStringRows + tableStringEnd;
    d3.select("#project-list").html(html);
    //console.log( d3.select("#project-list"))
       
    d3.selectAll(".move-project").on("click", function() {
        moveProject(this.id);
    });

    d3.selectAll(".project-name").on("change", function() {
        changeProject("Name", this);
    });
    d3.selectAll(".project-status").on("change", function() {
        changeProject("Status", this);
    });
    d3.selectAll("button#saveMap").on("click", function(){
        saveMap(data)
    });

    return ;

}

function saveMap (data) {
    var json = JSON.stringify(data)
    //console.log('saveMap:', json)
    //alert('savemap ')
// Function to download data to a file
    var type ="application/json";
    var filename = "data.json";
    var jsonBlob = new Blob([json], {type: type});

    //var jsonBlob = new Blob([JSON.stringify("kiki")], { type: 'application/javascript;charset=utf-8' });
    var link=window.URL.createObjectURL(jsonBlob);
    //window.location=link;
    saveAs(jsonBlob, filename);

    


    
   return; 
}

function drag () {
    
    function dragstarted(event, d) {
      d3.select(this).raise().attr("stroke", "black");
    }
  
    function dragged(event, d) {
        //d3.select(this).attr("x", d.x = event.x).attr("y", d.y = event.y);
      d3.select(this).attr("transform", `translate(${event.x},${event.y})`);

    }
  
    function dragended(event, d) {
      d3.select(this).attr("stroke", null);
      moveProject(this.id, event.x, event.y);

    }
  
    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
  }

  var BrowserText = (function () {
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');
    /**
     * Measures the rendered width of arbitrary text given the font size and font face
     * @param {string} text The text to measure
     * @param {number} fontSize The font size in pixels
     * @param {string} fontFace The font face ("Arial", "Helvetica", etc.)
     * @returns {number} The width of the text
     **/
    function getWidth(text, fontSize, fontFace) {
        context.font = fontSize + 'px ' + fontFace;
        console.log('width:', context.measureText(text).width)

        return context.measureText(text).width;
    }

    return {
        getWidth: getWidth
    };
})();



/*
  function updateProjectListOLD(data)  {
    const tableStringStart = 
    `
    <table class="table table-sm table-light" id="project-list">
                    <thead>
                        <tr>
                        <th scope="col" class="text-right">Nbr</th>
                        <th scope="col" class="text-left">Name</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    var tableStringRows = '';
    data.projects.map(row=> {

    tableStringRows += `
    <tr>
    <th scope="row" class="text-right">${row.number}</th>
    <td><input type="text" id="Name-${row.number}"class="form-control project-name" value="${row.name}"></input>
    </td>    
    <td><button type="button" id ="Project-${String(row.number).padStart(2, '0')}-Up" class="btn btn-light move-project">
        <span class="bi bi-arrow-up-circle">
        <img src = "assets/arrow-up-blue.png" width="20px" height="20px"/>

        </span>
        </button></td>
        <td>
            <button type="button" id ="Project-${String(row.number).padStart(2, '0')}-Down" class="btn btn-light move-project">
            <span class="bi bi-arrow-down-circle">
            <img src = "assets/arrow-up-blue.png" width="20px" height="20px"/>
        </span>
            </button>
        </td>
        <td>
            <button type="button" id ="Project-${String(row.number).padStart(2, '0')}-Left" class="btn btn-light move-project">
            <span class="bi bi-arrow-left-circle">
            <img src = "assets/arrow-up-blue.png" width="20px" height="20px"/>
        </span>
            </button>
        </td>
        <td>
            <button type="button" id ="Project-${String(row.number).padStart(2, '0')}-Right" class="btn btn-light move-project">
            <span class="bi bi-arrow-right-circle">
            <img src = "assets/arrow-up-blue.png" width="20px" height="20px"/>
        </span>
            </button>
        </td>
    </tr>
    `});
    
    const tableStringEnd =
        `
        </tbody>
        </table>
        `;

    const saveButton = `
    <button type="button" class="btn btn-primary" id="saveMap" >Save Map</button>
    `        
    const html = tableStringStart + tableStringRows + tableStringEnd + saveButton;
    d3.select("#project-list").html(html);
    //console.log( d3.select("#project-list"))
       
    d3.selectAll(".move-project").on("click", function() {
        moveProject(this.id);
    });

    d3.selectAll(".project-name").on("change", function() {
        changeProject("Name", this);
    });
    d3.select('#saveMap').on("click", function() { saveMap(data);})

    return ;

}  

function moveProjectOLD(id, c){
    //console.log('updatedData (before):', updatedData)
    
    const projectArrayIndex = +id.substring(8,10)-1
    const moveDirection     = id.substring(11,12)
    //console.log('project:',updatedData.projects[projectArrayIndex], ' Axis:', projectAxis)
    if (moveDirection=='U') updatedData.projects[projectArrayIndex].cy-=10;
    if (moveDirection=='D') updatedData.projects[projectArrayIndex].cy+=10;
    if (moveDirection=='L') updatedData.projects[projectArrayIndex].cx-=10;
    if (moveDirection=='R') updatedData.projects[projectArrayIndex].cx+=10;

    updateProjects(updatedData)
    
}
*/
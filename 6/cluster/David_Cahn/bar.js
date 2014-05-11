console.log ("HELLO")

d1 = [
    {'label':'a', 'y':60},
    {'label':'b', 'y':55},
    {'label':'c', 'y':80},
    {'label':'d', 'y':20},
    {'label':'e', 'y':92},
    {'label':'f', 'y':17},    
];

var width = 400;
var height = 400;

var svg = d3.select("body").append("svg")
    .attr('width',width)
    .attr('height',height)
    .attr('id','svg')
    .style ('border','1px solid');


var xScale = d3.scale.linear()
    .domain([0,100])
    .range([0,width])

var yScale = d3.scale.linear()
    .domain([0,100])
    .range([0,height])


var c = svg.selectAll('rect')
    .data(d1)
    .enter()
    .append("rect")
    .attr('x',function(d,i){return i*50;})
    .attr('y',function(d){return height-yScale(d.y);})
    .attr('width',function(d) {return 45;})
    .attr('height',function(d){return yScale (d.y);})
    .attr('fill','steelblue')
    .attr ('font-family','sans-serif')
    .attr('font-size','20px')
    .attr('fill','red')
    .text(function (d) {return d.y;});

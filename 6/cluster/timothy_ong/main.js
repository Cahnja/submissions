
var width=800, height=400;

var data = new Array(300);






data = _.map(data,function(d){
	var item = {'type':1,
		    'features':[Math.floor(Math.random()*width),
				Math.floor(Math.random()*height)]};
	return item;
    });

var centroidColors = [ 'yellow','green','blue','gray','orange'];

var centroids = [ data[0],data[1],data[2],data[3],data[4]];



var svg = d3.select('body')
    .append('svg')
    .attr('id','svg')
    .attr('height',height)
    .attr('width',width)
    .style('border','solid 1px');


var data,items;
var xScale,yScale
    var doit = function(d){
    data = _.map(d,function(d) {
	    return {'type':d.name,
		    'realtype':d.name,
		    features: [parseInt(d.reading),
			       parseInt(d.math),
			       parseInt(d.writing),
			       ]};
	});

    var xMin = d3.min(data,function(d){return d.features[0];});
    var xMax = d3.max(data,function(d){return d.features[0];});
    var yMin = d3.min(data,function(d){return d.features[1];});
    var yMax = d3.max(data,function(d){return d.features[1];});
    
    xScale = d3.scale.linear()
    .domain([xMin,xMax])
    .range([20,width-20]);
    yScale = d3.scale.linear()
    .domain([yMin,yMax])
    .range([20,height-20]);
    items  = svg.selectAll('item')
    .data(data)
    .enter()
    .append('circle')
    .attr('class','item')
    .attr('r',5)
    .attr('cx',function(d) {return xScale(d.features [0]);})
    .attr('cy',function(d) {return yScale(d.features [1]);})
    .attr('fill','red');
}

    d3.csv("SAT_Results.csv",doit);
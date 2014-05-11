//console.log ("Hello");

// Goal: Organize JennaMarbles (example person) recent Instragram data to plot the relationship between likes and comment for recent posts.
// The data is pulled from Instragram.py in CCVB (part of my final project)
// Likes are on the x axis, comments are on the y axis
// Yellow dots means that a photo has many comments but not many likes. 
// Blue dots are photos that have many comments and many likes. 

width = 400;
height = 400;

var svg = d3.select("body")
    .append('svg')
    .attr('id','svg')
    .attr('height',height)
    .attr('width',width)
    .style('border', 'solid 1px');


var data;
var doit = function(d){
    console.log ("doing it");
    data = _.map(d, function(d) {
	return {'type':1,
		features:[parseInt(d.likes),
			  parseInt(d.comments),
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

    centroids = [ data [0],data [1], data [2]];
    centroidColors= ['green','blue','yellow'];

    items = svg.selectAll ('item')
	.data(data)
	.enter()
	.append('circle') 
	.attr('class','item')
	.attr('r',5)
	.attr('cx',function(d) {return xScale(d.features [0]);})
	.attr('cy',function(d) {return yScale(d.features [1]);})
	.attr('fill','red')

    centroidCirciles = svg.selectAll ('centroids')
	.data (centroids)
	.enter()
	.append ('circle')
	.attr ('class','centroid')
	.attr ('r',5)
	.attr('cx',function(d) {return xScale(d.features [0]);})
	.attr('cy',function(d) {return yScale(d.features [1]);})
	.attr('fill',function(d,i) {return centroidColors[i];});
};

var dist = function (a,b) {
    var z = _.zip(a,b);
    var sqs = _.map(z,function(d) {return (d[0]-d[1]) * (d[0] - d[1])});
    var sum = _.reduce(sqs,function(a,b) {return a + b;});
    return Math.sqrt(sum);
}

var assign = function (centroids,data) {
    _.each(data, function(d){
	var mins = _.map(centroids,function(d2) {
	    return dist(d2.features,d.features);
	});
	var min = _.min(mins);
	var minIndex = _.indexOf(mins,min);
	d['type'] = minIndex;
    });
}


var recenter = function(centroids,data) {
    _.each(centroids,function(d,i,c) {
	var subset = _.filter(data, function(d2) {
	    return d.type==d2.type;    
	});
	subset = _.map(subset,function(d){return d.features;});
	var z = _.zip(subset);
	console.log(z);
	var sums = _.map(z,function(d){
	    return _.reduce(d,function(a,b) {return a+b;});
	});
	var avgs = _.map (sums,function(d,i) {
	    return parseInt(d)/z[i].length;
	});
	c[i].features = avgs; 
    });
}

var clusterIt = function () {
    assign (centroids, data);
    items
    //	.transition()
    //	.delay(function(d,i) {return 50*i})
	.attr('stroke-width',3)
	.attr('stroke', function (d) {return centroidColors[d.type];});


    recenter(centroids,data);
    centroidCirciles
	.transition()
	.delay(function(d,i){return 1000*i;})
	.duration(3000)
	.attr('cx',function(d){return xScale( d.features[0]);})
	.attr('cy',function(d){return yScale( d.features[1]);})
}

d3.csv("instagram.csv",doit);

var clickme = d3.select("#clickme").on('click', clusterIt);
//var bd = d3.select("#build").on('click', build);

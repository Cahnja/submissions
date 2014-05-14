
var width=800, height=400;

var data = new Array(300);

data = _.map(data,function(d){
   var item = {'type':1,
	      'features':[Math.floor(Math.random()*width),
			 Math.floor(Math.random()*height)]};
    return item;
});

var centroidColors = [ 'magenta','green','blue'];

var centroids = [ data[0],data[1],data[2]];



var svg = d3.select('body')
	.append('svg')
	.attr('id','svg')
	.attr('height',height)
	.attr('width',width)
	.style('border','solid 1px');

var items  = svg.selectAll('item')
	.data(data)
	.enter()
	.append('circle')
	.attr('class','item')
	.attr('r',5)
	.attr('cx',function(d) {return d.features[0];})
	.attr('cy',function(d) {return d.features[1];})
	.attr('fill','red');

var centroidCircles = svg.selectAll('centroid')
	.data(centroids)
	.enter()
	.append('circle')
	.attr('class','centroid')
	.attr('r',9)
	.attr('cx',function(d) {return d.features[0];})
	.attr('cy',function(d) {return d.features[1];})
	.attr('fill',function(d,i){return centroidColors[i]});

var dist = function(a,b){
    var z = _.zip(a,b);
    var sqs = _.map(z,function(d){return (d[0]-d[1])*(d[0]-d[1]);});
    var sum = _.reduce(sqs,function(a,b){return a+b;});
    return Math.sqrt(sum);
}

var assign = function(centroids,data){
    _.each(data,function(d){
	var mins = _.map(centroids,function(d2){
	    return dist(d2.features,d.features);
	});
	var min = _.min(mins);
	var minIndex = _.indexOf(mins,min);
	d['type']=minIndex;
    });
}

var recenter = function(centroids,data){
    _.each(centroids,function(d,i,cArray){
	var subset = _.filter(data,function(d2){
	    return d.type==d2.type;
	});
	subset = _.map(subset,function(d){return d.features;});
	var z = _.zip(subset);
	var sums = _.map(z,function(d){return d3.sum(d);});
	var avgs = _.map(sums,function(d,i){
	    return parseInt(d/z[i].length);
	});
	cArray[i].features =avgs;
    });
}

var clusterit = function() {
    assign(centroids,data);
    
    items
	.transition()
	//.delay(function (d,i){return i*10;})
	.attr('stroke-width',3)
	.attr('stroke',function(d){return centroidColors[d.type];});

    recenter(centroids,data);
    
    centroidCircles
	.transition()
	.delay(function(d,i) {return 100*i;})
	.duration(1000)
	.attr('cx',function(d){return d.features[0];})
	.attr('cy',function(d){return d.features[1];});
}

var clickme = d3.select("#clickme").on('click',clusterit);


var data;
var centroids,svg;
var height=400, width=800;
var svg = d3.select("body")
	.append('svg')
	.attr('id','svg')
	.attr('height',height)
	.attr('width',width);

var xScale;
var yScale;
var items,ccircles;
var clustercolors = ['red','blue','black']


var assign = function(centroids,data) {
    _.each(data, function(d){

	var mins = _.map(centroids,function(d2) {
	    return dist(d2.features,d.features);});

	var min = _.min(mins);
	var mini = _.indexOf(mins,min);

	// assign to the appropriate centroid
	d['type']=centroids[mini].realtype;
    });

    items.attr('stroke-width',3)
	.attr('stroke',function(d){ return clustercolors[d.type];})
	.attr('fill',function(d){return clustercolors[d.realtype];});
    
    
}


var recenter = function(centroids,data) {
    _.each(centroids,function(d){
	// pull out this centroids current points
	var subset = _.filter(data,function(d2) { return d.realtype==d2.type;});
	subset = _.map(subset,function(d) {return d.features;});
	var z = _.zip(subset);

	var sums = _.map(z,function(d) {
	    return _.reduce(d,function(a,b){return a+b;}); });
	var avgs = _.map(sums, function(d,i) {return parseInt(d)/z[i].length;});
	d.features = avgs;
    });
}



var doit = function(d){
    
    data = _.map(d, function(d) {
	return {'realtype':parseInt(d.class),'type':parseInt(d.class),
		features:[parseFloat(d.rand1),
			  parseFloat(d.rand2),
			  parseFloat(d.rand3),
			  parseFloat(d.rand4)]};
    });
    
//    centroids = [ _.cloneDeep(data [0]),_.cloneDeep(data [1]),
//		  _.cloneDeep(data [2])];
    
    centroids = [ data [0],data [1],
		  data [2]];
    

    xScale = d3.scale.linear()
	.domain([d3.min(data,function(d) { return d.features[0];}),
		 d3.max(data,function(d) { return d.features[0];})])
	.range([20,width-20]);
    yScale = d3.scale.linear()
	.domain([d3.min(data,function(d) { return d.features[1];}),
		 d3.max(data,function(d) { return d.features[1];})])
	.range([20,height-20]);

    items = svg.selectAll("item")
	    .data(data)
	    .enter()
	    .append("circle")
	    .attr('class','item')
	    .attr('r',5)
	    .attr('cx',function(d){return xScale(d.features[0]);})
	    .attr('cy',function(d){return yScale(d.features[1]);})
	.attr('stroke-width',3)
	.attr('fill',function(d){return clustercolors[d.realtype];})
    	.attr('stroke',function(d){return clustercolors[d.realtype];});

    ccircles = svg.selectAll('centroid')
	.data(centroids)
	.enter()
	.append("circle")
	.attr('class','centroid')
	.attr('r',5)
	.attr('cx',function(d){return xScale(d.features[0]);})
	.attr('cy',function(d){return yScale(d.features[1]);})
	.attr('stroke-width',3)
	.attr('stroke','yellow')
	.attr('fill',function(d){return clustercolors[d.realtype];});
};


var dist = function(a,b){
    return _.reduce(_.map(_.zip(a,b),function(d) {return (d[0]-d[1])*(d[0]-d[1]);}),
		    function(a,b) {return a+b;},0);
}


var clusterit = function(){
    assign(centroids,data);
    recenter(centroids,data);
    d3.selectAll(".centroid")
	.transition()
  	.duration(1000)
	.attr('stroke-width',3)
	.attr('stroke','yellow')
	.attr('cx',function(d){return xScale(d.features[0]);})
	.attr('cy',function(d){return yScale(d.features[1]);});

    items
	.data(data)
	.attr('stroke-width',3)
	.attr('stroke',function(d){ return clustercolors[d.type];})
	.attr('fill',function(d){return clustercolors[d.realtype];});

}

var click = d3.select("#click").on('click',clusterit);
d3.csv("rand.csv",doit);



var data;
var centroids,svg;
var height=800, width=800;
var svg = d3.select("body")
	.append('svg')
	.attr('id','svg')
	.attr('height',height)
	.attr('width',width);

var xScale;
var yScale;
var items,ccircles;
var clustercolors = ['red','blue','green']


var assign = function(centroids,data) {
    _.each(data, function(d){

	var mins = _.map(centroids,function(d2) {
	    return dist(d2.features.slice(3,5),d.features.slice(3,5));
	});
	//console.log(mins)
	
	var min = _.min(mins);
	var mini = _.indexOf(mins,min);

	// assign to the appropriate centroid
	d['type']=centroids[mini].realtype;
    });

    items.attr('stroke-width',2)
	.attr('stroke',function(d){ return clustercolors[d.type];})
	.attr('fill',function(d){return clustercolors[d.realtype];});
    
    
}


var recenter = function(centroids,data) {
    _.each(centroids,function(d){
	// pull out this centroids current points
	var subset = _.filter(data,function(d2) { return d.realtype==d2.type;});
	subset = _.map(subset,function(d) {return d.features.slice(3,5);});
	var z = _.zip(subset);

	var sums = _.map(z,function(d) {
	    return _.reduce(d,function(a,b){return a+b;}); });
	var avgs = _.map(sums, function(d,i) {return parseInt(d)/z[i].length;});
	d.features[3] = avgs[0];
	d.features[4] = avgs[1];
    });
}



var doit = function(d){
    
    data = _.map(d, function(d) {
	var rand = Math.random()*3
	return {'realtype':parseInt(rand),'type':parseInt(rand),
		features:[String(d.DBN),
			  String(d.school_name),
              parseFloat(d.num_test_takers),
			  parseFloat(d.reading_score),
			  parseFloat(d.math_score),
			  parseFloat(d.writing_score)]};
    });
    
//    centroids = [ _.cloneDeep(data [0]),_.cloneDeep(data [1]),
//		  _.cloneDeep(data [2])];
   
    rand = new Array(3);
    rand[0] = parseInt(Math.random()*data.length); 
    rand[1] = parseInt(Math.random()*data.length);
    rand[2] = parseInt(Math.random()*data.length);
    while(rand[0] == rand[1]) 
        rand[1] = parseInt(Math.random()*data.length);
	while(rand[2] == rand[0] || rand[1] == rand[0])
        rand[2] = parseInt(Math.random()*data.length);
    centroids = [ data [rand[0]],data[rand[1]],data[rand[2]] ];
    

    xScale = d3.scale.linear()
	.domain([d3.min(data,function(d) { return d.features[3];}),
		 d3.max(data,function(d) { return d.features[3];})])
	.range([25,width-25]);
    yScale = d3.scale.linear()
	.domain([d3.min(data,function(d) { return d.features[4];}),
		 d3.max(data,function(d) { return d.features[4];})])
	.range([25,height-25]);

    items = svg.selectAll("item")
	    .data(data)
	    .enter()
	    .append("circle")
	    .attr('class','item')
	    .attr('r',5)
	    .attr('cx',function(d){return xScale(d.features[3]);})
	    .attr('cy',function(d){return yScale(d.features[4]);})
	.attr('stroke-width',3)
	.attr('fill',function(d){return clustercolors[d.realtype];})
    	.attr('stroke',function(d){return clustercolors[d.realtype];});

    ccircles = svg.selectAll('centroid')
	.data(centroids)
	.enter()
	.append("circle")
	.attr('class','centroid')
	.attr('r',5)
	.attr('cx',function(d){return xScale(d.features[3]);})
	.attr('cy',function(d){return yScale(d.features[4]);})
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
	.attr('cx',function(d){return xScale(d.features[3]);})
	.attr('cy',function(d){return yScale(d.features[4]);});

    items
	.data(data)
	.attr('stroke-width',3)
	.attr('stroke',function(d){ return clustercolors[d.type];})
	.attr('fill',function(d){return clustercolors[d.realtype];});

}

var click = d3.select("#click").on('click',clusterit);
d3.csv("SAT_Results.csv",doit);



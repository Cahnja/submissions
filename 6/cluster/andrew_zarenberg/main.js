var data = [];
for(var x=0;x<dd.length;x+=20){
    data.push(dd[x]);
}

var height = 1000, width = 1000;

var centroidColors = ["green","yellow","blue","purple","orange","pink"];


for(var x=0;x<data.length;x++){
    //data[x].features = [data[x].time/4,1000-data[x].age*10];
    //data[x].features = [data[x].distance*150,1000-data[x].age*10];
    data[x].features = [data[x].distance*150,600-data[x].time/10];
}


var centroids = [];

/*
var svg = d3.select("body")
    .append("svg")
    .attr("width",width)
    .attr("height",height)
    .attr("id","svg")
*/
var svg = d3.select("svg");

var items = svg.selectAll("item")
    .data(data)
    .enter()
    .append("circle")
    .attr("class","item")
    .attr("r",2)
    .attr("cx",function(d){ return d.features[0]; })
    .attr("cy",function(d){ return d.features[1]; })
    .attr("fill",function(d){ return d.gender==0?"blue":"pink"; });

var dist = function(a,b){
    var z = _.zip(a,b);
    var m = _.map(z,function(d){ return (d[1]-d[0])*(d[1]-d[0]); });
    var sum = _.reduce(m,function(a,b){ return a+b; });
    return Math.sqrt(sum);
}

var assign = function(centroids,data){
    _.each(data,function(d){
	var dists = _.map(centroids,function(d2){
	    return dist(d2.features,d.features);
	});

	var min = _.min(dists);
	var minIndex = _.indexOf(dists,min);
	d.type = minIndex;
    });
}


var recenter = function(centroids,data){
    _.each(centroids,function(d,i,c){
	var subset = _.filter(data,function(d2){
	    return d.type == d2.type;
	});
	subset = _.map(subset,function(d2){
	    return d.features;
	});

	var z = _.zip(subset);

	var sums = _.map(z,function(d2){
	    return _.reduce(d2,function(a,b){ return a+b; });
	});
	var avgs = _.map(sums,function(d,i){
	    return parseInt(d)/z[i].length;
	});
	console.log(avgs);
    });
};


var clusterit = function(n){
    for(var x=0;x<n;x++){
	centroids.push(data[Math.floor(Math.random()*data.length)]);
    }

    assign(centroids,data);

    items
	.transition()

	.attr("fill",function(d){ return centroidColors[d.type]; });

    recenter(centroids,data);
};


document.getElementById("cluster").addEventListener("click",function(){
    clusterit(parseInt(document.getElementById("clusterNum").value));
});





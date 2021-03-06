console.log("Hello");

var data = {};
var svg = d3.select("body").append("svg")
    .attr("width",500)
    .attr("height",500)
    .attr("id","svg");

var firstData = true;

//This code was uh..."borrowed" from grades.js
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var dataSwitchMaker = function(s, scale) {
    var f = function() {
	if (!firstData) {
	    svg.selectAll("circle")
		.data(data)
		.transition()
		.duration(1000)
		.attr("cx",function(d) {return d.UrbanPop * 4 + 50;})
		.attr("cy",function(d) {return -1 * scale * d[s] + 450;})
		.attr("fill",getRandomColor)
		.attr("r",5)
		.attr("state",function(d) {return d.State;});
        } else {
	    svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx",function(d) {return d.UrbanPop * 4 + 50;})
		.attr("cy",function(d) {return -1 * scale * d[s] + 450;})
		.attr("fill",getRandomColor)
		.attr("r",5)
		.attr("state",function(d) {return d.State;});
	    firstData = false;
	}
	svg.selectAll(".yaxis").remove();
	var yScale = d3.scale.linear().domain([0,450/scale]).range([450,50]);
	var yAxis = d3.svg.axis().scale(yScale).orient("left");
	svg.append("g").attr("class","yaxis")
	.attr("transform","translate(60,0)")
	    .call(yAxis);
	svg.selectAll(".yaxis")
	    .append("text")
	    .attr("transform","rotate(-90)")
	    .attr("x",-225)
	    .attr("y",-45)
	    .style("text-anchor", "middle")
	    .text("Arrests Per 100,000 Residents");


	var circles = svg.selectAll("circle")[0];

	for(var i = 0; i < circles.length; i++) {
	    circles[i].addEventListener("click", function(e) {
		var circle = e.toElement;
		svg.selectAll(".tag").remove();
		svg.selectAll(".yaxis")
		    .append("text")
		    .attr("class","tag")
		    .attr("x",parseInt(circle.getAttribute("cx"))-60)
		    .attr("y",parseInt(circle.getAttribute("cy"))+20)
		    .style("text-anchor","middle")
		    .style("font-family","sans-serif")
		    .text(circle.getAttribute("state"));
	    });
	}
    }
    return f;
}

var xScale = d3.scale.linear().domain([0,100]).range([50,450]);
var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
svg.append("g").attr("class","xaxis")
    .attr("transform","translate(0,440)")
    .call(xAxis);

svg.selectAll(".xaxis")
    .append("text")
    .attr("x",225)
    .attr("y",40)
    .style("text-anchor", "middle")
    .text("Urban Percentage of Population");

var assault = dataSwitchMaker("Assault", 1);
var murder = dataSwitchMaker("Murder", 20);
var rape = dataSwitchMaker("Rape", 8);
var total = dataSwitchMaker("Total", 1);

d3.csv("USArrests.csv")
    .row(function(d) {
	return {State : d.State, Murder: d.Murder, Assault: d.Assault,
		UrbanPop : d.UrbanPop, Rape : d.Rape, Total : parseInt(d.Murder) + parseInt(d.Assault) + parseInt(d.Rape)};
    })
    .get(function(error, rows) {
	data = rows;
	console.log(data);
	assault();
	});


document.getElementById("a").addEventListener("click",assault);
document.getElementById("m").addEventListener("click",murder);
document.getElementById("r").addEventListener("click",rape);
document.getElementById("t").addEventListener("click",total);



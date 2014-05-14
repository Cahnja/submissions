var data;
var centroids, svg;
var height = 400,
	width = 800;
var svg = d3.select("body")
	.append('svg')
	.attr('id', 'svg')
	.attr('height', height)
	.attr('width', width);

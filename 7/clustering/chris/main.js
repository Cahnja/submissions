var data = [];
var centroids = [];


var age2num = function(d) {
    return d / 100;
};
var sex2num = function(d) {
    if (d == "Male") {
	return 0;
    } else {
	return 1;
    }
};
var ed2num = function(d) {
    return d / 16;
}; 
var spouse2num = function(d) {
    if(d == "Married-civ-spouse") {
	return 0;
    } else {
	return 1;
    }
};
var race2num = function(d) {
    if(d == "White") {
	return 0
    } else {
	return 1;
    }
};
var class2num = function(d) {
    if(d == ">50K") {
	return 0;
    } else {
	return 1;
    }
};

var getKeys = function(dict) {
    return Object.keys(dict).map(function(key) {return dict[key];});
}

var dist = function(d, c) {
    var zipped = _.zip(getKeys(d), getKeys(c));
    var distssquared = _.map(zipped, function(data) {return (data[1]-data[0])*(data[1]-data[0]);});
    var sum = d3.sum(distssquared);
    return Math.sqrt(sum);
}

var minDist = function(d) {
    var dists =[dist(d,centroids[0]),dist(d,centroids[1]),dist(d,centroids[2])];
    return dists.indexOf(d3.min(dists));
}
		      

var maptocentroids = function(d) {
    _.map(d, function(data) {
	data["centroid"] = minDist(data);
	return data;});
}

d3.csv("census.data").row(function(d) {
    return {
	Age : age2num(parseInt(d["age"])),
	Sex : sex2num(d["sex"]),
	Education : ed2num(parseInt(d["educationnum"])),
	Spouse : spouse2num(d["maritalstatus"]),
	Race : race2num(d["race"]),
	Class : class2num(d["class"]) };
}).get(function(error, rows) {
    data = rows;
    centroids = [rows[0], rows[1], rows[2]];
    var learningData = data.slice(0, 25000);
    var testData = data.slice(25000);
    maptocentroids(learningData);
    console.log(data);
    console.log(learningData);
});

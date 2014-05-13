var data = [];
var centroids = [];
var group1, group2, group3;
var upperclass1, upperclass2, upperclass3;

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
    var sum = d3.sum(distssquared) - distssquared[distssquared.length - 1];
    return Math.sqrt(sum);
}

var minDist = function(d) {
    var dists =[dist(d,centroids[0]),dist(d,centroids[1]),dist(d,centroids[2]),dist(d,centroids[3])];
    return dists.indexOf(d3.min(dists));
}
		      

var maptocentroids = function(d) {
    _.map(d, function(data) {
	data["centroid"] = minDist(data);
	return data;});
}

var analyze = function(d) {
    group1 = _.filter(data, function(d) {return d["centroid"] == 0;});
    group2 = _.filter(data, function(d) {return d["centroid"] == 1;});
    group3 = _.filter(data, function(d) {return d["centroid"] == 2;});
    group4 = _.filter(data, function(d) {return d["centroid"] == 3;});

    totalupperclass = _.filter(data, function(d) {return d["Class"] == 0;});
    upperclass1 = _.filter(group1, function(d) {return d["Class"] == 0;});
    upperclass2 = _.filter(group2, function(d) {return d["Class"] == 0;});
    upperclass3 = _.filter(group3, function(d) {return d["Class"] == 0;});
    upperclass4 = _.filter(group4, function(d) {return d["Class"] == 0;});

    console.log("Percent of people with income greater than 50K: " +
		(totalupperclass.length*100/data.length) + "%");
    console.log("Percent of group 1 with income greater than 50K: " +
		(upperclass1.length*100/group1.length) + "%"); 
    console.log("Percent of group 2 with income greater than 50K: " +
		(upperclass2.length*100/group2.length) + "%"); 
    console.log("Percent of group 3 with income greater than 50K: " +
		(upperclass3.length*100/group3.length) + "%");    
    console.log("Percent of group 3 with income greater than 50K: " +
		(upperclass4.length*100/group4.length) + "%");    
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
    centroids = [rows[parseInt(Math.random() * 32562)], rows[parseInt(Math.random() * 32562)], rows[parseInt(Math.random() * 32562)], rows[parseInt(Math.random() * 32562)]];
    maptocentroids(data);
    analyze(data);
});

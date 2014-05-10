var data = {};

var sex2num = function(d) {
    if (d == "Male") {
	return 0;
    } else {
	return 1;
    }
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

d3.csv("census.data").row(function(d) {
    return {
	Age : parseInt(d["age"]),
	Sex : sex2num(d["sex"]),
	Education : parseInt(d["educationnum"]),
	Spouse : spouse2num(d["maritalstatus"]),
	Race : race2num(d["race"]),
	Class : class2num(d["class"]) };
}).get(function(error, rows) {
    data = rows;
    console.log(data);
});

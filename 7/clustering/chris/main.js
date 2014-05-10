var sexes = ['Male','Female'];
var educations = ['Preschool','1st-4th','5th-6th','7th-8th','9th','10th','11th','12th','HS-grad','Prof-school','Some-college','Assoc-acdm','Assoc-voc','Bachelors','Masters','Doctorate'];
//See http://archive.ics.uci.edu/ml/machine-learning-databases/adult/old.adult.names

d3.csv("census.txt")
    .row(function(d) {
	return {Age: d.age, Sex: function(d.sex) {
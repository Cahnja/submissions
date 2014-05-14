var w  = 1000;
var h  = 1000;
var veclen = 5;
var k = 10;
var means = [];
var data = [];
var clusters = [];
for (var i = 0; i < k; i++) {
    clusters.push([]);
}

function generateMeans() {
    means = [];
    for (var i = 0; i < k; i++) {
        var set = [];
        set.push(Math.round(Math.random() * w));
        set.push(Math.round(Math.random() * h));
        for (var j = 0; j < veclen - 2; j++) {
            set.push(Math.round(Math.random() * 500));
        }
        means.push(set);
    }
}

function drawMeans() {
    var loc = document.getElementById('means');
    loc.innerHTML = "";

    for (var i = 0; i < means.length; i++) {
        var pre = document.createElement('pre');
        pre.innerHTML = means[i];
        pre.style.color = "rgb(" + means[i][2] + "," + means[i][3] + "," + means[i][4] + ")";
        loc.appendChild(pre);
    }
}


function generateDataSet() {
    var img = document.getElementById('imgsrc');
    var imgctx = img.getContext('2d');
    img.width = w;
    img.height = h;
    imgctx.drawImage(document.getElementById('dataimg'), 0, 0);
    imgdata = imgctx.getImageData(0,0,w,h);
    data = [];
    for (var x = 0; x < w; x++) {
        for (var y = 0; y < h; y++) {
            var set = [];
            set.push(x);
            set.push(y);
            set.push(imgdata.data[x*y*4+0]);
            set.push(imgdata.data[x*y*4+1]);
            set.push(imgdata.data[x*y*4+2]);
            data.push(set);
        }
    }
    console.log(data);
}

function calculateClusters() {
    for (var i = 0; i < data.length; i++) {
        var distList = [];
        for (var j = 0; j < means.length; j++) {
            distList.push(dist(means[j], data[i]));
        }
        var smallest = 0;
        for (var j = 0; j < distList.length; j++) {
            if (distList[j] < distList[smallest]) {
                smallest = j;
            }
        }
        clusters[smallest].push(data[i]);
    }
}

function findClosestMean(e) {
    var distList = [];
    for (var j = 0; j < means.length; j++) {
        distList.push(dist(means[j], e));
    }
    var smallest = 0;
    for (var j = 0; j < distList.length; j++) {
        if (distList[j] < distList[smallest]) {
            smallest = j;
        }

    }
    return means[smallest];
}

function drawDataSet() {
    var loc = document.getElementById('data');
    loc.innerHTML = "";
    for (var i = 0; i < clusters.length; i++) {
        for (var j = 0; j < clusters[i].length; j++) {
            var pre = document.createElement('pre');
            pre.style.color = "rgb(" + means[i][2] + "," + means[i][3] + "," + means[i][4] + ")";
            pre.innerHTML = clusters[i][j];
            loc.appendChild(pre);
        }
    }
}

function dist(a, b) {
    var sqsum = 0;
    for (var i = 0; i < a.length; i++) {
        sqsum += Math.pow(b[i] - a[i], 2);
    }
    return sqsum;
}

function meansAsCentroids() {
    var newMeans = [];
    for (var i = 0; i < clusters.length; i++) {
        var sum = [];
        for (var j = 0; j < veclen; j++) {
            sum.push(0);
        }
        for (var j = 0; j < clusters[i].length; j++) {
            for (var k = 0; k < veclen; k++) {
                sum[k] += clusters[i][j][k];
            }
        }
        for (var j = 0; j < veclen; j++) {
            sum[j] /= clusters[i].length;
            sum[j] = Math.round(sum[j]);
        }
        if (!isNaN(sum[0])) {
            newMeans.push(sum);
        }
    }
    means = newMeans;
}
function update() {

    for (var i = 0; i < 10; i++) {
        meansAsCentroids();
        console.log("means updated");
        calculateClusters();
        console.log("Clusters calculated");
    }
    render();
    console.log("done rendering");
}

function render() {
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (var i= 0; i < clusters.length; i++) {
        ctx.fillStyle = "rgb(" + means[i][2] + "," + means[i][3] + "," + means[i][4] + ")"; 
        for (var j = 0; j < clusters[i].length; j++) {
            ctx.fillRect(clusters[i][j][0], clusters[i][j][1], 2, 2);
        }
        ctx.fillStyle = "rgb(0, 255, 0)";
        ctx.fillRect(means[i][0], means[i][1], 10, 10);
    }
}

// Put in the canvas
var canvas = document.getElementById('render');
var ctx = canvas.getContext('2d');
canvas.width = w;
canvas.height = h;
generateMeans();
//drawMeans();
generateDataSet();
calculateClusters();
//drawDataSet();
//drawMeans();
//drawDataSet();


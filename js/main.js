var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var squareVertices = [];
var circleVertices = [];
var x = 400 , y = 400, r = 300;
var n = 360

function interpolate(a, b, frac)
{
    var nx = a[0]+(b[0]-a[0])*frac;
    var ny = a[1]+(b[1]-a[1])*frac;
    return [nx, ny];
}

function d2r(degrees)
{
  // Store the value of pi.
  var pi = Math.PI;
  // Multiply degrees by pi divided by 180 to convert to radians.
  return degrees * (pi/180);
}


ctx.fillRect(x, y,4,4);

for (let i = 0; i < n/4; i++) {
  squareVertices.push([x+r, y-r+2*r*(4*i/n)])
}
for (let i = n/4; i < n/2; i++) {
  squareVertices.push([x+r-2*r*((4*i-n)/n), y+r])
}
for (let i = n/2; i < n*3/4; i++) {
  squareVertices.push([x-r, y+r-2*r*((4*i-2*n)/n)])
}
for (let i = n*3/4; i < n; i++) {
  squareVertices.push([x-r+2*r*((4*i-3*n)/n), y-r])
}

console.log(squareVertices.length)

for (let i = 0; i < n; i++) {
    console.log
    circleVertices.push([x+r*Math.cos(d2r(45-360*(i/n))),y-r*Math.sin(d2r(45-360*(i/n)))])
}

ctx.fillStyle = '#f00';

for (let i = 0; i < n; i++) {
  var point = squareVertices[i]
  ctx.fillRect(point[0], point[1],2,2);
}

// draw both instantly
// for (let i = 0; i < n; i++) {
//   var point = squareVertices[i]
//   ctx.fillRect(point[0], point[1],2,2);
//   sleep(1)
//   point = circleVertices[i]
//   ctx.fillRect(point[0], point[1],2,2);
// }

// show creation
// var progress = 0
// function animate() {
//     if (progress >= 359) {
//         console.log("done") 
//         return;
//     }
//     var point = squareVertices[progress]
//     ctx.fillRect(point[0], point[1],2,2);
//     var point = circleVertices[progress]
//     console.log(point)
//     console.log(progress)
//     ctx.fillRect(point[0], point[1],2,2);
//     progress++
//     setTimeout(animate, 10)
// }

// show morph
var progress = 0
function animate() {
    if (progress >= 0.95) {
        console.log("done") 
        return;
    }
    progress += 0.001
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < n; i++) {
        squareVertices[i] = interpolate(squareVertices[i], circleVertices[i],progress)
        console.log(squareVertices[i])
        var point = squareVertices[i]
        ctx.fillRect(point[0], point[1],2,2);
    }
    setTimeout(animate, 30)
}

setTimeout(animate, 2000)
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var squareVertices = [];
var circleVertices = [];
var x = 400 , y = 400, r = 300;
var cubeLD2 = Math.round(Math.sqrt((r**2)/2))
console.log(cubeLD2)
var n = 360

let grd = ctx.createLinearGradient(x-r, y-r, x+r, y+r);
grd.addColorStop(0, "#F86CA7");
grd.addColorStop(1, "#F4D444");

ctx.fillStyle = grd;

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

function easeInCubic(x) {
    return x * x * x;
}


ctx.fillRect(x, y,4,4);

for (let i = 0; i < n/4; i++) {
  squareVertices.push([x+cubeLD2, y-cubeLD2+2*cubeLD2*(4*i/n)])
}
for (let i = n/4; i < n/2; i++) {
  squareVertices.push([x+cubeLD2-2*cubeLD2*((4*i-n)/n), y+cubeLD2])
}
for (let i = n/2; i < n*3/4; i++) {
  squareVertices.push([x-cubeLD2, y+cubeLD2-2*cubeLD2*((4*i-2*n)/n)])
}
for (let i = n*3/4; i < n; i++) {
  squareVertices.push([x-cubeLD2+2*cubeLD2*((4*i-3*n)/n), y-cubeLD2])
}

for (let i = 0; i < n; i++) {
    console.log
    circleVertices.push([x+r*Math.cos(d2r(45-360*(i/n))),y-r*Math.sin(d2r(45-360*(i/n)))])
}

ctx.beginPath();
var point = circleVertices[0]
ctx.moveTo( point[0], point[1] )
for (let i = 0; i < n; i++) {
  var point = circleVertices[i]
  ctx.lineTo( point[0], point[1] )
}
var point = circleVertices[0]
ctx.lineTo(point[0], point[1])
ctx.closePath();
ctx.fill();

// draw both instantly
// for (let i = 0; i < n; i++) {
//   var point = squareVertices[i]
//   ctx.fillRect(point[0], point[1],2,2);
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

ctx.beginPath();
function animate() {
    if (progress < 0.95) {
        console.log("done") 
        progress += 0.005
    }
    canvas.width = canvas.width; // resets canvas, clearRect doesn't work in this case for sm reason
    ctx.fillStyle = grd; // resetting canvas removes fillStyles
    var point = circleVertices[0]
    ctx.moveTo( point[0], point[1] )
    for (let i = 0; i < n; i++) {
        squareVertices[i] = [x + (squareVertices[i][0]-x)*Math.cos(-Math.PI/360)-(squareVertices[i][1]-y)*Math.sin(-Math.PI/360),
        y + (squareVertices[i][0]-x)*Math.sin(-Math.PI/360)+(squareVertices[i][1]-y)*Math.cos(-Math.PI/360)] // rotates square
        circleVertices[i] = interpolate(circleVertices[i], squareVertices[i],progress)
        var point = circleVertices[i]
        ctx.lineTo( point[0], point[1] )
    }
    var point = circleVertices[0]
    ctx.lineTo(point[0], point[1])
    ctx.closePath();
    ctx.fill();
    setTimeout(animate, 30)
}

setTimeout(animate, 2000)
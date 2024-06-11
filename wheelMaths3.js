canvas = document.getElementById('canvaspiechart'); 
var theThing = document.querySelector("#thing");
var distance = 0;

ctx = canvas.getContext('2d'); 
 
var cx = 400; 
var cy = 350; 
var circleRadius = 300;
var trialData = "Trial no, X, Y, Primary Emotion, Confidence of Primary, Clockwise neighbour, Confidence of clockwise, Anticlockwise neighbour, Confidence of anti-clockwise \n";

var trialCounter = 1;
		 	
var posX = ""; 			 	
var posY = ""; 
var mainEmotion = "";
var emotionConfidense = "";
var clockEmotion = ""; 
var confidenseClockEmotion = ""; 
var antiClockEmotion = ""; 
var confidenseAntiClockEmotion = "";

//add emotions in the array to update circle
var emotionArray = ['sadness', 'disgust', 'anger', 'anticipation', 'joy', 'fear', 'surprise', 'sadness', 'disgust', 'anger', 'anticipation', 'joy', 'fear', 'surprise'];

var anglearray = [];
var sectorsarray = [];

 
function toRadians(deg) { 
return deg * Math.PI / 180 
} 

function splitCircle(sections) {

degreesPerSection = 360/parseInt(sections);
sectionLimit = 0;

for (let i = 0; i < sections+1; i++) {
anglearray[i] = sectionLimit;
sectionLimit += degreesPerSection;

}
 
}

function drawpiechart() { 

for (let i = 0; i < emotionArray.length; i++) {
	
ctx.fillStyle= 'white'; 
ctx.strokeStyle = 'black';
ctx.beginPath(); 
ctx.moveTo(cx,cy); 
ctx.arc(cx,cy,circleRadius ,toRadians(anglearray[i]),toRadians(anglearray[i+1])); 
ctx.lineTo(cx,cy); 
ctx.closePath(); 
ctx.fill();  
ctx.stroke();

var emotion = emotionArray[i];
    
    emotion = {
		start : toRadians(anglearray[i]),
		end : toRadians(anglearray[i+1]),
		name : emotionArray[i]
	};
	
	sectorsarray.push(emotion);
} 

}

splitCircle(emotionArray.length);
drawpiechart()

function isInsideSector(point, center, radius, angle1, angle2) {
  function areClockwise(center, radius, angle, point2) {
    var point1 = {
      x : (center.x + radius) * Math.cos(angle),
      y : (center.y + radius) * Math.sin(angle)
    };

    return -point1.x*point2.y + point1.y*point2.x > 0;
  }

  var relPoint = {
    x: point.x - center.x,
    y: point.y - center.y
  };

  return !areClockwise(center, radius, angle1, relPoint) &&
         areClockwise(center, radius, angle2, relPoint) &&
         (relPoint.x*relPoint.x + relPoint.y*relPoint.y <= radius * radius);
}


$("#canvaspiechart").mousedown(function (e) {
    var canvasOffset = $("#canvaspiechart").offset();
    var offsetX = canvasOffset.left;
    var offsetY = canvasOffset.top;    
    var mouseX = parseInt(e.clientX - offsetX);
    var mouseY = parseInt(e.clientY - offsetY);
    var point = { x: mouseX, y: mouseY };
    var piecenter = { x: cx, y: cy };
    var counter = 0;
    for(var i in sectorsarray){								
		if (isInsideSector(point, piecenter, circleRadius, sectorsarray[i].start, sectorsarray[i].end)) {
			$("#result").html("Click was in " + sectorsarray[i].name + ", x:" + mouseX + ", Y:" + mouseY)
			 getClickPosition(e, mouseX, mouseY);
			 getOriginDistance(parseInt(mouseX), parseInt(mouseY)); 
			// $("#arcDistance").html("sector number: " + (Math.atan2(mouseY - 300, mouseX - 300)*180)/Math.PI);
			
			angle =  ((Math.atan2(mouseY - cy, mouseX - cx)*180)/ Math.PI);
			if (angle < 0) {
				angle = 360 + angle;
			}
			
			angle = angle - (sectorsarray[i].start*(180/Math.PI));
			angle = (angle / (360/sectorsarray.length)) *100;
			
			if (angle < 0) {
				angle = 0;
			}
			
			antiClockNeighbour = i-1;
			if (antiClockNeighbour < 0) {
			antiClockNeighbour =emotionArray.length - 1;
			}
			
			clockNeighbour = parseInt(i)+1;
			if (clockNeighbour > emotionArray.length - 1) {
			clockNeighbour = 0;
			}
			
			var angle2 = 100-parseInt(angle);
				$("#position").html("Trial number: " + trialCounter);
			 	$("#confidence").html("Click is in: <b>" + sectorsarray[i].name + " </b>with a " +distance + "% confidence." );
			 	$("#clockNeighbour").html("Click was : " + parseInt(angle) + "% towards <b>" + emotionArray[clockNeighbour])+"</b>";
			 	$("#antiClockNeighbour").html("Click was : " + parseInt(angle2) + "% towards <b>" + emotionArray[antiClockNeighbour])+"</b>";
		 	
			 	posX = mouseX; 			 	
			 	posY = mouseY; 
			 	mainEmotion = sectorsarray[i].name;
			 	emotionConfidense = distance;
			 	clockEmotion = emotionArray[clockNeighbour]; 
			 	confidenseClockEmotion = parseInt(angle); 
			 	antiClockEmotion = emotionArray[antiClockNeighbour]; 
			 	confidenseAntiClockEmotion = parseInt(angle2);


		} else {
			counter++;
			 getClickPosition(e, mouseX, mouseY);

		}
    }
    if (counter >= sectorsarray.length) {
				$("#position").html("Trial number: " + trialCounter);
        $("#confidence").html("Outside of Circle");
        $("#antiClockNeighbour").html("Outside of Circle ");
			$("#clockNeighbour").html("Outside of Circle ");
    }
});


function getClickPosition(e, a, b) {
     
    theThing.style.left = a-(cx+circleRadius+10) + "px";
    theThing.style.top = b-(cy+circleRadius +50) + "px";
 // 	$("#indicator").html("Location " +  theThing.style.left + "  " +  theThing.style.top);
}

function getOriginDistance(clickX, clickY) {
distance=parseInt(Math.hypot(clickX-cx, clickY-cy)/circleRadius *100);

//getLeftNeighbour(parseInt(Math.hypot(clickX-cx, clickY-cy)));

return distance;
}

/*
function getLeftNeighbour(r) {
	theta = 360 / emotionArray.length;
	distNei= 2 * (Math.PI) * r * (theta)
}

*/

function calcAngleDegrees(x, y) {
  return (Math.atan2(y, x) * 180);
}



 function getPosition(el) {
  var xPos = 0;
  var yPos = 0;
 
  while (el) {
    if (el.tagName == "BODY") {
      // deal with browser quirks with body/window/document and page scroll
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;
 
      xPos += (el.offsetLeft - xScroll + el.clientLeft);
      yPos += (el.offsetTop - yScroll + el.clientTop);
    } else {
      // for all other non-BODY elements
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
    }
 
    el = el.offsetParent;
  }
  return {
    x: xPos,
    y: yPos
  };
}

function writeCSV() {
  const link = document.createElement("a");

         const file = new Blob([trialData], { type: 'text/plain' });
         link.href = URL.createObjectURL(file);
         link.download = "sample.csv";
         link.click();
         URL.revokeObjectURL(link.href);
         trialData = "Trial no, X, Y, Primary Emotion, Confidence of Primary, Clockwise neighbour, Confidence of clockwise, Anticlockwise neighbour, Confidence of anti-clockwise \n";
         trialCounter = 0;
      }
	
	function appendInfo() {
		trialData = trialData.concat(trialCounter, ", " + posX + ", " + posY + ", " + mainEmotion + ", " + emotionConfidense + ", " + clockEmotion + ", " + confidenseClockEmotion + ", " + antiClockEmotion + ", " + confidenseAntiClockEmotion + "\n");	
		$("#position").html("Trial number: " + trialCounter);		
		trialCounter +=1;	
	}

function addLabels(anglearray) {
	i=0;
for (let i = 0; i < anglearray.length - 1; i++) {
var div = document.createElement('div');
div.id = 'emotion' + i;
div.style.position = "absolute";
div.style.left = ((circleRadius +50) * Math.cos(toRadians(anglearray[i]+(360 / emotionArray.length)/2))) +cx + "px"; // Calculate the x position of the text element;
div.style.top = ((circleRadius +30) * Math.sin(toRadians(anglearray[i]+(360 / emotionArray.length)/2))) + cy + "px"; // Calculate the x position of the text element;
div.style.color = 'black';
div.innerHTML = emotionArray[i];
document.body.appendChild(div);

}
}

addLabels(anglearray);

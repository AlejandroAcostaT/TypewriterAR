angular.module('booksAR')

.controller('typewriterController', function(){


	var canvas = document.getElementById("book"),
	ctx = canvas.getContext("2d");


	ctx.fillStyle = "#FF0000";
	ctx.fillRect(0,0,150,75);
	//draw a circle
	ctx.beginPath();
	ctx.arc(394, 510, 40, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();

	this.createPDF = function(){
		// only jpeg is supported by jsPDF
		var imgData = canvas.toDataURL("image/png");
		var pdf = new jsPDF('', 'mm', [canvas.width, canvas.height]);

		pdf.addImage(imgData, 'png', 0, 0, canvas.width, canvas.height);
		//var download = document.getElementById('download');

		pdf.save("download.pdf");
	};

});
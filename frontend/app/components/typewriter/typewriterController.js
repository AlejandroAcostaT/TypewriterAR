angular.module('booksAR')

.controller('typewriterController', function(){

	this.text = '';


	this.createPDF = function(){
		
		var doc = new jsPDF('p','mm','letter'),
		margins = {
			top: 25,
			bottom: 25,
			left: 30,
			right: 30
		};

		doc.text(margins.left, margins.top, "this.text");
		doc.save('test.pdf');
	};

	this.pdf = function(){
		var pdf = new jsPDF('p', 'pt', 'letter')

		// source can be HTML-formatted string, or a reference
		// to an actual DOM element from which the text will be scraped.
		, source = document.getElementById("page")

		// we support special element handlers. Register them with jQuery-style 
		// ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
		// There is no support for any other type of selectors 
		// (class, of compound) at this time.
		, specialElementHandlers = {
		    // element with id of "bypass" - jQuery style selector
		    '#page': function(element, renderer){
		        // true = "handled elsewhere, bypass text extraction"
		        return true
		    }
		}

		margins = {
		  top: 60,
		  bottom: 60,
		  left: 45,
		  right: 45,
		  width: 522
		 };
		 // all coords and widths are in jsPDF instance's declared units
		 // 'inches' in this case
		 pdf.fromHTML(
		    source, // HTML string or DOM elem ref.
		    margins.left, // x coord
		    margins.top, // y coord
		    {
		        'width': margins.width, // max width of content on PDF
		        'elementHandlers': specialElementHandlers
		    },
		    function (dispose) {
		      // dispose: object with X, Y of the last line add to the PDF 
		      //          this allow the insertion of new lines after html
		      pdf.output('dataurlnewwindow');     //opens the data uri in new window

		    },
		    margins
		)
	};

	/*
	var canvas = document.getElementById("book"),
	ctx = canvas.getContext("2d");

	
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(0,0,150,75);
	//draw a circle

	ctx.beginPath();
	ctx.arc(394, 510, 40, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();
	

	ctx.font = "30px Arial";
	ctx.fillText("Hello World",10,50);

	this.createPDF = function(){

		var imgData = canvas.toDataURL("image/png, 1.0");
		
		var pdf = new jsPDF('', 'mm', [canvas.width, canvas.height]);
		
		pdf.addImage(imgData, 'png', 0, 0, canvas.width, canvas.height);
		pdf.internal.scaleFactor = 2.25;
		//var download = document.getElementById('download');

		//pdf.save("download.pdf");
		console.log('Element is ' + offset + ' vertical pixels from <body>');
		//console.log($state.current.url);
	};
	*/

});
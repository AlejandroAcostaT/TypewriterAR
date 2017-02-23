angular.module('booksAR')

.controller('typewriterController', function($scope){

	this.text = '';

	this.paragraphs = [];

	this.pageType = 1;

	this.pageStyle = {
		size: "100%",
		weight: "normal",
		style: "normal",
		font: "times"
	};

	this.image={
		width: 720, //max value
		height: 880, //max value
		left: 0,
		top: 0
	}

	/*-------------Image position and size setings--------------*/

	this.setWidth = function(width){
		if(parseInt(this.image.width) < 720){
			return (width + "px");
		}else{
			this.image.width = 720;
			return (this.image.width + "px");
		}
	};

	this.setHeight = function(height){
		if(parseInt(this.image.height) < 720){
			return (height + "px");
		}else{
			this.image.height = 880;
			return (this.image.height + "px");
		}
	};

	this.setMarginLeft = function(left){
		if(parseInt(this.image.width + left) < 720){
			return (left + "px");
		}else{
			this.image.left = (720 - this.image.width);
			return (this.image.left + "px");
		}
		
	};

	this.setMarginTop = function(top){
		if(parseInt(this.image.height + top) < 880){
			return (top + "px");
		}else{
			this.image.top = (880 - this.image.height);
			return (this.image.top + "px");
		}
	};

	/*-------------Page Settings--------------*/

	this.isSelected = function(pageType){
		return this.pageType == pageType;
	};

	this.setPageType = function(pageType){
		this.pageType = pageType;
	}

	/*-------------Text Analysis--------------*/
	this.isExtra = function(index){
		var limit = document.getElementById("page").getBoundingClientRect().bottom - 45,
		rect = document.getElementById("page").getElementsByTagName("P")[index].getBoundingClientRect(),
		length = this.paragraphs.length;
		if(rect.bottom > limit){
			this.paragraphs.splice(index, length-index);
			return false;
		}else{
			return true;
		}		
	};

	this.textAnalysis = function(){
		this.paragraphs = this.text.split(/\r\n|\r|\n/g);
	};

	/*-------------PDF Creation--------------*/

	this.pdfImage = function(){
		var pdf = new jsPDF('p', 'pt', 'letter')

		// source can be HTML-formatted string, or a reference
		// to an actual DOM element from which the text will be scraped.
		, imgData = document.getElementById("img")

		// we support special element handlers. Register them with jQuery-style 
		// ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
		// There is no support for any other type of selectors 
		// (class, of compound) at this time.
		, specialElementHandlers = {
		    // element with id of "bypass" - jQuery style selector
		    
		}

		margins = {
		  top: 60,
		  bottom: 50,
		  left: 35,
		  right: 35,
		  width: 540
		 },

		image = {
			width: this.image.width*0.75,
			height: this.image.height*0.75,
			left: (this.image.left*0.75) + margins.left,
			top: (this.image.top*0.75) + margins.top
		};
		pdf.addImage(imgData, 'JPEG', image.left, image.top, image.width, image.height);
		pdf.output('dataurlnewwindow');     //opens the data uri in new window
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
		    
		}

		margins = {
		  top: 60,
		  bottom: 50,
		  left: 35,
		  right: 35,
		  width: 540
		 };

		 console.log(source);

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
		      
		    },
		    margins
		);

		/*pdf.addPage();
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
		    },
		    margins
		);*/

		//console.log(pdf.getFontList());
		pdf.output('dataurlnewwindow');     //opens the data uri in new window
	};

	

});
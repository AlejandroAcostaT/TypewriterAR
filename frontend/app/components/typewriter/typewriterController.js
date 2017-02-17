angular.module('booksAR')

.controller('typewriterController', function(){

	this.text = '';

	this.paragraphs = [];

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
		  bottom: 50,
		  left: 40,
		  right: 40,
		  width: 530
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


		pdf.output('dataurlnewwindow');     //opens the data uri in new window
	};

	

});
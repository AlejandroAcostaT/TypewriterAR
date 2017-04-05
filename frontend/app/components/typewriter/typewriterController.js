angular.module('booksAR')

.controller('typewriterController', function($scope, $state, Upload, sessionService, tokenService, verifySession, Book){

	this.text = '';

	this.title = '';

	this.paragraphs = [];

	this.pageType = 1;

	this.pageStyle = {
		textSize: "100%",
		titleSize: "270%",
		weight: "normal",
		style: "normal",
		textFont: "times",
		titleFont: "times"
	};

	this.image={
		width: 720, //max value
		height: 880, //max value if page type is only image (2)
		left: 0,
		top: 0
	};

	this.page = {
			pageType: 1,
			text: '',
			paragraphs: '',
			title: '',
			pageStyle: {
				textSize: "100%",
				titleSize: "270%",
				weight: "normal",
				style: "normal",
				textFont: "times",
				titleFont: "times"
			},
			image: {
				width: 720, //max value
				height: 880, //max value if page type is only image (2)
				left: 0,
				top: 0
			}
		};

	this.pages = [];

	this.currentPage = 1;
	this.pastPage = 1;

	//pages definition and load
	if(Book.pages.length == 0){
		var newPage = angular.copy(this.page);
		this.pages.push(newPage);
	}else{
		this.pages = angular.copy(Book.pages);
		//verify when not empty asign this.page to first page on pages
	}


	//logout function
	this.logOut = function(){
		sessionService.logOut();
	};


	/*-------------Add & Delete Pages--------------*/
	//Add page
	this.addPage = function(){

		var newPage = angular.copy(this.page);
		angular.copy(newPage, this.pages[this.pastPage-1]);

		var emptyPage = {
			pageType: 1,
			text: '',
			paragraphs: '',
			title: '',
			pageStyle: {
				textSize: "100%",
				titleSize: "270%",
				weight: "normal",
				style: "normal",
				textFont: "times",
				titleFont: "times"
			},
			image: {
				width: 720, //max value
				height: 880, //max value if page type is only image (2)
				left: 0,
				top: 0
			}
		};

		this.pages.push(emptyPage);

		angular.copy(emptyPage, this.page);
		this.currentPage = this.pages.length;
		this.pastPage = this.currentPage;
	};

	//Delete Page
	this.deletePage = function(){
		if(this.pages.length == 1){
			this.pages.splice(this.currentPage-1, 1);
			var emptyPage = {
				pageType: 1,
				text: '',
				paragraphs: '',
				title: '',
				pageStyle: {
					textSize: "100%",
					titleSize: "270%",
					weight: "normal",
					style: "normal",
					textFont: "times",
					titleFont: "times"
				},
				image: {
					width: 720, //max value
					height: 880, //max value if page type is only image (2)
					left: 0,
					top: 0
				}
			};

			this.pages.push(emptyPage);
			angular.copy(emptyPage, this.page);
			this.currentPage = this.pages.length;
			this.pastPage = this.currentPage;
		}else{
			if(this.currentPage == this.pages.length){

				this.pages.splice(this.currentPage-1, 1);
				this.currentPage = this.currentPage -1;
				angular.copy(this.pages[this.currentPage-1], this.page);
				this.pastPage = this.currentPage;
			}else{

				this.pages.splice(this.currentPage-1, 1);
				angular.copy(this.pages[this.currentPage-1], this.page);
				this.pastPage = this.currentPage;

			}
		}
		
		
	};

	this.updatePage = function(){
		var newPage = angular.copy(this.page);
		angular.copy(newPage, this.pages[this.pastPage-1]);

		angular.copy(this.pages[this.currentPage-1], this.page);
		this.pastPage = this.currentPage;
	};

	/*-------------Image position and size setings--------------*/

	this.setWidth = function(width){
		if(parseInt(this.page.image.width) < 720){
			return (width + "px");
		}else{
			this.page.image.width = 720;
			return (this.page.image.width + "px");
		}
	};

	this.setHeight = function(height){
		if(this.page.pageType == 2){
			//page type is only image
			if(parseInt(this.page.image.height) < 880){
				return (height + "px");
			}else{
				this.page.image.height = 880;
				return (this.page.image.height + "px");
			}

		}else if(this.page.pageType == 5){
			//page type is title & image
			var lines = this.title.split(/\r\n|\r|\n/g),
			space = 0,
			newHeight = 0;
			//default size with 1 line
			lines = lines.length - 1;


			switch(this.page.pageStyle.titleSize) {
			    case '270%': //26
			        space = 40;
			        newHeight = 820;
			        break;
			    case '280%': //28
			        space = 42;
			        newHeight = 815;
			        break;
			    case '290%': //30
			        space = 44;
			        newHeight = 815;
			        break;
			    case '300%': //32
			        space = 46;
			        newHeight = 813;
			        break;
			    case '320%': //34
			        space = 47;
			        newHeight = 811;
			        break;
			    case '350%': //36
			        space = 52;
			        newHeight = 806;
			        break;
			}


			if(parseInt(this.page.image.height) < (newHeight - space*lines)){
				return (height + "px");
			}else{
				this.page.image.height = (newHeight - space*lines);
				return (this.page.image.height + "px");
			}
		}
		
	};

	this.setMarginLeft = function(left){
		if(parseInt(this.page.image.width + left) < 720){
			return (left + "px");
		}else{
			this.page.image.left = (720 - this.page.image.width);
			return (this.page.image.left + "px");
		}
		
	};

	this.setMarginTop = function(top){
		if(this.page.pageType == 2){
			if(parseInt(this.page.image.height + top) < 880){
				return (top + "px");
			}else{
				this.page.image.top = (880 - this.page.image.height);
				return (this.page.image.top + "px");
			}
		}else if(this.page.pageType == 5){
			//page type is title & image
			var lines = this.page.title.split(/\r\n|\r|\n/g),
			space = 0,
			newHeight = 0;
			//default size with 1 line
			lines = lines.length - 1;


			switch(this.page.pageStyle.titleSize) {
			    case '270%': //26
			        space = 40;
			        newHeight = 820;
			        break;
			    case '280%': //28
			        space = 42;
			        newHeight = 815;
			        break;
			    case '290%': //30
			        space = 44;
			        newHeight = 815;
			        break;
			    case '300%': //32
			        space = 46;
			        newHeight = 813;
			        break;
			    case '320%': //34
			        space = 47;
			        newHeight = 811;
			        break;
			    case '350%': //36
			        space = 52;
			        newHeight = 806;
			        break;
			}


			if(parseInt(this.page.image.height + top) < (newHeight - space*lines)){
				return (top + "px");
			}else{
				this.page.image.top = ((newHeight - space*lines) - this.page.image.height);
				return (this.page.image.top + "px");
			}
		}
	};

	/*-------------Page Settings--------------*/

	this.isSelected = function(pageType){
		return this.page.pageType == pageType;
	};

	this.setPageType = function(pageType){
		this.page.pageType = pageType;
		// Text Only
		if(pageType == 1){
			this.page.pageStyle.textSize = "100%";
		}
		// Image Only
		if(pageType == 2){
			this.page.image.height = 880;
		}
		// Title Only
		if(pageType == 3){
			this.page.pageStyle.titleSize = "270%";
		}
		// Title & Text
		if(pageType == 4){
			this.page.pageStyle.textSize = "100%";
			this.page.pageStyle.titleSize = "270%";
		}
		// Title & Image
		if(pageType == 5){
			this.page.pageStyle.titleSize = "270%";
			this.page.image.height = 820;
		}
	}

	/*-------------Text Analysis--------------*/
	this.isExtra = function(index){
		var limit = document.getElementById("page").getBoundingClientRect().bottom - 45,
		rect = document.getElementById("page").getElementsByTagName("P")[index].getBoundingClientRect(),
		length = this.page.paragraphs.length;
		if(rect.bottom > limit){
			this.paragraphs.splice(index, length-index);
			return false;
		}else{
			return true;
		}		
	};

	this.textAnalysis = function(){
		this.page.paragraphs = this.page.text.split(/\r\n|\r|\n/g);
	};

	/*-------------PDF Creation--------------*/
	
	//Only Text
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
		  top: 65,
		  bottom: 50,
		  left: 35,
		  right: 35,
		  width: 540
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

		//console.log(pdf.getFontList());
		pdf.output('dataurlnewwindow');     //opens the data uri in new window
	};

	//Only Image
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
		  top: 65,
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

	//Only Title
	this.pdfTitle = function(){
		var pdf = new jsPDF('p', 'pt', 'letter')

		// we support special element handlers. Register them with jQuery-style 
		// ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
		// There is no support for any other type of selectors 
		// (class, of compound) at this time.
		, specialElementHandlers = {
		    // element with id of "bypass" - jQuery style selector
		    
		}

		margins = {
		  top: 65,
		  bottom: 50,
		  left: 35,
		  right: 35,
		  width: 540
		},

		linesOffset = 0;


		//Font Size
		if(this.pageStyle.titleSize == "270%"){
			pdf.setFontSize(26);
			linesOffset = 32;
		}
		if(this.pageStyle.titleSize == "280%"){
			pdf.setFontSize(28);
			linesOffset = 34;
		}
		if(this.pageStyle.titleSize == "290%"){
			pdf.setFontSize(30);
			linesOffset = 36;
		}
		if(this.pageStyle.titleSize == "300%"){
			pdf.setFontSize(32);
			linesOffset = 38;
		}
		if(this.pageStyle.titleSize == "320%"){
			pdf.setFontSize(34);
			linesOffset = 40;
		}
		if(this.pageStyle.titleSize == "350%"){
			pdf.setFontSize(36);
			linesOffset = 42;
		}
		
		//Font Family
		pdf.setFont(this.pageStyle.titleFont);


		/*************** Center Text in Page********************/
		var splitTitle = pdf.splitTextToSize(this.title, 540),
		lines = Math.floor(splitTitle.length / 2),
		xOffset = 0,
		yOffset = (pdf.internal.pageSize.height / 2) - (lines * linesOffset);
		yOffset = yOffset > 0 ? yOffset : margins.top;

		for(var i=0; i<splitTitle.length; i++){
			//Calculate Center
			//Center Horizontal
			xOffset = (pdf.internal.pageSize.width / 2) - (pdf.getStringUnitWidth(splitTitle[i]) * pdf.internal.getFontSize() / 2);
			xOffset = xOffset > 0 ? xOffset : margins.left;

			//Write Title
			console.log(pdf.internal.getFontSize());

			pdf.text(splitTitle[i], xOffset, yOffset);

			yOffset += linesOffset;
		}

		pdf.output('dataurlnewwindow');     //opens the data uri in new window

	};

	//Title & Text
	this.pdfTitleText = function(){
		var pdf = new jsPDF('p', 'pt', 'letter'),
		source = document.getElementById("page"),

		// we support special element handlers. Register them with jQuery-style 
		// ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
		// There is no support for any other type of selectors 
		// (class, of compound) at this time.
		specialElementHandlers = {
		    // element with id of "bypass" - jQuery style selector
		}

		margins = {
		  top: 85,
		  bottom: 50,
		  left: 35,
		  right: 35,
		  width: 540
		},

		linesOffset = 0;


		//Title Font Size
		if(this.pageStyle.titleSize == "270%"){
			pdf.setFontSize(26);
			linesOffset = 32;
		}
		if(this.pageStyle.titleSize == "280%"){
			pdf.setFontSize(28);
			linesOffset = 34;
		}
		if(this.pageStyle.titleSize == "290%"){
			pdf.setFontSize(30);
			linesOffset = 36;
		}
		if(this.pageStyle.titleSize == "300%"){
			pdf.setFontSize(32);
			linesOffset = 38;
		}
		if(this.pageStyle.titleSize == "320%"){
			pdf.setFontSize(34);
			linesOffset = 40;
		}
		if(this.pageStyle.titleSize == "350%"){
			pdf.setFontSize(36);
			linesOffset = 42;
		}
		
		//Title Font Family
		pdf.setFont(this.pageStyle.titleFont);


		/*************** Center Text in Page********************/
		var splitTitle = pdf.splitTextToSize(this.title, 540),
		lines = Math.floor(splitTitle.length / 2),
		xOffset = 0,
		yOffset = margins.top;

		for(var i=0; i<splitTitle.length; i++){
			//Calculate Center
			//Center Horizontal
			xOffset = (pdf.internal.pageSize.width / 2) - (pdf.getStringUnitWidth(splitTitle[i]) * pdf.internal.getFontSize() / 2);
			xOffset = xOffset > 0 ? xOffset : margins.left;

			//Write Title
			pdf.text(splitTitle[i], xOffset, yOffset);

			yOffset += linesOffset;
		}

		yOffset -= linesOffset*2; //reset margin top to fit page

		// Text Printing
		pdf.fromHTML(
		    source, // HTML string or DOM elem ref.
		    margins.left, // x coord
		    yOffset - 15, // y coord
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

		pdf.output('dataurlnewwindow');     //opens the data uri in new window

	};


	// Title & Image
	this.pdfTitleImage = function(){

		var pdf = new jsPDF('p', 'pt', 'letter')

		// we support special element handlers. Register them with jQuery-style 
		// ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
		// There is no support for any other type of selectors 
		// (class, of compound) at this time.
		, specialElementHandlers = {
		    // element with id of "bypass" - jQuery style selector
		    
		}

		margins = {
		  top: 85,
		  bottom: 50,
		  left: 35,
		  right: 35,
		  width: 540
		},

		linesOffset = 0,

		imgData = document.getElementById("img"),

		image = {
			width: this.image.width*0.75,
			height: this.image.height*0.75,
			left: (this.image.left*0.75) + margins.left,
			top: (this.image.top*0.75)
		};

		//Font Size
		if(this.pageStyle.titleSize == "270%"){
			pdf.setFontSize(26);
			linesOffset = 32;
		}
		if(this.pageStyle.titleSize == "280%"){
			pdf.setFontSize(28);
			linesOffset = 34;
		}
		if(this.pageStyle.titleSize == "290%"){
			pdf.setFontSize(30);
			linesOffset = 36;
		}
		if(this.pageStyle.titleSize == "300%"){
			pdf.setFontSize(32);
			linesOffset = 38;
		}
		if(this.pageStyle.titleSize == "320%"){
			pdf.setFontSize(34);
			linesOffset = 40;
		}
		if(this.pageStyle.titleSize == "350%"){
			pdf.setFontSize(36);
			linesOffset = 42;
		}

		image.top += linesOffset;
		
		//Font Family
		pdf.setFont(this.pageStyle.titleFont);


		/*************** Center Text in Page********************/
		var splitTitle = pdf.splitTextToSize(this.title, 540),
		lines = Math.floor(splitTitle.length / 2),
		xOffset = 0,
		yOffset = margins.top;
		//yOffset = yOffset > 0 ? yOffset : margins.top;

		for(var i=0; i<splitTitle.length; i++){
			//Calculate Center
			//Center Horizontal
			xOffset = (pdf.internal.pageSize.width / 2) - (pdf.getStringUnitWidth(splitTitle[i]) * pdf.internal.getFontSize() / 2);
			xOffset = xOffset > 0 ? xOffset : margins.left;

			//Write Title
			pdf.text(splitTitle[i], xOffset, yOffset);

			yOffset += linesOffset;
		}

		yOffset -= linesOffset;

		pdf.addImage(imgData, 'JPEG', image.left, yOffset + image.top, image.width, image.height+14); //+14 is to set image height in proportion to web page

		pdf.output('dataurlnewwindow');     //opens the data uri in new window

	};

	/*-------------Files Input--------------*/


	// upload later on form submit or something similar
    this.submit = function() {
      if ($scope.form.file.$valid && $scope.file) {
        $scope.upload($scope.file);
      }
    };

    // upload on file select or drop
    this.upload = function (file) {
        Upload.upload({
            url: '',
            data: {file: file}
        }).then(function (resp) {
            console.log('Success');
        }, function (resp) {
            console.log('Error status: ');
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };
    // for multiple files:
    /*
    this.uploadFiles = function (files) {
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          Upload.upload({..., data: {file: files[i]}, ...})...;
        }
        // or send them all together for HTML5 browsers:
        Upload.upload({..., data: {file: files}, ...})...;
      }
    }
    */

    //verify user has logged in
	if(verifySession){
		$state.go('home');
	}

});
const userId_input = document.getElementById("search-field");
let userId;
let userProfileLink;
let userPage;
let data;
let correctAnswer=0;
let wrongAnswer=0;
let others =0;
let timeLimitExceeded=0;
let runTimeError =0;

$("#submissions-chart").hide();

// function DrawChart(correctAnswer, wrongAnswer, timeLimitExceeded, runTimeError, others){
function DrawChart(){

	am4core.useTheme(am4themes_kelly);
	am4core.useTheme(am4themes_animated);
	// Themes end

	// Create chart instance
	var chart = am4core.create("submissions-chart", am4charts.PieChart);

	// Add data
	chart.data = [ {result:"Correct Answer", number: correctAnswer ,numbe: correctAnswer},
	 				{result:"Wrong Answer", number: wrongAnswer, numbe: wrongAnswer},
	 				{result:"TLE", number: timeLimitExceeded, numbe: timeLimitExceeded},
	 				{result:"RTE", number: runTimeError, numbe: runTimeError},
	 				{result:"Others", number: others, numbe: others}
	 				];

	// Add and configure Series
	var pieSeries = chart.series.push(new am4charts.PieSeries());
	pieSeries.dataFields.value = "number";
	pieSeries.dataFields.category = "result";
	pieSeries.slices.template.stroke = am4core.color("#fff");
	pieSeries.slices.template.strokeWidth = 1;
	pieSeries.slices.template.strokeOpacity = 2;

	// This creates initial animation
	pieSeries.hiddenState.properties.opacity = 1;
	pieSeries.hiddenState.properties.endAngle = -90;
	pieSeries.hiddenState.properties.startAngle = -90;
	$("#submissions-chart").show();
}

function CalculateStats(userId, userProfileLink){
	let pages;
	$.ajax({
    url: "https://cors-anywhere.herokuapp.com/"+userProfileLink+'1', 
    data: {value: 1},
    type: 'get',
    error: function(XMLHttpRequest, textStatus, errorThrown){
        // alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
        alert(`User Id ${userId} Not found`)
    },
    success: function(page_data){
        	data = page_data.substring(page_data.indexOf('<body>'),page_data.length)
        	userPage = jQuery(data)
			pages = jQuery(userPage.find('.pagination').find('ul').find('li').find('.page-index')[jQuery(userPage.find('.pagination').find('ul').find('li').find('.page-index')).length-1]).text()
        	console.log(pages)
        	console.log("hello"+pages)
			for(let pageIndex=1;pageIndex<=parseInt(pages);pageIndex++){
				console.log("pagenumber"+pageIndex);
		        $.ajax({
				    url: "https://cors-anywhere.herokuapp.com/"+userProfileLink+'1', 
				    data: {value: 1},
				    type: 'get',
				    error: function(XMLHttpRequest, textStatus, errorThrown){
				        // alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
				        alert(`User Id ${userId} Not found`)
				    },
				    success: function(page_data, status){
		        		// console.log("Data: "+page_data+"\nStatus: "+status)
		        		data = page_data.substring(page_data.indexOf('<body>'),page_data.length)
		        		userPage = jQuery(data)
		        		let table_array = userPage.find(".status-frame-datatable").find('tr');
		        		for(let i=1;i<table_array.length;i++){
		        			let table_cells = jQuery(table_array[i]).find('td')
		        			console.log(jQuery(jQuery(table_cells[5]).find('span')).attr('submissionverdict'));
		        			switch(jQuery(jQuery(table_cells[5]).find('span')).attr('submissionverdict')){
		        				case "TIME_LIMIT_EXCEEDED":
		        					timeLimitExceeded++;
		        					break;
		        				case "WRONG_ANSWER":
		        					wrongAnswer++;
		        					break;
		        				case "OK":
		        					correctAnswer++;
		        					break;
		        				case "RUNTIME_ERROR":
		        					runTimeError++;
		        					break;
		        				default:
		        					others++;
		        			}
		        			// console.log(timeLimitExceeded);
		        			// console.log(table_cells.length);
		        			// jQuery(table_row[j]).
		        			// break;
			        	}
			        	if(pageIndex==parseInt(pages))
		    		    	DrawChart();
			        }
		        });
		    }
        }
});

    
    // console.log(timeLimitExceeded);
    // console.log(wrongAnswer);
    // console.log(correctAnswer);
    // console.log(runTimeError);
    // console.log(others);
    // callback(correctAnswer, wrongAnswer, timeLimitExceeded, runTimeError, others);
    // callback();
}

// jQuery(userPage.find('.pagination').find('ul').find('li')[userPage.find('.pagination').find('ul').find('li').length-1]).text()
$("#search-button").click( 
    function() {
        userId = userId_input.value;
        userProfileLink = `https://codeforces.com/submissions/${userId}/page/`;
        console.log(userProfileLink);
        CalculateStats(userId, userProfileLink)
    });

$("h1").click(function(){
	console.log(timeLimitExceeded);
	    console.log(wrongAnswer);
	    console.log(correctAnswer);
	    console.log(runTimeError);
	    console.log(others);
	    DrawChart();
})


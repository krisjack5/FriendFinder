//single controller object to control both home and survey html pages.
var controlLogic = {
	init: function () {
		this.cacheDom();
		this.bindEvents();
	}, 
	cacheDom: function() {
		this.$submit = $("#submit");
		this.$apiLink = $("#apiFriend");
	},
	bindEvents: function() {
		this.$submit.on("click", this.apiFriendPost);
		this.$apiLink.on("click", this.apiFriendReq);
	},
	apiFriendReq: function() {
		// Here we get the location of the root page.
      	// We use this instead of explicitly saying the URL is localhost:3001 because the url will change when we deploy.
      	var currentURL = window.location.origin;

		// The AJAX function uses the URL of our home and routes it to the survey page.
		$.ajax({ url: currentURL + "/api/friends", method: "GET" })
	      .done(function(data) {
	      	console.log(data);
	        // Here we are logging the URL so we have access to it for troubleshooting
	        console.log("------------------------------------");
	        console.log("URL: " + currentURL + "/survey");
	        console.log("------------------------------------");
	      });
	},
	apiFriendPost: function() {
		// Form validation
		function validateForm() {
		var isValid = true;
		$('.form-control').each(function() {
		if ( $(this).val() === '' )
		    isValid = false;
		});

		$('.chosen-select').each(function() {

		  if( $(this).val() === "")
		      isValid = false
		  });
		  return isValid;
		}
	    // If all required fields are filled
	    if (validateForm() == true)
	    {
	        // Here we get the location of the root page.
	      	// We use this instead of explicitly saying the URL is localhost:3001 because the url will change when we deploy.
	      	var currentURL = window.location.origin;
			// Here we grab the form elements
			var newFriend = {
			name: $("#name").val().trim(),
			photo: $("#photo").val().trim(),
			scores: [$("#q1").val()
				   ,$("#q2").val()
				   ,$("#q3").val()
				   ,$("#q4").val()
				   ,$("#q5").val()
				   ,$("#q6").val()
				   ,$("#q7").val()
				   ,$("#q8").val()
				   ,$("#q9").val()
				   ,$("#q10").val()
				   ]
			}
	        // AJAX post the data to the friends API. 
	        // Also logic for determining matched person!
	        $.post("/api/friends", newFriend)
	        .done(function(data){
	        	//console.log(data.length);
	        	var compatibilityArr = [];
	        	var sum = 0;
	        	var minOfSum = 0;
	        	var newPerson = data[data.length - 1];
	        	//loop up to the last index, i.e. data.length-2
	        	//last index is newly added person to match.
	        	for(var i = 0; i < data.length - 2; i++){
	        		for(var j = 0; j < data[i].scores.length; j++){
	        			sum += Math.abs(parseInt(data[i].scores[j]) - 
	        						    parseInt(newPerson.scores[j]));
	        		}
	        		compatibilityArr.push(sum);
	        		//reset the sum
	        		sum = 0;
	        	}
	        	//variable to hold the minimum of compatibility array, i.e. matched person!
	            minOfSum = Math.min.apply(null, compatibilityArr);	        	
	        	//loop through the archived compabilityArr, which holds the total summation 
	        	//all the scores. 
	        	for (var m = 0; m < compatibilityArr.length; m++) {
	        		//conditional to find the matched person, then render!
	        		if(compatibilityArr[m] === minOfSum){
	        			$("#matchName").text(data[m].name);
						$('#matchImg').attr("src", data[m].photo);
						$("#resultsModal").modal('toggle');
						//exit loop.
						return true;
	        		}
	        	}
	        });
	    }
	    else 
	    {
	      alert("Please fill out all fields before submitting!");
	    }
	}
}

$(document).ready(function(){
	console.log("linked!");
	//initiate the object.
	controlLogic.init();
});
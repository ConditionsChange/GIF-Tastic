//Initialize Variables
var tvshows = ["Spongebob","Simpsons","Rugrats","Pokemon", "The Flintstones","Futurama","Family Guy","Dragon Ball Z","South Park","Looney Tunes","The Powerpuff Girls","Dexter's Laboratory","Duck Tails","Teen Titans","Doug"];
var gifs; //variable to hold the JSON object that is returned from the GIPHY API


$(document).ready(function(){

	//function to show buttons on the page
	function addButton(buttonName){
		var newButton = $("<button>");
		newButton.html(buttonName);
		newButton.attr("class","newsearches button row btn btn-primary");
		newButton.css("margin","2px");
		$("#button-row").append(newButton);	
	}

	//show the preloaded tvshow buttons onto the page
	for (var i=0;i<tvshows.length;i++){
		addButton(tvshows[i]);
	}

	//add user created buttons from the input
	$("#search").on("click",function(event){
		event.preventDefault();	
		var input = $("input").val().trim();
		//perform regex and capitalize the first letter of every word
		if (/^[a-zA-Z\s]+$/.test(input)){
			var firstLetterCaps = input.split(" ");
			for (var i=0;i<firstLetterCaps.length;i++){
				firstLetterCaps[i] = firstLetterCaps[i].charAt(0).toUpperCase() + firstLetterCaps[i].substring(1);
			};
			addButton(firstLetterCaps.join(" "));
		};
		$("input").val("");
	});


	//query the GIPHY API when any of the tvshow buttons are clicked 
	$(document).on("click",".newsearches",function(){
		$("#loaded-gifs").html(""); //clear the loaded gifs div
		var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + $(this).html().toLowerCase() + "&api_key=dc6zaTOxFJmzC";
		$.ajax({
		  url: queryURL,
		  method: 'GET'
		}).done(function(response) {
		  gifs = response.data; //store the JSON object in this variable
		  var count = 0; //counter to determine if any GIFs were found when querying the GIPHY API
		  if (gifs.length > 0){
			  console.log(response.data);
			  //append GIFs onto the page with their ratings
			  for (var i=0;i<=14;i++){
				  	if (gifs[i].rating !=="pg-13" & gifs[i].rating !=="r"){ //filter out gifs
					  	//create a new div and append the rating and image onto it
					  	var newdiv = $("<div>");
					  	newdiv.attr({style:"display:inline-block;text-align:center;margin:2px"});
					  	var newgif = $("<img>");
					  	newgif.attr({class:"gif",playing:"no",val:i,src:gifs[i].images.fixed_height_small_still.url});
					  	newdiv.append("<h4>Rating: " + gifs[i].rating.toUpperCase() + "</h4>");
					  	newdiv.append(newgif);
					  	$("#loaded-gifs").append(newdiv);
					  	count++;
				  	};
				  };
				};
			  if (count===0){
			  		$("#loaded-gifs").html("<h3>There are no GIFs to display</h3>");	
			  };
		}).fail(function(xhr, status, error) {
	        console.log(error);
	        $("#loaded-gifs").html("<h3>There was an error retreiving the GIFs</h3>");
    	});
	});


	//play and stop gifs when the user clicks them by changing their src attribute
	$(document).on("click",".gif",function(){
			var isplaying = $(this).attr("playing"); //the playing attribute determines of the GIF is currently playing or not
			var gifid = $(this).attr("val"); //the val attribute determines which GIF to play or pause
			if (isplaying==="no"){
				$(this).attr("src",gifs[gifid].images.fixed_height_small.url);
				$(this).attr("playing","yes");			
			}
			else{
				$(this).attr("src",gifs[gifid].images.fixed_height_small_still.url);	
				$(this).attr("playing","no");									
			};
	});

});

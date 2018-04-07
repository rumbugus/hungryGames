var arrSelectedPlaces =[]; /// contains place_id, place_name, place coordinates 



  function isIdInArray(array, item) {
          for (var i = 0; i < array.length; i++) {
            //if id in array => true
            if (array[i][0] == item) {
              return true; 
            }
          }
          return false; 
        }


function getSelectedList(){

	$('.ajaxProgress').show();
	$.ajax({
		type: "GET",
		url: 'getSelectedList/',
		dataType: "json",
		async: true,
		data: {csrfmiddlewaretoken: '{{ csrf_token}}'},
		success: function (json){ 
              ///check if the div contains an element with this id. If yes, check if the nbr of votes is the same. If not update the nbr. 
              ///If not append  

              for(i = 0; i<json.message.length; i++){
              	var placeVotes = json.message[i][2];
              	var placeName= json.message[i][0];
              	var placeID = json.message[i][1];

                ///if place not in array, push it into array


                if(isIdInArray(arrSelectedPlaces, placeID) == false){
                  var arrTemp = [placeID, placeName];
                  arrSelectedPlaces.push(arrTemp);

                    	console.log("adding new place"+placeName);
                    	const listElement = document.createElement("li");
                    	$(listElement).append(
                    		 "&nbsp;<a href='#' class='flag-button'><span class='glyphicon glyphicon-flag'></span></a>"+
                  "&nbsp;<a href='#' class='flag-button'><span class='glyphicon glyphicon-info-sign info-button' data-toggle='modal'></span></a>&nbsp;"
                    		);
                    	listElement.id = placeID + "voting";
                    	listElement.classList.add('place-list-item');

                    	const votesDisplay = document.createElement("span");
                    	votesDisplay.id = placeID+"votes";
                    	votesDisplay.classList.add('place-list-votes', 'align-right');
                    	const content = document.createTextNode(placeVotes);
                    	votesDisplay.appendChild(content);

                    	const placeNameNode = document.createTextNode(placeName);

                    	listElement.appendChild(placeNameNode);
                    	$(listElement).append("<a class='minus-button align-right enabled-button' href='#'><span class='glyphicon glyphicon-thumbs-down' aria-hidden='true'></span></a>&nbsp;");        	
                    	listElement.appendChild(votesDisplay);
                    	$(listElement).append("<a class='plus-button align-right enabled-button' href='#'><span class='glyphicon glyphicon-thumbs-up' aria-hidden='false'></span>&nbsp;</a>&nbsp;");

                    	$('#selectedPlacesList').append(listElement);

                    ///find place by place id and create marker using that place
                    var place = searchResults.find(x => x.id == placeID);
                    console.log("Found place by ID: " + placeID +"  "+ place.name);

                    createMarker(place);


                  }else{
                  	var displayedVotes = document.getElementById(placeID+"votes");
                  //	console.log($(displayedVotes).text());
                  	if ($(displayedVotes).text() != placeVotes){
                  		console.log($(displayedVotes).text()+placeVotes+"updating" +i);
                  		$(displayedVotes).text(placeVotes) ;
                  	}
                  }       
              }
          }
      });
}




function getWinner(){

  $('.ajaxProgress').show();
  $.ajax({
    type: "GET",
    url: 'getWinner/',
    dataType: "json",
    async: true,
    data: {csrfmiddlewaretoken: '{{ csrf_token}}'},
    success: function (json){ 
          console.log("Get winner was fucking called");
          clearVotes();

          document.getElementById('winner').innerHTML= "The masses have spoken! </br> We're going to... </br> <span id='restaurant-name'>"+ json.message +"</span>";
          document.getElementById('winner').classList.add('winnerDisplayed');
          document.getElementById('voteHere-text').innerHTML = " - Winner - "

          }
      });
}



function clearVotes(){
  var myNode = document.getElementById("selectedPlacesList");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
}


getSelectedList();

var myVar = setInterval(function(){
  getSelectedList()}, 1000);


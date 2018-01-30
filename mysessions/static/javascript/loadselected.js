var arrSelectedPlaces =[];


  $( function() {
    $( "#tabs" ).tabs();
  } );


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
                if(arrSelectedPlaces.indexOf(placeID) == -1){
                	var arrTemp = [placeID, placeName];
                	arrSelectedPlaces.push(arrTemp);
                }

                var elementInDOM = document.getElementById(placeID);
                console.log("--------"+elementInDOM);

                    //check the parent element of placeID, if srchResultsList change class to 'added'
                    if($(elementInDOM).parent().attr('id') == 'srchResultsList'){
                    	$(elementInDOM).addClass('added');
                    }


                    if(elementInDOM == null){
                    	console.log("adding new place"+placeName);
                    	const listElement = document.createElement("li");
                    	$(listElement).append(
                    		 "&nbsp;<a href='#' class='flag-button'><span class='glyphicon glyphicon-flag'></span></a>"+
                  "&nbsp;<a href='#' class='flag-button'><span class='glyphicon glyphicon-info-sign info-button' data-toggle='modal'></span></a>&nbsp;"
                    		);
                    	listElement.id = placeID;
                    	listElement.classList.add('place-list-item');

                    	const votesDisplay = document.createElement("span");
                    	votesDisplay.id = placeID+"votes";
                    	votesDisplay.classList.add('place-list-votes', 'align-right');
                    	const content = document.createTextNode(placeVotes);
                    	votesDisplay.appendChild(content);

                    	const placeNameNode = document.createTextNode(placeName);

                    	listElement.appendChild(placeNameNode);
                    	$(listElement).append("<a class='minus-button align-right' href='#'><span class='glyphicon glyphicon-thumbs-down' aria-hidden='true'></span></a>&nbsp;");        	
                    	listElement.appendChild(votesDisplay);
                    	$(listElement).append("<a class='plus-button align-right' href='#'><span class='glyphicon glyphicon-thumbs-up' aria-hidden='false'></span>&nbsp;</a>&nbsp;");

                    	$('#selectedPlacesList').append(listElement);
                    	initMap();
                      //createAddedMarker(placeID);

                  }else{
                  	var displayedVotes = document.getElementById(placeID+"votes");
                  	console.log($(displayedVotes).text());
                  	if ($(displayedVotes).text() != placeVotes){
                  		console.log($(displayedVotes).text()+placeVotes+"updating" +i);
                  		$(displayedVotes).text(placeVotes) ;
                  	}
                  }       
              }
          }
      });
}

getSelectedList();
var myVar = setInterval(function(){getSelectedList()}, 1000);


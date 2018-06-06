

  var map;
  var mapModal;
  var infowindow;

  //var srchRadius = 830;
  var timeout = null;
  var searchResults = [];
  var gMarkers = [];

  var coords;
  var testPlace;

  var arrSelectedPlaces =[]; /// contains place_id, place_name, place coordinates 
  var winner;


  function initMap(){
//if timer > 0 => populate places array and populate the searchResults 
//if timer Б 0 => call getWinner function 

   navigator.geolocation.getCurrentPosition(function (position) {
    console.log("Successfully retrieved position: ", position);

    coords = position.coords;
    var pyrmont = {lat: coords.latitude, lng:  coords.longitude};

    map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
    });

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    console.log(timeDelta);
      if(timeDelta > 0){
            service.nearbySearch({
            location: pyrmont,
            type: ['restaurant'],
            rankBy: google.maps.places.RankBy.DISTANCE,
          }, callback);
      }else{
          var getwinner = getWinner();
          $(".enabled-button").each(function() {
            $(this).addClass("disabled");
           });
      }
  }, function (error) {
    alert("Could not retrieve position, please refresh the page.");
    console.log("Something went wrong retrieving position: ", error);
    setTimeout(getPos, 5000);
  });



 }


 var distance = function(lat1,lon1,lat2,lon2){
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1); 
      var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      return d;
    }

function deg2rad(deg) {return deg * (Math.PI/180)}



function callback(results, status, pagination) {
      console.log("updating search results");
        if (status === google.maps.places.PlacesServiceStatus.OK) {

            populateSrchArray(results, function (){
                if(pagination.hasNextPage){
                   pagination.nextPage();
                   console.log("NEXTPAGE NEXTPAGE NEXTPAGE NEXTPAGE");
                 }else{
                    console.log("calling getSelectedList for the first time");
                                   
                      if(timeDelta > 0){
                        var selectedVar = getSelectedList();
                        populateSrchList();
                        var getListInterval = setInterval(function(){getSelectedList()}, 1000);

                      }

                    }

                  });
        }
      }

////if place doesn't have a marker, create Marker,add to marker array
function createMarker(place) {

          if(place.markerIndex == -1 || place.markerIndex == undefined){
            var marker = null;
            console.log("create marker called");
            var placeLoc = place.geometry.location;
            var marker = new google.maps.Marker({
              map: map,
              position: place.geometry.location
            });

            if(isIdInArray(arrSelectedPlaces, place.place_id) == true){
              marker.setIcon('http://maps.google.com/mapfiles/kml/paddle/grn-stars.png');
            }

              gMarkers.push(marker);
              place.markerIndex = gMarkers.length -1;
            

            google.maps.event.addListener(marker, 'click', function() {
              infowindow.setContent(place.name);
              infowindow.open(map, this);
            });

          }
        }


function removeMarker(place){
          var i = place.markerIndex;
          console.log("removing marker with index " + i + "of place " + place.name);
          gMarkers[i].setMap(null);
          place.markerIndex = -1;
        }

function createAddedMarker(placeId, placeName) {
          var marker = null;
          var geocoder = new google.maps.Geocoder;

          geocoder.geocode({'placeId': placeId}, function(results, status) {
            if (status === 'OK') {
              if (results[0]) {
                var marker = new google.maps.Marker({
                  map: map,
                  position: results[0].geometry.location
                });
                google.maps.event.addListener(marker, 'click', function() {
                  infowindow.setContent(placeName);
                  infowindow.open(map, this);
                });
                marker.setIcon('http://maps.google.com/mapfiles/kml/paddle/grn-stars.png')
              } else {
                console.log('No results found');
              }
            } else {
              console.log('Geocoder failed due to: ' + status);
              if(status == 'OVER_QUERY_LIMIT'){
              }
            }
          });
        }


function populateSrchArray(results, callback){
for (var i = 0; i < results.length; i++) {
  var place = results[i];
  place.distance = distance(coords.latitude, coords.longitude, results[i].geometry.location.lat(), results[i].geometry.location.lng());
  place.onSrchList = 'N';
  place.markerIndex = '-1';
  place.selectedVoting = 'N';

  if(searchResults.indexOf(place) == -1){
      searchResults.push(place);
  }
}
callback();
}


var maxDistance = 0;

function populateSrchList(){
  srchRadius = $('#radius').val()*0.070;
  var i =0;

  if(maxDistance < srchRadius){
     while (searchResults[i].distance<srchRadius && i<searchResults.length-1){
       //if place is not on srchResultsList and if not Selected for Voting, add it to the page

        if (searchResults[i].onSrchList == 'N' && isIdInArray(arrSelectedPlaces, searchResults[i].place_id) == false){
            console.log("fucking adding "+i);
           $('#srchResultsList').append("<li class='place-list-item' id='"+searchResults[i].place_id+"'>"+
            "&nbsp;<a href='#' class='info-button'><span class='glyphicon glyphicon-info-sign info-button' data-toggle='modal' ></span></a>&nbsp;"+
            searchResults[i].name+
            "<a class='add-button align-right enabled-button' href='#'><span class='glyphicon glyphicon-plus-sign' aria-hidden='true'></span></a>&nbsp;"+
            "&nbsp;<a href='#' class='flag-button align-right'><span class='glyphicon glyphicon-flag'></span></a>&nbsp;&nbsp;</li>");
            searchResults[i].onSrchList = 'Y';
            createMarker(searchResults[i]);
        }
      i++;           
    }
  }else{
      i = searchResults.length -1;
      while(searchResults[i].distance > srchRadius){
        placeDomElement = document.getElementById(searchResults[i].place_id);
        if(placeDomElement != null){
          console.log("fucking removing "+i);
          $(placeDomElement).remove();
          searchResults[i].onSrchList = 'N';
          if(isIdInArray(arrSelectedPlaces, searchResults[i].place_id) == false){
            removeMarker(searchResults[i]);
          }
        }
        ////if place is not selected for voting;

        i --;
    }
  }
  maxDistance = searchResults[i].distance;
}






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
                      listElement.id = placeID+"voting";
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
                    var place = searchResults.find(x => x.place_id == placeID);
                    console.log("Found place by ID: " + placeID +"  "+ place.name);

                    ///if place in the searchResults list, remove from there and delete marker
                    if(place.onSrchList =='Y'){
                      removeMarker(place);
                      document.getElementById(placeID).remove();
                    }


                    createMarker(place);


                  }else{
                    var displayedVotes = document.getElementById(placeID+"votes");
                  //  console.log($(displayedVotes).text());
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
          clearSrchResults();

          getPlaceDetails(json.message);

          document.getElementById('winner').classList.add('winnerDisplayed');
          document.getElementById('voteHere-text').innerHTML = " - Winner - ";
          document.getElementById("p-rad").style.visibility = "hidden";


          }
      });
}



function clearVotes(){
  var myNode = document.getElementById("selectedPlacesList");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
}

function clearSrchResults(){
    var myNode = document.getElementById("srchResultsList");

    if(myNode != null){
        while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
    }

}

function getPlaceDetails(place){
  console.log("get place dtails");
  var request = {
  placeId: place
};

    service = new google.maps.places.PlacesService(map);
    service.getDetails(request, populateWinner);


    function populateWinner(place, status) {
      console.log("populate winner");
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    createMarker(place);

    testPlace = place;
    console.log (place);

    document.getElementById('winner').innerHTML= "The masses have spoken! </br> We're going to... </br> <span id='restaurant-name'>"+ place.name +"</span>";
   

document.getElementById('containerSrchResults').innerHTML= 
"<div id='winner-info'>"+
"<div id='name-open'>"+
"<h2 id='details-name'>"+place.name+"</h2>"+
"<h4 id='details-isopen'>"+isOpen(place)+"</h4>"+
"</div><div class='details-2'>"+
"<a id='details-website' href='"+place.website+"'>"+place.website+"</a>"+
"<p id='details-description'>"+place.formatted_phone_number+"</p>"+
"<p id='details-address'>"+place.formatted_address+"</p>"+
"<div class='stars-outer'><div class='stars-inner' id='stars-inner'></div></div></div>"+
"</div>"+
commentsCarousel(place)
;


setRatingStars(place);
    
  }else{
    console.log("Google did not return place details, status"+status);
  }

} 
}


var isOpen = function(place){
  if(place.opening_hours.open_now=true){
    return "<span style='color:#C5D86D'>Open</span>";
  }
  return "<span style='color:red'>Closed</span>";
}


function setRatingStars(place){
  var rating= place.rating;
  $( "#stars-inner" ).css("width", (rating/5)*100+"%");
}


var commentsCarousel = function(place){

  var htmlStr = "<div id='commentsCarousel' class='carousel slide' data-ride='carousel'>";
  var htmlList = "<ol class='carousel-indicators'><li data-target='#commentsCarousel' data-slide-to='0' class='active'></li>";
  var htmlItems = "<div class='carousel-inner'>";
  var htmlControls = "<a class='left carousel-control' href='#commentsCarousel' data-slide='prev'><span class='glyphicon glyphicon-chevron-left'></span><span class='sr-only'>Previous</span></a><a class='right carousel-control' href='#commentsCarousel' data-slide='next'><span class='glyphicon glyphicon-chevron-right'></span><span class='sr-only'>Next</span></a></div>";

  if(place.reviews.length >0){
      for(var i =0; i<place.reviews.length; i++){

        var active ='';
        if(i==0){active = "active"}
        var name = place.reviews[i].author_name;
        var rating = place.reviews[i].rating;
        var timeAgo = place.reviews[i].relative_time_description;
        var text = place.reviews[i].text;

        if(text.length > 350){
          text = text.substring(0,343) +" (...)";
        }

        console.log(name+rating+timeAgo+text);


        htmlList += "<li data-target='#commentsCarousel' data-slide-to='"+i+"'></li>";
        htmlItems += "<div class='comment item "+active+"'>"+"<span class='comment-name'>"+name+"</span></br><span class='comment-time'>"+timeAgo+"</span></br></br><span class='comment-text'>"+text+"</span></div>";
      }
      htmlList += "</ol>";
      htmlItems += "</div>";
  }

  return htmlStr + htmlStr + htmlList + htmlItems + htmlControls;
}


//getSelectedList();




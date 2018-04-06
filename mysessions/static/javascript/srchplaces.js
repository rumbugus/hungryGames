  var map;
  var mapModal;
  var infowindow;

  //var srchRadius = 830;
  var timeout = null;
  var searchResults = [];
  var gMarkers = [];

  var coords;


  function initMap(){
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

    service.nearbySearch({
      location: pyrmont,
      type: ['restaurant'],
      rankBy: google.maps.places.RankBy.DISTANCE,
    }, callback);
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
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      return d;
    }

    function deg2rad(deg) {
      return deg * (Math.PI/180)
    }



    function callback(results, status, pagination) {

      console.log("updating search results");
        //clear search results list
     //   $('#srchResultsList').children().remove();

        if (status === google.maps.places.PlacesServiceStatus.OK) {

            populateSrchArray(results);

            if(pagination.hasNextPage){
              pagination.nextPage();
            }

            populateSrchList();

            for(var i = 0; i<arrSelectedPlaces.length-1; i++){

              var elementInDOM = document.getElementById(arrSelectedPlaces[i][0]);
              $(elementInDOM).addClass('added');
              createAddedMarker(arrSelectedPlaces[i][0], arrSelectedPlaces[i][1]);
            }
          }
        }

////create Marker, populate the array, leave them invisible by default 
        function createMarker(place) {
          var marker = null;

          var placeLoc = place.geometry.location;
          var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
          });

          if(isIdInArray(arrSelectedPlaces, place.id) == true){
            marker.setIcon('http://maps.google.com/mapfiles/kml/paddle/grn-stars.png');
          }


          if(gMarkers.indexOf(marker) == -1){
            gMarkers.push(marker);
            place.markerIndex = gMarkers.length -1;
          }

          google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.name);
            infowindow.open(map, this);
          });
        }


        function removeMarker(place){
          var i = place.markerIndex;
          console.log("removing marker with index " + i + "of place " + place.name);
          gMarkers[i].setMap(null);
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


        function populateSrchArray(results){
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
        }


        $(document).on('keyup mouseup', '#radius',function(e){
          clearTimeout(timeout);
          timeout = setTimeout(function () {

          populateSrchList();

          }, 1000);
                });



          var maxDistance = 0;

        function populateSrchList(){
          srchRadius = $('#radius').val()*0.070;
          var i =0;
          console.log("fucking radius is : " + srchRadius);

          if(maxDistance < srchRadius){
             while (searchResults[i].distance<srchRadius && i<searchResults.length-1){
               //if place is not on the page, add it to the page

                if (searchResults[i].onSrchList == 'N'){
                    console.log("fucking adding "+i);
                   $('#srchResultsList').append("<li class='place-list-item' id='"+searchResults[i].id+"'>"+
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
                placeDomElement = document.getElementById(searchResults[i].id);
                if(placeDomElement != null){
                  console.log("fucking removing "+i);
                  $(placeDomElement).remove();
                  searchResults[i].onSrchList = 'N';
                  if(isIdInArray(arrSelectedPlaces, searchResults[i].id) == false){
                    removeMarker(searchResults[i]);
                  }
                }
                ////if place is not selected for voting;

                i --;
            }
          }
          maxDistance = searchResults[i].distance;
        }


$(document).on('click', '.add-button', function(e){
  e.preventDefault();
  var id = $(this).id;

  $.ajax({
    type: 'POST',
    url: 'add/',
    data:{
     place_id: $(this).parent().attr('id'),
     place_name: $(this).parent().text(),
     csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
   },
   success:function(){
    console.log("place added");
  }
})
});


$(document).on('click', '.minus-button', function(e){
  e.preventDefault();
  var id = $(this).id;

  $.ajax({
    type: 'POST',
    url: 'down/',
    data:{
      place_id: $(this).parent().attr('id'),
      csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    },
    success:function(){
      console.log("place downvoted");
    }
  })
});


$(document).on('click', '.plus-button', function(e){
  e.preventDefault();
  var id = $(this).id;

  $.ajax({
    type: 'POST',
    url: 'up/',
    data:{
      place_id: $(this).parent().attr('id'),
      csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    },
    success:function(){
      console.log("place upvoted");
    }
  })
});


///MODAL
function initMapModal(placeId){
  getPos = function () {
           // var srchRadius= document.getElementById('rad').value*83;
           console.log("getPos function called");

           navigator.geolocation.getCurrentPosition(function (position) {
            console.log("Successfully retrieved position: ", position);
            var coords = position.coords;

            var pyrmont = {
              lat: coords.latitude, lng:  coords.longitude};

              map = new google.maps.Map(document.getElementById('mapModal'), {
                center: pyrmont,
                zoom: 15
              });


              infowindow = new google.maps.InfoWindow();
              var service = new google.maps.places.PlacesService(map);


            }, function (error) {
              console.log("Something went wrong retrieving position: ", error);
              setTimeout(getPos, 5000);
            });
         }
         getPos();
       }


       $(document).on('shown.bs.modal', '.modal', function(e){ 

        initMapModal();

      });





       var placeLinks= function(place){
        var place_id = place.place_id;

        const span = document.createElement("span");

        const infobutton =document.createElement('button');
        inforbutton.classList.add('info-button glyphicon glyphicon-info-sign');

        const content = document.createTextNode(placeVotes);


        listElement.appendChild(placeNameNode);
        listElement.appendChild(votesDisplay);

      };


      $(document).on('click', '.info-button',function(e){
        $('#myModal').modal('show');
      });




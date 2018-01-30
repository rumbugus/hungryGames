  var map;
  var mapModal;
  var infowindow;

  var srchRadius = 830;
  var timeout = null;


  function initMap(){
    getPos = function () {
           // var srchRadius= document.getElementById('rad').value*83;
           console.log("getPos function called");

           navigator.geolocation.getCurrentPosition(function (position) {
            console.log("Successfully retrieved position: ", position);
            var coords = position.coords;

            var pyrmont = {
              lat: coords.latitude, lng:  coords.longitude};

              map = new google.maps.Map(document.getElementById('map'), {
                center: pyrmont,
                zoom: 15
              });


              infowindow = new google.maps.InfoWindow();
              var service = new google.maps.places.PlacesService(map);

              console.log(srchRadius.value);

              service.nearbySearch({
                location: pyrmont,
                radius: srchRadius,
                type: ['restaurant']
              }, callback);


            }, function (error) {
              console.log("Something went wrong retrieving position: ", error);
              setTimeout(getPos, 5000);
            });
         }
         getPos();
       }


  function callback(results, status) {

        console.log("updating search results");
        //clear search results list
        $('#srchResultsList').children().remove();

        if (status === google.maps.places.PlacesServiceStatus.OK) {

          for (var i = 0; i < results.length; i++) {
            var place = results[i];
            //add results to list

                  $('#srchResultsList').append("<li class='srch-list-itm' id='"+results[i].place_id+"'>"+
                  "&nbsp;<a href='#' class='info-button'><span class='glyphicon glyphicon-info-sign info-button' data-toggle='modal' ></span></a>&nbsp;"+
                  results[i].name+
                  "<a class='add-button align-right' href='#'><span class='glyphicon glyphicon-plus-sign' aria-hidden='true'></span></a>&nbsp;"+
                  "&nbsp;<a href='#' class='flag-button align-right'><span class='glyphicon glyphicon-flag'></span></a>&nbsp;&nbsp;</li>");

              //if place is not in array of selected places, create red marker 
              if(isIdInArray(arrSelectedPlaces, place.place_id) == false){
                createMarker(place);

              }
              //else add green marker and change itm class to 'added' 
            }
            for(var i = 0; i<arrSelectedPlaces.length; i++){
              createAddedMarker(arrSelectedPlaces[i][0], arrSelectedPlaces[i][1]);
            }
          }
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

  function createMarker(place) {
    var marker = null;

    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
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
        }
      });


  }




  $(document).on('keyup mouseup', '#radius',function(e){
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      $('#test').text($('#radius').val());
      var rad = $('#radius').val();
      srchRadius = $('#radius').val()*83;
      initMap();

    }, 1000);
  });




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



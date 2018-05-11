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

$(document).on('keyup mouseup', '#radius',function(e){
      clearTimeout(timeout);
      timeout = setTimeout(function () {
      populateSrchList();
      }, 1000);
          });


$(document).on('click', '.add-button', function(e){
  e.preventDefault();
  var id = $(this).id;
  var placeID = $(this).parent().attr('id');


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
  var id = $(this).parent().attr('id').substring(0, 27);
  console.log(id);

  $.ajax({
    type: 'POST',
    url: 'down/',
    data:{
      place_id: $(this).parent().attr('id').substring(0, 27),
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
      place_id: $(this).parent().attr('id').substring(0, 27),
      csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    },
    success:function(){
      console.log("place upvoted");
    }
  })
});
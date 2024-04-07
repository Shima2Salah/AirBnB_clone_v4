$(document).ready(function () {
    let check = {};
    $('input:checkbox').change(function() {
      if ($(this).is(':checked')) {
        check[$(this).data('id')] = $(this).data('name');
      } else {
        delete check[$(this).data('id')];
      }
      $('div.amenities h4').html(function () {
        let amenity = Object.values(check);
        if (amenity.length === 0) {
          return ('&nbsp')
        } else {
          return (amenity.join(', '))
        }
      })
    })
    $.get("http://localhost:5001/api/v1/status/").done(function(data) {
      $('div#api_status').addClass('available');
    }).fail(function(data) {
      $('div#api_status').removeClass('available');
    })
   })

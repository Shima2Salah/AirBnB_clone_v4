$(document).ready(function () {
  let check_val = {};
  $('input:checkbox').change(function() {
    if ($(this).is(':checked')) {
      check_val[$(this).data('id')] = $(this).data('name');
    } else {
      delete check_val[$(this).data('id')];
    }
    $('div.amenities h4').html(function () {
      let amenity = Object.values(check_val);
      if (amenity.length === 0) {
        return ('&nbsp')
      } else {
        return (amenity.join(', '))
      }
    })
  })
 })

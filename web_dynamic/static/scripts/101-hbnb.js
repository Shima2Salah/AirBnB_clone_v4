const $ = window.$;
$(document).ready(function () {
  /**
   * Task 2:
   * Listen for changes on each INPUT checkbox tag:
   * - if the checkbox is checked, you must store the Amenity ID in a variable (dictionary or list)
   * - if the checkbox is unchecked, you must remove the Amenity ID from the variable
   * - update the H4 tag inside the DIV Amenities with the list of Amenities checked
   **/
  const myAmenities = {};
  const myStates = {};
  const myCities = {};
  let myList = [];
  const checkbox = $('.amenities input[type="checkbox"]');
  const checkboxStates = $('.locations .popover li > h2 > input[type="checkbox"]');
  const checkboxCities = $('.locations .popover li > ul li > input[type="checkbox"]');
  checkbox.prop('checked', false);
  checkboxStates.prop('checked', false);
  checkboxCities.prop('checked', false);

  function checkBoxActions (checkbox, dict, additionalDict = null) {
    myList = [];
    const dataId = $(checkbox).attr('data-id');
    const dataName = $(checkbox).attr('data-name');
    if (checkbox.checked) {
      dict[dataId] = dataName;
    } else {
      delete (dict[dataId]);
    }
    for (const key in dict) {
      myList.push(dict[key]);
    }
    if (additionalDict != null) {
      for (const key in additionalDict) {
        myList.push(additionalDict[key]);
      }
    }
    myList = myList.join(', ');
    return myList;
  }

  checkbox.change(function () {
    myList = checkBoxActions(this, myAmenities);
    $('div.amenities > h4').text(myList);
  });

  checkboxStates.change(function () {
    myList = checkBoxActions(this, myStates, myCities);
    $('div.locations > h4').text(myList);
  });

  checkboxCities.change(function () {
    myList = checkBoxActions(this, myCities, myStates);
    $('div.locations > h4').text(myList);
  });

  /**
   * how to handle api status
   **/
  const apiStatus = $('DIV#api_status');
  $.ajax('http://0.0.0.0:5001/api/v1/status/').done(function (data) {
    if (data.status === 'OK') {
      apiStatus.addClass('available');
    } else {
      apiStatus.removeClass('available');
    }
  });

  function search (theAmenities, theStates, theCities) {
    const items = {};
    if (theAmenities != null) {
      items.amenities = theAmenities;
    }
    if (theStates != null) {
      items.states = theStates;
    }
    if (theCities != null) {
      items.cities = theCities;
    }
    const placesSearch = $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      dataType: 'json',
      contentType: 'application/json',
      method: 'POST',
      data: JSON.stringify(items)
    });
    placesSearch.done(function (data) {
      for (let i = 0; i < data.length; i++) {
        const placeId = data[i].id;
        const placeName = data[i].name;
        const priceByNight = data[i].price_by_night;
        const maxGuest = data[i].max_guest;
        const maxRooms = data[i].number_rooms;
        const maxBathrooms = data[i].number_bathrooms;
        const desc = data[i].description;
        const article = $('<article></article>');
        const titleBox = $("<div class='title_box'><h2></h2><div class='price_by_night'></div></div>");
        titleBox.find('> h2').html(placeName);
        titleBox.find('.price_by_night').html('$' + priceByNight);
        article.append(titleBox);
        const information = $("<div class='information'></div>");
        let guestString = ' Guest';
        if (maxGuest > 1) {
          guestString = ' Guests';
        }
        const guest = $("<div class='max_guest'></div>").html(maxGuest + guestString);
        information.append(guest);
        let roomString = ' Bedroom';
        if (maxRooms > 1) {
          roomString = ' Bedrooms';
        }
        const rooms = $("<div class='number_rooms'></div>").html(maxRooms + roomString);
        information.append(rooms);
        let bathString = ' Bathroom';
        if (maxBathrooms > 1) {
          bathString = ' Bathrooms';
        }
        const bathrooms = $("<div class='number_bathrooms'></div>").html(maxBathrooms + bathString);
        information.append(bathrooms);
        article.append(information);
        const description = $("<div class='description'></div>").html(desc);
        article.append(description);
        const reviews = $("<div class='reviews'><span>show</span><h2>Reviews</h2><ul></ul></div>");
        reviews.find('span').attr('data-id', placeId);
        article.append(reviews);
        $('SECTION.places').append(article);
      }
    });
  }

  search();

  $('.filters > button').click(function () {
    $('SECTION.places').empty();
    search(myAmenities, myStates, myCities);
  });

  setTimeout(function () {
    $('.reviews span').click(function () {
      if ($(this).text() === 'show') {
        const placeId = $(this).attr('data-id');
        const url = 'http://0.0.0.0:5001/api/v1/places/' + placeId + '/reviews';
        const myReviews = $.ajax(url);
        const review = $(this);
        let myUser;
        myReviews.done(function (data) {
          for (let i = 0; i < data.length; i++) {
            myUser = $.ajax('http://0.0.0.0:5001/api/v1/users/' + data[i].user_id);
            myUser.done(function (userData) {
              let date = new Date(data[i].created_at);
              date = date.getDate() + 'th ' + ' ' + date.toLocaleString('default', { month: 'long' }) + ' ' + date.getFullYear();
              review.parent().find('ul').append('<li><h2>From ' + userData.first_name + ' ' + userData.last_name + ' the ' + date + '</h2><p>' + data[i].text + '</p></li>');
            });
          }
        });
        $(this).text('hide');
      } else {
        $(this).text('show');
        $(this).parent().find('ul').empty();
      }
    });
  }, 1000);
});

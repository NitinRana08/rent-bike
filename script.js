// Save selected bike and go to booking page
function bookBike(bikeName) {
  localStorage.setItem('selectedBike', bikeName);
  window.location.href = "booking.html";
}

// Validate form input (phone, name, dates)
function validateForm() {
  var phone = document.getElementById('phone').value.trim();
  var name = document.getElementById('name').value.trim();
  var pickup = document.getElementById('pickup').value;
  var returnDate = document.getElementById('return').value;
  var valid = true;

  // Validate phone
  if (phone.length !== 10 || isNaN(phone)) {
    document.getElementById('error').style.display = 'block';
    valid = false;
  } else {
    document.getElementById('error').style.display = 'none';
  }

  // Validate name
  var namePattern = /^[A-Za-z ]+$/;
  if (!namePattern.test(name)) {
    document.getElementById('nameError').style.display = 'block';
    valid = false;
  } else {
    document.getElementById('nameError').style.display = 'none';
  }

  

  // Validate dates
  if (!pickup || !returnDate) {
    alert("Please select both pickup and return dates.");
    valid = false;
  } else {
    var pickupDate = new Date(pickup);
    var returnDateObj = new Date(returnDate);
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    if (pickupDate < today) {
      alert("Pickup date cannot be in the past.");
      valid = false;
    } else if (returnDateObj <= pickupDate) {
      alert("Return date must be after pickup date.");
      valid = false;
    }
  }

  return valid;
}

// On form submit
function submitBooking(e) {
  e.preventDefault();

  if (!validateForm()) return;

  var booking = {
    bike: document.getElementById('selectedBike').value,
    name: document.getElementById('name').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    pickup: document.getElementById('pickup').value,
    return: document.getElementById('return').value
  };

  localStorage.setItem("bookingData", JSON.stringify(booking));
  window.location.href = "confirm.html";
}

// On page load
window.onload = function () {
  var path = window.location.pathname;
  var bike = localStorage.getItem('selectedBike');
  var bikeInput = document.getElementById("selectedBike");

  if (bikeInput) {
    bikeInput.value = bike || "No bike selected";
  }

  // 🚫 Prevent past pickup dates
  var pickupInput = document.getElementById('pickup');
  var returnInput = document.getElementById('return');
  var today = new Date();
  var yyyy = today.getFullYear();
  var mm = today.getMonth() + 1;
  var dd = today.getDate();

  // Add leading zero
  if (mm < 10) mm = '0' + mm;
  if (dd < 10) dd = '0' + dd;

  var todayStr = yyyy + '-' + mm + '-' + dd;

  if (pickupInput) {
    pickupInput.setAttribute('min', todayStr);
  }

  if (pickupInput && returnInput) {
    pickupInput.addEventListener('change', function () {
      returnInput.setAttribute('min', this.value);
    });
  }

  // 👇 Booking confirmation logic on confirm.html
  if (path.includes("confirm.html")) {
    var data = JSON.parse(localStorage.getItem('bookingData'));
    var container = document.getElementById('bookingDetails');
    var section = document.querySelector('.confirmation');

    var isDataValid = data &&
      data.bike && data.name && data.phone &&
      data.pickup && data.return &&
      data.bike !== "No bike selected";

    if (isDataValid && container) {
      var heading = document.createElement('h2');
      heading.textContent = "✅ YOYO Booking Confirmed!";
      section.insertBefore(heading, container);

      container.innerHTML =
        "<p><strong>Bike:</strong> " + data.bike + "</p>" +
        "<p><strong>Name:</strong> " + data.name + "</p>" +
        "<p><strong>Phone:</strong> " + data.phone + "</p>" +
        "<p><strong>Pickup Date:</strong> " + data.pickup + "</p>" +
        "<p><strong>Return Date:</strong> " + data.return + "</p>";

      localStorage.removeItem("selectedBike");

    } else if (container) {
      var errorHeading = document.createElement('h2');
      errorHeading.textContent = "❌ No Booking Found!";
      errorHeading.style.color = "red";
      section.insertBefore(errorHeading, container);

      container.innerHTML =
        "<p>Please go back and complete your booking first.</p>" +
        '<a href="booking.html" class="btn">Book Now</a>';
    }
  }
};

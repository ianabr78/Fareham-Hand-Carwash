// BOOKINGS functions

function searchBooking() {
    // Get the value entered in the findID input field
    const searchValue = document.getElementById('findID').value;

    // Filter the bookings array to find the booking with the matching ID
    const foundBooking = bookings.find(booking => booking._id.toString() === searchValue);

    // Clear the current booking display
    document.getElementById('bookingsContainer').innerHTML = '';

    // If a booking is found, display it
    if (foundBooking) {
        displayBooking(foundBooking);
    } else {
        // If no booking is found, display a message indicating so
        document.getElementById('bookingsContainer').innerHTML = '<p>No booking found.</p>';
    }
}

function displayBooking(booking) {


    // Construct HTML for displaying the booking
    const bookingHTML = `
        <div class="booking" id="">
            <div class="bookings">
                <p><strong>ID:</strong> ${booking._id}</p>
                <p><strong>Name:</strong> ${booking.name}</p>
                <p><strong>Date:</strong> ${booking.date}</p>
                <p><strong>Vehicle:</strong> ${booking.car}</p>
            </div>
        </div>
    `;

    // Append the booking HTML to the bookings container
    document.getElementById('bookingsContainer').innerHTML += bookingHTML;
}
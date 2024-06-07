function filterBookings(filter){


    // Redirect to the /api/filterBookings endpoint
    window.location.href = `/api/filterBookings?filter=${filter}`;

}

// **New Function** to search booking by ID and update the display
function searchBooking() {
    const searchValue = document.getElementById('findID').value;

    // **New Fetch Request** to get the booking data from the server

    // In the provided JavaScript code, the container variable is used to simplify and clarify the access 
    // to the HTML element identified by 'bookingsContainer'. This is a common practice to improve code readability and maintainability

    fetch(`/api/customquery?id=${searchValue}`)
    // When you enclose a variable or expression within ${} inside a string literal (delimited by backticks `), JavaScript evaluates the expression and inserts the result into the string.
    // see routeer.js

        .then(response => response.json()) //part of a promise chain commonly used in JavaScript to handle fetch requests for data, typically from an API or a server.
        // The Fetch API is used in JavaScript to make asynchronous HTTP requests to servers for resources. It is a modern alternative to XMLHttpRequest

        // The .json() method is called on the response object. This method is a built-in function provided by the fetch API. 
        // ..It reads the body of the response stream to completion and parses the data as JSON. It returns another Promise that resolves to the parsed JSON data.

        .then(data => {
            const container = document.getElementById('bookingsContainer');
            container.innerHTML = ''; // **Updated to clear previous results**

            if (data && data.length > 0) {
                data.forEach(booking => displayBooking(booking)); // **Updated to handle multiple bookings**

               // Change the background color of the div
                container.style.backgroundColor = 'green'; // Change 'blue' to any color you desire


            } else {
                container.innerHTML = '<p>No booking found.</p>'; // **New Error Handling**
                alert(searchValue + ' no booking found');
                container.style.backgroundColor = 'red'; // Change 'blue' to any color you desire
            }
        })
        .catch(error => {
            console.error('Error fetching booking data:', error);
            document.getElementById('bookingsContainer').innerHTML = '<p>Error loading booking data.</p>'; // **New Error Handling**
        });
}

// **New Function** to display bookings in HTML format
function displayBooking(booking) {
    const bookingHTML = `
        <div class="booking">
            <p><strong>ID:</strong> ${booking._id}</p>
            <p><strong>Name:</strong> ${booking.name}</p>
            <p><strong>Date:</strong> ${booking.date}</p>
            <p><strong>Vehicle:</strong> ${booking.car}</p>
        </div>
    `;
    document.getElementById('bookingsContainer').innerHTML += bookingHTML; // **Updated to add to existing HTML**
}
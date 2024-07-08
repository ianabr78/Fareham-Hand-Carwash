///// BOOKINGS.EJS /////

function filterBookings(filter) {


    // Redirect to the /api/filterBookings endpoint
    window.location.href = `/api/filterBookings?filter=${filter}`;

}

function editBooking(editValue) {

    // this will be front end logging but lost once redirected
    console.log('editBooking function called'); // CHANGE
    console.log('booking being edited is: ' + editValue); // CHANGE

   //window.location.href = `/api/edit-booking?editValue=${editValue}`;
   fetch(`/api/findByID?id=${editValue}`)  

   .then(response => {
       if (!response.ok) {
           throw new Error('Network response was not ok');
       }
       return response.json();
   })
           .then(data => {
               

               // cant use res.render as this is a client side function!
               // res.render('pages/booking', { bookingData: data });

               console.log('utils.js editBooking data for id: ' + data.id); // Add this line to log the data


               // re direction not as simple as re render user in the router.js
               //window.location.href = `/booking?id=${data._id}`;

               data.booking = data.booking[0]; // this needed as this is an array  with many elelments
               window.location.href = `/booking?id=${data.booking._id}&name=${encodeURIComponent(data.booking.name)}&date=${data.booking.date}&time=${data.booking.time}&car=${encodeURIComponent(data.booking.car)}`;

           })
           .catch(error => {
               console.error('Error fetching booking data:', error);
               alert('Failed to fetch booking data. Please try again.');
           });


}

// **New Function** to search booking by ID and update the display
function searchBooking() {
    const searchValue = document.getElementById('findID').value;

    // **New Fetch Request** to get the booking data from the server

    // In the provided JavaScript code, the container variable is used to simplify and clarify the access
    // to the HTML element identified by 'bookingsContainer'. This is a common practice to improve code readability and maintainability


    console.log('searchBooking /api/findByID?id=' + searchValue);

    fetch(`/api/findByID?id=${searchValue}`)
    // When you enclose a variable or expression within ${} inside a string literal (delimited by backticks `), JavaScript evaluates the expression and inserts the result into the string.
    // see routeer.js
    // The fetch function in this context is used to make an asynchronous HTTP request to a specified URL, in this case, /api/findByID ? id = ${ searchValue }.

    

        .then(response => response.json()) //part of a promise chain commonly used in JavaScript to handle fetch requests for data, typically from an API or a server.
        // The Fetch API is used in JavaScript to make asynchronous HTTP requests to servers for resources. It is a modern alternative to XMLHttpRequest

        // The .json() method is called on the response object. This method is a built-in function provided by the fetch API. 
        // ..It reads the body of the response stream to completion and parses the data as JSON. It returns another Promise that resolves to the parsed JSON data.

        .then(data => {
            const container = document.getElementById('bookingsContainer');
            container.innerHTML = ''; // **Updated to clear previous results**

            if (data.booking) {
                data.booking.forEach(booking => displayBooking(booking)); // **Updated to handle multiple bookings**

               // Change the background color of the div
                container.style.backgroundColor = 'green'; // 


            } else {
                container.innerHTML = '<p>No booking found.</p>'; // **New Error Handling**
                alert(searchValue + ' no booking found');
                container.style.backgroundColor = 'red'; // 
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
            <p><strong>Date:</strong> ${booking.time}</p>
            <p><strong>Vehicle:</strong> ${booking.car}</p>
        </div>
    `;
    document.getElementById('bookingsContainer').innerHTML += bookingHTML; // **Updated to add to existing HTML**
}

// BOOKING.EJS ....

function submitBooking() {

    const name = document.getElementById('nameIpt').value;
    const number = document.getElementById('phoneIpt').value;
    const car = document.getElementById('carIpt').value;
    const date = document.getElementById('dateIpt').value;
    const time = document.getElementById('timeIpt').value;
    const size = document.getElementById('sizeIpt').value;

    const datetime = new Date(`${date}T${time}`); // line joining date and time into a mongo dateTime object

    const data = {
        name: name,
        number: number,
        car: car,
        datetime: datetime,
        size: size
    };



    console.log(data);

    // Check that data is not null

    if (!name) {
        showUser("Please enter a name");
        return;
    } else if (!number) {
        showUser("Please enter a number");
        return;
    } else if (!car) {
        showUser("Please enter a Car make & Model");
        return;
    } else if (!date) {
        showUser("Please enter a date");
        return;
    } else if (!time) {
        showUser("Please enter a time");
        return;
    } else if (!size) {
        showUser("Please select a size");
        return;
    }

    // example of an IF / OR

    if (!name || !number || !car || !date || !time || !size) {
        showUser("Please fill in all fields.");
        return;
    }

    // PART REMOVED

    
}

function updateBooking(bookingId, updatedData) {
    fetch(`/api/update-booking?id=${bookingId}`, {
        method: 'PUT', // Use PUT method for update operation
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData), // Convert updatedData to JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Updated booking:', data);
        // Optionally handle success or inform the user
        alert('Booking updated successfully!');
        // Redirect or update UI as needed
        // window.location.href = '/booking?id=' + bookingId;
    })
    .catch(error => {
        console.error('Error updating booking:', error);
        alert('Failed to update booking. Please try again.');
    });
}

function showUser(message, error = true) {
    const textElem = document.getElementById('showUser');

    if (!error)
        textElem.style.color = "green";

    textElem.innerHTML = "";
    textElem.textContent = message;
}
const form = document.getElementById('search-form');

// Define bus routes and coordinates with more random locations
const routes = [
  {
    from: 'Kengeri',
    to: 'Yelahanka',
    buses: ['401K', '401KB', '401M'],
    routeCoordinates: [
      { lat: 12.9236, lng: 77.4987 }, // Kengeri
      { lat: 12.9300, lng: 77.5100 }, // Random location 1
      { lat: 12.9400, lng: 77.5200 }, // Random location 2
      { lat: 12.9450, lng: 77.5300 }, // Random location 3
      { lat: 12.9539, lng: 77.6309 }, // Random midpoint
      { lat: 12.9600, lng: 77.5800 }, // Random location 4
      { lat: 12.9700, lng: 77.5600 }, // Random location 5
      { lat: 13.0035, lng: 77.5800 }, // Random location 6
      { lat: 13.1035, lng: 77.5762 }, // Yelahanka
    ],
  },
  {
    from: 'Koramangala',
    to: 'Electronic City',
    buses: ['600F', '600R', '600S'],
    routeCoordinates: [
      { lat: 12.9333, lng: 77.6101 }, // Koramangala
      { lat: 12.9150, lng: 77.6220 }, // Random location 1
      { lat: 12.9250, lng: 77.6300 }, // Random location 2
      { lat: 12.9290, lng: 77.6400 }, // Random location 3
      { lat: 12.9348, lng: 77.6521 }, // Random midpoint
      { lat: 12.9200, lng: 77.6600 }, // Random location 4
      { lat: 12.9100, lng: 77.6700 }, // Random location 5
      { lat: 12.9075, lng: 77.6800 }, // Random location 6
      { lat: 12.8490, lng: 77.6742 }, // Electronic City
    ],
  },
  {
    from: 'Malleswaram',
    to: 'Banashankari',
    buses: ['47', '47A', '47B'],
    routeCoordinates: [
      { lat: 13.0042, lng: 77.5766 }, // Malleswaram
      { lat: 13.0120, lng: 77.5800 }, // Random location 1
      { lat: 13.0150, lng: 77.5850 }, // Random location 2
      { lat: 13.0200, lng: 77.5900 }, // Random location 3
      { lat: 13.0350, lng: 77.6000 }, // Random midpoint
      { lat: 13.0400, lng: 77.6100 }, // Random location 4
      { lat: 13.0450, lng: 77.6200 }, // Random location 5
      { lat: 13.0500, lng: 77.6300 }, // Random location 6
      { lat: 12.9348, lng: 77.5918 }, // Banashankari
    ],
  },
  // Add more routes if needed
];

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const fromLocation = document.getElementById('from-location').value.trim();
  const toLocation = document.getElementById('to-location').value.trim();

  // Find the route for both directions
  const matchingRoute = routes.find(
    (route) =>
      (route.from.toLowerCase() === fromLocation.toLowerCase() &&
        route.to.toLowerCase() === toLocation.toLowerCase()) ||
      (route.from.toLowerCase() === toLocation.toLowerCase() &&
        route.to.toLowerCase() === fromLocation.toLowerCase())
  );

  if (matchingRoute) {
    // Redirect to a new page showing the buses
    showBusListPage(matchingRoute);
  } else {
    // Show a message if no route matches
    alert('No buses found for this route. Please try again.');
  }
});

// Function to dynamically display buses with map functionality
function showBusListPage(route) {
  // Clear the document and add the new content
  document.body.innerHTML = `
    <header>
      <h1>Buses from ${route.from} to ${route.to}</h1>
    </header>
    <main>
      <section>
        <h2>Available Buses</h2>
        ${route.buses
          .map(
            (bus, index) =>
              `<button class="bus-btn" data-route-index="${index}">${bus}</button>`
          )
          .join('')}
        <div id="map" style="width: 100%; height: 400px; margin-top: 20px; display:none;"></div>
        <button id="go-back">Search Again</button>
      </section>
    </main>
    <footer>
      <p>&copy; 2024 Bus Tracker</p>
    </footer>
  `;

  // Event listener for bus buttons
  const busButtons = document.querySelectorAll('.bus-btn');
  busButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Load the map and set the location
      loadMap(route);
      
      // Loop through all random locations and place a marker for each
      route.routeCoordinates.forEach(coordinate => {
        const marker = new google.maps.Marker({
          position: coordinate,
          map: map,
        });
      });

      // Optionally, you can center the map on the first location or midpoint
      setTimeout(() => {
        map.setCenter(route.routeCoordinates[0]);
      }, 500);
    });
  });

  // Add functionality to the "Go Back" button
  document.getElementById('go-back').addEventListener('click', () => {
    location.reload(); // Reload the page to go back to the form
  });
}

// Variable for map
let map;

function loadMap(route) {
  // Check if the map is already loaded
  if (!map) {
    // Create a new map when the button is clicked
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: route.routeCoordinates[0], // Start from the first location
    });

    // Display the map
    document.getElementById('map').style.display = 'block';
  }
}

// Automatically select the "To" location based on the "From" location
const fromLocationSelect = document.getElementById('from-location');
const toLocationSelect = document.getElementById('to-location');

fromLocationSelect.addEventListener('change', () => {
  const fromLocation = fromLocationSelect.value;
  // Find the matching route based on the selected "From" location
  const matchingRoute = routes.find(route => route.from === fromLocation);
  if (matchingRoute) {
    // Set the "To" location based on the "From" location
    toLocationSelect.value = matchingRoute.to;
  }
});

// Automatically select the "From" location based on the "To" location (reverse logic)
toLocationSelect.addEventListener('change', () => {
  const toLocation = toLocationSelect.value;
  // Find the matching route based on the selected "To" location
  const matchingRoute = routes.find(route => route.to === toLocation);
  if (matchingRoute) {
    // Set the "From" location based on the "To" location
    fromLocationSelect.value = matchingRoute.from;
  }
});

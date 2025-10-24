// =======================
// Bus Tracker - app.js
// =======================

// Store Google Map and marker references globally so they're easy to manage/clear
let map;            
let markers = [];   

const form = document.getElementById('search-form');

// Define bus routes and coordinates
const routes = [
  {
    from: 'Kengeri',
    to: 'Yelahanka',
    buses: ['401K', '401KB', '401M'],
    routeCoordinates: [
      { lat: 12.9236, lng: 77.4987 }, // Kengeri
      { lat: 12.9300, lng: 77.5100 },
      { lat: 12.9400, lng: 77.5200 },
      { lat: 12.9450, lng: 77.5300 },
      { lat: 12.9539, lng: 77.6309 }, // Random midpoint
      { lat: 12.9600, lng: 77.5800 },
      { lat: 12.9700, lng: 77.5600 },
      { lat: 13.0035, lng: 77.5800 },
      { lat: 13.1035, lng: 77.5762 }, // Yelahanka
    ],
  },
  {
    from: 'Koramangala',
    to: 'Electronic City',
    buses: ['600F', '600R', '600S'],
    routeCoordinates: [
      { lat: 12.9333, lng: 77.6101 },
      { lat: 12.9150, lng: 77.6220 },
      { lat: 12.9250, lng: 77.6300 },
      { lat: 12.9290, lng: 77.6400 },
      { lat: 12.9348, lng: 77.6521 }, // Random midpoint
      { lat: 12.9200, lng: 77.6600 },
      { lat: 12.9100, lng: 77.6700 },
      { lat: 12.9075, lng: 77.6800 },
      { lat: 12.8490, lng: 77.6742 }, // Electronic City
    ],
  },
  {
    from: 'Malleswaram',
    to: 'Banashankari',
    buses: ['47', '47A', '47B'],
    routeCoordinates: [
      { lat: 13.0042, lng: 77.5766 }, // Malleswaram
      { lat: 13.0120, lng: 77.5800 },
      { lat: 13.0150, lng: 77.5850 },
      { lat: 13.0200, lng: 77.5900 },
      { lat: 13.0350, lng: 77.6000 }, // Random midpoint
      { lat: 13.0400, lng: 77.6100 },
      { lat: 13.0450, lng: 77.6200 },
      { lat: 13.0500, lng: 77.6300 },
      { lat: 12.9348, lng: 77.5918 }, // Banashankari
    ],
  },
  // More routes can be added here
];

// Handle form submission for bus search
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const fromLocation = document.getElementById('from-location').value.trim();
  const toLocation = document.getElementById('to-location').value.trim();

  // Find the route (either direction)
  const matchingRoute = routes.find(
    (route) =>
      (route.from.toLowerCase() === fromLocation.toLowerCase() &&
       route.to.toLowerCase() === toLocation.toLowerCase()) ||
      (route.from.toLowerCase() === toLocation.toLowerCase() &&
       route.to.toLowerCase() === fromLocation.toLowerCase())
  );

  if (matchingRoute) {
    showBusListPage(matchingRoute);
  } else {
    alert('No buses found for this route. Please try again.');
  }
});

// Display buses and map when a route is found
function showBusListPage(route) {
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
          ).join('')}
        <div id="map" style="width: 100%; height: 400px; margin-top: 20px; display:none;"></div>
        <button id="go-back">Search Again</button>
      </section>
    </main>
    <footer>
      <p>&copy; 2024 Bus Tracker</p>
    </footer>
  `;

  document.querySelectorAll('.bus-btn').forEach(button => {
    button.addEventListener('click', () => {
      loadMap(route);

      // Remove old markers
      markers.forEach(marker => marker.setMap(null));
      markers = [];

      // Add new set of route markers
      route.routeCoordinates.forEach(coordinate => {
        const marker = new google.maps.Marker({
          position: coordinate,
          map: map,
        });
        markers.push(marker);
      });

      document.getElementById('map').style.display = 'block';
      map.setCenter(route.routeCoordinates[0]);
    });
  });

  document.getElementById('go-back').addEventListener('click', () => {
    location.reload(); // back to form
  });
}

// Init Google Map for first time button click
function loadMap(route) {
  if (map) return;
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: route.routeCoordinates[0], // center on first stop
  });
}

// Auto-select logic for dropdowns
const fromLocationSelect = document.getElementById('from-location');
const toLocationSelect = document.getElementById('to-location');

// If "From" changes, auto-set "To" based on predefined routes
fromLocationSelect.addEventListener('change', () => {
  const fromLocation = fromLocationSelect.value;
  const matchingRoute = routes.find(route => route.from === fromLocation);
  if (matchingRoute) {
    toLocationSelect.value = matchingRoute.to;
  }
});

// If "To" changes, auto-set "From" for reverse directions
toLocationSelect.addEventListener('change', () => {
  const toLocation = toLocationSelect.value;
  const matchingRoute = routes.find(route => route.to === toLocation);
  if (matchingRoute) {
    fromLocationSelect.value = matchingRoute.from;
  }
});

/* eslint-disable */
import 'leaflet';

export const renderTourMap = function (locations) {
  // Get midpoint of tour locations
  const getMidpoint = () => {
    const latitudes = [];
    const longitudes = [];

    locations.forEach((loc) => {
      latitudes.push(loc.coordinates[1]);
      longitudes.push(loc.coordinates[0]);
    });

    const sumLatitude = latitudes.reduce((acc, cur) => {
      return acc + cur;
    }, 0);

    const sumLongitude = longitudes.reduce((acc, cur) => {
      return acc + cur;
    }, 0);

    return [
      sumLatitude / latitudes.length,
      sumLongitude / longitudes.length,
    ];
  };

  const tourMidpoint = getMidpoint();

  // Create and tile map
  const map = L.map('map').setView(tourMidpoint, 11);

  L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  ).addTo(map);

  // Create custom marker
  const greenIcon = L.icon({
    iconUrl: '/img/pin.png',
    iconSize: [32, 40], // size of the icon
    iconAnchor: [16, 45], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -50], // point from which the popup should open relative to the iconAnchor
  });

  // Create markers from location data
  locations.forEach((loc) => {
    L.marker([loc.coordinates[1], loc.coordinates[0]], {
      icon: greenIcon,
    })
      .addTo(map)
      .bindPopup(
        `<p>Day ${loc.day}: ${loc.description}</p>`,
        {
          autoClose: false,
          className: 'mapPopup',
        },
      )
      .openPopup();
  });

  // Disable zoom
  map.scrollWheelZoom.disable();
};

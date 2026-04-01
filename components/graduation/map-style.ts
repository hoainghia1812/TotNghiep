/** Tông xanh nước biển — Google Maps JavaScript API styled map */
export const oceanMapStyles: object[] = [
  { elementType: "geometry", stylers: [{ color: "#e8f3f0" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#1a4a5c" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#e8f3f0" }, { lightness: 12 }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#7fb8c9" }] },
  { featureType: "landscape.man_made", elementType: "geometry.stroke", stylers: [{ color: "#b8d9e4" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#c5e6dd" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#9fd4c4" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#9ec9d6" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#d4ebe8" }] },
  { featureType: "transit.line", stylers: [{ color: "#8fc4dc" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#5ba3c6" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#e8f6ff" }] },
];

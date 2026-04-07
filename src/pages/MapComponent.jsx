import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Import images properly
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// ✅ Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function MapComponent({ pickup, dropoff, driverLocation }) {
  const center = [
    pickup?.lat || 18.5204,
    pickup?.lng || 73.8567,
  ];

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "100%", width: "100%", minHeight: "300px" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {pickup && (
        <Marker position={[pickup.lat, pickup.lng]}>
          <Popup>Pickup Location</Popup>
        </Marker>
      )}

      {dropoff && (
        <Marker position={[dropoff.lat, dropoff.lng]}>
          <Popup>Drop Location</Popup>
        </Marker>
      )}

      {driverLocation && (
        <Marker position={[driverLocation.lat, driverLocation.lng]}>
          <Popup>Driver Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
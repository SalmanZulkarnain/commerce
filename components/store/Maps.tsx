"use client";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { Icon } from "leaflet";
import { useEffect } from "react";

const customIcon = new Icon({
  iconUrl: "/location.png",
  iconSize: [38, 38],
});

function RecenterMap({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 15, { animate: true });
    }
  }, [position, map]);
  return null;
}

function MapClickHandler({
  onClick,
}: {
  onClick: (lat: number, lon: number) => void;
}) {
  useMapEvents({
    click(e) {
      // e.latlng itu object bawaan Leaflet. Kita ambil lat dan lng-nya
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface MapsProps {
  position: [number, number];
  zoom: number;
  onMapClick: (lat: number, lon: number) => void;
}

export default function Maps({ position, zoom, onMapClick }: MapsProps) {
  return (
    <MapContainer className="h-100" center={position} zoom={zoom}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position} icon={customIcon}>
        <Popup>
          Koordinat saat ini: <br /> {position}, {position}
        </Popup>
      </Marker>

      <RecenterMap position={position} />

      <MapClickHandler onClick={onMapClick} />
    </MapContainer>
  );
}

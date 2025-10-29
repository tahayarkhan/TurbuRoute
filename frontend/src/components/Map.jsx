import React, { useEffect, useState } from 'react';
import Map, { Source, Layer } from "react-map-gl/mapbox";
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidGFoYXlhcmtoYW4iLCJhIjoiY21oYzJlbWEzMTRnMDJscHhmaHlwc3Z5cSJ9.sgFoFA5LPjm2Pc_zNk1NhQ';

export default function FlightMap() {
  const [routePoints, setRoutePoints] = useState([]);
  
  useEffect(() => {
    // Fetch static route from backend
    fetch('http://127.0.0.1:8000/test-db')
      .then(res => res.json())
      .then(data => {
        const points = Array.isArray(data?.routes) ? data.routes : [];
        setRoutePoints(points);
      })
      .catch(err => console.error(err));
  }, []);

  const geoJson = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: routePoints.map(p => [p.lon, p.lat])
    }
  };

  return (
    <div className="h-screen w-full">
      <Map
        initialViewState={{
          longitude: -79.6248,
          latitude: 43.6777,
          zoom: 4
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {routePoints.length > 0 && (
          <Source id="route" type="geojson" data={geoJson}>
            <Layer
              id="route-line"
              type="line"
              paint={{
                'line-color': '#FF0000',
                'line-width': 4
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}

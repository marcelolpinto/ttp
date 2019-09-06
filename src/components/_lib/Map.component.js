import React from 'react';
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const KEY = process.env.REACT_APP_GOOGLE_API_KEY || '';

const MapComponent = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?v=3.exp&key=${KEY}&libraries=places,geolocation`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={props.zoom || 14}
    defaultCenter={{ lat:	-23.533773, lng: -46.625290 }}
  >
    {props.properties.map(property => (
      <Marker key={property.id} position={{ lat:	-23.533773, lng: -46.625290 }} />
    ))}
  </GoogleMap>
);

export { MapComponent };
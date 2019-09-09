import React, { Component } from 'react';
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { DEFAULT_CENTER } from '../../constants';

const KEY = process.env.REACT_APP_GOOGLE_API_KEY || '';

// SÃO PAULO

const DEFAULT_ZOOM = 12;

const MapComponent = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?v=3.exp&key=${KEY}&libraries=places,geolocation`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)(class MyMap extends Component {

  componentDidUpdate(prevProps, prevState) {
    if(!this.props.properties.length) return;
    if(this.props.center || (!this.props.center && prevProps.center)) return;
    const bounds = new window.google.maps.LatLngBounds()
    this.props.properties.forEach((property, i) => {
      bounds.extend(new window.google.maps.LatLng(
        property.coords.lat,
        property.coords.lng
      ));
    });
    this.refs.map.fitBounds(bounds) 
  }

  render() {
    const { creating, zoom, center, properties } = this.props;

    const mapProps = { defaultCenter: DEFAULT_CENTER, defaultZoom: DEFAULT_ZOOM };
    if(creating) mapProps.center = creating;
    if(zoom) mapProps.zoom = zoom;
    if(center) mapProps.center = center;
  
    return (
      <GoogleMap
        ref='map'
        {...mapProps}
      >
        {properties.map(property => {
          const markerProps = {
            key: property.id,
            position: property.coords,
            title: property.name
          };
          if(!property.isRented) markerProps.icon = {
            url: '/icons/green-marker.png'
          }
          return (
            <Marker { ...markerProps }/>
          )
        })}
        {
          creating && 
          <Marker key='creating' position={creating} />
        }
      </GoogleMap>
    );
  }

});

MapComponent.defaultProps = {
  properties: [],
  creating: null
};

export { MapComponent };
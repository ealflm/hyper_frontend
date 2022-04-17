import { Injectable } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment.prod';
@Injectable({
  providedIn: 'root',
})
export class MapService {
  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  // style = 'mapbox://styles/mapbox/satellite-v9';
  lat = 10.8427;
  lng = 106.809334;
  zoom = 12;
  constructor() {
    (mapboxgl as typeof mapboxgl).accessToken = environment.mapbox.accessToken;
  }
  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat],
    });
    this.map.addControl(new mapboxgl.NavigationControl());
  }
  setStyleMap(style: string) {
    this.style = style;
  }
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          if (position) {
            console.log(
              'Latitude: ' +
                position.coords.latitude +
                'Longitude: ' +
                position.coords.longitude
            );
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            console.log(this.lat);
            console.log(this.lat);
          }
        },
        (error: any) => console.log(error)
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
}

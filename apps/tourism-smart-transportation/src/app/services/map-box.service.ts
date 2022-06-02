import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment.prod';
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
@Injectable({
  providedIn: 'root',
})
export class MapBoxService {
  map!: mapboxgl.Map;
  miniMap!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  // style = 'mapbox://styles/mapbox/satellite-v9';
  lat = 10.22698;
  lng = 103.9967;
  zoom = 12;
  coordinates$ = new Subject<any>();
  coordinates = this.coordinates$.asObservable();
  initView$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() {
    (mapboxgl as typeof mapboxgl).accessToken = environment.mapbox.accessToken;
  }

  initializeMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat],
    });
    // this.map.addControl(new mapboxgl.NavigationControl());
    this.map.on('mousemove', (e) => {
      const geo = JSON.stringify(e.lngLat.wrap());
      this.coordinates$.next(geo);
    });
  }
  initializeMiniMap() {
    this.miniMap = new mapboxgl.Map({
      container: 'mini-map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat],
    });
  }
  getCoordinates() {
    return this.coordinates;
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

  getMarkers() {
    const geoJson = [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [103.96, 10.215],
        },
        properties: {
          description: 'Southern Ave',
          title: 'Trạm Dương Đông',
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [103.995, 10.185],
        },
        properties: {
          description: 'Deanwood',
          title: 'Trạm sân bay',
        },
      },
    ];
    return geoJson;
  }
  setMarker() {
    this.getMarkers().map((marker) => {
      const el = document.createElement('div');
      const width = 40;
      const height = 40;
      el.className = 'marker';
      el.style.backgroundImage = `url('../../../assets/image/google-maps-bus-icon-14.jpg')`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = '100%';
      el.style.cursor = 'pointer';

      const markerDiv = new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates as [number, number])
        .addTo(this.map)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <h3>${marker.properties.title}</h3>
        <p>${marker.properties.description}</p>
        `)
        );
      markerDiv.getElement().addEventListener('click', () => {
        markerDiv.togglePopup();
        alert('clicked');
      });
    });
  }
  setMarkerDriver() {
    this.getMarkers().map((marker) => {
      console.log(marker);
      const el = document.createElement('div');
      const width = 40;
      const height = 40;
      el.className = 'marker';
      el.style.backgroundImage = `url('../../../assets/image/google-maps-bus-icon-14.jpg')`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = '100%';
      el.style.cursor = 'pointer';

      const markerDiv = new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates as [number, number])
        .addTo(this.map);
      markerDiv.getElement().addEventListener('click', () => {
        alert('clicked');
      });
    });
  }
}

import { RentStation } from './../models/RentStationResponse';
import {
  StationsResponse,
  Station,
  StationResponse,
} from './../models/StationResponse';
import { MapService } from './map.service';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
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
  // currentBusStationMarkers: any = [];
  // currentRentStationMarkers: any = [];
  constructor(private mapService: MapService) {
    (mapboxgl as typeof mapboxgl).accessToken = environment.mapbox.accessToken;
  }

  initializeMap(longitude: number, latitude: number, zoom: number) {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: zoom,
      center: [longitude, latitude],
    });
    // this.map.addControl(new mapboxgl.NavigationControl());
    this.map.on('mousemove', (e) => {
      const geo = JSON.stringify(e.lngLat.wrap());
      this.coordinates$.next(geo);
    });
  }
  removeRoute() {
    if (this.map.getLayer('route')) {
      this.map.removeLayer('route');
    }
    if (this.map.getSource('route')) {
      this.map.removeSource('route');
    }
  }
  getRoute(routeRes: any) {
    const data = routeRes;
    const route = data.geometry.coordinates;
    const geojson: any = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route,
      },
    };
    // if the route already exists on the map, we'll reset it using setData
    this.removeRoute();

    this.map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: geojson,
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#3887be',
        'line-width': 5,
        'line-opacity': 0.75,
      },
    });
  }
  removeLayerTracking() {
    if (this.map.getLayer('iss')) {
      this.map.removeLayer('iss');
    }
    if (this.map.getSource('iss')) {
      this.map.removeSource('iss');
    }
  }
  trackingVehicle(geojson: any) {
    console.log(geojson);
    this.removeLayerTracking();
    this.map.loadImage(
      'https://img.icons8.com/color/48/undefined/car--v1.png',
      (error, image) => {
        if (error) throw error;
        if (!this.map.hasImage('car')) {
          if (image) {
            this.map.addImage('car', image);
          }
        }
        this.map.addLayer({
          id: 'iss',
          type: 'symbol',
          source: {
            type: 'geojson',
            data: geojson,
          },
          layout: {
            'icon-image': 'car',
            'icon-size': 0.5,
          },
        });
      }
    );
  }
  initializeMiniMap() {
    this.miniMap = new mapboxgl.Map({
      container: 'mini-map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat],
    });
  }
  flyToMarker(longitude: number, latitude: number) {
    this.map.flyTo({
      zoom: 17,
      center: [longitude, latitude],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
    });
  }
  flyToMarkerMiniMap(longitude: number, latitude: number) {
    this.miniMap.flyTo({
      zoom: 17,
      center: [longitude, latitude],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
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
  // setRentStationMarkers(rentStations: RentStation[]) {
  //   rentStations.map((marker) => {
  //     const el = document.createElement('div');
  //     el.id = marker.id;
  //     const width = 40;
  //     const height = 40;
  //     el.className = 'marker';
  //     el.style.backgroundImage = `url('../../../assets/image/rent-station.png')`;
  //     el.style.width = `${width}px`;
  //     el.style.height = `${height}px`;
  //     el.style.backgroundSize = '100%';
  //     el.style.cursor = 'pointer';

  //     const markerDiv = new mapboxgl.Marker(el)
  //       .setLngLat([marker.longitude, marker.latitude] as [number, number])
  //       .addTo(this.map);
  //     markerDiv.getElement().addEventListener('click', () => {
  //       if (marker.longitude && marker.latitude) {
  //         this.flyToMarker(marker.longitude, marker.latitude);
  //       }
  //     });
  //     this.currentRentStationMarkers.push(markerDiv);
  //   });
  // }
  // removeRentStationMarker() {
  //   if (this.currentRentStationMarkers !== null) {
  //     for (let i = this.currentRentStationMarkers.length - 1; i >= 0; i--) {
  //       this.currentRentStationMarkers[i].remove();
  //     }
  //   }
  // }
  // bus stations
  // setBusStationMarkers(busStations: Station[]) {
  //   busStations.map((marker) => {
  //     // console.log(marker);
  //     const elStationMarker = document.createElement('div');
  //     elStationMarker.id = marker.id;
  //     const width = 40;
  //     const height = 40;
  //     elStationMarker.className = 'marker';
  //     elStationMarker.style.backgroundImage = `url('../../../assets/image/google-maps-bus-icon-14.jpg')`;
  //     elStationMarker.style.width = `${width}px`;
  //     elStationMarker.style.height = `${height}px`;
  //     elStationMarker.style.backgroundSize = '100%';
  //     elStationMarker.style.cursor = 'pointer';

  //     const markerDiv = new mapboxgl.Marker(elStationMarker)
  //       .setLngLat([marker.longitude, marker.latitude] as [number, number])
  //       .addTo(this.map)
  //       .setPopup(
  //         new mapboxgl.Popup({ offset: 25 }).setHTML(`
  //       <h3>${marker.title}</h3>
  //       <p>${marker.description}</p>
  //       `)
  //       );
  //     // markerDiv.getElement().addEventListener('mouseenter', () => {
  //     //   markerDiv.togglePopup();
  //     // });
  //     markerDiv.getElement().addEventListener('click', () => {
  //       if (marker.longitude && marker.latitude) {
  //         this.flyToMarker(marker.longitude, marker.latitude);
  //         markerDiv.getPopup();
  //       }
  //     });
  //     this.currentBusStationMarkers.push(markerDiv);
  //   });
  // }
  // removeBusStationMarker() {
  //   if (this.currentBusStationMarkers !== null) {
  //     for (let i = this.currentBusStationMarkers.length - 1; i >= 0; i--) {
  //       this.currentBusStationMarkers[i].remove();
  //     }
  //   }
  // }
}

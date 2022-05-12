import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment.prod';
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
@Injectable({
  providedIn: 'root',
})
export class MapService {
  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  // style = 'mapbox://styles/mapbox/satellite-v9';
  lat = 10.215;
  lng = 103.96;
  zoom = 12;
  coordinates$ = new Subject<any>();
  coordinates = this.coordinates$.asObservable();
  curentLat = null;
  currentLng = null;

  markers: any[] = [];
  markerIndex = 1;
  lnglat: any;
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
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.on('mousemove', (e) => {
      const geo = JSON.stringify(e.lngLat.wrap());
      this.coordinates$.next(geo);
    });
  }

  addMarker() {
    this.map.on('click', (e) => {
      const el = document.createElement('div');
      el.id = 'marker' + this.markerIndex;
      const divElement = document.createElement('div');
      const assignBtn = document.createElement('div');
      assignBtn.innerHTML = `<button click="delete(${el.id})">Delete</button>`;
      divElement.appendChild(assignBtn);

      const width = 40;
      const height = 40;
      el.className = 'marker';
      el.style.backgroundImage = `url('../../../assets/image/google-maps-bus-icon-14.jpg')`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = '100%';
      el.style.cursor = 'pointer';

      let marker = new mapboxgl.Marker();
      // const index = this.markers.findIndex(
      //   (x: any) =>
      //     x._lngLat.lat == e.lngLat.lat && x._lngLat.lng == e.lngLat.lng
      // );

      // if (index == -1) {
      //   marker = new mapboxgl.Marker(el, {
      //     draggable: true,
      //   })
      //     .setLngLat([e.lngLat.lng, e.lngLat.lat])
      //     .addTo(this.map)
      //     .setPopup(new mapboxgl.Popup().setDOMContent(assignBtn));
      //   marker.togglePopup();
      //   marker
      //     .getElement()
      //     .addEventListener('mouseenter', () => marker.togglePopup());
      //   this.markers.push(marker);
      // } else {
      //   const index = this.markers.find(
      //     (x: any) =>
      //       x._lngLat.lat == e.lngLat.lat && x._lngLat.lng == e.lngLat.lng
      //   );
      //   index?.remove();
      // }
      marker = new mapboxgl.Marker(el, {
        draggable: true,
      })
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(this.map)
        .setPopup(new mapboxgl.Popup().setDOMContent(assignBtn));
      marker
        .getElement()
        .addEventListener('mouseenter', () => marker.togglePopup());
      this.markers.push(el.id);
      console.log(this.markers);

      assignBtn.addEventListener('click', (e) => {
        const idElement = document.getElementById(el.id);
        const index = this.markers.find(
          (idAtribute) => idAtribute == idElement?.getAttribute('id')
        );
        this.markers.splice(index, 1);
        marker.remove();
        console.log(this.markers);
      });
      // marker.on('dragend', () => {
      //   const lngLat = marker.getLngLat();
      //   console.log(lngLat);
      //   el.style.display = 'block';
      //   el.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
      //   marker.setPopup(
      //     new mapboxgl.Popup({ offset: 25 }).setHTML(`
      //   <p>${(lngLat.lng, lngLat.lat)}</p>

      //   `)
      //   );
      //   marker.setLngLat(lngLat);
      // });

      // el.addEventListener('click', (e) => {
      //   console.log(e);
      // });
      // this.markers.push(marker);
      this.markerIndex++;
    });
  }
  delete(e: any) {}
  draggableMarker() {}
  deleteMarkers() {
    this.markers.forEach((marker: any) => marker.remove());
    console.log(this.markers);
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
      markerDiv
        .getElement()
        .addEventListener('mouseenter', () => markerDiv.togglePopup());
      // markerDiv.getElement();
      // .addEventListener('mouseleave', () => markerDiv.togglePopup());
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
}

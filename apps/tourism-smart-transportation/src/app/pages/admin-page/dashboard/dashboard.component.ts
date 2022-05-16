import { MapService } from './../../../services/map.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  AfterContentInit,
  OnDestroy,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'tourism-smart-transportation-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  coordinates: any;
  locationForm!: FormGroup;
  markers: any[] = [];
  markerIndex = 1;
  markerArray: any[] = [];
  constructor(private mapboxService: MapService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.mapboxService.initializeMap();
    this.mapboxService.setMarker();
    this.mapboxService.getCoordinates().subscribe((res: any) => {
      this.coordinates = res;
    });
    this._initLocationFormArray();
    this.addMarker();
  }
  _initLocationFormArray() {
    this.locationForm = this.fb.group({
      locations: this.fb.array([]),
    });
  }
  get locations() {
    return this.locationForm.controls['locations'] as FormArray;
  }
  addNewLocationForm(markerLnglat: any) {
    const locationForm = this.fb.group({
      stationName: ['', [Validators.required]],
      longitude: [
        { value: markerLnglat.lng, disabled: true },
        [Validators.required],
      ],
      latitude: [
        { value: markerLnglat.lat, disabled: true },
        [Validators.required],
      ],
    });
    this.locations.push(locationForm);
    console.log(this.locations);
  }
  deleteLocationForm(i: number) {
    this.locations.removeAt(i);
  }
  onSaveLocation() {}

  addMarker() {
    this.mapboxService.map.on('click', (e) => {
      const el = document.createElement('div');
      el.id = 'marker' + this.markerIndex;
      const divElement = document.createElement('div');
      const assignBtn = document.createElement('div');

      assignBtn.innerHTML = `
      <button type="button" class="buttonPopup" click="delete(${el.id})">Delete</button>`;
      divElement.appendChild(assignBtn);

      const width = 40;
      const height = 40;
      el.className = 'marker';
      el.style.backgroundImage = `url('../../../assets/image/google-maps-bus-icon-14.jpg')`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = '100%';
      el.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker(el, {
        draggable: true,
      })
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(this.mapboxService.map)
        .setPopup(new mapboxgl.Popup().setDOMContent(assignBtn));
      marker
        .getElement()
        .addEventListener('mouseenter', () => marker.togglePopup());
      this.markers.push(el.id);
      this.markerArray.push(marker);
      const markerLnglat: any = marker.getLngLat();
      this.addNewLocationForm(markerLnglat);

      // console.log(this.markerArray);
      assignBtn.addEventListener('click', (e) => {
        const idElement = document.getElementById(el.id);
        const index = this.markers.find(
          (idAtribute) => idAtribute == idElement?.getAttribute('id')
        );
        this.markers.splice(index, 1);
        marker.remove();
        const markerLnglat: any = marker.getLngLat();

        //remove marker and return index
        const indexMarker = this.markerArray.findIndex(
          (marker: any) =>
            marker._lngLat.lng == markerLnglat.lng &&
            marker._lngLat.lat == markerLnglat.lat
        );
        this.deleteLocationForm(indexMarker);
        this.markerArray.splice(indexMarker, 1);
        // console.log(this.markerArray);
      });
      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        console.log(lngLat);
        el.style.display = 'block';
        assignBtn.innerHTML = `
        <p>${lngLat.lng}--${lngLat.lat}</p>
        <button type="button" class="buttonPopup" click="delete(${el.id})">Delete</button>
        `;
        marker.setPopup(
          new mapboxgl.Popup({ offset: 25 }).setDOMContent(assignBtn)
        );
        //update lng and lat marker
        const indexMarker = this.markerArray.findIndex(
          (marker: any) =>
            marker._lngLat.lng == lngLat.lng && marker._lngLat.lat == lngLat.lat
        );
        this.markerArray[indexMarker]._lngLat.lng = lngLat.lng;
        this.markerArray[indexMarker]._lngLat.lat = lngLat.lat;
        this.locations.at(indexMarker).patchValue({
          longitude: lngLat.lng,
          latitude: lngLat.lat,
        });
        // console.log(this.markerArray);
      });
      this.markerIndex++;
    });
  }
}
import { MapService } from './../../services/map.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
} from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-admin-pages',
  templateUrl: './admin-pages.component.html',
  styleUrls: ['./admin-pages.component.scss'],
})
export class AdminPagesComponent implements OnInit, AfterViewInit {
  constructor(private mapService: MapService) {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {}
}

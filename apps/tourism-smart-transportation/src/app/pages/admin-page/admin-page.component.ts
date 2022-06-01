import { MapBoxService } from '../../services/map-box.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
} from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-admin-pages',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit, AfterViewInit {
  constructor(private mapBoxService: MapBoxService) {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {}
}

import { DashboardService } from './../../../services/dashboard.service';
import {
  IReportEmbedConfiguration,
  models,
  Page,
  Report,
  service,
  VisualDescriptor,
} from 'powerbi-client';
import { Subject } from 'rxjs';
import { MapBoxService } from './../../../services/map-box.service';
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { PowerBIReportEmbedComponent } from 'powerbi-client-angular';
import { ConfigResponse } from '../../../models/ConfigResponse';

@Component({
  selector: 'tourism-smart-transportation-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  $sub: Subject<any> = new Subject();
  dialog = true;
  @ViewChild(PowerBIReportEmbedComponent)
  reportObj!: PowerBIReportEmbedComponent;

  // Div object to show status of the demo app
  @ViewChild('status') private statusRef!: ElementRef<HTMLDivElement>;

  // Embed Report button element of the demo app
  @ViewChild('embedReportBtn')
  private embedBtnRef!: ElementRef<HTMLButtonElement>;

  // Track Report embedding status
  isEmbedded = false;

  // Overall status message of embedding
  displayMessage =
    'The report is bootstrapped. Click Embed Report button to set the access token.';

  // CSS Class to be passed to the wrapper
  // Hide the report container initially
  reportClass = 'report-container hidden';

  // Flag which specify the type of embedding
  phasedEmbeddingFlag = false;

  // Pass the basic embed configurations to the wrapper to bootstrap the report on first load
  // Values for properties like embedUrl, accessToken and settings will be set on click of button
  reportConfig: IReportEmbedConfiguration = {
    type: 'report',
    embedUrl: undefined,
    tokenType: models.TokenType.Embed,
    accessToken: undefined,
    settings: undefined,
  };

  /**
   * Map of event handlers to be applied to the embedded report
   */
  // Update event handlers for the report by redefining the map using this.eventHandlersMap
  // Set event handler to null if event needs to be removed
  // More events can be provided from here
  // https://docs.microsoft.com/en-us/javascript/api/overview/powerbi/handle-events#report-events
  loading = true;
  constructor(
    private mapboxService: MapBoxService,
    private httpService: DashboardService,
    private element: ElementRef<HTMLDivElement>
  ) {}

  ngOnInit(): void {
    this.embedReportPowerBI();
    setTimeout(() => {
      this.loading = false;
    }, 5000);
  }
  ngAfterViewInit(): void {
    // this.mapboxService.initializeMap2();
  }
  ngOnDestroy(): void {
    // this.mapboxService.map.remove();
  }
  embedReportPowerBI() {
    this.httpService
      .getEmbedConfig('https://aka.ms/CaptureViewsReportEmbedConfig')
      .subscribe((reportConfigResponse) => {
        this.reportConfig = {
          ...this.reportConfig,
          id: reportConfigResponse.Id,
          embedUrl: reportConfigResponse.EmbedUrl,
          accessToken: reportConfigResponse.EmbedToken.Token,
        };
        const reportDiv =
          this.element.nativeElement.querySelector('.report-container');
        if (reportDiv) {
          // When Embed report is clicked, show the report container div
          reportDiv.classList.remove('hidden');
        }
      });
  }
}

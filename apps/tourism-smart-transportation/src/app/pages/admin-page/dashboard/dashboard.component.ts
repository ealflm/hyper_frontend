import { DashboardService } from './../../../services/dashboard.service';
import {
  IReportEmbedConfiguration,
  models,
  Page,
  Report,
  service,
  VisualDescriptor,
} from 'powerbi-client';
import { Subject, Subscription, take, takeUntil } from 'rxjs';
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
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  $sub: Subject<any> = new Subject();
  dialog = true;
  @ViewChild(PowerBIReportEmbedComponent)
  reportObj!: PowerBIReportEmbedComponent;

  reportClass = 'report-container hidden';
  phasedEmbeddingFlag = true;

  reportConfig: IReportEmbedConfiguration = {
    type: 'report',
    embedUrl: undefined,
    tokenType: models.TokenType.Embed,
    accessToken: undefined,
    settings: undefined,
  };

  loading = true;
  constructor(
    private mapboxService: MapBoxService,
    private httpService: DashboardService,
    private element: ElementRef<HTMLDivElement>
  ) {}

  ngOnInit(): void {
    // this.embedReportPowerBI();
    this.embedReport();
  }
  ngAfterViewInit(): void {
    // (document.querySelector('.position-static') as HTMLElement).style.display =
    //   'none';
  }
  ngOnDestroy(): void {
    // this.$sub.complete();
    this.$sub.unsubscribe();
  }
  embedReportPowerBI() {
    this.httpService
      .getEmbeddedTokenPowerBI()
      .pipe(take(1), takeUntil(this.$sub))
      .subscribe((reportConfigResponse) => {
        this.reportConfig = {
          ...this.reportConfig,
          id: '3e481985-a0d9-4dfc-b89a-5873bdade319',
          embedUrl:
            'https://app.powerbi.com/reportEmbed?reportId=3e481985-a0d9-4dfc-b89a-5873bdade319&autoAuth=true&ctid=447080b4-b9c6-4b0b-92fd-b543a68b4e97&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D',
          accessToken: reportConfigResponse.body.token,
        };
        const reportDiv =
          this.element.nativeElement.querySelector('.report-container');
        if (reportDiv) {
          reportDiv.classList.remove('hidden');
        }

        this.loading = false;
      });
  }
  async embedReport(): Promise<void> {
    let reportConfigResponse: any;

    // Get the embed config from the service and set the reportConfigResponse
    try {
      reportConfigResponse = await this.httpService
        .getEmbeddedTokenPowerBI()
        .toPromise();
    } catch (error) {
      // Prepare status message for Embed failure
      //      await this.prepareDisplayMessageForEmbed(errorElement, errorClass);
      //this.displayMessage = `Failed to fetch config for report. Status: ${error.statusText} Status Code: ${error.status}`;
      // console.error(this.displayMessage);
      return;
    }

    // Update the reportConfig to embed the PowerBI report
    this.reportConfig = {
      ...this.reportConfig,
      id: '3e481985-a0d9-4dfc-b89a-5873bdade319',
      embedUrl:
        'https://app.powerbi.com/reportEmbed?reportId=3e481985-a0d9-4dfc-b89a-5873bdade319&autoAuth=true&ctid=447080b4-b9c6-4b0b-92fd-b543a68b4e97&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D',
      accessToken: reportConfigResponse.body.token,
    };
    this.loading = false;

    // Get the reference of the report-container div
    const reportDiv =
      this.element.nativeElement.querySelector('.report-container');
    if (reportDiv) {
      // When Embed report is clicked, show the report container div
      reportDiv.classList.remove('hidden');
    }
  }
}

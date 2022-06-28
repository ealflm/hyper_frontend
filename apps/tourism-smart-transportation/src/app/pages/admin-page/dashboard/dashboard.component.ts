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
export class DashboardComponent implements OnInit, AfterViewInit {
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
    // setTimeout(() => {
    this.loading = false;
    // }, 5000);
  }
  ngAfterViewInit(): void {
    this.embedReportPowerBI();
    // this.mapboxService.initializeMap2();
  }

  embedReportPowerBI() {
    this.reportConfig = {
      ...this.reportConfig,
      id: 'ded06add-f791-4ad0-803d-279bbe4c7bda',
      embedUrl:
        'https://app.powerbi.com/reportEmbed?reportId=c62daf71-599a-4475-a7aa-22ac491136cb&autoAuth=true&ctid=447080b4-b9c6-4b0b-92fd-b543a68b4e97&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D',
      accessToken:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNDQ3MDgwYjQtYjljNi00YjBiLTkyZmQtYjU0M2E2OGI0ZTk3LyIsImlhdCI6MTY1NjM5Mzk2OSwibmJmIjoxNjU2MzkzOTY5LCJleHAiOjE2NTYzOTk1MzMsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84VEFBQUE1L0RzOFFkQm9OdVNoaEZzMGJIcGZ2RlVzVVovZlJGRjdBdGVSYjNuZGxWNEVUTy9wL1NzWlc2S1JsQ0NUMzhLIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6IjIzZDhmNmJkLTFlYjAtNGNjMi1hMDhjLTdiZjUyNWM2N2JjZCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiTmd1eWVuIExhbSBDb25nIiwiZ2l2ZW5fbmFtZSI6IkRhbmgiLCJpcGFkZHIiOiIxMTUuNzYuMTQ2LjE1NSIsIm5hbWUiOiJEYW5oIE5ndXllbiBMYW0gQ29uZyIsIm9pZCI6Ijc2MzM1ZDhiLWVjMDYtNDI3MS04NTYzLTVkYTFjNDJlNzQ5MSIsInB1aWQiOiIxMDAzMjAwMEZDREY3MDM3IiwicmgiOiIwLkFWUUF0SUJ3Uk1hNUMwdVNfYlZEcG90T2x3a0FBQUFBQUFBQXdBQUFBQUFBQUFCVUFBby4iLCJzY3AiOiJBcHAuUmVhZC5BbGwgQ2FwYWNpdHkuUmVhZC5BbGwgQ2FwYWNpdHkuUmVhZFdyaXRlLkFsbCBDb250ZW50LkNyZWF0ZSBEYXNoYm9hcmQuUmVhZC5BbGwgRGFzaGJvYXJkLlJlYWRXcml0ZS5BbGwgRGF0YWZsb3cuUmVhZC5BbGwgRGF0YWZsb3cuUmVhZFdyaXRlLkFsbCBEYXRhc2V0LlJlYWQuQWxsIERhdGFzZXQuUmVhZFdyaXRlLkFsbCBHYXRld2F5LlJlYWQuQWxsIEdhdGV3YXkuUmVhZFdyaXRlLkFsbCBQaXBlbGluZS5EZXBsb3kgUGlwZWxpbmUuUmVhZC5BbGwgUGlwZWxpbmUuUmVhZFdyaXRlLkFsbCBSZXBvcnQuUmVhZC5BbGwgUmVwb3J0LlJlYWRXcml0ZS5BbGwgU3RvcmFnZUFjY291bnQuUmVhZC5BbGwgU3RvcmFnZUFjY291bnQuUmVhZFdyaXRlLkFsbCBUZW5hbnQuUmVhZC5BbGwgVGVuYW50LlJlYWRXcml0ZS5BbGwgVXNlclN0YXRlLlJlYWRXcml0ZS5BbGwgV29ya3NwYWNlLlJlYWQuQWxsIFdvcmtzcGFjZS5SZWFkV3JpdGUuQWxsIiwic3ViIjoiS2NGR2pNQ1JiUS0wRUFlbEdQUlh0SnRLYU9vMndSQnYtcHR6UVFFZU4xbyIsInRpZCI6IjQ0NzA4MGI0LWI5YzYtNGIwYi05MmZkLWI1NDNhNjhiNGU5NyIsInVuaXF1ZV9uYW1lIjoiZGFuaG5sY3NlMTQwNjU1QGZwdC5lZHUudm4iLCJ1cG4iOiJkYW5obmxjc2UxNDA2NTVAZnB0LmVkdS52biIsInV0aSI6ImRfbFZ1d3ZOQzBXbExKLV9JTml3QUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdfQ.XiRZn1JH4Pp1F71JHndZnWJqNiG-u8hpaHLAQNYEdmsdOwJV0wIXwThAN4sypirkDNbhKw4e0YuitTnELToyVe0f8PfxRs9Y7HhTvaRRBRb5p0_leSdDAttxLsy6-ZTa4PnnnP3j2zxMe0Y7N_6BUe2lRsQI1lg7vAcUqHuyQpQ5UXe_6YzW0_gxqf91p-RWOCL4lWg5ZisfYG8ab93kPcciD-bYh4vvlhyS5w4eIIvPUk6l6WthCidXSE5eJi4VPbpEEfSDEjG5hJKmMGRLdnE4HIPyRATHIXB9zNKCwhR5w3lwVPtwMD9sAOZwkhAbFcp3v7YB60I-_L6Wn1dUSQ',
    };
    const reportDiv =
      this.element.nativeElement.querySelector('.report-container');
    if (reportDiv) {
      // When Embed report is clicked, show the report container div
      reportDiv.classList.remove('hidden');
    }
    // this.httpService
    //   .getEmbedConfig('https://aka.ms/CaptureViewsReportEmbedConfig')
    //   .subscribe((reportConfigResponse) => {
    //     this.reportConfig = {
    //       ...this.reportConfig,
    //       id: reportConfigResponse.Id,
    //       embedUrl: reportConfigResponse.EmbedUrl,
    //       accessToken: reportConfigResponse.EmbedToken.Token,
    //     };
    //     const reportDiv =
    //       this.element.nativeElement.querySelector('.report-container');
    //     if (reportDiv) {
    //       // When Embed report is clicked, show the report container div
    //       reportDiv.classList.remove('hidden');
    //     }
    //   });
  }
}

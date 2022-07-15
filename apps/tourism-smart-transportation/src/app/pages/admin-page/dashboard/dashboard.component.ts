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
    setTimeout(() => {
      this.loading = false;
    }, 4000);
  }
  ngAfterViewInit(): void {
    this.embedReportPowerBI();
    // this.mapboxService.initializeMap2();
  }

  embedReportPowerBI() {
    this.reportConfig = {
      ...this.reportConfig,
      id: 'c62daf71-599a-4475-a7aa-22ac491136cb',
      embedUrl:
        'https://app.powerbi.com/reportEmbed?reportId=c62daf71-599a-4475-a7aa-22ac491136cb&autoAuth=true&ctid=447080b4-b9c6-4b0b-92fd-b543a68b4e97&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D',
      accessToken:
        'H4sIAAAAAAAEACWUx66EVgBD_-VtiURvkbKAoQ-9w45eL51hIMq_50XZ2l4d2f77x87ucc7Knz9_BFXSaNExEyX2y1ZjRHYFGaisiVe6PRLXLV93nNTgVnlJ-QgUnsp4XGutHSzQZzKHCYkAOeBD2iBGjqkiaEO1QkN_xCGtixEiGIOMLO7D83YxvW6C0O2R69OuLR2FzSwRwONx9s0XokZ2oZOHubBNxczLyBAps_24eDEePhFaSG30JwiGt4jXbSJ6kdHK0Lcjj3lPTXS_hzK2q7zaasGNpUJI8EUZgl7qWr7pPfZo3mjr18XJ4lvryY-RO9aUjOG0MG4JxzcDGR2reIkh4EQNGkD3hZDD57zZ_aLN_KK3vMPIh8ov6sVZl3-nWvKqqf6DVySvISR9qoY5gpbHyM2dX7eIdp-iJPkq_L5fVX9xkU2zGoCCcjuZxLoA0_XVrNC1KiJYlStozJis8xDtncZW1ruND-ebHF2uqF42ePHAEcwgcN06hI7SPLcddNk25qVs1KJdNYQ9RoAfPONT8bmDPMfOWeoyP-SA3WkTMsZpQzmcUs_xhFs703h0Fh8tnSsLmQr41NQGRU56JNPPXfmwH313ckjDNHHfnYPz-mU7OYfioQDFUR_zm5RJbBlplagmp8JvS9oluV2_tBzrSI6I6RQSF0uZvNqlh8-8K3fJA-brcT2NUf4pcJj6FJk0tBywuRnt5PN6SATG1_zUkkljkGjScM466E2IEI591_QLVUVup0Lh-0x90qK8eEhjfcloQBFKX0uX-BCPCWomnDghnmyfrCj6sbSXThtduKZoRhq3VOhiXVv6b6sR3Zvc8dQdwR-vIUka8OsNggKa0Jelk6RVlhbw-RNQrDMM2jrrqvi9v2nhBmO2xaY_Jvf0rs_WbX_--Hlt93LM7-r-nZODXHzD6nyEv6hocnfB-UjkotlLZQmGxp9xFwBFZ3YHttdTOBrpeZcVK31JtQk9xCeJ6Szm1J-y2HzI47dEIGWa-0PlpEE3kRasPRt7PCy64abfgeEhx7mQzAFf0B0OYxKtx5F7tk3Y1zd1vc2poCScTJnOE4TPZxhWp8bgp4s1dV4DeWWFmEiFvBU38XfzJnji2ZMKj0A1G6XRg5myl6VopuWmpxXdVqLFPXjwfT88dDDWLRcBpdrdPCSj8o7XJZArSZFpJp9gPwzEmxaDVdJ7KeDhy-VPWr3m6kICKzW8G9bmbr18j2jtRSaq7gtlHCtxdNEJaa8UkpcUAHBHxSHc9ddf_2G-l7ba1PCXsmYa4tkZXj-wBBmUIN3J7_R_yuuaKTvOrfqNichbhrPB9UJAbu3uqEiJr8wur_SMeSLvig9gS1M_1nC56IKUX05CrBa7ZRypz6EIJ9jic5Snx4MO0C4WInu-id555-ZtOuortpjch9jCXTqxpqDC400M0YP-GhE0wMq-EmnYbJXEllxdZcMYGmAzzT_uzrwOlFJktCu2V5JZ-QgDyCr5dVr0Zpv2wrop9nWFl_xM-VFah_oepZSUuCzxlbzcKKsPsEO95EDnDD_flQBv7BMK7pzlm4aqP3aYbZGfs1AlKG6O0Nivco5UaAmKKQfeKbS3yOtldaafABsktgDDeMoPJGSYSpa_32xxDtjfc1PP6mVWWlaxOLlcUqJtA_Yf5n_-Bfk1vtVCBgAA.eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUVBU1QtQVNJQS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImVtYmVkRmVhdHVyZXMiOnsibW9kZXJuRW1iZWQiOmZhbHNlfX0=',
    };
    const reportDiv =
      this.element.nativeElement.querySelector('.report-container');
    if (reportDiv) {
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
    //       reportDiv.classList.remove('hidden');
    //     }
    //   });
  }
}

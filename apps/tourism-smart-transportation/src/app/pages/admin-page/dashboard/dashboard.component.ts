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
        'H4sIAAAAAAAEAB2Tt66EVgBE_-W1WLrAEi25IMOSl0xHzjktWP53P7s_U8wZzd8_VnL3U5L__PkDfHgwDFhbj7uNo2QNOQcdji-MWcte6yaIsfSqUrHli7rBzWBA1YA1c_MIu5L-MB1y2v7uNLYRoZiS-wSVvI4cryEEDN93rb8hF7JHTTfdLLatQjYmOckdknqdpWjBGZxuJf8EjV91gQu0UQPOHZPFLF8GRmk9qgtSbnAra918WIosYllzfA_nxRSyFk5yA1-f6lG7L17pHG9_3E676plsUB3VCRHJ0qpoucr8NGPbL87GFwk7drzZiFs9lm_F-KIAmTqM0RfxK5mvm9nCrj9Ge-wVqvqMHfuiJT2fQ8UPoimajLRyhNrSw_Uc0Hyta2xSgpvWJrLgZPmWO9T8UuPOL2x0YacJZS8r79UhNTB5cUlT3hfW1bnmzqLh1Z-ZHA6FxGS18KR06GZtibu5zMQ6Q7TiqaiYZyESazSLkK-sOrx9G6G3LNMzwU6FI0YvN3vUPqVo_RAlxt6SeO5-IxkakCYozyvD0sixGMTHqwFpMH38zEVVlXYYE5K-MaGNeHIpk6fns4P-7FBqFe1YAaDZwSSaiqAE0Rm_d3gg3MJubdxVeVg7Xb8jX_nxkKgMhNqVRbcHdgHFaHVWUnvQMVn5pnG8TPJzWEIfdzBW2H6BI5lwKnP88o8Dq4waIyjMLZj1Hr-Q2AdiiyuVSmioTs5q1sTYdsF0EvVoB93ul-RoOV9KJGilc7Hnu7lxceW69RSW8ZKcPEAqEkkCkWlGxgMBGJrgbSfwa6QLdEvmKV_Ag3XvUDp9EsoIznVGHCxNhlITd889rsC1oLHovpmAn9fPHhAi-QFkohjlC_F53FVAkNPfOdRT_WaKrHgiRLUp25vJU_n544db73mf1OL-vRNrePseRFw3QqFweoXMp7761ITKVB1QDCPSQK_yBBDWTXJdaNROYoRsQPpQ7xP1yAXlI-5l8dUQfmgfc6Z7qRX5D5eyLtJZrPNNjpiMlnsBNfwSxJJwaqJbzFimD3-q0_ZoeOPy8s3VFvLIpk83nTAVM1htUO8ui5_N4TyMeEsT9O1pQF_VGdAJGMrCK3SKNubkbsk-Vgw7jRaio5QF68Qv9UUZo7yddVtC9huYwpTaPDnpZqypY6rKXroPUT1nQ7M6154pgXsXtuyS0MsRXC-aXB4C5SNZaKv2Pm9vHkWJj0m8tTZ_4pk9uLuCoioJ8ORs6tpsr4n6TPrY5pj4CkvBqf766z_N91wXq-L_WsZaB-CiEs6xgIzbuHuR-HGY_ymnqcZkP9biFwtZSmzPS1Dwj0K5GM8pwxuzsolWqKGcY30nbqu1VQsXwObiKG8zXuEg2iAiC5isSMwf0iKrBT-Jm0aukm0VAjiHQ7_rSBtcj910XNyxRjmXxtqmXc9kJpUDQJhBW20NNwOeem2rGC7oYvpmp3bFR2dLyz5JkfqqVXL9dp1ym7ZJEXV4_j3it5EbFdjrvFD9opFAuhDF04UnobEbxd6uXzqKBGC6g78qZAIrzqPapL2yypCu3Hl3qN59gck1_jY-xaTaxYnsYHqjEuHhPAoiR2r6erwiLCIhOz1ll5de6gEijUmY8HXP42OpUJ9b_Ba3StkWkQUvNWTQq2PZoe17C8z9N8Y__wJr00ZxQgYAAA==.eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUVBU1QtQVNJQS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImVtYmVkRmVhdHVyZXMiOnsibW9kZXJuRW1iZWQiOmZhbHNlfX0=',
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

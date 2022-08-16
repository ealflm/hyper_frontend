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

  loading = false;
  constructor(
    private mapboxService: MapBoxService,
    private httpService: DashboardService,
    private element: ElementRef<HTMLDivElement>
  ) {}

  ngOnInit(): void {
    // this.embedReportPowerBI();
    // this.embedReport();
  }
  ngAfterViewInit(): void {
    // (document.querySelector('.position-static') as HTMLElement).style.display =
    //   'none';
    this.reportConfig = {
      ...this.reportConfig,
      id: '5063a581-7c8f-4abf-90ad-3f8dad280560',
      embedUrl:
        'https://app.powerbi.com/reportEmbed?reportId=5063a581-7c8f-4abf-90ad-3f8dad280560&groupId=1a3b802a-469d-4819-af81-296036d0adce&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUVBU1QtQVNJQS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImVtYmVkRmVhdHVyZXMiOnsibW9kZXJuRW1iZWQiOnRydWUsInVzYWdlTWV0cmljc1ZOZXh0Ijp0cnVlfX0%3d',
      // accessToken: reportConfigResponse.body.token,
      accessToken:
        'H4sIAAAAAAAEAB1Xtw7sCA77l9d6Aee0wBbOOWd3zh7ncbYP9-83e60gFSQoivrPHzt7hjkr__z958aM4fZtqy1DSZ539E0vhfcITvdHCw3NkWMXgeEUkYw9I5U3yZlJoAhhy0MUdTspXJMLiW6K2-G4XDJ8xXs3XZ9Zt5GEZDoX3mNn9HMJuXgBq8ZidLYN0thmIrI20qGjPlI6qMAcMjYiMUwQRSQNKBHgXXNiKZmJ6dfGrpKwLoBikFLvv9yB1slrbt3zzTzPMU8Mn3Jh70Js-pzf1bXqhD3ch3KHXCqlHNGSssNqZd8S1v_c9ECXwnrwTZLIgHkZzaKD3_KT4AiGmfHS8o_iA5uUmr27V_hlnfTqBXFdHot3lLh6NCii_WpubtcbdETIiD7Lq0gMwvBdaAEtWB2E1O_FZtvBaHs5AJSS3dZ1EFnl5QKxinhFuYIl1WjLU2yAFs67meS3B_vNVkPVWhzlk9-HsMY2SAqj-RABuKD6LLBLgA5cRwALdjkk_v0-rnUJelIsGGixQGmiVoDFdE3CSgLRnxrEOrHrQEt9gaogu_0cfK_ouaKHtcK855WAe_wHA_yeRwB_6XdyShL3vbY0Agw75Xr3miXq7iCT3SEctq5GqfiibFVGRqhMQ0tvVD17L90gkJAMtnTvdKHLs_AwpYc_7NfDDYnqu1GsP0_gWOrobIwwVfLSDmIGekhmp1H7RRrTBiHdSQuTLKp1Fw28zSRM1WWCEL5mY52MYWHioCuuFV5JwSqJ8MwD4TWkkFBzxDUitJ8BtQ8LQLrlmhVdDAakoaXPzbok95TRuBJZvLuGh2bBgLV2eBR2_TzR7p5sg-Kg0PkBb_r0qxF5mrEl69hpbLh8X-xKbuwt0a6LivhvFRBriM9yDXEWfY0fdiDO1-5k5ASrh5IRFKe6-LUNgkAz17fHbyWO12tIhLl-ELvIwjS5BKj0mHoq62UOeldfyXiZleOjAtgA0_VPUAmQB7fqgRU9ayrLEzMEtG4iVt74JXSK7k5MJRbi-9bzY5Cr3ztg5Yg2h3LOS4aFJ6Zq-vQ3gZ-VCCSbZvSS4GNsOPXiJvujXWMbwNcZDYZm1odFg12Z7vE9jzF55TQMlzafUoBdrHEmgGItZJ6FlghIs601M2pK9fQ-Z99UVMhcX_YeS9Vqkf1QFnZxHwRcO_C7Zxy9jU74Ggx9zhDMVMvmPWoEiozSaIb1GtimPgiWHy3I5BKd6bkWljVIXgmxuPkFtyxfy87T9hCIfXmac5BlVUP8kcT3AAVo-FIoJ3SgV8Inx-lG7rfUB2qX7sPrWRpnE_JbTaSdGtjgvO9FLuTkG6gRHCkVSL2psx_3uYPafvR_t2KbKizbTY5U3gQcFfHy5zZFDyxAXRdq4V7nvfomJOczsb35kVhpUrur92xYZgiwC6jmS22dfItSThfs4tw2IQt9OtwCC644f7cKnpLqbMLURyUoJZ6SF360-eQ0L5Hm7ah81koOYBCy-4Rlvr07i5A_F_cd9e_8cpj1iXO51CRnH-954qHd0Dg-TDVUC8GxzMF0kOTk9IK-Tesxvlpn5UbiLPQ90A5gxpClAxz_TYRdOi-6HevLxGf3k-HXYFe6eh8IEjaIJay5bz65glZdN6Ig612lsDVqMURYjWUNNc2bAk39YQsvBDRjls0grHrTsrT5UmxxsjLPWgdD1Td5CSPegYrIUBESgn7VuUI3dWBvRFJ4jpOZ90AfOEv9MEVAw3VwQivNkwq68TFz6GsMtXeskvNw3S0-v_neN-bgYgXUfTTiXej5YgBUbC4UPbY9wbdLOy80qLMebHF5zqjLij4wH1WNOxo0JY1X2SFlEdK5c2_YmuHK2q7gq6rWTMKkWDPNfAlBOeFepmFpSoWkR_mw4FEW0HQ2QYFIyPI-TRqHIep75VenajbUE-S0xkdHYreXm154ekMI-vq7V9DJF7eXD-osyno_feUjLjbGD6ZJX4pIHFbmSmLsyBLuA2fJA7xk36vl9jrbw-VhHyHW-f0ISLFJxYFMOTg9GsZB1nFDp-BeiDZsOvM7AVvGVw6BL6qADOtOrWtQPV2wVK0r0-QbDhUueOePj9NFIeNFXoZkp2_yyO5lFAsdQ7Dq6EdpiG9XVkcUvDL7NlI4EvkSlLfk0uAwPlFN45NavaIQzh0Yje4dHLFZVA13DmDnoYAysCXRPhUSzNxh2DbSzVAKxiAgQYcv-yxF2fpc4-2Ct74NDHgsU1VtdCqklGdJze9V9fLHmRzvPCvkOoDkEkXIkZG23iJIHqlve-Q2HFz5WNn2luDolb5LLjf4tz0X8XK16IUqcoKbw10Xz3mEHcoNNNz5D-2XUvNdnUj_gn7ZBxXwPB8hIj_onYE8S26TGBiutcKjF10gCgXl6LUwdUbSD8GnYgKJhOFo8_xkyZXepJz-Cby8IMfasgWWsVXKqN_FRGIFLOE2P_goiMk403_GqybxGf_UGHBHKBaWHinFPUq4azznOyJnOcQF62c9WlvQUxi8oIQBJ-cY87vGj-thjS8LOcF6VHpJsUYHezUsS_qhScXRez50pzapRKkZ7yGLxvfmvWuvJSdfSN2FKRlnMU4j6xy8CoRNBrpPyqy75BfjLOfIrVDzWVrsXYD6OWufEyJvWdHrDX_--sOtz7LPWvX84iBHjjrZvC0eJ9D5pDwxWAzdYNpoBaBtXWj06TDwbFQlYE51nmLgWYLo6Zk-yvxnjmBZ42uMGfNzegPRiLcG3ItCphyAnqPOTE7LIjB7Vb7ZgZglIisAcx4Yt1wE9sXLL_LxrM3OTewA5SrvVAmiHS19KZvwACrjtgcep7Ab7jzCkl68hNhDefI6t1Lv1Pvu9muA4MpZkXvtUEU68o3UQVcJ6LWZoDb4ZcPZasnG73ER0y0ma0d7UuNIjYvH6LpExGBOwWMKJAxilsxfrNCAfgVWwrDhulebj01xgAWFlt2gKkCrVcrcI6sTlTz_7tqiae-E9i1Fthd7jYK8uB6Y91obwdc___xL87O01aqEP5blKhwcyGMaMyZl6aIXyesW5v9d3qeZsv1Yq1-b2O4806oeEGZtWr48u-dSS53-I0CrH-R6PuU91P_A59fQ9YTyAr6-5t10H4uJvxbSfaipCZcMT2no-0u9pWtqfamRvpYSPigMygRyMkqRCeJQa3XMgMeNXkxbzObGiXuFGl1dq6WCXZNuBws0O1QMHiwoo05F8VwdiIWndmRLNh5D115YyEjf-s_CiNYpeR7hADvG-iO7_Uo5vcT1sxffv5wprihMjTnm99A8mhqInIAOQzT0CchaUKNUOect01ddduNXIsuqoEEGWpxoWHGX_OnLLXZv3G7DwOiW_r0jGVU6jWjJdgB1Uh5cksd8ffiJH6tec6NI5Z-NdhdEclG6znzzo_m__wMmSJ5FAg0AAA==.eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUVBU1QtQVNJQS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImVtYmVkRmVhdHVyZXMiOnsibW9kZXJuRW1iZWQiOmZhbHNlfX0=',
    };
    const reportDiv =
      this.element.nativeElement.querySelector('.report-container');
    if (reportDiv) {
      // When Embed report is clicked, show the report container div
      reportDiv.classList.remove('hidden');
    }
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
          id: '1f3dab4e-e566-458a-9c3c-803b0a74d927',
          embedUrl:
            'https://app.powerbi.com/reportEmbed?reportId=1f3dab4e-e566-458a-9c3c-803b0a74d927&autoAuth=true&ctid=447080b4-b9c6-4b0b-92fd-b543a68b4e97&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D',
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
      // console.log(error);
      this.loading = false;
      // Prepare status message for Embed failure
      //      await this.prepareDisplayMessageForEmbed(errorElement, errorClass);
      //this.displayMessage = `Failed to fetch config for report. Status: ${error.statusText} Status Code: ${error.status}`;
      // console.error(this.displayMessage);
      return;
    }

    // Update the reportConfig to embed the PowerBI report
    this.reportConfig = {
      ...this.reportConfig,
      id: '5063a581-7c8f-4abf-90ad-3f8dad280560',
      embedUrl:
        'https://app.powerbi.com/reportEmbed?reportId=5063a581-7c8f-4abf-90ad-3f8dad280560&autoAuth=true&ctid=447080b4-b9c6-4b0b-92fd-b543a68b4e97&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWVhc3QtYXNpYS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D',
      // accessToken: reportConfigResponse.body.token,
      accessToken:
        'H4sIAAAAAAAEAB2Wx86EXJJE3-Xf0hLetdQLXOG9rx0UF-89jObd5-vZxyIVmXki_ucfJ3v6KSv--fc_kU6ZUL3XZqfy6B269qnaOdhs3GDawYYDmrEZJRkkHiXOBeV9d7riLZjwVeYZkTg5XIl21Jjxr4WKRk27IFgsCxlIlzhQQ6Kgdvsocyx1PpdYNnNap2d8HV5dYnsb5JBSJu0Jw9571VuGl77FMx9GhViu3cSHk9rDq3uAjGmeFjOv_Bi7iBQZR-uXP8eslQ5_HJBZt7Q29NY6IlKYByggyIEQ5T6vd3KyjRdIVHgUI5LMHeusJO0rHM4JmS2pJv-silDSVFgk0-oeJWlaNyzaWK3jHCJiNfnlr5Te2s9kiqvwq8Idj0AmOXRicv53t9HfZytsUxRjicIYpcdnFrLKXr1vNRiTXoRpeOgTyE1KOI59c25hJbrsILQH70Z375vySPit9ZvKTs2s6W9Ld0gS9H7SJPVKbnXvNkW2VCveUwNNkYuSu2ZCoHMoAnJS2v0SRL4EITuYxYe6Xy-eHxJ60iFBiRB_YRXmIu1lPrWgVueUHaGkDOYQzi9fd-JunH1ZYFVIbOcs7bsnqf1cqC-m00sjmOVkQlQmh3YWidHBoodZZZCLTGX4PjPu5hxVUPdsQTCVMQsVv3TellTUmzrb9i5CfNOs_Dj67eRyLAwUonaj25WsyURfirkEQnlObHV3Vhx4j-aF-OTqS7bUnIBfOEH2-wlEDMXj5sTfDt4frQY6-pJqLOztqbFB0E-lfDlfi37yUh0ZmS8_U0yFco1ALSFXx7Ve_GZ-gshON0oicQYMnJWjrZngvRaGsFaGGRX4i0k2YVma6-TBFVTzljJIjLz3sh1XQ5sJvyw9xwsJl4fPV3Psf9g8aGkcWuU3o-vhzrcz1mILhHxYO-uGZsWi0kC80xa4NRhqS8xeTHN5p5tWI4ah6kKvQgzwcYrkzEF5U16OckmFSel8a3YG3zddsEQKGOtqi9Rxmkpjv0FLDpqaZjageKw_ajfOeJk1zOE97RTlnrlXUjP7wOLhsZHsUMPHkM7ivU-PWtGA0KRgv0YqVJEKrcpGDya7AfzkQu_LzQ1fkdj195uzEtPcbfbGYdjVzSZczM6FFTE7Ol52dzhmj_IBY1PbxWN-nVn26MTPdlL30d1s2Inny93q_l7Ag6L0p4kSDbKLXDrsFxnEElW6acTc_I6f7MS0Zzu6mnnwd_vyP0nyWn5u78q1K8VKt_wIWEJfpZxo_674A42rhsdTMdKXRcFn-RIM3byeEbm2N7EVDp_R0bfrZmuzt2rTZRh5utVZ2BX0I9YjSx-dlkN4QLzpjMVsJB0711Zli_Lxt1BKiZM5gNjjhwYbpOmjM4jcjc7Rr2AtfJXaSI3BMCi-o1oVmgCuxl7Ftymhb60_UMXbB5y9jYngHCN2cjXftwJVrTKQSzusGcXAR7Fx8w8j5t1N1NYhW-O1hNd58plkPDXFqsCrJDUTWwRXdvhp6ssWDgpbN_qPAdG1Aedg1Y-9o1ZCMnPf65mFFmKoCm0zflECyxpqahveAt94EPbRh-Gw79VDFRJYMb69B09u3VCjqPSxKOSwH9gRv3kmMvu40x9Z8gPKEBRI2o-kbpTGNfyGBCgJhS814_Yoi1rtc1drZ3f11xRWcscENG2CyAc4qWtoIp9yI3KDwxBz0zkoFFcYvZn6J1H_XrZb3BoBiCSw29CXr7CDaq95zjwFQxYQwkHjOwd58nP-9vtlV47Pvlc5EHyJ_PF-gp2oeCRSx7NKhyIBOjWrwgQ5ILDhMVy42Piz-qrhbk0x8sbCR1fH5Ga3iJr139ioA4N0WYVPkOH6gtz4KwAoHi4gxQcj4ZSD0eZEzy_UKgN8ntKLVaVm_EXOYo9C5KEc9wfGlMHZZIbIBpIeN9zVlIGLA7xYiSGvSnyzpY65Ni2gvGXo-UjsHWYTU_cWgjDPmafcT-Z-r4UOpza22-Y2_pKtOIFDYxapNpzhKO1V-zmpcP5sXyE119GYLvqpcxLJvW72Kg4MfbZqb3dGMtxEJoXLgPX3wi-pyCi2Jyjy_eTbdOMf3z_XO6AgNOPz8adPOo5nhvEDnq2POOVXk_zRgmkUSooWk04lfyo5a9_LcFN3CZYaf0c0Eo--fxwOUN0ipxKrcYO4JMHdCzj6Fa8xPnYBoA6bEspdEBUXaCKCs9rivq4v6SElfCImWovilCSrZ0Mov8-8gwpaGPP5JUF4J1zu0T6izRjvUJ4qRuIEkSa-QJ-0NpFXIPvmd8a-78uH8iAfByL--oR9W2swzOzqF5x9Zg3jc4_sEd8Ja3CxdSvhjxVHB78GqT8I5YALdmXtp2U7O7jvc_DmkwK7nW2xO4AwuyIy1EcU67YNIa1_mMh0wYdqfv7i_pqJ54t6EVy0IdaZF6n07U_D76ktdZP_mqpICTe4Hoyz3PQBnO98CVtPDNJTsBQ9mx-jnanScfZqEKzLpvd7Yvzn-QHoE6ifG1PzzsZYQhOHBVVTwEli_XjRLrjoB3gmpZF4nSVhv04zb23lMmbCiT_aoKhtQPYpVa3NU1oLPec9iAj68kZaD2ftB5N8SVD6MLDwWkALltJjASEsROe2EcmlYChfl3IGehV46WNvY3fofoWphCUw__zrH2F95n3SwfNXBz0R_EDhNx6mDqBQWKWTMOSjvynHXWReUs5aMMvQrWcjdH2SGGiyu24Bt1nzQkWfWNwcp3FJaoAqBp2bCLhLH183liV_KJM-TiSyeNYd9A4HsvAIviL-nJ6RSr40H7sI8ubdv8qZYu8xfRSDdqSBWpOHIGogEraGdz4T503fprWWZ0MnPwUGAs5RaRSajg5iPZmZ7co8otVg7Qjh2gTXtnlo8t0QS46J5NASy8KZRJ5aBYzJYZLJBwfbYmme_aLUiL6TWx-cw6uV-59FxijlJ218KXw7tIUff1P6tQM3TcrM0Xs8hTGo5CVDjZs94nx9GE8vx1lXu_egZXiVNnqpbsTrP__5r83PXINVjf5cnuIakzuxCWEAX8i2a4pTUdX_q_ymGrP9WMGfTLD7jANj0D0xZd14mKqzIr8aTkyTmb4fteUkS3T4wfqrqexva_MuUiBxugF9jkGcl3D9FRvxF8b7pcj2B19PVHmHX1UryEivjIPgv325dmf5GwZqeFK6HHHpxtgky8WtrIT6Eth6Vw1MrirxTG_LCbyTeaGSUQjC4DrC8qsmCpTzQ01Pd99ky7zjHg_sTtKouZX5RLcpF1pv_c7j3FM2LkSZ9B7Puz4IZ32K-XHpB4jBdanN8Y28xFf0jT7AGaBV0Ly9kSu5jBcgmMBV5wO1HbjFK5uFyJFbjJtxv38X6BvLxEhqIhMNpDHnYPeu9OwIUH-cXjvtfYN-F01agPw46jL4v8v43_8DP-X-sQINAAA=.eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUVBU1QtQVNJQS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImVtYmVkRmVhdHVyZXMiOnsibW9kZXJuRW1iZWQiOmZhbHNlfX0=',
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

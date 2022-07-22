import { Subscription } from 'rxjs';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { Chart } from 'chart.js';
@Component({
  selector: 'tourism-smart-transportation-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  basicData: any;
  chartOptions: any;
  basicOptions: any;
  //
  pieChartData: any;
  barChart: any;
  constructor() {}
  ngOnInit() {
    // const data = {
    //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //   datasets: [
    //     {
    //       label: 'Looping tension',
    //       data: [65, 59, 80, 81, 26, 55, 40],
    //       fill: false,
    //       borderColor: 'rgb(75, 192, 192)',
    //     },
    //   ],
    // };
    // const config: any = {
    //   type: 'line',
    //   data: data,
    //   options: {
    //     animations: {
    //       tension: {
    //         duration: 1000,
    //         easing: 'linear',
    //         from: 1,
    //         to: 0,
    //         loop: true,
    //       },
    //     },
    //     scales: {
    //       y: {
    // defining min and max so hiding the dataset does not change scale range
    //         min: 0,
    //         max: 100,
    //       },
    //     },
    //   },
    // };
    // const lineChart = new Chart('lineChart', config);
    // this.basicData = {
    //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //   datasets: [
    //     {
    //       label: 'First Dataset',
    //       data: [65, 59, 80, 81, 56, 55, 40],
    //       fill: false,
    //       borderColor: '#42A5F5',
    //       tension: 0.4,
    //     },
    //     {
    //       label: 'Second Dataset',
    //       data: [28, 48, 40, 19, 86, 27, 90],
    //       fill: false,
    //       borderColor: '#FFA726',
    //       tension: 0.4,
    //     },
    //   ],
    // };
    //

    this.pieChartData = {
      labels: ['Đặt xe', 'Thuê xe', 'Đi theo chuyến'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    };

    //

    this.barChart = {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      datasets: [
        {
          label: 'Danh thu từng tháng',
          data: [65, 59, 80, 81, 56, 55, 40, 81, 56, 55, 40, 56],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }
  ngAfterViewInit(): void {}
}

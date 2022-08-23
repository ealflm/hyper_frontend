import { PrimeNGConfig } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { AdminService } from './services/admin.service';

@Component({
  selector: 'tourism-smart-transportation-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'tourism-smart-transportation';
  constructor(
    private adminService: AdminService,
    private configPrimeng: PrimeNGConfig
  ) {
    // this.adminService.getAllAdmin().subscribe((res) => console.log(res));
  }
  ngOnInit(): void {
    this.configPrimeng.setTranslation({
      dateIs: 'Ngày là',
      dateIsNot: 'Không phải ngày',
      dateBefore: 'Ngày trước',
      dateAfter: 'Ngày sau',
      clear: 'Xóa',
      apply: 'Lưu',
      dayNames: [
        'Chủ nhật',
        'Thứ 2',
        'Thứ 3',
        'Thứ 4',
        'Thứ 5',
        'Thứ 6',
        'Thứ 7',
      ],
      dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
      dayNamesMin: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
      monthNames: [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
      ],
      monthNamesShort: [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
      ],
    });
  }
}

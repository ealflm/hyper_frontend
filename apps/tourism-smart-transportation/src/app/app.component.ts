import { Component } from '@angular/core';
import { AdminService } from './services/admin.service';

@Component({
  selector: 'tourism-smart-transportation-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tourism-smart-transportation';
  constructor(private adminService: AdminService) {
    this.adminService.getAllAdmin().subscribe((res) => console.log(res));
  }
}

import { ActivatedRoute } from '@angular/router';
import { DriverService } from './../../../services/driver.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-driver-trip-history',
  templateUrl: './driver-trip-history.component.html',
  styleUrls: ['./driver-trip-history.component.scss'],
})
export class DriverTripHistoryComponent implements OnInit {
  driverRating = 4;
  driverHistoryTrip: any = {
    driver: {},
    history: [],
  };
  loading = false;

  constructor(
    private driverService: DriverService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.paramMap.subscribe((params) => {
      const driverId = params.get('id');
      if (driverId) {
        this.driverService.getHistoryTrip(driverId).subscribe(
          (driverHistoryTripRes) => {
            this.driverHistoryTrip.driver =
              driverHistoryTripRes.body.items[0].driver;
            this.driverHistoryTrip.history =
              driverHistoryTripRes.body.items[0].history;
            // console.log(this.driverHistoryTrip);
            this.loading = false;
          },
          (error) => {
            this.loading = false;
          }
        );
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';

@Component({
  selector: 'tourism-smart-transportation-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  subscribe!: Subscription;
  constructor() {}

  ngOnInit(): void {}
  scrollToElement($element: any): void {
    // console.log($element);
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }
}

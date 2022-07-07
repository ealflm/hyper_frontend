import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-card-credit',
  templateUrl: './card-credit.component.html',
  styleUrls: ['./card-credit.component.scss'],
})
export class CardCreditComponent implements OnInit {
  @Input() cardNumber!: string;
  @Input() userName?: string;
  constructor() {}

  ngOnInit(): void {}
}

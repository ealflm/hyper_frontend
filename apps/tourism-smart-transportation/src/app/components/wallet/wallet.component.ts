import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  @Input() Wallet?: any;
  constructor() {}

  ngOnInit(): void {}
}

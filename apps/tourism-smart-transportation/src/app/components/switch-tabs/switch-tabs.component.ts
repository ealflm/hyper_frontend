import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-switch-tabs',
  templateUrl: './switch-tabs.component.html',
  styleUrls: ['./switch-tabs.component.scss'],
})
export class SwitchTabsComponent implements OnInit, AfterViewInit {
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    const tads = (<HTMLElement>this.elementRef.nativeElement).querySelector(
      '.link'
    );
    const tadOne = (<HTMLElement>this.elementRef.nativeElement).querySelector(
      '.link1'
    );
    const tadTwo = (<HTMLElement>this.elementRef.nativeElement).querySelector(
      '.link2'
    );

    tadOne?.classList.add('tabone');
    tadOne?.addEventListener('click', () => {
      console.log('click 1');

      tadOne?.classList.add('tabone');
      tadTwo?.classList.remove('tabone');
    });
    tadTwo?.addEventListener('click', () => {
      tadTwo?.classList.add('tabone');
      tadOne?.classList.remove('tabone');
    });
  }
}

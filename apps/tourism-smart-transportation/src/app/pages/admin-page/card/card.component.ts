import { STATUS_CARD } from './../../../constant/status';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardService } from './../../../services/card.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  status: any = [];
  cards: any = [];
  menuValue: any = [
    {
      value: 1,
      lable: 'Đã liên kết',
    },
    {
      value: 2,
      lable: 'Chưa liên kết',
    },
    {
      value: 0,
      lable: 'Vô hiệu hóa',
    },
    {
      value: null,
      lable: 'Tất cả',
    },
  ];
  displayDialog = false;
  @ViewChild('cardElement') cardElement: any;
  @ViewChild('cardInput') cardInputEle: any;
  cardForm!: FormGroup;
  checked = false;
  uiCard = '';
  isNumber = false;
  filterByStatus = 1;
  constructor(
    private cardService: CardService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getListCards();
    this._initCardForm();
    this._mapStatus();
  }
  _initCardForm() {
    this.cardForm = this.fb.group({
      uiCard: ['', [Validators.required]],
    });
  }
  get cardsForm() {
    return this.cardForm.controls;
  }
  private _mapStatus() {
    this.status = Object.keys(STATUS_CARD).map((key) => {
      return {
        id: key,
        lable: STATUS_CARD[key].lable,
        class: STATUS_CARD[key].class,
      };
    });
  }
  getListCards() {
    this.cardService.getListCard(this.filterByStatus).subscribe((res) => {
      this.cards = res.body;
    });
  }
  createCard() {
    this.displayDialog = true;
    this.checked = false;
    this.cardsForm['uiCard'].setValue('');
  }
  cardElementClick() {
    if (this.cardInputEle) {
      this.cardInputEle.nativeElement.focus();
    }
  }
  onChangeFilterByLastName(e: any) {
    this.cards = this.cards.filter(
      (el: any) =>
        el?.customerName
          ?.toLowerCase()
          .indexOf(e.target.value.toLowerCase()) !== -1
    );
  }
  OnGetMenuClick(value: any) {
    this.filterByStatus = value;
    this.getListCards();
  }
  deleteCard(id: string) {
    this.confirmationService.confirm({
      key: 'deleteConfirm',
      accept: () => {
        this.cardService.deleteCard(id).subscribe((res) => {
          if (res.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: res.message,
            });
            this.getListCards();
          }
        });
      },
    });
  }
  cancelDialog() {
    this.displayDialog = false;
    this.checked = false;
    this.cardsForm['uiCard'].setValue('');
  }
  onInput(uiCard: any) {
    this.uiCard = uiCard;
    if (this.uiCard.length == 10) {
      if (this.uiCard.match(/^[0-9]+$/) != null) {
        this.checked = true;
        this.isNumber = true;
      } else {
        this.isNumber = false;
        this.checked = true;
      }
    }
  }
  onSaveCard() {
    const formData = new FormData();
    if (
      (this.uiCard !== null || this.uiCard !== '') &&
      this.isNumber &&
      this.checked
    ) {
      formData.append('uid', this.uiCard);
      this.cardService.createCard(formData).subscribe((res) => {
        if (res.statusCode === 201) {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: res.message,
          });
          this.displayDialog = false;
          this.checked = false;
          this.getListCards();
        }
      });
    }
  }
  scanAgain() {
    this.checked = false;
    this.uiCard = '';
    this.cardsForm['uiCard'].setValue('');
  }
  // navCardDetail(id: string) {}
}

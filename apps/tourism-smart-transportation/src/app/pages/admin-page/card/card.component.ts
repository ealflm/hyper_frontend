import { FormGroup, FormBuilder } from '@angular/forms';
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
  constructor(
    private cardService: CardService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getListCards();
    this._initCardForm();
  }
  _initCardForm() {
    this.cardForm = this.fb.group({
      uiCard: [''],
    });
  }
  get cardsForm() {
    return this.cardForm.controls;
  }
  getListCards() {
    this.cardService.getListCard().subscribe((res) => {
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
  onChangeFilterByLastName(e: any) {}
  OnGetMenuClick(e: any) {}
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
  cancelDialog() {}
  onPasteCard() {
    if (
      this.cardsForm['uiCard'].value !== null ||
      this.cardsForm['uiCard'].value !== ''
    ) {
      setTimeout(() => {
        this.checked = true;
      }, 1000);
    }
  }
  onInput(uiCard: any) {
    this.uiCard = uiCard;
  }
  onSaveCard() {
    const formData = new FormData();
    if (this.uiCard !== null || this.uiCard !== '') {
      formData.append('uid', this.uiCard);
      this.cardService.createCard(formData).subscribe((res) => {
        if (res.statusCode === 201) {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: res.message,
          });
          this.getListCards();
        }
      });
    }
  }
  // navCardDetail(id: string) {}
}

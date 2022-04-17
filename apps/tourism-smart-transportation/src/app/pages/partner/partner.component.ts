import { STATUS } from './../../constant/status';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PartnersService } from './../../services/partners.service';
import { Partner } from './../../models/partner';
import { Component, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'tourism-smart-transportation-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss'],
  animations: [
    trigger('openCloseIcon', [
      state(
        'openIcon',
        style({
          transform: 'rotate(0deg)',
        })
      ),
      state(
        'closeIcon',
        style({
          transform: 'rotate(90deg)',
        })
      ),
      transition('openIcon => closeIcon', [animate('0.2s')]),
      transition('closeIcon => openIcon', [animate('0.2s')]),
    ]),
  ],
})
export class PartnerComponent implements OnInit {
  inforForm!: FormGroup;
  selected: any = '1';
  isOpenIconFillter = true;
  partners: Partner[] = [];
  displayDialog = false;
  loading = false;
  isSubmit = false;
  status: any[] = [];
  uploadedFiles: any[] = [];
  constructor(
    private partnerService: PartnersService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAllPartners();
    this.initForm();
    this.mapStatus();
  }
  private mapStatus() {
    this.status = Object.keys(STATUS).map((key) => {
      return {
        id: key,
        lable: STATUS[key].lable,
      };
    });
  }
  onUpload(event: { files: any }) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
  }
  private initForm() {
    this.inforForm = this.formBuilder.group({
      userName: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      address: ['', Validators.required],
    });
  }
  get inforsForm() {
    return this.inforForm.controls;
  }
  getAllPartners() {
    this.partnerService.getAllPartners().subscribe((partnerResponse: any) => {
      console.log(partnerResponse);

      this.partners = partnerResponse.items;
    });
  }
  navmenuclick(value: any) {
    this.selected = value;
  }
  onToggle() {
    this.isOpenIconFillter = !this.isOpenIconFillter;
  }
  showDialog(id: string) {
    this.displayDialog = !this.displayDialog;
    if (this.displayDialog) {
      this.partnerService.getPartnerById(id).subscribe((partnerResponse) => {
        console.log(partnerResponse);
        this.inforsForm['userName'].setValue(partnerResponse.userName);
        this.inforsForm['name'].setValue(partnerResponse.name);
        this.inforsForm['address'].setValue(partnerResponse.address);
      });
    } else {
      this.inforsForm['userName'].setValue('');
    }
  }
  onSaveInfor() {}
}

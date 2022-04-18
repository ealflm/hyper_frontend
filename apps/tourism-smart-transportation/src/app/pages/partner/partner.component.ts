import { PartnerResponse } from './../../models/PartnerResponse';
import { STATUS } from './../../constant/status';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PartnersService } from './../../services/partners.service';
import { Partner } from '../../models/PartnerResponse';
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
  imagePreview?: string | ArrayBuffer | null =
    '../assets/image/imagePreview.png';
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

  private initForm() {
    this.inforForm = this.formBuilder.group({
      userName: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      address: ['', Validators.required],
      selectedStatus: ['', Validators.required],
      photoUrl: ['', Validators.required],
    });
  }
  get inforsForm() {
    return this.inforForm.controls;
  }
  getAllPartners() {
    this.partnerService
      .getAllPartners()
      .subscribe((partnerResponse: PartnerResponse) => {
        console.log(partnerResponse);
        partnerResponse.items?.map((partner: Partner) => {
          this.partners = [...this.partners, partner];
        });
        console.log(this.partners);
        // this.partners = partnerResponse.items;
        // console.log(partnerResponse);
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
      this.inforsForm['name'].setValue('');
      this.inforsForm['address'].setValue('');
    }
  }
  onUpload(event: any) {
    console.log(event);

    const avatarFile = event.target.files[0];
    console.log(avatarFile);

    if (avatarFile) {
      this.inforForm.patchValue({ image: avatarFile });
      this.inforsForm['photoUrl'].setValue(avatarFile);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imagePreview = fileReader.result;
      };
      fileReader.readAsDataURL(avatarFile);
    }
  }
  onSaveInfor() {
    this.displayDialog = false;
    const formData = new FormData();

    formData.append('Name', this.inforsForm['name'].value);
    formData.append('Address', this.inforsForm['address'].value);
    formData.append('Status', this.inforsForm['selectedStatus'].value);
    formData.append('UploadFile', this.inforsForm['photoUrl'].value);
    formData.forEach((values) => {
      console.log(values);
    });
  }
}

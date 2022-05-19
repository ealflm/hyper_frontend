import {
  PartnerResponse,
  PartnersResponse,
} from './../../../models/PartnerResponse';
import { Subject } from 'rxjs';
import { STATUS } from '../../../constant/status';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PartnersService } from '../../../services/partners.service';
import { Partner } from '../../../models/PartnerResponse';
import { Component, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';

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
      transition('openIcon => closeIcon', [animate('0.3s')]),
      transition('closeIcon => openIcon', [animate('0.3s')]),
    ]),
  ],
})
export class PartnerComponent implements OnInit {
  inforForm!: FormGroup;
  fillterStatus: number | null = null;
  fillterByName: any | null;
  isOpenIconFillter = true;
  partners: Partner[] = [];
  displayDialog = false;
  loading = false;
  progress!: number;
  isSubmit = false;
  status: any[] = [];
  uploadedFiles: any[] = [];
  imagePreview?: string | ArrayBuffer | null =
    '../assets/image/imagePreview.png';
  deleteFile?: string | null;
  $sub: Subject<any> = new Subject();

  //
  totalItems = 0;
  //
  pageIndex?: number = 0;
  itemsPerPage?: number = 5;
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
      id: [''],
      userName: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      address: ['', Validators.required],
      selectedStatus: ['', Validators.required],
      DeleteFile: [''],
      photoUrl: ['', Validators.required],
    });
  }
  get inforsForm() {
    return this.inforForm.controls;
  }
  getAllPartners() {
    // console.log(this.pageIndex);
    // console.log(this.itemsPerPage);

    this.partnerService
      .getAllPartners(
        this.fillterByName,
        this.fillterStatus,
        this.pageIndex,
        this.itemsPerPage,
        null
      )
      .subscribe((partnersResponse: PartnersResponse) => {
        this.totalItems = partnersResponse.body.totalItems as number;
        this.partners = partnersResponse.body.items;

        // partnersResponse.body.items?.map((partner: Partner) => {
        //   this.partners.push(partner);
        // console.log(this.partners);
        // });
      });
  }

  onPaginate(e: any) {
    this.pageIndex = e.page + 1;
    this.itemsPerPage = e.rows;
    this.getAllPartners();
  }
  onChangeFillterByName(e: any) {
    this.fillterByName = e.target.value;
    this.getAllPartners();
  }
  navmenuclick(value?: any | null) {
    this.fillterStatus = value;

    this.getAllPartners();
  }
  onToggle() {
    this.isOpenIconFillter = !this.isOpenIconFillter;
  }

  showDialog(id: string) {
    this.displayDialog = !this.displayDialog;
    if (this.displayDialog) {
      this.partnerService
        .getPartnerById(id)
        .subscribe((partnerResponse: PartnerResponse) => {
          console.log(partnerResponse);
          this.inforsForm['id'].setValue(partnerResponse.body?.id);
          this.inforsForm['userName'].setValue(partnerResponse.body?.userName);
          this.inforsForm['name'].setValue(partnerResponse.body?.firstName);
          this.inforsForm['selectedStatus'].setValue(
            partnerResponse.body?.status?.toString()
          );
          this.inforsForm['address'].setValue(partnerResponse.body?.address);
          this.inforsForm['photoUrl'].setValue(partnerResponse.body?.photoUrl);
          partnerResponse.body?.photoUrl !== null
            ? (this.imagePreview = `https://se32.blob.core.windows.net/partner/${partnerResponse.body?.photoUrl}`)
            : (this.imagePreview = null);
          this.deleteFile = partnerResponse.body?.photoUrl?.trim();
        });
    } else {
      this.inforsForm['id'].setValue('');
      this.inforsForm['userName'].setValue('');
      this.inforsForm['name'].setValue('');
      this.inforsForm['address'].setValue('');
      this.inforsForm['photoUrl'].setValue('');
      this.imagePreview = '../assets/image/imagePreview.png';
      this.deleteFile = null;
    }
  }
  onUpload(event: any) {
    const avatarFile = event.target.files[0];
    if (avatarFile) {
      this.inforForm.patchValue({ image: avatarFile });
      this.inforsForm['photoUrl'].setValue(avatarFile);
      this.inforsForm['DeleteFile'].setValue(this.deleteFile);
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
    const idPartner = this.inforsForm['id'].value;
    formData.append('Name', this.inforsForm['name'].value);
    formData.append('Address', this.inforsForm['address'].value);
    formData.append('Status', this.inforsForm['selectedStatus'].value);
    formData.append('UploadFile', this.inforsForm['photoUrl'].value);
    formData.append('DeleteFile', this.inforsForm['DeleteFile'].value);
    // formData.forEach((values) => {
    //   console.log(values);
    // });
    if (idPartner != null) {
      this.partnerService
        .updatePartnerById(idPartner, formData)
        .subscribe((updatePartnerRes: HttpEvent<any>) => {
          console.log(updatePartnerRes);
          this.getAllPartners();
        });
    }
  }
}

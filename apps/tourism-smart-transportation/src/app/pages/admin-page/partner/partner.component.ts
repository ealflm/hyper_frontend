import { ConfirmationService } from 'primeng/api';
import { MustMatch } from './../../../providers/CustomValidators';
import {
  PartnerResponse,
  PartnersResponse,
} from './../../../models/PartnerResponse';
import { Subject } from 'rxjs';
import { STATUS_PARTNER } from '../../../constant/status';
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
import { DatePipe } from '@angular/common';

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
  displayDialog = false;
  loading = false;
  isSubmit = false;
  isOpenIconFillter = true;
  progress!: number;
  editMode = false;
  comebackStatus = false;
  //
  inforForm!: FormGroup;
  fillterStatus: number | null = null;
  fillterByName: any | null;
  //
  partners: Partner[] = [];
  status: any[] = [];
  uploadedFiles: any[] = [];
  imagePreview?: string | ArrayBuffer | null =
    '../assets/image/imagePreview.png';
  deleteFile?: string | null;
  $sub: Subject<any> = new Subject();
  gender = [
    {
      id: 'false',
      lable: 'Nữ',
    },
    {
      id: 'true',
      lable: 'Nam',
    },
  ];
  //
  totalItems = 0;
  //
  pageIndex?: number = 0;
  itemsPerPage?: number = 5;
  partnerCurrent!: Partner;

  constructor(
    private partnerService: PartnersService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAllPartners();
    this.initForm();
    this.mapStatus();
    // console.log(this.status);
  }
  private mapStatus() {
    this.status = Object.keys(STATUS_PARTNER).map((key) => {
      return {
        id: key,
        lable: STATUS_PARTNER[key].lable,
        class: STATUS_PARTNER[key].class,
      };
    });
  }

  private initForm() {
    this.inforForm = this.formBuilder.group(
      {
        id: [''],
        userName: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        companyName: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        addressUser: [''],
        addressCompany: [''],
        phone: [''],
        email: [''],
        dateOfBirth: ['', Validators.required],
        selectedGender: ['', Validators.required],
        DeleteFile: [''],
        photoUrl: [''],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
  }

  get inforsForm() {
    return this.inforForm.controls;
  }
  getAllPartners() {
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
  cancelDialog(displayDialog: boolean, comebackStatus: boolean) {
    this.displayDialog = displayDialog;
    this.comebackStatus = comebackStatus;
    //true
    this.confirmationService.confirm({});
  }
  showDialog(editMode: boolean, id?: string, comebackStatus?: boolean) {
    this.displayDialog = !this.displayDialog;
    this.editMode = editMode;
    if (id && editMode) {
      this.editMode = true;
      this.isSubmit = false;
      this.partnerService
        .getPartnerById(id)
        .subscribe((partnerResponse: PartnerResponse) => {
          this.inforsForm['id'].setValue(partnerResponse.body?.id);
          this.inforsForm['userName'].setValue(partnerResponse.body?.username);
          this.inforsForm['firstName'].setValue(
            partnerResponse.body?.firstName
          );
          this.inforsForm['lastName'].setValue(partnerResponse.body?.lastName);
          this.inforsForm['password'].setValue('..');
          this.inforsForm['confirmPassword'].setValue('..');
          const dobRes = new Date(partnerResponse.body.dateOfBirth.toString());
          const pipe = new DatePipe('en-US');
          const dobPipe = pipe.transform(dobRes, 'dd/MM/yyy');
          this.inforsForm['dateOfBirth'].setValue(dobPipe);
          this.inforsForm['selectedGender'].setValue(
            partnerResponse.body?.gender?.toString()
          );
          this.inforsForm['phone'].setValue(partnerResponse.body?.phone);
          this.inforsForm['email'].setValue(partnerResponse.body?.email);
          this.inforsForm['addressUser'].setValue(
            partnerResponse.body?.address1
          );
          this.inforsForm['companyName'].setValue(
            partnerResponse.body?.companyName
          );
          this.inforsForm['addressCompany'].setValue(
            partnerResponse.body?.address2
          );
          this.inforsForm['photoUrl'].setValue(partnerResponse.body?.photoUrl);
          partnerResponse.body?.photoUrl == '' ||
          partnerResponse.body?.photoUrl == null
            ? (this.imagePreview = '../assets/image/imagePreview.png')
            : (this.imagePreview = `https://se32.blob.core.windows.net/partner/${partnerResponse.body?.photoUrl}`);
          this.deleteFile = partnerResponse.body?.photoUrl?.trim();
        });
    } else if (!editMode && comebackStatus) {
      this.isSubmit = false;
    } else if (!editMode && !comebackStatus) {
      this.isSubmit = false;
      this.inforsForm['id'].setValue('');
      this.inforsForm['userName'].setValue('');
      this.inforsForm['password'].setValue('');
      this.inforsForm['confirmPassword'].setValue('');
      this.inforsForm['firstName'].setValue('');
      this.inforsForm['lastName'].setValue('');
      this.inforsForm['dateOfBirth'].setValue('');
      this.inforsForm['selectedGender'].setValue('0');
      this.inforsForm['phone'].setValue('');
      this.inforsForm['email'].setValue('');
      this.inforsForm['addressUser'].setValue('');
      this.inforsForm['companyName'].setValue('');
      this.inforsForm['addressCompany'].setValue('');
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
    console.log(this.inforForm.invalid);
    this.isSubmit = true;
    if (this.inforForm.invalid) return;
    const formData = new FormData();
    const idPartner = this.inforsForm['id'].value;
    if (this.editMode) {
      this.displayDialog = false;
      this.isSubmit = false;
      formData.append('FirstName', this.inforsForm['firstName'].value);
      formData.append('LastName', this.inforsForm['lastName'].value);
      formData.append('CompanyName', this.inforsForm['companyName'].value);
      formData.append('Address1', this.inforsForm['addressUser'].value);
      formData.append('Address2', this.inforsForm['addressCompany'].value);
      formData.append('Phone', this.inforsForm['phone'].value);
      formData.append('Email', this.inforsForm['email'].value);
      formData.append('DateOfBirth', this.inforsForm['dateOfBirth'].value);
      let Gender: string;
      this.inforsForm['selectedGender'].value == '1'
        ? (Gender = 'true')
        : (Gender = 'false');
      formData.append('Gender', Gender);

      formData.append('DeleteFile', this.inforsForm['DeleteFile'].value);
      formData.forEach((values) => {
        console.log(values);
      });
      if (idPartner != null) {
        this.partnerService
          .updatePartnerById(idPartner, formData)
          .subscribe((updatePartnerRes: HttpEvent<any>) => {
            console.log(updatePartnerRes);
            this.getAllPartners();
          });
      }
    } else {
      this.isSubmit = false;
      this.displayDialog = false;
      formData.append('Username', this.inforsForm['userName'].value);
      formData.append('Password', this.inforsForm['password'].value);
      formData.append('FirstName', this.inforsForm['firstName'].value);
      formData.append('LastName', this.inforsForm['lastName'].value);
      formData.append('CompanyName', this.inforsForm['companyName'].value);
      formData.append('Address1', this.inforsForm['addressUser'].value);
      formData.append('Address2', this.inforsForm['addressCompany'].value);
      formData.append('Phone', this.inforsForm['phone'].value);
      formData.append('Email', this.inforsForm['email'].value);
      formData.append('DateOfBirth', this.inforsForm['dateOfBirth'].value);
      formData.append('Gender', this.inforsForm['selectedGender'].value);
      formData.append('DeleteFile', this.inforsForm['DeleteFile'].value);
    }

    // formData.forEach((values) => {
    //   console.log(values);
    // });
  }

  showConfirmDialog(id: string, deleteStatus: boolean) {
    this.comebackStatus = false;
    if (deleteStatus) {
      this.confirmationService.confirm({
        accept: () => {
          this.partnerService.deletePartnerById(id).subscribe((res) => {
            this.getAllPartners();
          });
        },
      });
    }
  }
}

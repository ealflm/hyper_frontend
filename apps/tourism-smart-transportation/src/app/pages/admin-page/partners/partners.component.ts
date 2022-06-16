import { Gender } from './../../../constant/gender';
import { MenuFilterStatus } from './../../../constant/menu-filter-status';
import { ServiceTypeService } from './../../../services/service-type.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AgeCheck, MustMatch } from '../../../providers/CustomValidators';
import {
  PartnerResponse,
  PartnersResponse,
} from '../../../models/PartnerResponse';
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
import { ServiceType } from '../../../models/ServiceTypeResponse';

@Component({
  selector: 'tourism-smart-transportation-partner',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss'],
})
export class PartnersComponent implements OnInit {
  displayDialog = false;
  loading = false;
  isSubmit = false;
  progress!: number;
  editMode = false;
  comebackStatus = false;
  //
  inforForm!: FormGroup;
  fillterStatus: number | null = 1;
  fillterByName: any | null;
  //
  partners: Partner[] = [];
  status: any[] = [];

  //
  totalItems = 0;
  //
  pageIndex?: number = 0;
  itemsPerPage?: number = 5;
  //
  uploadedFiles: any[] = [];
  imagePreview?: string | ArrayBuffer | null =
    '../assets/image/imagePreview.png';
  deleteFile?: string | null;
  $sub: Subject<any> = new Subject();
  gender = Gender;
  menuValue = MenuFilterStatus;
  serviceTypes: ServiceType[] = [];
  constructor(
    private partnerService: PartnersService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private serviceTypeService: ServiceTypeService
  ) {}

  ngOnInit(): void {
    this._getAllPartners();
    this._initForm();
    this._mapStatus();
    this._getServiceType();
    // console.log(this.status);
  }
  private _mapStatus() {
    this.status = Object.keys(STATUS_PARTNER).map((key) => {
      return {
        id: key,
        lable: STATUS_PARTNER[key].lable,
        class: STATUS_PARTNER[key].class,
      };
    });
  }
  private _getServiceType() {
    this.serviceTypeService.getAllServiceType().subscribe((serviceTypeRes) => {
      this.serviceTypes = serviceTypeRes.body.items;
    });
  }
  private _initForm() {
    this.inforForm = this.formBuilder.group(
      {
        id: [''],
        // userName: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        companyName: ['', Validators.required],
        // password: ['', Validators.required],
        // confirmPassword: ['', Validators.required],
        addressUser: [''],
        addressCompany: [''],
        serviceType: ['', Validators.required],
        phone: [
          '',
          [Validators.required, Validators.pattern(/^-?(0|[0-9]{10}\d*)?$/)],
        ],
        email: ['', [Validators.required, Validators.email]],
        dateOfBirth: ['', Validators.required],
        selectedGender: ['', Validators.required],
        DeleteFile: [''],
        photoUrl: [''],
      },
      {
        validator: [
          // MustMatch('password', 'confirmPassword'),
          AgeCheck('dateOfBirth'),
        ],
      }
    );
  }

  get _inforsForm() {
    return this.inforForm.controls;
  }
  _getAllPartners() {
    this.partnerService
      .getAllPartners(
        this.fillterByName,
        this.fillterStatus,
        this.pageIndex,
        this.itemsPerPage,
        null
      )
      .subscribe((partnersResponse: PartnersResponse) => {
        this.totalItems = partnersResponse.body?.totalItems as number;
        this.partners = partnersResponse.body?.items;
      });
  }

  onPaginate(e: any) {
    this.pageIndex = e.page + 1;
    this.itemsPerPage = e.rows;
    this._getAllPartners();
  }
  onChangeFillterByName(e: any) {
    this.fillterByName = e.target.value;
    this._getAllPartners();
  }
  OnGetMenuClick(value: any) {
    this.fillterStatus = value;
    this._getAllPartners();
  }

  cancelDialog(displayDialog: boolean, comebackStatus: boolean) {
    this.displayDialog = displayDialog;
    this.comebackStatus = comebackStatus;
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
          this._inforsForm['id'].setValue(partnerResponse.body?.id);
          // this._inforsForm['userName'].setValue(partnerResponse.body?.username);
          this._inforsForm['firstName'].setValue(
            partnerResponse.body?.firstName
          );
          this._inforsForm['lastName'].setValue(partnerResponse.body?.lastName);
          // this._inforsForm['password'].setValue('..');
          // this._inforsForm['confirmPassword'].setValue('..');
          const dobRes = new Date(partnerResponse.body.dateOfBirth.toString());
          const pipe = new DatePipe('en-US');
          const dobPipe = pipe.transform(dobRes, 'dd/MM/yyy');
          this._inforsForm['dateOfBirth'].setValue(dobPipe);
          this._inforsForm['selectedGender'].setValue(
            partnerResponse.body?.gender?.toString()
          );
          this._inforsForm['phone'].setValue(partnerResponse.body?.phone);
          this._inforsForm['email'].setValue(partnerResponse.body?.email);
          this._inforsForm['addressUser'].setValue(
            partnerResponse.body?.address1
          );
          this._inforsForm['companyName'].setValue(
            partnerResponse.body?.companyName
          );
          this._inforsForm['addressCompany'].setValue(
            partnerResponse.body?.address2
          );
          this._inforsForm['photoUrl'].setValue(partnerResponse.body?.photoUrl);
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
      // this._inforsForm['userName'].setValue('');
      // this._inforsForm['password'].setValue('');
      // this._inforsForm['confirmPassword'].setValue('');
      //
      // this._inforsForm['id'].setValue('');
      // this._inforsForm['serviceType'].setValue('');
      // this._inforsForm['firstName'].setValue('');
      // this._inforsForm['lastName'].setValue('');
      // this._inforsForm['dateOfBirth'].setValue('');
      // this._inforsForm['phone'].setValue('');
      // this._inforsForm['email'].setValue('');
      // this._inforsForm['addressUser'].setValue('');
      // this._inforsForm['companyName'].setValue('');
      // this._inforsForm['addressCompany'].setValue('');
      // this._inforsForm['photoUrl'].setValue('');
      this.inforForm.reset();
      this._inforsForm['selectedGender'].setValue(true);

      this.imagePreview = '../assets/image/imagePreview.png';
      this.deleteFile = null;
    }
  }
  onUpload(event: any) {
    const avatarFile = event.target.files[0];
    if (avatarFile) {
      this.inforForm.patchValue({ image: avatarFile });
      this._inforsForm['photoUrl'].setValue(avatarFile);
      this._inforsForm['DeleteFile'].setValue(this.deleteFile);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imagePreview = fileReader.result;
      };
      fileReader.readAsDataURL(avatarFile);
    }
  }
  onSaveInfor() {
    this.isSubmit = true;
    if (this.inforForm.invalid) return;
    const formData = new FormData();
    const idPartner = this._inforsForm['id'].value;
    if (this.editMode) {
      this.displayDialog = false;
      this.isSubmit = false;
      formData.append('FirstName', this._inforsForm['firstName'].value);
      formData.append('LastName', this._inforsForm['lastName'].value);
      formData.append('CompanyName', this._inforsForm['companyName'].value);
      formData.append('Address1', this._inforsForm['addressUser'].value);
      formData.append('Address2', this._inforsForm['addressCompany'].value);
      formData.append('Phone', this._inforsForm['phone'].value);
      formData.append('Email', this._inforsForm['email'].value);
      const dobRes = new Date(this._inforsForm['dateOfBirth'].value);
      const pipe = new DatePipe('en-US');
      const dobPipe = pipe.transform(dobRes, 'dd/MM/yyy');

      formData.append('DateOfBirth', dobPipe ? dobPipe : '');
      formData.append('Gender', this._inforsForm['selectedGender'].value);
      formData.append('UploadFile', this._inforsForm['photoUrl'].value);
      formData.append('DeleteFile', this._inforsForm['DeleteFile'].value);

      if (idPartner != null) {
        this.partnerService
          .updatePartnerById(idPartner, formData)
          .subscribe((updatePartnerRes) => {
            if (updatePartnerRes.statusCode === 201) {
              this.messageService.add({
                severity: 'success',
                summary: 'Thành công',
                detail: updatePartnerRes.message,
              });
            }
            this._getAllPartners();
            this.editMode = false;
          });
      }
    } else if (!this.editMode) {
      this.isSubmit = false;
      this.displayDialog = false;
      // formData.append('Username', this._inforsForm['userName'].value);
      // formData.append('Password', this._inforsForm['password'].value);
      formData.append('FirstName', this._inforsForm['firstName'].value);
      formData.append('LastName', this._inforsForm['lastName'].value);
      formData.append('CompanyName', this._inforsForm['companyName'].value);
      formData.append('Address1', this._inforsForm['addressUser'].value);
      formData.append('Address2', this._inforsForm['addressCompany'].value);
      formData.append('Phone', this._inforsForm['phone'].value);
      formData.append('Email', this._inforsForm['email'].value);
      const dobRes = new Date(this._inforsForm['dateOfBirth'].value);
      const pipe = new DatePipe('en-US');
      const dobPipe = pipe.transform(dobRes, 'yyyy-MM-dd');
      for (let i = 0; i < this._inforsForm['serviceType'].value.length; i++) {
        formData.append(
          'ServiceTypeIdList',
          this._inforsForm['serviceType'].value[i]
        );
      }
      formData.append('DateOfBirth', dobPipe ? dobPipe : '');
      formData.append('Gender', this._inforsForm['selectedGender'].value);
      formData.append('UploadFile', this._inforsForm['photoUrl'].value);
      formData.append('DeleteFile', this._inforsForm['DeleteFile'].value);

      this.partnerService.createPartner(formData).subscribe((partnerRes) => {
        if (partnerRes.statusCode === 201) {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: partnerRes.message,
          });
        }
        this._getAllPartners();
      });
    }
  }

  showConfirmDialog(id: string, deleteStatus: boolean) {
    this.comebackStatus = false;
    if (deleteStatus) {
      this.confirmationService.confirm({
        accept: () => {
          this.partnerService.deletePartnerById(id).subscribe((res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã khóa đối tác',
            });
            this._getAllPartners();
          });
        },
      });
    }
  }
  restorePartner(id: string) {
    const formData = new FormData();
    formData.append('Status', '1');
    this.confirmationService.confirm({
      key: 'restoreConfirm',
      accept: () => {
        this.partnerService
          .updatePartnerById(id, formData)
          .subscribe((updatePartnerRes) => {
            if (updatePartnerRes.statusCode === 201) {
              this.messageService.add({
                severity: 'success',
                summary: 'Thành công',
                detail: updatePartnerRes.message,
              });
            }
            this._getAllPartners();
          });
      },
    });
  }
  navigatePartnerDetail(id: string) {
    this.router.navigate([`admin/account-partners/${id}`]);
  }
}

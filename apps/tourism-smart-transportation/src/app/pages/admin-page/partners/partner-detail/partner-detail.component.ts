import { HttpErrorResponse } from '@angular/common/http';
import { Gender } from './../../../../constant/gender';
import { MenuFilterPartnerDetail } from './../../../../constant/menu-filter-status';
import { Vehicle } from './../../../../models/VehicleResponse';
import { Driver } from './../../../../models/DriverResponse';
import { DriverService } from './../../../../services/driver.service';
import { VehicleService } from './../../../../services/vehicle.service';
import { ServiceType } from './../../../../models/ServiceTypeResponse';
import { ServiceTypeService } from './../../../../services/service-type.service';
import { STATUS_PARTNER, STATUS_VEHICLE } from './../../../../constant/status';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PartnersService } from './../../../../services/partners.service';
import { Component, OnInit } from '@angular/core';
import {
  AgeCheck,
  NAME_REGEX,
  PHONE_NUMBER_REGEX,
  validateEmty,
} from '../../../../providers/CustomValidators';
import { Partner, PartnerResponse } from '../../../../models/PartnerResponse';
import { DatePipe } from '@angular/common';
import { convertDateToVN } from '../../../../providers/ConvertDate';

@Component({
  selector: 'tourism-smart-transportation-partner-detail',
  templateUrl: './partner-detail.component.html',
  styleUrls: ['./partner-detail.component.scss'],
})
export class PartnerDetailComponent implements OnInit {
  menuValue = MenuFilterPartnerDetail;
  editModeStatus = false;
  status: any = [];
  vehicleStatus: any = [];
  inforForm!: FormGroup;
  isSubmit = false;
  uploadedFiles: any[] = [];
  imagePreview?: string | ArrayBuffer | null =
    '../assets/image/imagePreview.png';
  deleteFile?: string | null;
  gender = Gender;
  drivers: Driver[] = [];
  vehicles: Vehicle[] = [];
  currentUser!: Partner;
  fillterStatus = 1;
  serviceTypes: ServiceType[] = [];
  usernameBiding? = '';
  statusBiding?: number = 1;
  loading = false;
  deleteServiceTypeList = [];
  constructor(
    private partnerService: PartnersService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private serviceTypeService: ServiceTypeService,
    private verhicleService: VehicleService,
    private driverService: DriverService
  ) {}

  ngOnInit(): void {
    this._mapStatus();
    this._initForm();
    this._getServiceType();
    this._getDetailPartner();
    this._mapVehicleStatus();
  }
  private _getDetailPartner() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.partnerService
          .getPartnerById(params['id'])
          .subscribe((partnerResponse: PartnerResponse) => {
            this.currentUser = partnerResponse.body;
            this._inforsForm['id'].setValue(partnerResponse.body?.id);
            // this._inforsForm['userName'].setValue(partnerResponse.body?.username);
            this._inforsForm['firstName'].setValue(
              partnerResponse.body?.firstName
            );
            this._inforsForm['lastName'].setValue(
              partnerResponse.body?.lastName
            );

            this._inforsForm['createdDate'].setValue(
              convertDateToVN(partnerResponse.body?.createdDate.toString())
            );
            this._inforsForm['modifiedDate'].setValue(
              convertDateToVN(partnerResponse.body?.modifiedDate.toString())
            );
            const dobRes = new Date(partnerResponse.body.dateOfBirth);

            this._inforsForm['dateOfBirth'].setValue(dobRes);
            this._inforsForm['selectedGender'].setValue(
              partnerResponse.body?.gender?.toString()
            );
            this._inforsForm['phone'].setValue(partnerResponse.body?.phone);
            this._inforsForm['email'].setValue(partnerResponse.body?.email);
            this._inforsForm['addressUser'].setValue(
              partnerResponse.body?.address1
            );
            let serivceTypeIdList: any = [];
            partnerResponse.body?.serviceTypeList?.map((serviceType) => {
              serivceTypeIdList = [...serivceTypeIdList, serviceType.id];
            });
            this._inforsForm['serviceType'].setValue(serivceTypeIdList);

            this._inforsForm['companyName'].setValue(
              partnerResponse.body?.companyName
            );
            this._inforsForm['addressCompany'].setValue(
              partnerResponse.body?.address2
            );
            this._inforsForm['photoUrl'].setValue(
              partnerResponse.body?.photoUrl
            );
            partnerResponse.body?.photoUrl == '' ||
            partnerResponse.body?.photoUrl == null
              ? (this.imagePreview = '../assets/image/imagePreview.png')
              : (this.imagePreview = `https://se32.blob.core.windows.net/partner/${partnerResponse.body?.photoUrl}`);
            this.deleteFile = partnerResponse.body?.photoUrl?.trim();
            this.usernameBiding = partnerResponse.body?.username;
            this.statusBiding = partnerResponse.body?.status;
            this.deleteServiceTypeList = serivceTypeIdList;
            this.getListDriverFormPartnerId();
          });
      }
    });
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
  private _mapVehicleStatus() {
    this.vehicleStatus = Object.keys(STATUS_VEHICLE).map((key) => {
      return {
        id: key,
        lable: STATUS_VEHICLE[key].lable,
        class: STATUS_VEHICLE[key].class,
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
        firstName: [
          { value: '', disabled: true },
          [
            Validators.required,
            validateEmty,
            Validators.pattern(NAME_REGEX),
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        ],
        lastName: [
          { value: '', disabled: true },
          [
            Validators.required,
            validateEmty,
            Validators.pattern(NAME_REGEX),
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        ],
        companyName: [
          { value: '', disabled: true },
          [Validators.required, validateEmty, Validators.minLength(3)],
        ],
        addressUser: [
          { value: '', disabled: true },
          [Validators.required, validateEmty, Validators.minLength(10)],
        ],
        addressCompany: [
          { value: '', disabled: true },
          [Validators.required, validateEmty, Validators.minLength(10)],
        ],
        serviceType: [{ value: '', disabled: true }, Validators.required],
        phone: [
          { value: '', disabled: true },
          [Validators.required, Validators.pattern(PHONE_NUMBER_REGEX)],
        ],
        email: [
          { value: '', disabled: true },
          [
            Validators.required,
            Validators.email,
            validateEmty,
            Validators.minLength(3),
            Validators.maxLength(255),
          ],
        ],
        dateOfBirth: [{ value: '', disabled: true }, Validators.required],
        selectedGender: [{ value: '', disabled: true }, Validators.required],
        DeleteFile: [''],
        photoUrl: [''],
        createdDate: [{ value: '', disabled: true }],
        modifiedDate: [{ value: '', disabled: true }],
        DeleteServiceTypeIdList: [],
      },
      {
        validator: [
          // MustMatch('password', 'confirmPassword'),
          AgeCheck('dateOfBirth'),
        ],
      }
    );
  }
  OnChangeServiceTypeList() {
    const result = this.deleteServiceTypeList.filter(
      (value) => !this._inforsForm['serviceType'].value.includes(value)
    );
    this._inforsForm['DeleteServiceTypeIdList'].setValue(result);
    // console.log('mang da xoa', result);

    // console.log('mang hien tai', this._inforsForm['serviceType'].value);
  }
  get _inforsForm() {
    return this.inforForm.controls;
  }
  OnGetMenuClick(e: any) {
    this.fillterStatus = e;
    if (this.fillterStatus === 0) {
      this.getListVehicleFormPartnerId();
    } else {
      this.getListDriverFormPartnerId();
    }
  }
  onSaveInfor() {}
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
  onChangeEdit() {
    this.editModeStatus = !this.editModeStatus;

    // this._inforsForm['firstName'].enable();
    // this._inforsForm['lastName'].enable();
    this._inforsForm['companyName'].enable();
    this._inforsForm['addressUser'].enable();
    this._inforsForm['addressCompany'].enable();
    this._inforsForm['serviceType'].enable();
    this._inforsForm['phone'].enable();
    this._inforsForm['email'].enable();
    this._inforsForm['dateOfBirth'].enable();
    this._inforsForm['selectedGender'].enable();
  }
  onCancleEdit() {
    this.editModeStatus = !this.editModeStatus;
    this._inforsForm['firstName'].disable();
    this._inforsForm['lastName'].disable();
    this._inforsForm['companyName'].disable();
    this._inforsForm['addressUser'].disable();
    this._inforsForm['addressCompany'].disable();
    this._inforsForm['serviceType'].disable();
    this._inforsForm['phone'].disable();
    this._inforsForm['email'].disable();
    this._inforsForm['dateOfBirth'].disable();
    this._inforsForm['selectedGender'].disable();
    const dobRes = new Date(this.currentUser.dateOfBirth);

    this._inforsForm['dateOfBirth'].setValue(dobRes);
    this._inforsForm['selectedGender'].setValue(
      this.currentUser?.gender?.toString()
    );
    this._inforsForm['phone'].setValue(this.currentUser?.phone);
    this._inforsForm['email'].setValue(this.currentUser?.email);
    this._inforsForm['addressUser'].setValue(this.currentUser?.address1);
    let serivceTypeIdList: any = [];
    this.currentUser?.serviceTypeList?.map((serviceType) => {
      serivceTypeIdList = [...serivceTypeIdList, serviceType.id];
    });
    this._inforsForm['serviceType'].setValue(serivceTypeIdList);

    this._inforsForm['companyName'].setValue(this.currentUser?.companyName);
    this._inforsForm['addressCompany'].setValue(this.currentUser?.address2);
    this._inforsForm['photoUrl'].setValue(this.currentUser?.photoUrl);
    this.currentUser?.photoUrl == '' || this.currentUser?.photoUrl == null
      ? (this.imagePreview = '../assets/image/imagePreview.png')
      : (this.imagePreview = `https://se32.blob.core.windows.net/partner/${this.currentUser?.photoUrl}`);
    this.deleteFile = this.currentUser.photoUrl?.trim();
  }
  onSaveChange() {
    this.isSubmit = true;
    if (this.inforForm.invalid) return;
    this.loading = true;
    const formData = new FormData();
    const idPartner = this._inforsForm['id'].value;
    // formData.append('FirstName', this._inforsForm['firstName'].value);
    // formData.append('LastName', this._inforsForm['lastName'].value);
    formData.append('CompanyName', this._inforsForm['companyName'].value);
    formData.append('Address1', this._inforsForm['addressUser'].value);
    formData.append('Address2', this._inforsForm['addressCompany'].value);
    formData.append('Phone', this._inforsForm['phone'].value);
    formData.append('Email', this._inforsForm['email'].value);

    const dobRes = new Date(this._inforsForm['dateOfBirth'].value);
    const pipe = new DatePipe('en-US');
    const dobPipe = pipe.transform(dobRes, 'yyyy/MM/dd');

    if (this._inforsForm['DeleteServiceTypeIdList'].value) {
      for (let i = 0; i < this._inforsForm['serviceType'].value.length; i++) {
        formData.append(
          'AddServiceTypeIdList',
          this._inforsForm['serviceType'].value[i]
        );
      }
    }

    if (
      this._inforsForm['DeleteServiceTypeIdList'].value &&
      this._inforsForm['DeleteServiceTypeIdList'].value.length > 0
    ) {
      for (
        let i = 0;
        i < this._inforsForm['DeleteServiceTypeIdList'].value.length;
        i++
      ) {
        formData.append(
          'DeleteServiceTypeIdList',
          this._inforsForm['DeleteServiceTypeIdList'].value[i]
        );
      }
    }

    formData.append('DateOfBirth', dobPipe ? dobPipe : '');
    formData.append('Gender', this._inforsForm['selectedGender'].value);
    formData.append('UploadFile', this._inforsForm['photoUrl'].value);
    if (this._inforsForm['DeleteFile'].value) {
      formData.append('DeleteFile', this._inforsForm['DeleteFile'].value);
    }

    if (idPartner != null) {
      this.partnerService.updatePartnerById(idPartner, formData).subscribe(
        (updatePartnerRes) => {
          if (updatePartnerRes.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: updatePartnerRes.message,
            });
          }
          this.disableInput();
          this.isSubmit = false;
          this._getDetailPartner();
        },
        (error: HttpErrorResponse) => {
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
      );
    }
  }
  private disableInput() {
    this.editModeStatus = !this.editModeStatus;
    this._inforsForm['firstName'].disable();
    this._inforsForm['lastName'].disable();
    this._inforsForm['companyName'].disable();
    this._inforsForm['addressUser'].disable();
    this._inforsForm['addressCompany'].disable();
    this._inforsForm['serviceType'].disable();
    this._inforsForm['phone'].disable();
    this._inforsForm['email'].disable();
    this._inforsForm['dateOfBirth'].disable();
    this._inforsForm['selectedGender'].disable();
  }
  getListVehicleFormPartnerId() {
    const id = this._inforsForm['id'].value;
    if (id) {
      this.verhicleService.getListVehicleByPartnerId(id).subscribe((res) => {
        this.vehicles = res.body;
        console.log(res);
      });
    }
  }
  getListDriverFormPartnerId() {
    const id = this._inforsForm['id'].value;
    if (id) {
      this.driverService.getListDriverByPartnerId(id).subscribe((res) => {
        // console.log(res);
        this.drivers = res.body;
      });
    }
  }
}

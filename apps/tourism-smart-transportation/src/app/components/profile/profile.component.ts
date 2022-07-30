import { WalletService } from './../../services/wallet.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ServiceType } from './../../models/ServiceTypeResponse';
import { ServiceTypeService } from './../../services/service-type.service';
import { PartnersService } from './../../services/partners.service';
import { LocalStorageService } from './../../auth/localstorage.service';
import { STATUS_PARTNER } from './../../constant/status';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { AgeCheck, MustMatch } from '../../providers/CustomValidators';
import { DatePipe } from '@angular/common';
import { Gender } from '../../constant/gender';
import { convertDateToVN } from '../../providers/ConvertDate';
import { Partner } from '../../models/PartnerResponse';

@Component({
  selector: 'tourism-smart-transportation-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, AfterViewInit {
  inforForm!: FormGroup;
  changePassForm!: FormGroup;
  imagePreview?: string | ArrayBuffer | null =
    '../assets/image/imagePreview.png';
  deleteFile?: string | null;
  gender = Gender;
  usernameBiding? = '';
  isSubmit = false;
  editModeStatus = false;
  changePasswordDialog = false;
  profile: any;
  serviceTypes: ServiceType[] = [];
  loading = false;
  walletStatus = false;
  Wallet: any;
  currentPartner!: Partner;
  constructor(
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private partnerService: PartnersService,
    private serviceTypeService: ServiceTypeService,
    private messageService: MessageService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private walletService: WalletService
  ) {}

  ngOnInit(): void {
    this._initForm();
    this._changePasswordForm();
    const user = this.localStorageService.getUser;
    if (user) {
      this.profile = user;
      this._getServiceType();
      this._getProfileUser();
      this._getWalletAndHistory();
    }
  }
  ngAfterViewInit(): void {}
  changeValueCheckBox() {
    this.walletStatus = !this.walletStatus;
  }
  private _getProfileUser() {
    if (this.profile.role === 'Partner') {
      this.partnerService
        .getProfileForPartner(this.profile.id)
        .subscribe((res) => {
          this.currentPartner = res.body;
          this._inforsForm['id'].setValue(res?.body.id);
          this._inforsForm['firstName'].setValue(res.body.firstName);
          this._inforsForm['lastName'].setValue(res.body.lastName);
          this._inforsForm['companyName'].setValue(res.body.companyName);
          this._inforsForm['addressUser'].setValue(res.body.address1);
          this._inforsForm['addressCompany'].setValue(res.body.address2);
          let serivceTypeIdList: any = [];
          res.body.serviceTypeList?.map((serviceType) => {
            serivceTypeIdList = [...serivceTypeIdList, serviceType.id];
          });
          this._inforsForm['serviceType'].setValue(serivceTypeIdList);
          this._inforsForm['phone'].setValue(res.body.phone);
          this._inforsForm['email'].setValue(res.body.email);

          const dobRes = new Date(res.body.dateOfBirth);

          this._inforsForm['dateOfBirth'].setValue(dobRes);
          this._inforsForm['selectedGender'].setValue(
            res?.body.gender?.toString()
          );
          this._inforsForm['createdDate'].setValue(
            convertDateToVN(res.body.createdDate.toString())
          );
          this._inforsForm['modifiedDate'].setValue(
            convertDateToVN(res.body.modifiedDate.toString())
          );
          this._inforsForm['photoUrl'].setValue(res?.body.photoUrl);
          res?.body.photoUrl == '' || res?.body.photoUrl == null
            ? (this.imagePreview = '../assets/image/imagePreview.png')
            : (this.imagePreview = `https://se32.blob.core.windows.net/partner/${res?.body.photoUrl}`);
          this.deleteFile = res?.body.photoUrl?.trim();
          this.usernameBiding = res?.body.username;
        });
    }
  }
  private _getWalletAndHistory() {
    if (this.profile.role === 'Partner') {
      this.walletService
        .getWalletAndHistoryPartner(this.profile.id)
        .subscribe((walletRes) => {
          this.Wallet = walletRes.body;
        });
    }
  }
  private _getServiceType() {
    this.serviceTypeService
      .getListServiceTypeForPartner(this.profile.id)
      .subscribe((serviceTypeRes) => {
        this.serviceTypes = serviceTypeRes.body;
      });
  }
  private _initForm() {
    this.inforForm = this.fb.group(
      {
        id: [''],
        firstName: [{ value: '', disabled: true }, Validators.required],
        lastName: [{ value: '', disabled: true }, Validators.required],
        companyName: [{ value: '', disabled: true }, Validators.required],
        addressUser: [{ value: '', disabled: true }],
        addressCompany: [{ value: '', disabled: true }],
        serviceType: [{ value: '', disabled: true }, Validators.required],
        phone: [{ value: '', disabled: true }],
        email: [{ value: '', disabled: true }],
        dateOfBirth: [{ value: '', disabled: true }, Validators.required],
        selectedGender: [{ value: '', disabled: true }, Validators.required],
        DeleteFile: [''],
        photoUrl: [''],
        createdDate: [{ value: '', disabled: true }],
        modifiedDate: [{ value: '', disabled: true }],
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
  private _changePasswordForm() {
    this.changePassForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: [MustMatch('password', 'confirmPassword')],
      }
    );
  }
  get _changePassForm() {
    return this.changePassForm.controls;
  }
  onChangeEdit() {
    this.editModeStatus = true;

    // this._inforsForm['firstName'].enable();
    // this._inforsForm['lastName'].enable();
    this._inforsForm['companyName'].enable();
    this._inforsForm['addressUser'].enable();
    this._inforsForm['addressCompany'].enable();
    this._inforsForm['phone'].enable();
    this._inforsForm['email'].enable();
    this._inforsForm['dateOfBirth'].enable();
    this._inforsForm['selectedGender'].enable();
  }
  onCancleEdit() {
    this.editModeStatus = false;
    this._inforsForm['companyName'].disable();
    this._inforsForm['addressUser'].disable();
    this._inforsForm['addressCompany'].disable();
    this._inforsForm['serviceType'].disable();
    this._inforsForm['phone'].disable();
    this._inforsForm['email'].disable();
    this._inforsForm['dateOfBirth'].disable();
    this._inforsForm['selectedGender'].disable();
    this._inforsForm['firstName'].setValue(this.currentPartner.firstName);
    this._inforsForm['lastName'].setValue(this.currentPartner.lastName);
    this._inforsForm['companyName'].setValue(this.currentPartner.companyName);
    this._inforsForm['addressUser'].setValue(this.currentPartner.address1);
    this._inforsForm['addressCompany'].setValue(this.currentPartner.address2);
    let serivceTypeIdList: any = [];
    this.currentPartner.serviceTypeList?.map((serviceType) => {
      serivceTypeIdList = [...serivceTypeIdList, serviceType.id];
    });
    this._inforsForm['serviceType'].setValue(serivceTypeIdList);
    this._inforsForm['phone'].setValue(this.currentPartner.phone);
    this._inforsForm['email'].setValue(this.currentPartner.email);

    const dobRes = new Date(this.currentPartner.dateOfBirth);

    this._inforsForm['dateOfBirth'].setValue(dobRes);
    this._inforsForm['selectedGender'].setValue(
      this.currentPartner.gender?.toString()
    );
    this._inforsForm['createdDate'].setValue(
      convertDateToVN(this.currentPartner.createdDate.toString())
    );
    this._inforsForm['modifiedDate'].setValue(
      convertDateToVN(this.currentPartner.modifiedDate.toString())
    );
    this._inforsForm['photoUrl'].setValue(this.currentPartner.photoUrl);
    this.currentPartner.photoUrl == '' || this.currentPartner.photoUrl == null
      ? (this.imagePreview = '../assets/image/imagePreview.png')
      : (this.imagePreview = `https://se32.blob.core.windows.net/partner/${this.currentPartner.photoUrl}`);
    this.deleteFile = this.currentPartner.photoUrl?.trim();
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
  cancelDialog() {
    this.changePasswordDialog = false;
  }
  onSaveInfor() {
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
    formData.append('DateOfBirth', dobPipe ? dobPipe : '');
    formData.append('Gender', this._inforsForm['selectedGender'].value);
    formData.append('UploadFile', this._inforsForm['photoUrl'].value);
    if (this._inforsForm['DeleteFile'].value) {
      formData.append('DeleteFile', this._inforsForm['DeleteFile'].value);
    }

    if (idPartner != null) {
      this.partnerService.partnerUpdateProfile(idPartner, formData).subscribe(
        (updatePartnerRes) => {
          if (updatePartnerRes.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: updatePartnerRes.message,
            });
          }
          this.onCancleEdit();
          this.isSubmit = false;
          this._getProfileUser();
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
  onChangePassword() {
    this.changePasswordDialog = true;
    this.changePassForm.reset();
  }
  onSavePassword() {
    if (this.changePassForm.invalid) return;
    const formData = new FormData();
    formData.append('Username', this.profile.username);
    formData.append(
      'OldPassowrd',
      this._changePassForm['currentPassword'].value
    );
    formData.append('NewPassword', this._changePassForm['password'].value);

    this.partnerService.changePasswordPartner(formData).subscribe(
      (res) => {
        if (res.statusCode === 201) {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: res.message,
          });
          this.changePasswordDialog = false;
        }
      },
      (error) => {
        this.changePasswordDialog = true;
      }
    );
  }
}

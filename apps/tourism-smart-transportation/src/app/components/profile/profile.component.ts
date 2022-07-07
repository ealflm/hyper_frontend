import { ServiceType } from './../../models/ServiceTypeResponse';
import { ServiceTypeService } from './../../services/service-type.service';
import { PartnersService } from './../../services/partners.service';
import { LocalStorageService } from './../../auth/localstorage.service';
import { STATUS_PARTNER } from './../../constant/status';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AgeCheck, MustMatch } from '../../providers/CustomValidators';
import { DatePipe } from '@angular/common';
import { Gender } from '../../constant/gender';
import { convertDateToVN } from '../../providers/ConvertDate';

@Component({
  selector: 'tourism-smart-transportation-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
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

  constructor(
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private partnerService: PartnersService,
    private serviceTypeService: ServiceTypeService
  ) {}

  ngOnInit(): void {
    this._initForm();
    this._changePasswordForm();
    const user = this.localStorageService.getUser;
    if (user) {
      this.profile = user;
      this._getServiceType();
      this._getProfileUser();
    }
  }
  private _getProfileUser() {
    if (this.profile.role === 'Partner') {
      this.partnerService
        .getProfileForPartner(this.profile.id)
        .subscribe((res) => {
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
          const pipe = new DatePipe('en-US');
          const dobPipe = pipe.transform(dobRes, 'dd/MM/yyy');
          this._inforsForm['dateOfBirth'].setValue(dobPipe);
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
        deleteFile: [''],
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

    this._inforsForm['firstName'].enable();
    this._inforsForm['lastName'].enable();
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
  onUpload(event: any) {
    const avatarFile = event.target.files[0];
    if (avatarFile) {
      this.inforForm.patchValue({ image: avatarFile });
      this._inforsForm['photoUrl'].setValue(avatarFile);
      this._inforsForm['deleteFile'].setValue(this.deleteFile);
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
  onSaveInfor() {}
  onChangePassword() {
    this.changePasswordDialog = true;
  }
  onSavePassword() {}
}

import { STATUS_PARTNER } from './../../constant/status';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AgeCheck, MustMatch } from '../../providers/CustomValidators';

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
  usernameBiding? = '';
  isSubmit = false;
  editModeStatus = false;
  changePasswordDialog = false;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this._initForm();
    this._changePasswordForm();
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

import { ServiceTypeEnum } from './../../../../constant/service-type';
import { HttpErrorResponse } from '@angular/common/http';
import { PackageService } from './../../../../services/package.service';
import { ServiceTypeService } from './../../../../services/service-type.service';
import { ServiceType } from '../../../../models/ServiceTypeResponse';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Location } from '@angular/common';
import { validateEmty } from '../../../../providers/CustomValidators';

@Component({
  selector: 'tourism-smart-transportation-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss'],
})
export class ServiceDetailComponent implements OnInit {
  imagePreview?: string | ArrayBuffer | null =
    '../assets/image/imagePreview.png';
  tierForm!: FormGroup;
  isAdded?: boolean = false;
  isSubmit? = false;
  serviceTypes: ServiceType[] = [];
  deleteFile?: string | null;
  // check button
  editModeStatus?: boolean = false;
  editBtnStatus?: boolean = false;
  createStatus?: boolean = true;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private packageService: PackageService,
    private serviceTypeService: ServiceTypeService,
    private messageService: MessageService,
    private location: Location,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {
    this._getServiceType();
  }

  ngOnInit(): void {
    this._initTierForm();
    const idTier = this.route.snapshot.paramMap.get('id');
    if (idTier) {
      this.createStatus = false;
      this.editBtnStatus = true;
      this._getPackageId(idTier);
    } else {
      this.createStatus = true;
    }
  }

  _initTierForm() {
    this.tierForm = this.fb.group({
      id: [''],
      tierName: ['', [Validators.required, validateEmty]],
      description: ['', [Validators.required, validateEmty]],
      price: ['', [Validators.required, Validators.min(1)]],
      promotedTitle: ['', [Validators.required, validateEmty]],
      deleteFile: [''],
      uploadFile: [''],
      packages: this.fb.array([]),
    });
    this.addNewPackgeForm();
    this.checkDropDownDisableInput();
  }

  get _tiersForm() {
    return this.tierForm.controls;
  }
  get _packagesForm() {
    return this.tierForm.get('packages') as FormArray;
  }
  private _getServiceType() {
    this.serviceTypeService.getAllServiceType().subscribe((serviceTypeRes) => {
      this.serviceTypes = serviceTypeRes.body.items.filter(
        (value: any) => value.id !== ServiceTypeEnum.RentCarService
      );
    });
  }
  private _getPackageId(id: string) {
    this.packageService.getPackageById(id).subscribe((packageRes) => {
      this._tiersForm['id'].setValue(packageRes.body.id);
      this._tiersForm['tierName'].setValue(packageRes.body.name);
      this._tiersForm['description'].setValue(packageRes.body.description);
      this._tiersForm['price'].setValue(packageRes.body.price);
      this._tiersForm['promotedTitle'].setValue(packageRes.body.promotedTitle);
      this._tiersForm['uploadFile'].setValue(packageRes.body.photoUrl);
      packageRes.body?.photoUrl == '' || packageRes.body?.photoUrl == null
        ? (this.imagePreview = '../assets/image/imagePreview.png')
        : (this.imagePreview = `https://se32.blob.core.windows.net/admin/${packageRes.body?.photoUrl}`);
      this.deleteFile = packageRes.body?.photoUrl?.trim();
      packageRes.body.packageItems.map((packageValue: any, index: any) => {
        // console.log(index);

        if (index) {
          this.addNewPackgeForm();
        }
        this._packagesForm
          .at(index)
          .get('packageName')
          ?.setValue(packageValue.name);
        this._packagesForm
          .at(index)
          .get('serviceType')
          ?.setValue(packageValue.serviceTypeId);
        this._packagesForm.at(index).get('limit')?.setValue(packageValue.limit);
        this._packagesForm.at(index).get('value')?.setValue(packageValue.value);
        this._packagesForm.at(index).get('id')?.setValue(packageValue.id);
        this._packagesForm
          .at(index)
          .get('tierId')
          ?.setValue(packageValue.tierId);
      });
      this.disableAllInputForm();
    });
  }
  onChangeServiceType() {
    this.checkDropDownDisableInput();
    // this.onAddRow();
  }
  removePackageForm(i: number) {
    this.isAdded = false;
    this._packagesForm.removeAt(i);
  }
  onClickDeleteItem(i: number) {
    this._packagesForm.removeAt(i);
  }
  addNewPackgeForm() {
    const packageForm = this.fb.group({
      id: [''],
      tierId: [''],
      packageName: ['', [Validators.required, validateEmty]],
      serviceType: ['', Validators.required],
      limit: ['', [Validators.required, Validators.min(1)]],
      value: ['', [Validators.required, Validators.min(1)]],
    });
    this._packagesForm.push(packageForm);
    this.checkDropDownDisableInput();
  }
  onAddRow() {
    const lengthFormArray = this._packagesForm.length;
    let currentIndex, nextIndex;
    if (lengthFormArray == 1) {
      currentIndex = 0;
    } else {
      currentIndex = lengthFormArray - 2;
      nextIndex = lengthFormArray - 1;
    }
    const objectArrCurrentIndex =
      this._packagesForm.controls[currentIndex]?.value;
    let objectArrayNextIndex;
    if (nextIndex) {
      objectArrayNextIndex = this._packagesForm.controls[nextIndex]?.value;
    }
    let isEmptyPackage = true,
      isEmptyServiceType = true,
      isEmptyLimit = true,
      isEmptyValue = true;

    Object.keys(objectArrCurrentIndex).map((x) => {
      if (x == 'packageName') {
        if (objectArrCurrentIndex[x]) {
          isEmptyPackage = false;
        }
      } else if (x == 'serviceType') {
        if (objectArrCurrentIndex[x]) {
          isEmptyServiceType = false;
        }
      } else if (x == 'limit') {
        if (objectArrCurrentIndex[x]) {
          isEmptyLimit = false;
        }
      } else if (x == 'value') {
        if (objectArrCurrentIndex[x]) {
          isEmptyValue = false;
        }
      }
    });
    if (
      !objectArrCurrentIndex['packageName'] &&
      !objectArrCurrentIndex['serviceType'] &&
      !objectArrCurrentIndex['limit'] &&
      !objectArrCurrentIndex['value']
    ) {
      this.isAdded = true;
      this.removePackageForm(currentIndex + 1);
    } else if (nextIndex) {
      if (
        objectArrayNextIndex['packageName'] ||
        objectArrayNextIndex['serviceType'] ||
        objectArrayNextIndex['limit'] ||
        objectArrayNextIndex['value']
      ) {
        this.isAdded = false;
      }
    }

    if (
      !isEmptyPackage ||
      !isEmptyServiceType ||
      !isEmptyLimit ||
      !isEmptyValue
    ) {
      if (!this.isAdded) {
        this.addNewPackgeForm();
        this.isAdded = true;
      }
    }
    // this._packagesForm.value.map((value: any, index: any) => {
    //   console.log(value);
    // });
    this.checkDropDownDisableInput();
  }
  checkDropDownDisableInput() {
    for (let index = 0; index <= this._packagesForm.length; index++) {
      if (
        this._packagesForm.at(index)?.get('serviceType')?.value == null ||
        this._packagesForm.at(index)?.get('serviceType')?.value == ''
      ) {
        this._packagesForm.at(index)?.get('limit')?.disable();
        this._packagesForm.at(index)?.get('value')?.disable();
      } else {
        this._packagesForm.at(index)?.get('limit')?.enable();
        this._packagesForm.at(index)?.get('value')?.enable();
      }
    }
  }
  disableAllInputForm() {
    this._tiersForm['tierName'].disable();
    this._tiersForm['price'].disable();
    this._tiersForm['description'].disable();
    this._tiersForm['promotedTitle'].disable();
    for (let index = 0; index < this._packagesForm.length; index++) {
      this._packagesForm.at(index)?.get('limit')?.disable();
      this._packagesForm.at(index)?.get('value')?.disable();
      this._packagesForm.at(index)?.get('packageName')?.disable();
      this._packagesForm.at(index)?.get('serviceType')?.disable();
    }
  }
  enableAllInputForm() {
    this._tiersForm['tierName'].enable();
    this._tiersForm['price'].enable();
    this._tiersForm['description'].enable();
    this._tiersForm['promotedTitle'].enable();
    for (let index = 0; index <= this._packagesForm.length; index++) {
      this._packagesForm.at(index)?.get('limit')?.enable();
      this._packagesForm.at(index)?.get('value')?.enable();
      this._packagesForm.at(index)?.get('packageName')?.enable();
      this._packagesForm.at(index)?.get('serviceType')?.enable();
    }
  }
  onUpload(event: any) {
    const avatarFile = event.target.files[0];
    if (avatarFile) {
      this.tierForm.patchValue({ image: avatarFile });
      this._tiersForm['uploadFile'].setValue(avatarFile);
      this._tiersForm['deleteFile'].setValue(this.deleteFile);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imagePreview = fileReader.result;
      };
      fileReader.readAsDataURL(avatarFile);
    }
    // console.log(avatarFile);
  }

  //change mode
  onChangeEdit() {
    this.editModeStatus = true;
    this.editBtnStatus = true;
    this.enableAllInputForm();
  }
  // edit mode
  onCancleEdit() {
    this.editModeStatus = false;
    this.editBtnStatus = true;
    this.disableAllInputForm();
    this.confirmationService.confirm({
      accept: () => {
        this.enableAllInputForm();
        this.onUpdate();
      },
    });
  }
  onUpdate() {
    this.isSubmit = true;
    if (this.tierForm.invalid) {
      return;
    }
    this.loading = true;
    const formData = new FormData();
    formData.append('Name', this._tiersForm['tierName'].value);
    formData.append('Description', this._tiersForm['description'].value);
    formData.append('Price', this._tiersForm['price'].value);
    formData.append('PromotedTitle', this._tiersForm['promotedTitle'].value);
    formData.append('UploadFile', this._tiersForm['uploadFile'].value);
    formData.append('DeleteFile', this._tiersForm['deleteFile'].value);
    this.nomalizeDataPackageList(formData);
    this.packageService
      .updatePackagebyId(this._tiersForm['id'].value, formData)
      .subscribe(
        (res) => {
          if (res.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: res.message,
            });
            this.disableAllInputForm();
            this.editModeStatus = false;
            this.editBtnStatus = true;
            this.loading = false;
            // if (!this.loading) {
            //   this.router.navigate(['admin/manage-service']);
            // }
          }
        },
        (error: HttpErrorResponse) => {
          this.disableAllInputForm();
          this.editModeStatus = false;
          this.editBtnStatus = true;
          this.loading = false;
        }
      );
  }
  nomalizeDataPackageList(formData: FormData) {
    let data: any = [];
    const lengthFormArray = this._packagesForm.length;
    const checkEmptyData =
      this._packagesForm.controls[lengthFormArray - 1]?.value;
    let isLastedEmptyDataRow = false;
    if (
      !checkEmptyData['packageName'] &&
      !checkEmptyData['serviceType'] &&
      !checkEmptyData['limit'] &&
      !checkEmptyData['value']
    ) {
      isLastedEmptyDataRow = true;
    }
    this._tiersForm['packages'].value.map((x: any, index: number) => {
      if (
        index == this._tiersForm['packages'].value.length - 1 &&
        isLastedEmptyDataRow
      ) {
        data = [...data];
        console.log(data);
      } else {
        data = [...data, x];
        console.log(data);
      }
    });

    let result = '';
    data.map((res: any) => {
      const obj = {
        id: res.id,
        packageId: res.packageId,
        serviceTypeId: res.serviceType,
        name: res.packageName,
        limit: res.limit,
        value: res.value,
        status: 1,
      };
      result += JSON.stringify(obj) + ',';
    });
    result = result.substring(0, result.length - 1);
    console.log(result);

    formData.append('PackageItems', `${result}`);
  }
  // create mode
  onCancle() {
    this.confirmationService.confirm({
      accept: () => {
        this.enableAllInputForm();
        this.onSave();
      },
    });
  }
  onSave() {
    this.isSubmit = true;
    if (this.tierForm.invalid) {
      return;
    }
    this.loading = true;
    const formData = new FormData();
    formData.append('Name', this._tiersForm['tierName'].value);
    formData.append('Description', this._tiersForm['description'].value);
    formData.append('Price', this._tiersForm['price'].value);
    formData.append('PromotedTitle', this._tiersForm['promotedTitle'].value);
    formData.append('UploadFile', this._tiersForm['uploadFile'].value);

    formData.append('DeleteFile', this._tiersForm['deleteFile'].value);
    this.nomalizeDataPackageList(formData);
    this.packageService.createPackage(formData).subscribe(
      (res) => {
        if (res.statusCode === 201) {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: res.message,
          });
          if (!this.loading) {
            this.router.navigate(['admin/manage-service']);
          }
          this.loading = false;
        }
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
      }
    );
  }

  // hủy thay đổi
  cancleDialog() {
    this.location.back();
  }
}

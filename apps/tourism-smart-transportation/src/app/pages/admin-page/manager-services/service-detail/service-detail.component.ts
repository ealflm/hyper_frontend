import { TierService } from './../../../../services/tier.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss'],
})
export class ServiceDetailComponent implements OnInit {
  imagePreview?: string | ArrayBuffer | null =
    '../assets/image/imagePreview.png';
  tierForm!: FormGroup;
  editModeStatus?: boolean = false;
  isAdded?: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private tierService: TierService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {});
    this._initTierForm();
  }
  _initTierForm() {
    this.tierForm = this.fb.group({
      tierName: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      promotedTitle: ['', Validators.required],
      deleteFile: [''],
      uploadFile: [''],
      packages: this.fb.array([]),
    });
    this.addNewPackgeForm();
  }
  get _tiersForm() {
    return this.tierForm.controls;
  }
  get _packagesForm() {
    return this.tierForm.controls['packages'] as FormArray;
  }
  removePackageForm(i: number) {
    this.isAdded = false;
    this._packagesForm.removeAt(i);
  }
  addNewPackgeForm() {
    const packageForm = this.fb.group({
      packageName: ['', Validators.required],
      serviceType: ['', Validators.required],
      limit: ['', Validators.required],
      value: ['', Validators.required],
    });
    this._packagesForm.push(packageForm);
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
  }
  onUpload($event: any) {}
  onChangeEdit() {
    let data: any = [];
    const formData = new FormData();
    formData.append('Name', this._tiersForm['tierName'].value);
    formData.append('Description', this._tiersForm['description'].value);
    formData.append('Price', this._tiersForm['price'].value);
    formData.append('PromotedTitle', this._tiersForm['promotedTitle'].value);
    this._tiersForm['packages'].value.map((x: any, index: number) => {
      if (index != this._tiersForm['packages'].value.length - 1) {
        data = [...data, x];
      }
    });

    const dataSend = data.map((res: any) => {
      return {
        tierId: null,
        serviceTypeId: res.serviceType,
        name: res.packageName,
        limit: res.limit,
        value: res.value,
        status: 1,
      };
    });
    // console.log(dataSend);
    // const blobOverrides = new Blob([JSON.stringify(dataSend)], {
    //   type: 'application/json',
    // });
    // console.log(blobOverrides);

    formData.append('PackageList', JSON.stringify(dataSend));

    // console.log(formData.get('PackageList'));
    formData.forEach((res) => {
      console.log(res);
    });
    this.tierService.createTỉer(formData).subscribe((res) => {
      console.log(res);
    });
  }
  onCancleEdit() {}
  onSaveChange() {}
  onCheckEmptyData(data: string) {}
}

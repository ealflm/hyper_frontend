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
  constructor(private route: ActivatedRoute, private fb: FormBuilder) {}

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

  onUpload($event: any) {}
  onChangeEdit() {}
  onCancleEdit() {}
  onSaveChange() {}
}

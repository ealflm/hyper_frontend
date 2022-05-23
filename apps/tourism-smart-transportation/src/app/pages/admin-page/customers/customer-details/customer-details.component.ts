import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent implements OnInit {
  imagePreview?: string | ArrayBuffer | null =
    '../assets/image/imagePreview.png';
  gender = [
    {
      id: true,
      lable: 'Nữ',
    },
    {
      id: true,
      lable: 'Nam',
    },
  ];
  customerEditForm!: FormGroup;
  constructor(private fb: FormBuilder) {
    this._initCustomerForm();
  }

  ngOnInit(): void {}
  _initCustomerForm() {
    this.customerEditForm = this.fb.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      selectedGender: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      addressUser: ['', Validators.required],
    });
  }
  onUpload(e: any) {}
}

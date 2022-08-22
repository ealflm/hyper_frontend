import { validateEmty } from '../../../../providers/CustomValidators';
import { MenuFilterStatus } from './../../../../constant/menu-filter-status';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Category,
  CategoryResponse,
  CategorysResponse,
} from './../../../../models/CategoryResponse';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategorySerivce } from './../../../../services/category.service';
import { VehicleTypesService } from './../../../../services/vehicle-types.service';
import { STATUS_BUS_PRICE } from './../../../../constant/status';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tourism-smart-transportation-vehicle-class',
  templateUrl: './vehicle-class.component.html',
  styleUrls: ['./vehicle-class.component.scss'],
})
export class VehicleClassComponent implements OnInit {
  menuValue = MenuFilterStatus;
  status: any = [];
  vehicleClasses: any = [];
  editMode = false;
  filterCategoryStatus = 1;
  filterCategoryName = null;
  displayDialog = false;
  categoryForm!: FormGroup;
  isSubmit = false;
  loading = false;
  currentVehicleClass?: Category;
  constructor(
    private categoryService: CategorySerivce,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this._mapStatus();
    this._initCategoryForm();
    this.getAllCategory();
  }
  private _mapStatus() {
    this.status = Object.keys(STATUS_BUS_PRICE).map((key) => {
      return {
        id: key,
        lable: STATUS_BUS_PRICE[key].lable,
        class: STATUS_BUS_PRICE[key].class,
      };
    });
  }
  private _initCategoryForm() {
    this.categoryForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, validateEmty]],
      description: ['', [Validators.required, validateEmty]],
    });
  }
  get _categoryForm() {
    return this.categoryForm.controls;
  }
  createVehicleClass() {
    this.displayDialog = true;
    this.editMode = false;
    this.categoryForm.reset();
    // this._categoryForm['id'].setValue('');
    // this._categoryForm['name'].setValue('');
    // this._categoryForm['description'].setValue('');
  }
  onChangeFillterByName(e: any) {
    this.filterCategoryName = e.target.value;
    this.getAllCategory();
  }
  onDeleteVehicleClass(id: string) {
    this.confirmationService.confirm({
      accept: () => {
        this.categoryService.deleteCategory(id).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đã khóa phân loại xe',
          });
          this.getAllCategory();
        });
      },
    });
  }
  updateVehicleClass(id: string) {
    this.editMode = true;
    this.displayDialog = true;
    this.categoryService
      .getCategoryById(id)
      .subscribe((res: CategoryResponse) => {
        this._categoryForm['id'].setValue(res.body.id);
        this._categoryForm['name'].setValue(res.body.name);
        this._categoryForm['description'].setValue(res.body.description);
        this.currentVehicleClass = res.body;
      });
  }

  onGetValueMenu(value: any) {
    this.filterCategoryStatus = value;
    this.getAllCategory();
  }
  onSaveVehicleClass() {
    this.isSubmit = true;
    if (this.categoryForm.invalid) return;
    this.loading = true;
    if (this.isSubmit && this.editMode) {
      const id = this._categoryForm['id'].value;
      let vehicleType: Category;
      if (this.currentVehicleClass?.name === this._categoryForm['name'].value) {
        vehicleType = {
          description: this._categoryForm['description'].value,
          status: 1,
        };
      } else {
        vehicleType = {
          name: this._categoryForm['name'].value,
          description: this._categoryForm['description'].value,
          status: 1,
        };
      }

      this.categoryService.updateCategory(id, vehicleType).subscribe(
        (res) => {
          if (res?.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: res.message,
            });
            this.getAllCategory();
            this.isSubmit = false;
            this.editMode = false;
            this.displayDialog = false;
            this.loading = false;
          }
        },
        (error) => {
          this.isSubmit = false;
          this.editMode = true;
          this.displayDialog = true;
          this.loading = false;
        }
      );
    } else if (this.isSubmit && !this.editMode) {
      const vehicleType: Category = {
        name: this._categoryForm['name'].value,
        description: this._categoryForm['description'].value,
        status: 1,
      };
      this.categoryService.createCategory(vehicleType).subscribe(
        (res) => {
          if (res?.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: res.message,
            });
            this.getAllCategory();
            this.isSubmit = false;
            this.editMode = false;
            this.displayDialog = false;
            this.loading = false;
          }
        },
        (error) => {
          this.isSubmit = false;
          this.editMode = false;
          this.displayDialog = true;
          this.loading = false;
        }
      );
    }
  }
  cancelDialog() {
    this.displayDialog = false;
    this.confirmationService.confirm({
      key: 'confirmCloseDialog',
      accept: () => {
        this.displayDialog = true;
      },
      reject: () => {
        this.isSubmit = false;
      },
    });
  }
  getAllCategory() {
    this.categoryService
      .getListCategory(this.filterCategoryName, this.filterCategoryStatus)
      .subscribe((res: CategorysResponse) => {
        this.vehicleClasses = res.body.items;
      });
  }
}

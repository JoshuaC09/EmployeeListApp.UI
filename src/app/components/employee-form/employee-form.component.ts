import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { EmployeeStatus } from 'src/app/enums/employee-status.enum';
import { EmployeeGender } from 'src/app/enums/employee-gender.enum';
import { HttpService } from 'src/app/http.service';
import { IEmployee } from 'src/app/interfaces/employee';
import { ActivatedRoute, Router } from '@angular/router';
import { NumberFormatPipe } from 'src/app/pipes/number-format.pipe';
import { NumberFormatDirective } from 'src/app/directives/number-format.directive';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
  imports: [
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    CommonModule,
    MatButtonModule,
    FormsModule,
    NumberFormatPipe,
    NumberFormatDirective,
  ],
  standalone: true,
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  statusOptions: { value: EmployeeStatus; viewValue: string }[];
  genderOptions: { value: EmployeeGender; viewValue: string }[];

  employeeId!: number;
  isEdit = false;
  isView = false;

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToastrService
  ) {
    this.employeeForm = this.formBuilder.group({});
    this.statusOptions = [];
    this.genderOptions = [];
  }

  onCancel() {
    this.router.navigate(['/employee-list']);
  }

  onBack() {
    this.router.navigate(['/employee-list']);
  }

  getStatusViewValue(value: EmployeeStatus): string {
    const status = this.statusOptions.find((option) => option.value === value);
    return status ? status.viewValue : '';
  }

  getGenderViewValue(value: EmployeeGender): string {
    const gender = this.genderOptions.find((option) => option.value === value);
    return gender ? gender.viewValue : '';
  }

  ngOnInit() {
    this.initForm();
    this.initOptions();
    const idParam = this.route.snapshot.params['id'];
    const mode = this.route.snapshot.queryParams['mode'];

    if (idParam) {
      this.employeeId = +idParam;
      this.isEdit = mode === 'edit';
      this.isView = mode === 'view';
      this.httpService.getEmployeeById(this.employeeId).subscribe((result) => {
        console.log('Fetched employee:', result);
        this.employeeForm.patchValue(result);
      });
    }
  }

  initForm() {
    this.employeeForm = this.formBuilder.group({
      employeeId: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      phoneNumber: [''],
      salary: [0, [Validators.min(0)]],
      status: [EmployeeStatus.Active, Validators.required],
      gender: [EmployeeGender.PreferNotToSay, Validators.required],
    });
  }

  initOptions() {
    this.statusOptions = Object.entries(EmployeeStatus)
      .filter(([key]) => isNaN(Number(key)))
      .map(([key, value]) => ({
        value: value as EmployeeStatus,
        viewValue: key,
      }));

    this.genderOptions = Object.entries(EmployeeGender)
      .filter(([key]) => isNaN(Number(key)))
      .map(([key, value]) => ({
        value: value as EmployeeGender,
        viewValue: key,
      }));
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const employee: IEmployee = {
        ...this.employeeForm.value,
        employeeId: this.isEdit ? this.employeeId : 0,
        phoneNumber:
          this.employeeForm.get('phoneNumber')?.value?.toString() || '',
        salary: this.employeeForm.get('salary')?.value || 0,
      };

      if (this.isEdit) {
        this.httpService.updateEmployee(this.employeeId, employee).subscribe(
          (response) => {
            console.log('Employee updated successfully', response, employee);
            this.toaster.success('Employee updated sucsessfully');
            this.router.navigateByUrl('/employee-list');
          },
          (error) => {
            console.error('Error updating employee', error);
            console.error('Validation Errors: ', error.error.errors);
          }
        );
      } else {
        this.httpService.createEmployee(employee).subscribe(
          (response) => {
            console.log('Employee created successfully', response);
            this.toaster.success('Employee created sucsessfully');

            this.router.navigateByUrl('/employee-list');
          },
          (error) => {
            console.error('Error creating employee', error);
            console.error('Validation Errors: ', error.error.errors);
          }
        );
      }
    } else {
      Object.keys(this.employeeForm.controls).forEach((key) => {
        const control = this.employeeForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}

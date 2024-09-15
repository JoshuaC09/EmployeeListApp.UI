import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { IEmployee } from 'src/app/interfaces/employee';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { EnumToStringPipe } from 'src/app/pipes/enum-to-string.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { NumberFormatPipe } from 'src/app/pipes/number-format.pipe';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  imports: [
    MatTableModule,
    CommonModule,
    EnumToStringPipe,
    MatButtonModule,
    MatPaginatorModule,
    RouterLink,
    NumberFormatPipe,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
  ],
  standalone: true,
})
export class EmployeeListComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<IEmployee> = new MatTableDataSource<IEmployee>(
    []
  );
  displayedColumns: string[] = [
    'employeeId',
    'firstName',
    'lastName',
    'middleName',
    'email',
    'address',
    'phoneNumber',
    'salary',
    'status',
    'gender',
    'action',
  ];
  isLoading: boolean = true;
  searchTerm: string = '';

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private dialog: MatDialog,
    private toaster: ToastrService
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadEmployees() {
    this.isLoading = true;
    this.httpService.GetAllEmployee().subscribe(
      (result) => {
        this.dataSource.data = result;
        this.isLoading = false;
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      },
      (error) => {
        console.error('Error loading employees:', error);
        this.isLoading = false;
        this.toaster.error(
          'Failed to load employees.<br>Check the server and try again.',
          '',
          { enableHtml: true }
        );
      }
    );
  }

  searchEmployees() {
    this.isLoading = true;
    this.httpService.searchEmployees(this.searchTerm).subscribe(
      (result) => {
        console.log('Search results:', result);
        this.dataSource.data = result;
        this.isLoading = false;
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      },
      (error) => {
        console.error('Error searching employees:', error);
        this.isLoading = false;
      }
    );
  }

  edit(id: number) {
    this.router.navigate([`/employee/${id}`], {
      queryParams: { mode: 'edit' },
    });
  }

  view(id: number) {
    this.router.navigate([`/employee/${id}`], {
      queryParams: { mode: 'view' },
    });
  }

  delete(id: number) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
      width: '215px',
      data: { employeeId: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.httpService.deleteEmployee(id).subscribe(
          () => {
            console.log('Successfully deleted employee');
            this.toaster.success('Successfully deleted employee');
            this.loadEmployees();
          },
          (error) => {
            console.error('Error deleting employee:', error);
            this.toaster.error('Error deleting employee');
            this.isLoading = false;
          }
        );
      }
    });
  }
}

@Component({
  selector: 'delete-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>Confirm Delete</h2>
    <mat-dialog-content
      >Are you sure you want to delete this employee?</mat-dialog-content
    >
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>
        Delete
      </button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DeleteConfirmationDialog {
  constructor(public dialogRef: MatDialogRef<DeleteConfirmationDialog>) {}
}

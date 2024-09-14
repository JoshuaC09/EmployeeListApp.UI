import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IEmployee } from './interfaces/employee';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  http = inject(HttpClient);
  apiUrl = 'https://localhost:7041';
  constructor() {}
  GetAllEmployee() {
    return this.http.get<IEmployee[]>(`${this.apiUrl}/api/Employee`);
  }

  createEmployee(employee: IEmployee) {
    return this.http.post(`${this.apiUrl}/api/Employee`, employee);
  }
  getEmployeeById(employeeId: number) {
    return this.http.get<IEmployee>(
      `${this.apiUrl}/api/Employee/${employeeId}`
    );
  }
  updateEmployee(employeeId: number, employee: IEmployee) {
    return this.http.put<IEmployee>(
      `${this.apiUrl}/api/Employee/${employeeId}`,
      employee
    );
  }
  deleteEmployee(employeeId: number) {
    return this.http.delete<IEmployee>(
      `${this.apiUrl}/api/Employee/${employeeId}`
    );
  }
}

import { EmployeeStatus } from '../enums/employee-status.enum';
import { EmployeeGender } from '../enums/employee-gender.enum';

export interface IEmployee {
  employeeId: number;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  address: string;
  phoneNumber: string;
  salary: number;
  status: EmployeeStatus;
  gender: EmployeeGender;
}

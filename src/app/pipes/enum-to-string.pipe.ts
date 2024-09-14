import { Pipe, PipeTransform } from '@angular/core';
import { EmployeeStatus } from '../enums/employee-status.enum';
import { EmployeeGender } from '../enums/employee-gender.enum';

@Pipe({
  name: 'enumToString',
  standalone: true,
})
export class EnumToStringPipe implements PipeTransform {
  transform(value: number, enumType: 'status' | 'gender'): string {
    switch (enumType) {
      case 'status':
        return EmployeeStatus[value];
      case 'gender':
        return EmployeeGender[value];
      default:
        return 'Unknown';
    }
  }
}

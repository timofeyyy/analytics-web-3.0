
import { Pipe, PipeTransform } from '@angular/core';
import { AppEnum } from '../utils/enum/app.enum';

@Pipe({
  name: 'emptyValue'
})
export class EmptyValuePipe implements PipeTransform {
  transform(value: any): string {
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      (typeof value === 'string' && value.trim().toLowerCase() === 'null')
    ) {
      return AppEnum.NOTDEFINED;
    }
    return value;
  }
}

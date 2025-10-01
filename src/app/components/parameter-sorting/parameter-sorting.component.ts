import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SelectListComponent } from "../select-list/select-list.component";
import { AppEnum } from '../../../utils/enum/app.enum';

@Component({
  selector: 'app-parameter-sorting',
  imports: [SelectListComponent],
  templateUrl: './parameter-sorting.component.html',
  styleUrl: './parameter-sorting.component.css'
})
export class ParameterSortingComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    this.onSortValueSelected(this.currentValue)
  }

  @Input()
  all: any[] = []
  @Input()
  parameter!: string
  sortValues: string[] = [AppEnum.ASC, AppEnum.DESC]
  currentValue: string = this.sortValues[0]
  @Output()
  onChange: EventEmitter<any> = new EventEmitter()
  onSortValueSelected(type: string): void {
    if (this.parameter) {
      this.all.sort((a, b) => {
        const isNum = (typeof a[this.parameter] === 'number')
        const isAsc = type != AppEnum.ASC
        const A = a[this.parameter] ?? 0
        const B = b[this.parameter] ?? 0
        if (isNum) {

          return isAsc ? A - B : B - A;
        }
        else {
          // const A = a[this.parameter] ?? ''
          // const B = b[this.parameter] ?? ''
          return isAsc ? ('' + A).localeCompare(B) : ('' + B).localeCompare(A)
        }
      })
    }
    this.currentValue = type
    this.onChange.emit()
  }
}

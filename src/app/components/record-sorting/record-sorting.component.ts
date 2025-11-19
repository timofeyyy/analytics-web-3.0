import { NgClass, NgForOf, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SelectListComponent } from "../select-list/select-list.component";
import { componentStorage } from '../../../utils/redux/component';
import { AppEnum } from '../../../utils/enum/app.enum';

@Component({
  selector: 'app-record-sorting',
  imports: [NgForOf],
  templateUrl: './record-sorting.component.html',
  styleUrl: './record-sorting.component.css'
})
export class RecordSortingComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.labels) {
      this.labels = [
        [this.valueName + ' (возвр)', true, true],
        [this.valueName + ' (убыв)', true, false],
        [this.countName + ' (возвр)', false, true],
        [this.countName + ' (убыв)', false, false],
      ]
    }
    this.sort(this.current ? this.current[0] : this.labels[2][0])
  }
  onLabelSelected(event: any): void {
    this.sort(event.target.value)
    const label = this.labels.find((l) => l[0] == event.target.value)
    this.onSortDirectionChanged.emit([label![1] ? AppEnum.PARAMETER : AppEnum.AMOUNT, label![2] ? AppEnum.ASC : AppEnum.DESC])
  }
  @Output()
  onSortDirectionChanged = new EventEmitter<[string, string]>()
  isOpen!: boolean
  @Input()
  valueName: string = AppEnum.PARAMETER
  @Input()
  countName: string = AppEnum.AMOUNT
  labels!: [string, boolean, boolean][]
  @Input()
  rows: { value: string, prodSummary: number }[] = []
  current!: [string, boolean, boolean]
  sort(label: string): void {
    const obj: any = this.labels.find((val) => val[0] === label)
    this.rows.sort((a: any, b: any) => {
      const A = obj[2] ? a : b
      const B = obj[2] ? b : a
      const pattern = obj[1] ? ('' + A.value).localeCompare(B.value) : A.prodSummary - B.prodSummary
      return pattern
    })
    this.current = obj
  }
}

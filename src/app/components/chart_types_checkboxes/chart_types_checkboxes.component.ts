import { NgFor } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChartType } from '../../../utils/types/app';

@Component({
  selector: 'app-chart-types-checkboxes',
  imports: [NgFor],
  templateUrl: './chart_types_checkboxes.component.html',
  styleUrl: './chart_types_checkboxes.component.css'
})
export class ChartTypesCheckboxesComponent implements OnInit {

  @Output()
  public onChnage = new EventEmitter<string>();
  list!: ChartType[]

  ngOnInit(): void {
    this.list = [{
        checked: true,
        value:"donut"
      },
      {
        checked: false,
        value: "bar"
      },
      {
        checked: false,
        value: "pie"
      },
      {
        checked: false,
        value: "mixed"
      }]
  }

  onSelected(value: string): void {
    this.onChnage.emit(value)
  }

}

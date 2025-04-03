import { NgFor } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChartType, ComponentType } from '../../../utils/types/app';

@Component({
  selector: 'app-chart-types-checkboxes',
  imports: [NgFor],
  templateUrl: './chart-types-checkboxes.component.html',
  styleUrl: './chart-types-checkboxes.component.css'
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

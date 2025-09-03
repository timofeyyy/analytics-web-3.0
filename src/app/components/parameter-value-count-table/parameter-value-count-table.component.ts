import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass, NgFor, NgStyle } from '@angular/common';
import gteParameterValueCountStat from '../../../utils/fnc1/other/paramter-value-count-stat.fnc';
import { RecordSortingComponent } from "../record-sorting/record-sorting.component";

@Component({
  selector: 'app-parameter-value-count-table',
  imports: [NgFor, NgStyle, RecordSortingComponent, NgClass],
  templateUrl: './parameter-value-count-table.component.html',
  styleUrls: ['./parameter-value-count-table.component.css', '../styles/input.css']
})
export class ParameterValueCountTableComponent implements OnChanges {
  @Input()
  noRedirect!: boolean
  @Input()
  allowNull!: boolean
  @Input()
  alliasName!: string
  @Input()
  hideLabel!: boolean
  rows!: any[]
  orig!: any[]
  @Input()
  all!: any[]
  @Input()
  parameter!: string
  @Input()
  borderRadius: string = '.5vw'
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.rows = gteParameterValueCountStat(this.all, this.parameter, this.allowNull) as any[]
    this.orig = Array.from(this.rows)
    this.currentValue = undefined
    console.log(this.currentValue)
  }
  @Output()
  public onValueChanged = new EventEmitter<string>()
  @Input()
  currentValue: string | undefined
  getValue(value: string): void {
    this.currentValue = (this.currentValue == value ? undefined : value)
    // console.log(this.currentValue)
    this.onValueChanged.emit(this.currentValue)
  }
  
  search(event: any): void {
    let value: string = event.target.value
    this.rows = []
    this.orig.forEach((manufacturer: any) => {
      if (this.include(manufacturer, value)) {
        this.rows.push(manufacturer)
      }
    })
  }

  include(manufacturer: any, value: string): boolean {
    let manufacturerName: string = manufacturer.value
    let length: number = manufacturerName.length >= value.length ? value.length : manufacturerName.length
    let extractedPart = manufacturerName.slice(0, length).split('')
    for (let i = 0; i < extractedPart.length; i++) {
      if (value[i].toLocaleLowerCase() !== extractedPart[i].toLocaleLowerCase()) {
        return false;
      }
    }
    return true;
  }

  openCatalog(manufacturer: string): any {
    let url = "/filters?"
    url += `manufacturerName=${manufacturer}`
    localStorage.removeItem('savedFilterValues')
    this.router.navigateByUrl(url)
  }
}

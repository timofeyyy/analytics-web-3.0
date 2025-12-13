import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import gteParameterValueCountStat from '../../../utils/fnc1/other/paramter-value-count-stat.fnc';
import { RecordSortingComponent } from "../record-sorting/record-sorting.component";
import { ComponentTypes } from '../../../utils/types/app';
import { SelectListComponent } from "../select-list/select-list.component";
import { AppEnum } from '../../../utils/enum/app.enum';

@Component({
  selector: 'app-parameter-value-count-table',
  imports: [NgFor, NgIf, NgStyle, RecordSortingComponent, SelectListComponent],
  templateUrl: './parameter-value-count-table.component.html',
  styleUrls: ['./parameter-value-count-table.component.css', '../styles/input.css']
})
export class ParameterValueCountTableComponent implements OnChanges, OnInit {
  onComponentTypeSelected(RuComponentType: string) {
    this.currentComponentType = this.componentTypes.find(item => item.RuComponentType === RuComponentType)!
    this.initOriginalRecords(this.all)
    this.onComponentTypeChanged.emit(this.currentComponentType)
  }
  sortDirectionChanged($event: [string, string]) {
    this.onSortDirectionChanged.emit($event)
  }
  @Input()
  noRedirect!: boolean
  @Input()
  allowNull!: boolean
  @Input()
  aliasName!: string
  @Input()
  hideLabel!: boolean
  rows!: any[]
  orig!: any[]
  @Input()
  all!: any[]
  @Input()
  parameter!: string
  @Input()
  parameterAlias!: string
  @Input()
  borderRadius: string = '.5vw'
  @Input()
  firstSelectedDefault!: boolean
  @Output()
  onSortDirectionChanged = new EventEmitter<[string, string]>()
  @Output()
  onComponentTypeChanged = new EventEmitter<ComponentTypes>()
  @Input()
  componentTypes!: ComponentTypes[]
  componentTypeLabels!: string[]
  currentComponentType!: ComponentTypes
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.initOriginalRecords(this.all)
  }
  ngOnChanges(changes: SimpleChanges): void {
    // if (this.componentTypes && this.componentTypes.length) {
    //   this.componentTypeLabels = this.componentTypes.map(item => item.RuComponentType)
    // }
    // if (!this.parameter || this.parameterCopy != this.parameter) {
    // const clonedAll = JSON.parse(JSON.stringify(this.all))
    // const rows = gteParameterValueCountStat(clonedAll, this.parameter, this.allowNull) as any[]
    // this.rows = [...rows]
    // this.orig = [...rows]
    // if (this.firstSelectedDefault && rows && rows.length) {
    //   this.getValue(this.rows[0].value, false)
    // }
    // }
    // this.parameter = this.parameterCopy
  }
  initOriginalRecords(all: any): void {
     if (this.componentTypes && this.componentTypes.length) {
      this.componentTypeLabels = []
      this.componentTypeLabels = this.componentTypes.map(item => item.RuComponentType)
    }
    let clonedAll = JSON.parse(JSON.stringify(this.currentComponentType && this.currentComponentType.EnComponentType != AppEnum.ALL ? (all as any[]).filter(item => item.RuComponentType === this.currentComponentType.RuComponentType) : all))
    const rows = gteParameterValueCountStat(clonedAll, this.parameter, this.allowNull) as any[]
    this.rows = [...rows]
    this.orig = [...rows]
    if (this.firstSelectedDefault && rows && rows.length) {
      this.getValue(this.rows[0].value, false)
    }
  }
  @Output()
  public onValueChanged = new EventEmitter<string>()
  @Input()
  currentValue: string | undefined
  getValue(value: string, changeState: boolean): void {
    this.currentValue = (this.currentValue == value && changeState ? undefined : value)
    this.onValueChanged.emit(this.currentValue)
  }

  searchValue: string = ""
  resetSearchedValue(): void {
    this.searchValue = ""
  }
  search(event: any): void {
    this.searchValue = event.target.value
    this.rows = []
    this.orig.forEach((manufacturer: any) => {
      if (this.include(manufacturer)) {
        this.rows.push(manufacturer)
      }
    })
  }

  homoglyphsArray: any[] = [
    { ru: 'а', en: 'a' },
    { ru: 'к', en: 'k' },
    { ru: 'm', en: 'м' },
    { ru: 'е', en: 'e' },
    { ru: 'о', en: 'o' },
    { ru: 'с', en: 'c' },
    { ru: 'р', en: 'p' },
    { ru: 'х', en: 'x' },
  ];

  include(manufacturer: any): boolean {
    let ManufacturerName: string = `${manufacturer.value}`
    let length: number = ManufacturerName.length >= this.searchValue.length ? this.searchValue.length : ManufacturerName.length
    let extractedPart = ManufacturerName.slice(0, length).split('')
    for (let i = 0; i < extractedPart.length; i++) {
      if (this.searchValue[i].toLocaleLowerCase() !== extractedPart[i].toLocaleLowerCase()) {
        let recognizedRu = this.homoglyphsArray.find(char => char.ru == this.searchValue[i].toLowerCase() && char.en == extractedPart[i].toLowerCase())
        if (recognizedRu) {
          break;
        }
        let recognizedEn = this.homoglyphsArray.find(char => char.en == this.searchValue[i].toLowerCase() && char.ru == extractedPart[i].toLowerCase())
        if (recognizedEn) {
          break;
        }
        return false;
      }
    }
    return true;
  }

  openCatalog(manufacturer: string): any {
    let url = "/filters?"
    url += `ManufacturerName=${manufacturer}`
    localStorage.removeItem('savedFilterValues')
    this.router.navigateByUrl(url)
  }
}

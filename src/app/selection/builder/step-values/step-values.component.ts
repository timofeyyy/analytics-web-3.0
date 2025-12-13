import { Component, EventEmitter, Input, OnChanges, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { DropboxProviderComponent } from "../../../components/dropbox-provider/dropbox-provider.component";
import { ChartTemplateComponent } from "../../../components/charts/chart-template.component";
import { NgIf } from '@angular/common';
import { ParameterValueCountTableComponent } from "../../../components/parameter-value-count-table/parameter-value-count-table.component";
import { AppEnum } from '../../../../utils/enum/app.enum';
import { existInColumnsMax, existInColumnsMin } from '../../../../utils/static-data/compared-min-max';
import { ErrorStepHandling } from '../../../../utils/types/app';
import { resetWarning, selectionStorage, setWarning } from '../../../../utils/redux/selection';

@Component({
  selector: 'app-step-values',
  imports: [DropboxProviderComponent, ChartTemplateComponent, NgIf, ParameterValueCountTableComponent],
  templateUrl: './step-values.component.html',
  styleUrls: ['./step-values.component.css', '../step-window/step-window.component.css']

})
export class StepValuesComponent implements OnChanges, ErrorStepHandling {

  @ViewChildren(ParameterValueCountTableComponent)
  stepValues!: QueryList<ParameterValueCountTableComponent>;

  // triggerRefreshAll(): void {
  //   // this.initSelections()
  //   // // console.log(this.manufacturersStat.length, this.parameterStat.length)
  //   // this.stepValues.get(0)?.initOriginalRecords(this.manufacturersStat)
  //   // this.stepValues.get(1)?.initOriginalRecords(this.parameterStat)
  // }

  findError(): void {
    const val = this.dropBoxPropsMapConfig.get(this.columnName).currentValue
    if (val !== AppEnum.ALL && val) {
      selectionStorage.dispatch(resetWarning(this.index))
    }
    else {
      selectionStorage.dispatch(setWarning([this.index, `Прежде чем перейти запроните значение параметра ${this.alias.get(this.columnName)}`]))
    }
  }
  onSortDirectionChanged(entry: [string, string]) {
    this.buildMainChart(entry[0], entry[1])

  }
  resetInput(): void {
    this.queryObj.clear()
    // // console.log(this.queryObj.size)
    // // console.log(this.currentIndex)
    // // console.log(this.columnName)

    this.onParameterChnaged("")
    this.obj = {}
    this.stepValues.get(0)?.resetSearchedValue()
    this.stepValues.get(1)?.resetSearchedValue()
  }
  ngOnChanges(changes: SimpleChanges | void): void {
    if (this.currentIndex == this.index) {
      // // console.log(this.currentIndex)
      // const queryObj = new Map()
      let currentValue = this.dropBoxPropsMapConfig.get(this.columnName).currentValue
      this.inputValue = currentValue
      if (!currentValue) {
        this.currentSelection = Array.from(this.prevSelection)
        this.findError()
      }
      this.initSelections()
      // // // console.log(this.parameterStat, this.manufacturersStat)
      // // console.log(this.queryObj.size, this.ManufacturerName, this.ManufacturerName !== this.prevManufacturerName)
      if (!this.queryObj.size || this.ManufacturerName !== this.prevManufacturerName) {
        this.buildMainChart()
        this.prevManufacturerName = this.ManufacturerName
      }
    }
  }

  initSelections(): void {
    let EnComponentType: string = this.dropBoxPropsMapConfig.get('EnComponentType').currentValue
    let storageCopy = Object.fromEntries(this.storage)
    if (!Object.entries(this.obj).length) {
      for (const key in storageCopy) {
        if (!this.obj[key])
          this.obj[key] = []
        if (EnComponentType.toLowerCase() === key.toLowerCase()) {
          let prevSelection = this.prevSelection
          if (this.obj[key].length !== prevSelection.length) {
            this.obj[key] = this.prevSelection
          }
        }
      }
    }
    for (const key in storageCopy) {
      if (EnComponentType.toLowerCase() === key.toLowerCase()) {
        this.parameterStat = this.prevSelection
        this.manufacturersStat = this.currentSelection
        this.stepValues.get(0)?.initOriginalRecords(this.manufacturersStat)
        this.stepValues.get(1)?.initOriginalRecords(this.parameterStat)
        break
      }
    }
  }

  buildMainChart(sortParam: string = AppEnum.AMOUNT, sortDirectopn: string = AppEnum.ASC): void {
    this.queryObj = new Map()
      .set('RuComponentType', this.dropBoxPropsMapConfig.get('RuComponentType').currentValue)
      .set('EnComponentType', this.dropBoxPropsMapConfig.get('EnComponentType').currentValue)
      .set('param', this.columnName)
      .set('all', '1')
      .set('bar-x-labels', '1')
      .set('alias', this.alias.get(this.columnName)!)
      .set('x-labels-size', 'max(0.8vw, 8px)')
      .set('y-labels-size', '0.75vw')
      .set("sortParam", sortParam).set("sortDirectopn", sortDirectopn)
    if (this.ManufacturerName) {
      this.queryObj.set('ManufacturerName', this.ManufacturerName)
    }
    // // console.log(this.queryObj)
  }

  @Input()
  storage!: Map<string, any>
  @Input()
  index!: number
  @Input()
  alias!: Map<string, string>
  @Input()
  activeKeys!: Map<string, string>
  @Input()
  all!: any[]
  currentDropBoxName: string | undefined
  @Input()
  dropBoxPropsMapConfig!: Map<string, any>
  @Input()
  columnName!: string
  @Input()
  currentIndex!: number
  @Input()
  prevSelection!: any[]
  queryObj: Map<string, string> = new Map()
  @Output()
  public onValueChanged = new EventEmitter<[string, string]>()
  @Output()
  public onSourceChanged = new EventEmitter<[string, any[]]>()

  onCurrentDropBoxNameChnaged(obj: { propsMap: Map<string, any>, currentName: string | undefined }): void {
    this.currentDropBoxName = obj.currentName
    this.dropBoxPropsMapConfig = obj.propsMap
    this.activeKeys.set(this.columnName, this.dropBoxPropsMapConfig.get(this.columnName).currentValue)
    this.filterArray()
    this.findError()
    this.onValueChanged.emit([this.columnName, this.dropBoxPropsMapConfig.get(this.columnName).currentValue])
  }
  obj: any = {}
  currentSelection: any[] = []
  manufacturersStat: any[] = []
  parameterStat: any[] = []
  filterArray(): void {
    this.currentSelection = []
    let currentValue = this.dropBoxPropsMapConfig.get(this.columnName).currentValue
    if (currentValue) {
      for (const element of this.prevSelection) {
        let obj = element
        if (
          (obj[`${this.columnName}`]) &&
          (
            (obj[`${this.columnName}`] === '' && currentValue.replace(AppEnum.NOTDEFINED, '') == `${obj[`${this.columnName}`]}`) ||
            (obj[`${this.columnName}`] === null && currentValue.replace(AppEnum.NOTDEFINED, null) == `${obj[`${this.columnName}`]}`) ||
            ((existInColumnsMin(this.columnName) && !isNaN(Number(currentValue)) && obj[`${this.columnName}`] >= currentValue) &&
              (existInColumnsMax(this.columnName) && !isNaN(Number(currentValue)) && obj[`${this.columnName}`] <= currentValue)) ||
            (`${obj[`${this.columnName}`]}`.replaceAll(' ', '').replaceAll('\n', '') == `${currentValue}`.replaceAll(' ', '').replaceAll('\n', '')) ||
            (obj[`${this.columnName}`] == Number(currentValue))
          )
        ) {
          this.currentSelection.push(element)
        }
      }
    }
    else {
      this.currentSelection = Array.from(this.prevSelection)
    }
    this.onSourceChanged.emit([this.columnName, this.currentSelection])
  }
  ManufacturerName: string | undefined
  prevManufacturerName: string | undefined

  onManufacturerChanged(ManufacturerName: string): void {
    this.ManufacturerName = (this.ManufacturerName == ManufacturerName ? undefined : ManufacturerName)
    this.ngOnChanges()
  }
  inputDisabled!: boolean
  inputValue!: string
  onParameterChnaged(value: string): void {
    if (value)
      value = value.toString()
    this.inputDisabled = (value === AppEnum.NOTDEFINED && this.inputValue != value)
    // this.inputValue = (value === this.inputValue ? "" : value)
    this.inputValue = value
    this.dropBoxPropsMapConfig.get(this.columnName).currentValue = this.inputValue
    this.onCurrentDropBoxNameChnaged({ propsMap: this.dropBoxPropsMapConfig, currentName: undefined })
    // this.triggerRefreshAll()
  }

  changeDisabledState(): void {
    this.inputDisabled = !this.inputDisabled
    if (!this.inputDisabled && this.inputValue === AppEnum.NOTDEFINED) {
      this.inputValue = ""
    }
    if (this.inputDisabled) {
      this.inputValue = AppEnum.NOTDEFINED
    }
    this.dropBoxPropsMapConfig.get(this.columnName).currentValue = this.inputValue
    this.onCurrentDropBoxNameChnaged({ propsMap: this.dropBoxPropsMapConfig, currentName: undefined })
  }
}

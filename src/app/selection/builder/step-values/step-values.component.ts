import { Component, EventEmitter, Input, OnChanges, Output,  SimpleChanges } from '@angular/core';
import { DropboxProviderComponent } from "../../../components/dropbox-provider/dropbox-provider.component";
import { ChartTemplateComponent } from "../../../components/charts/chart_template.component";
import { ManufacturerCountTableComponent } from "../../../components/manufacturer-count-table/manufacturer-count-table.component";
import { NgIf } from '@angular/common';
import { ParameterValueCountTableComponent } from "../../../components/parameter-value-count-table/parameter-value-count-table.component";
import { AppEnum } from '../../../../utils/enum/app.enum';
import { existInColumnsMax, existInColumnsMin } from '../../../../utils/static-data/compared-min-max';

@Component({
  selector: 'app-step-values',
  imports: [DropboxProviderComponent, ChartTemplateComponent, ManufacturerCountTableComponent, NgIf, ParameterValueCountTableComponent],
  templateUrl: './step-values.component.html',
  styleUrls: ['./step-values.component.css', '../step-window/step-window.component.css']

}) 
export class StepValuesComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges | void): void {
    if (this.currentIndex == this.index) {
      let currentValue = this.dropBoxPropsMapConfig.get(this.columnName).currentValue
      // console.log(currentValue)
      if (!currentValue) {
        this.currentSelection = Array.from(this.prevSelection)
      }  
      let enComponentType:string = this.dropBoxPropsMapConfig.get('enComponentType').currentValue 
      let storageCopy = Object.fromEntries(this.storage)
      // console.log(this.storage, !Object.entries(this.obj).length)
      // console.log(storageCopy, enComponentType)
      if (!Object.entries(this.obj).length) {
        for (const key in storageCopy) {
          if (!this.obj[key])
            this.obj[key] = []
          if (enComponentType.toLowerCase() === key.toLowerCase()) {
            let prevSelection = this.prevSelection.map((el) => el.component)
            if (this.obj[key].length !== prevSelection.length) {
              this.obj[key] = this.prevSelection.map((el) => el.component)
            }
          }
        }
      }
      for (const key in storageCopy) {
        if (enComponentType.toLowerCase() === key.toLowerCase()) {
          this.parameterStat = this.prevSelection.map((el) => el.component)
          this.manufacturersStat = this.currentSelection.map((el) => el.component)
        }
      }
      if (!this.queryObj.size || this.manufacturerName !== this.prevManufacturerName) {
        this.queryObj = new Map()
          .set('ruComponentType', this.dropBoxPropsMapConfig.get('ruComponentType').currentValue)
          .set('param', this.columnName)
          .set('allias', this.allias.get(this.columnName))
        if (this.manufacturerName) {
          this.queryObj.set('manufacturerName', this.manufacturerName)
        }
        this.prevManufacturerName = this.manufacturerName
      }
    }
  } 
  @Input()
  storage!: Map<string, any>
  @Input()
  index!: number
  @Input()
  allias!: Map<string, string>
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
  public onSourceChanged = new EventEmitter<[string, any[], boolean]>()

  onCurrentDropBoxNameChnaged(obj: { propsMap: Map<string, any>, currentName: string | undefined }): void {
    this.currentDropBoxName = obj.currentName
    this.dropBoxPropsMapConfig = obj.propsMap
    this.activeKeys.set(this.columnName, this.dropBoxPropsMapConfig.get(this.columnName).currentValue)
    this.filterArray()
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
        let obj = element.component
        if (
          (obj[`${this.columnName}`] === '' && currentValue.replace(AppEnum.NOTDEFINED, '') == `${obj[`${this.columnName}`]}` ) ||
          (obj[`${this.columnName}`] === null && currentValue.replace(AppEnum.NOTDEFINED, null) == `${obj[`${this.columnName}`]}` ) ||
          (existInColumnsMin(this.columnName) && !isNaN(Number(currentValue)) && obj[`${this.columnName}`] >= currentValue) ||
          (existInColumnsMax(this.columnName) && !isNaN(Number(currentValue)) && obj[`${this.columnName}`] <= currentValue) ||
          (`${obj[`${this.columnName}`]}`.replaceAll(' ', '').replaceAll('\n', '') == `${currentValue}`.replaceAll(' ', '').replaceAll('\n', '')) ||
          (obj[`${this.columnName}`] == Number(currentValue))
        ) {
          this.currentSelection.push(element)
        }
      }
    }
    else {
      this.currentSelection = Array.from(this.prevSelection)
    }
    this.onSourceChanged.emit([this.columnName, this.currentSelection, this.currentSelection.length === 0])
  }
  manufacturerName: string | undefined
  prevManufacturerName: string | undefined

  onManufacturerChanged(manufacturerName: string): void {
    // console.log(manufacturerName)
    this.manufacturerName = (this.manufacturerName == manufacturerName ? undefined : manufacturerName)
    this.ngOnChanges()
  }
  inputDisabled!: boolean
  inputValue!: string
  onParameterChnaged(value: string): void {
    value = value.toString()
    this.inputDisabled = (value === AppEnum.NOTDEFINED && this.inputValue != value)
    // this.inputValue = (value === this.inputValue ? "" : value)
    this.inputValue = value
    this.dropBoxPropsMapConfig.get(this.columnName).currentValue = this.inputValue
    this.onCurrentDropBoxNameChnaged({ propsMap: this.dropBoxPropsMapConfig, currentName: undefined })
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

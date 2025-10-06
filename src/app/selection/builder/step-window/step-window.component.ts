import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigatorComponent } from "../../../components/navigator/navigator.component";
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../../../services/api.services1';
import { forkJoin } from 'rxjs';
import { StepTablenameComponent } from "../step-tablename/step-tablename.component";
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { StepPrioritiesComponent } from "../step-priorities/step-priorities.component";
import { StepValuesComponent } from "../step-values/step-values.component";
import { AppEnum } from '../../../../utils/enum/app.enum';
import { props } from '../../../fetch.config';
import { LoaderComponent } from "../../../components/loader/loader.component";
import { PriorityColumn } from '../../../../utils/types/app';
import { Router } from '@angular/router';
import { componentStorage, setComponentSchema, initComponentTypes } from '../../../../utils/redux/component';
import { move, resetStep, resetStepLength, resetWarning, selectionStorage, setStep, setStepLength } from '../../../../utils/redux/selection';
import { PopupWindowComponent } from "../../popup-window/popup-window.component";



@Component({
  selector: 'app-step-window',
  imports: [HttpClientModule, StepTablenameComponent, NgStyle, StepPrioritiesComponent, StepValuesComponent, NgFor, LoaderComponent, PopupWindowComponent],
  templateUrl: './step-window.component.html',
  providers: [ApiService],
  styleUrls: ['./step-window.component.css', '../../../components/styles/button.css']

})
export class StepWindowComponent implements OnInit {
  onWarningClose() {
    this.warning = false
  }

  warning!: boolean
  warningMessage!: string

  loader!: boolean
  alias: Map<string, string> = new Map()
  storage: Map<string, any> = new Map()
  dropBoxPropsMapConfig!: Map<string, any>
  columns: string[] = []
  all: any[] = []
  showWarning!: boolean
  selectionStorage: any

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.selectionStorage = selectionStorage
    this.dropBoxPropsMapConfig = this.initDropBoxMapConfig()
    this.move()
    this.getApi()
  }

  initDropBoxMapConfig(exceptionsMap: Map<string, any> | void): Map<string, any> {
    const dropBoxPropsClone: any = {};
    for (const [key, value] of Object.entries(props)) {
      dropBoxPropsClone[key] = { currentValue: '', input: true };
      if (exceptionsMap) {
        let exceptionValue = exceptionsMap.get(key)
        if (exceptionsMap.get(key)) {
          dropBoxPropsClone[key] = { ...exceptionValue };
        }
      }
    }
    return new Map(Object.entries(dropBoxPropsClone));
  }
  move(): void {
    selectionStorage.dispatch(move())
  }
  getApi(): void {
    this.loader = true
    forkJoin([
      this.api.getComponentsApiAll(),
      this.api.getAlias()
    ]).subscribe((res: any) => {
      this.storage = new Map(Object.entries(res[0] as any))
      this.alias = new Map(Object.entries(res[1] as any[]))
      componentStorage.dispatch(setComponentSchema(res[0]))
      this.loader = false
    })
  }
  next(): void {
    const step = selectionStorage.getState().step
    const stepLength = selectionStorage.getState().stepLength
    const stepper: any = selectionStorage.getState().stepper
    if (step <= stepLength) {
      if (!stepper[`step${step + 1}`]?.isReady) {
        this.warningMessage = stepper[`step${step + 1}`]?.warningMessage
        this.warning = true
        return
      }
      selectionStorage.dispatch(setStep(step + 1))
      if (stepLength === step) {
        this.makeQueryStr()
      }
      else {
        this.move()
      }
    }
  }
  openSelectionView(): void {
    this.router.navigateByUrl("/selection-main")
    selectionStorage.dispatch(resetStepLength())
    selectionStorage.dispatch(resetStep())
  }
  priorities: string[] = []
  prioritiesNoJumps: PriorityColumn[] = []
  onPriorityChanged(columns: PriorityColumn[]): void {
    this.activeKeys = new Map()
    selectionStorage.dispatch(setStepLength(2))
    const stepper: any = selectionStorage.getState().stepper
    const noJumps: boolean = stepper['step2']?.isReady!
    this.resetChangedSelection(columns)
    if (noJumps) {
      this.prioritiesNoJumps = columns
      const stepLength = selectionStorage.getState().stepLength
      selectionStorage.dispatch(setStepLength(stepLength + columns.length - 1))
      // this.stepLength += this.prioritiesNoJumps.length - 1
      this.move()
    }
    this.dropBoxPropsMapConfig = this.initDropBoxMapConfig(
      new Map()
        .set('ruComponentType', this.dropBoxPropsMapConfig.get('ruComponentType'))
        .set('enComponentType', this.dropBoxPropsMapConfig.get('enComponentType'))
    )
    this.cdr.detectChanges();
  }

  resetChangedSelection(currentColumns: PriorityColumn[]): void {

    for (const key of this.columns) {
      this.selections.delete(key)
    }

  }

  prev(): void {
    const step = selectionStorage.getState().step
    const stepper: any = selectionStorage.getState().stepper

    if (step > 0) {
      let key = stepper[`step${step}`]?.key
      this.activeKeys.delete(key)
      this.selections.delete(key)
      if (key) {
        if (this.dropBoxPropsMapConfig.get(key).input) {
          this.dropBoxPropsMapConfig.get(key).currentValue = ""
        }
        else {
          this.dropBoxPropsMapConfig.get(key).currentValue = AppEnum.ALL
        }
      }
      selectionStorage.dispatch(setStep(step - 1))
      this.move()
    }
  }

  onTypeSelected(entries: [string, string, any[]]): void {
    this.activeKeys = new Map()
    let ruComponentType: string = AppEnum.ALL
    this.columns = []
    if (this.dropBoxPropsMapConfig.get('ruComponentType').currentValue !== entries[0]) {
      ruComponentType = entries[0]
      const componentSchemaMap: Map<string, string[]> = new Map(Object.entries(componentStorage.getState().componentSchema as []))
      this.columns = componentSchemaMap.get(ruComponentType) as []
    }
    this.priorities = this.columns
    this.dropBoxPropsMapConfig.get('ruComponentType').currentValue = ruComponentType

    this.all = entries[2]
    let enComponentType: string = AppEnum.ALL
    if (this.dropBoxPropsMapConfig.get('enComponentType').currentValue !== entries[1]) {
      enComponentType = entries[1]
    }
    this.dropBoxPropsMapConfig.get('enComponentType').currentValue = enComponentType
  }
  getPositionX(index: number): number {
    const stepper: any = selectionStorage.getState().stepper
    if (stepper[`step${index}`] && stepper[`step${index}`]?.positionX) {
      return stepper[`step${index}`]?.positionX as number
    }
    return 0
  }
  st!: boolean
  activeKeys: Map<string, string> = new Map()
  onDropBoxValueChnaged(obj: [string, string]): void {
    let copy = Object.fromEntries(this.activeKeys)
    this.activeKeys = new Map()
    for (const key in copy) {
      this.activeKeys.set(key, copy[key])
    }
    this.activeKeys.set(obj[0], obj[1])
  }

  selections: Map<string, { prev: any[], current: any[] }> = new Map()
  onDropBoxSourceChnaged(obj: [string, any[]]): void {
    const step = selectionStorage.getState().step
    let prev: any = Array.from(this.all)
    let current = obj[1]
    if (step > 2) {
      let nextKey = this.priorities[step - 3][0]
      prev = this.selections.get(nextKey)?.current
    }
    this.selections.set(obj[0], { prev: prev, current: current })
    this.st = (this.selections.get(obj[0])?.current.length == 0)
  }

  getPriorityState(): boolean {
    const step = selectionStorage.getState().step
    let currentPriority = this.priorities[step - 2]
    if (currentPriority && currentPriority[0]) {
      return this.selections.get(currentPriority[0]) !== undefined && this.selections.get(currentPriority[0])?.current.length === 0
    }
    return false
  }

  makeQueryStr(): void {
    const queryParams: any = {
      params: 'pr',
      ruComponentType: this.dropBoxPropsMapConfig.get('ruComponentType').currentValue
    }
    let obj = Object.fromEntries(this.activeKeys)
    for (const key in obj) {
      if (this.selections.get(key)?.current.length) {
        queryParams[key] = obj[key]
      }
    }
    this.router.navigate(['/selection-main'], { queryParams: queryParams })
    localStorage.setItem('selection', JSON.stringify([['/selection-main'], { queryParams: queryParams }]))
    this.selections.clear()
    this.activeKeys.clear()
    this.priorities = []
    this.prioritiesNoJumps = []
    this.dropBoxPropsMapConfig.clear()
    this.columns = []
    this.all = []
    selectionStorage.dispatch(resetStep())
    selectionStorage.dispatch(resetStepLength())
  }

  getPrevSelection(): any[] {
    const step = selectionStorage.getState().step
    let prev: any = Array.from(this.all)
    if (step > 2) {
      let nextKey = this.prioritiesNoJumps[step - 3]
      prev = this.selections.get(nextKey.name)?.current
    }
    return prev
  }
}


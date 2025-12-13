import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NavigatorComponent } from "../../../components/navigator/navigator.component";
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../../../services/api.services';
import { concatMap, forkJoin } from 'rxjs';
import { StepTablenameComponent } from "../step-tablename/step-tablename.component";
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { StepPrioritiesComponent } from "../step-priorities/step-priorities.component";
import { StepValuesComponent } from "../step-values/step-values.component";
import { AppEnum } from '../../../../utils/enum/app.enum';
// import { props } from '../../../fetch.config';
import { LoaderComponent } from "../../../components/loader/loader.component";
import { ComponentTypes, PriorityColumn } from '../../../../utils/types/app';
import { Router } from '@angular/router';
import { componentStorage, setComponentSchema } from '../../../../utils/redux/component';
import { move, resetStep, resetStepLength, resetWarning, selectionStorage, setStep, setStepLength } from '../../../../utils/redux/selection';
import { PopupWindowComponent } from "../../popup-window/popup-window.component";
import { QuerySettingsService } from '../../../../services/query-settings.service';
import { ComponentTypeService } from '../../../../services/component-type.service';



@Component({
  selector: 'app-step-window',
  imports: [HttpClientModule, StepTablenameComponent, NgStyle, StepPrioritiesComponent, StepValuesComponent, NgFor, LoaderComponent, PopupWindowComponent, NgIf],
  templateUrl: './step-window.component.html',
  providers: [ApiService, ComponentTypeService, QuerySettingsService],
  styleUrls: ['./step-window.component.css', '../../../components/styles/button.css']

})
export class StepWindowComponent implements OnInit {
  onWarningClose() {
    this.warning = false
  }
  allowNull:boolean = false
  @ViewChildren(StepValuesComponent)
  stepValues!: QueryList<StepValuesComponent>;
  @ViewChild(StepPrioritiesComponent)
  stepPriorities!: StepPrioritiesComponent;
  triggerRefreshAll(): void {
    if (this.selectionStorage.getState().step + 1 == 1) {
      this.stepPriorities.init()
    }
    else {
      this.stepValues.forEach(cmp => {
        // // console.log(cmp.index - 1, this.selectionStorage.getState().step + 1)
        if (cmp.index - 1 == this.selectionStorage.getState().step + 1) {
          cmp.resetInput()
          // cmp.triggerRefreshAll()
          // // console.log(cmp.columnName)
        }
      });
    }
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
    private querySettings: QuerySettingsService,
    private cts: ComponentTypeService
  ) { }

  ngOnInit(): void {
    this.selectionStorage = selectionStorage
    this.api.getComponentNames()
      .subscribe((types: ComponentTypes[]) => {
        if (types == null) {
          // обработать
        }
        this.cts.setComponentTypes(types)
        this.move()
        this.getApi()
      })

  }

  initDropBoxMapConfig(exceptionsMap: Map<string, any> | void): Map<string, any> {
    const dropBoxPropsClone: any = {};
    // // // console.log(Object.fromEntries(this.alias.entries()))
    for (const [key, value] of this.alias.entries()) {
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
    this.api.getAlias()
      .pipe(
        concatMap((alias: { [type: string]: string }) => {
          this.alias = new Map(Object.entries(alias))
          this.dropBoxPropsMapConfig = this.initDropBoxMapConfig()
          return this.api.getComponentsAll()
        }
        ))
      .subscribe((res: any) => {
        console.log(res)
        this.storage = new Map(Object.entries(res))
        componentStorage.dispatch(setComponentSchema(res))
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
      // this.stepValues.forEach(cmp => {
      //   if (cmp.index - 1 == this.selectionStorage.getState().step + 1) {
      //     cmp.triggerRefreshAll()
      //     // // // console.log(cmp.columnName)
      //   }
      // });
      if (stepLength === step) {
        this.makeQueryStr()
      }
      else {
        this.move()
      }
      // if (this.selectionStorage.getState().step + 1 != 1) {
      //   this.stepValues.forEach(cmp => {
      //     if (cmp.index - 1 == this.selectionStorage.getState().step + 1) {
      //       cmp.resetInput()
      //       // this.triggerRefreshAll()
      //       // // console.log(cmp.columnName)
      //     }
      //   });
      // }
    }
  }
  openSelectionView(): void {
    this.router.navigateByUrl("/selection-priorities")
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
        .set('RuComponentType', this.dropBoxPropsMapConfig.get('RuComponentType'))
        .set('EnComponentType', this.dropBoxPropsMapConfig.get('EnComponentType'))
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
      this.triggerRefreshAll()
      this.move()
    }
  }

  onTypeSelected(entries: [string, string, any[]]): void {
    console.log(entries)
    this.activeKeys = new Map()
    let RuComponentType: string = AppEnum.ALL
    this.columns = []
    if (this.dropBoxPropsMapConfig.get('RuComponentType').currentValue !== entries[0]) {
      RuComponentType = entries[0]
      const componentSchemaMap: Map<string, string[]> = new Map(Object.entries(componentStorage.getState().componentSchema as []))
      // // // console.log(componentSchemaMap)
      this.columns = componentSchemaMap.get(entries[1]) as []
      console.log(this.columns)
    }
    this.priorities = this.columns
    this.dropBoxPropsMapConfig.get('RuComponentType').currentValue = RuComponentType
    this.all = entries[2]
    let EnComponentType: string = AppEnum.ALL
    if (this.dropBoxPropsMapConfig.get('EnComponentType').currentValue !== entries[1]) {
      EnComponentType = entries[1]
    }
    this.dropBoxPropsMapConfig.get('EnComponentType').currentValue = EnComponentType
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
    let prev: any = Array.from(this.allowNull ? this.all : this.filterAllNull(this.prioritiesNoJumps, this.all))
    let current = obj[1]
    if (step > 2) {
      let nextKey = this.priorities[step - 3][0]
      prev = this.selections.get(nextKey)?.current
    }

    // // // console.log(prev, this.selections)
    this.selections.set(obj[0], { prev: prev, current: current })
    // // console.log(this.selections)
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
    // // // console.log(this.dropBoxPropsMapConfig.get('EnComponentType'))
    const queryParams: any = {
      params: 'priorityWindow',
      EnComponentType: this.dropBoxPropsMapConfig.get('EnComponentType').currentValue
    }
    let obj = Object.fromEntries(this.activeKeys)
    for (const key in obj) {
      if (this.selections.get(key)?.current.length) {
        queryParams[key] = obj[key]
      }
    }
    queryParams['autoGeneratedSchema'] = this.stepPriorities.autoGeneratedSchema
    // // // console.log(queryParams)
    this.router.navigate(['/selection-priorities'], { queryParams: queryParams })
    localStorage.setItem('selection', JSON.stringify([['/selection-priorities'], { queryParams: queryParams }]))
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
    // // console.log(this.prioritiesNoJumps)
    const step = selectionStorage.getState().step
    let prev: any = Array.from(this.allowNull ? this.all : this.filterAllNull(this.prioritiesNoJumps, this.all))
    if (step > 2) {
      let nextKey = this.prioritiesNoJumps[step - 3]
      prev = this.selections.get(nextKey.name)?.current
    }
    return prev
  }

  filterAllNull(prioritiesNoJumps: PriorityColumn[], all: any[]): any[] {
    let res = Array.from(all)
    prioritiesNoJumps.forEach((pr) => {
      res = res.filter((obj) => obj[pr.name])
    })
    return res
  }

  getComponentTypes(): ComponentTypes[] {
    return this.cts.getComponentTypes()
  }
}


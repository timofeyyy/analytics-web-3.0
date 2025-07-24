import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigatorComponent } from "../../../components/navigator/navigator.component";
import { HttpClientModule } from '@angular/common/http';
import { ApiService1 } from '../../../../services/api.services1';
import { forkJoin } from 'rxjs';
import { StepTablenameComponent } from "../step-tablename/step-tablename.component";
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { StepPrioritiesComponent } from "../step-priorities/step-priorities.component";
import { StepValuesComponent } from "../step-values/step-values.component";
import { AppEnum, ComponentTypeEnEnum } from '../../../../utils/enum/app.enum';
import { prioritySchemaMap, props, propsInput, propsInputMap } from '../../../../assets/fetch.config';
import { LoaderComponent } from "../../../components/loader/loader.component";
import { ComponentOptions } from '../../../../utils/types/app';
import { Router } from '@angular/router';

interface IStepper {
  positionX: number,
  isReady: boolean,
  warningMessage: string,
  key: string | undefined
}

@Component({
  selector: 'app-step-window',
  imports: [NavigatorComponent, HttpClientModule, StepTablenameComponent, NgStyle, StepPrioritiesComponent, StepValuesComponent, NgFor, LoaderComponent, NgClass],
  templateUrl: './step-window.component.html',
  providers: [ApiService1],
  styleUrls: ['./step-window.component.css', '../../../components/styles/button.css']

})
export class StepWindowComponent implements OnInit {

  step: number = 0
  loader!: boolean
  stepper: Map<string, Partial<IStepper>> = new Map()
  allias: Map<string, string> = new Map()
  storage: Map<string, any> = new Map()
  dropBoxPropsMapConfig!: Map<string, any>
  enComponentTypes: ComponentTypeEnEnum[] = []
  columns: string[] = []
  all: Partial<ComponentOptions>[] = []
  showWarning!: boolean
  stepLength: number = 2
  constructor(
    private api: ApiService1,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dropBoxPropsMapConfig = this.initDropBoxMapConfig()
    this.move()
    this.getApi()
  }

  initDropBoxMapConfig(exceptionsMap: Map<string, any> | void): Map<string, any> {
    const dropBoxPropsClone: any = {};
    for (const [key, value] of Object.entries(propsInput)) {
      dropBoxPropsClone[key] = { ...value };
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
    for (let index = -this.step, i = 1; index < -this.step + this.stepLength + 1; index++, i++) {
      let isReady: boolean = this.stepper.get(`step${i}`)?.isReady as boolean;
      let warningMessage: string = this.stepper.get(`step${i}`)?.warningMessage as string;
      let key: string | undefined = this.stepper.get(`step${i}`)?.key;
      this.stepper.set(`step${i}`, {
        positionX: index * 100,
        isReady: isReady,
        warningMessage: warningMessage,
        key: key
      })
    }
  }
  getApi(): void {
    this.loader = true
    forkJoin([
      this.api.getComponentsApiAll(),
      this.api.getAlias()
    ]).subscribe((res: any) => {
      this.storage = new Map(Object.entries(res[0] as any))
      this.allias = new Map(Object.entries(res[1] as any[]))
      this.enComponentTypes = Array.from(this.storage.keys() as unknown as ComponentTypeEnEnum[])
      this.loader = false
    })
  }
  next(): void {
    if (this.step <= this.stepLength) {
      // let old = this.stepper.get(`step${this.step}`)?.key
      // let prevSeleciton: any = this.all
      // if (old) {
      //   prevSeleciton = this.activeKeys.get(old)?.selection
      // }
      if (!this.stepper.get(`step${this.step + 1}`)?.isReady) {
        alert("Преждем чем перейти дальше заполните текущий этап полностью")
        return
      }
      this.step++
      if (this.stepLength + 1 === this.step) {
        this.makeQueryStr()
      }
      else {
        this.move()
      }
      // let key = this.stepper.get(`step${this.step}`)?.key
      // if(key) {
      //   this.activeKeys.set(key, { value: "", selection: prevSeleciton })
      // }
      // console.log(this.activeKeys, key)
    }
  }
  priorities: [] = []
  prioritiesNoJumps: [] = []
  onPriorityChanged(obj: any): void {
    this.activeKeys = new Map()
    this.priorities = []
    this.prioritiesNoJumps = []
    this.stepLength = 2
    const sortedObj: any = Object.entries(obj).sort((a: any, b: any): any => a[1].priority - b[1].priority)
    let lastSaved: number | undefined;
    let noJumps: boolean = true
    for (let el of sortedObj) {
      if (lastSaved === undefined) {
        lastSaved = el[1].priority
        continue;
      }
      if (el[1].priority - 1 !== lastSaved) {
        noJumps = false
        break
      }
      lastSaved = el[1].priority
    }
    this.stepper.get('step2')!.isReady = noJumps
    this.priorities = sortedObj
    if (noJumps) {
      this.prioritiesNoJumps = sortedObj
      this.stepLength += this.priorities.length - 1
      this.move()
    }
    this.dropBoxPropsMapConfig = this.initDropBoxMapConfig(
      new Map()
        .set('ruComponentType', this.dropBoxPropsMapConfig.get('ruComponentType'))
        .set('enComponentType', this.dropBoxPropsMapConfig.get('enComponentType'))
    )
    this.cdr.detectChanges();
  }
  prev(): void {
    if (this.step > 0) {
      let key = this.stepper.get(`step${this.step}`)?.key
      if (key) {
        this.activeKeys.delete(key)
        this.selections.delete(key)
        if (this.dropBoxPropsMapConfig.get(key).input) {
          this.dropBoxPropsMapConfig.get(key).currentValue = ""
        }
        else {
          this.dropBoxPropsMapConfig.get(key).currentValue = AppEnum.ALL
        }
      }
      this.step--
      this.move()
    }
  }
  onTypeSelected(ruComponentType: string): void {
    this.activeKeys = new Map()
    let value: string = AppEnum.ALL
    this.stepper.get('step1')!.isReady = false
    this.columns = []

    if (this.dropBoxPropsMapConfig.get('ruComponentType').currentValue !== ruComponentType) {
      value = ruComponentType
      this.stepper.get('step1')!.isReady = true
      this.columns = prioritySchemaMap.get(ruComponentType) as []
    }
    this.dropBoxPropsMapConfig.get('ruComponentType').currentValue = value
  }
  onSourceChanged(entries: [string, any[]]): void {
    this.all = entries[1].map((el) => { return { component: el } })
    let value: string = AppEnum.ALL
    // console.log(this.dropBoxPropsMapConfig.get('enComponentType'),)

    if (this.dropBoxPropsMapConfig.get('enComponentType').currentValue !== entries[0]) {
      value = entries[0]
    }
    this.dropBoxPropsMapConfig.get('enComponentType').currentValue = value
  }
  getPositionX(index: number): number {
    if (this.stepper.get(`step${index}`) && this.stepper.get(`step${index}`)?.positionX) {
      return this.stepper.get(`step${index}`)?.positionX as number
    }
    return 0
  }
  st!: boolean
  activeKeys: Map<string, string> = new Map()
  onDropBoxValueChnaged(obj: [string, string]): void {
    this.stepper.get(`step${this.step}`)!.key = obj[0]
    this.stepper.get(`step${this.step + 1}`)!.isReady = false
    if (obj[1] !== AppEnum.ALL && obj[1]) {
      this.stepper.get(`step${this.step + 1}`)!.isReady = true
    }
    let copy = Object.fromEntries(this.activeKeys)
    this.activeKeys = new Map()
    for (const key in copy) {
      this.activeKeys.set(key, copy[key])
    }
    this.activeKeys.set(obj[0], obj[1])
    console.log(this.activeKeys)
    // console.log(this.activeKeys)
    // let nextKey = this.priorities[this.step - 3][0]
    //     console.log(nextKey)

    // if (nextKey) {
    //   this.activeKeys.set(nextKey, { value: "", selection: obj[1].selection })
    // }
    // console.log(this.activeKeys, nextKey)
  }
  // disablePriorities: boolean = false

  selections: Map<string, { prev: any[], current: any[] }> = new Map()
  onDropBoxSourceChnaged(obj: [string, any[], boolean]): void {
    let prev: any = Array.from(this.all)
    let current = obj[1]
    if (this.step > 2) {
      let nextKey = this.priorities[this.step - 3][0]
      prev = this.selections.get(nextKey)?.current
    }
    this.selections.set(obj[0], { prev: prev, current: current })
    // console.log(this.selections.get(obj[0])?.current.length)
    // this.disablePriorities = (current.length === 0)
    this.st = (this.selections.get(obj[0])?.current.length == 0)


  }

  getPriorityState(): boolean {
    let currentPriority = this.priorities[this.step - 2]
    if (currentPriority && currentPriority[0]) {
      return this.selections.get(currentPriority[0]) !== undefined && this.selections.get(currentPriority[0])?.current.length === 0
    }
    return false
  }

  makeQueryStr(): void {
    let str = "?"
    let obj = Object.fromEntries(this.activeKeys)
    for (const key in obj) {
      if (this.selections.get(key)?.current.length) {
        str += `${key}=${obj[key]}&`
      }
    }
    str += `${'ruComponentType'}=${this.dropBoxPropsMapConfig.get('ruComponentType').currentValue}&`

    str = str.replace('+', '%2B0')
    this.resetStorage()
    this.router.navigateByUrl(`/selection-view${str}`)
  }
  resetStorage(): void {
    window.localStorage.removeItem('selection')
  }

  getPrevSelection(): any[] {
    let prev: any = Array.from(this.all)
    if (this.step > 2) {
      let nextKey = this.priorities[this.step - 3][0]
      prev = this.selections.get(nextKey)?.current
    }

    return prev
  }
}

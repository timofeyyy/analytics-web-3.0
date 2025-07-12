import { Component, EventEmitter, input, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AppEnum, ComponentTypeRuEnum } from '../../../utils/enum/app.enum';
import manufacturerNameFilters from '../../../utils/fnc1/filters/manufacturerName';
import componentKindFilters from '../../../utils/fnc1/filters/componentKind';
import componentTypeFilters from '../../../utils/fnc1/filters/componentType';
import { NgFor, NgIf } from '@angular/common';
import { ComponentOptions, FilterDropBox } from '../../../utils/types/app';
import { ApiService1 } from '../../../services/api.services1';
import { HttpClientModule } from '@angular/common/http';
import { DropboxProviderComponent } from "../dropbox-provider/dropbox-provider.component";
import { props } from '../../../assets/fetch.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filters',
  imports: [HttpClientModule, DropboxProviderComponent, NgFor],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
  providers: [ApiService1]
})
export class FiltersComponent implements OnInit, OnChanges {
  @Input()
  all!: Partial<ComponentOptions>[]
  @Input()
  allias!: Map<string, string>
  @Input()
  tableColumns!: Map<string, string>

  constructor(
    private api: ApiService1,
    private router: Router
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("onchange", this.tableColumns)
    this.onRuComponentTypeChanged()
  }

  @Output()
  public onChange = new EventEmitter<any>()

  cancel(): void {
    this.onChange.emit()
  }
  makeQueryStr(): string {
    let str = "?"
    let object = Object.fromEntries(this.dropBoxPropsMapConfig)
    for (const key in object) {
      let val = object[key].currentValue
      if ((!this.selectedColumnsContains(key) && val !== AppEnum.ALL && val)) {
        str += `${key}=${val}&`
      }

      if (key === 'ruComponentType' && val !== AppEnum.ALL && val) {
        str += `${key}=${val}&`
      }
      if (key === 'ruComponentKind' && val !== AppEnum.ALL && val) {
        str += `${key}=${val}&`
      }
      if (key === 'manufacturerName' && val !== AppEnum.ALL && val) {
        str += `${key}=${val}&`
      }
    }
    return str
  }
  getSimpleKeyValueMap(): Map<string, string> {
    const map: Map<string, string> = new Map()
    const object = Object.fromEntries(this.dropBoxPropsMapConfig)
    for (const key in object) {
      let val = object[key].currentValue
      if ((!this.selectedColumnsContains(key) && val !== AppEnum.ALL && val)) {
        map.set(key, val)
      }
      if (key === 'ruComponentType' && val !== AppEnum.ALL && val) {
        map.set(key, val)
      }
      if (key === 'ruComponentKind' && val !== AppEnum.ALL && val) {
        map.set(key, val)
      }
      if (key === 'manufacturerName' && val !== AppEnum.ALL && val) {
        map.set(key, val)
      }
    }
    return map
  }

  selectedColumnsContains(column: string): boolean {
    return this.selectedColumns.find((value) => value == column) === undefined
  }
  apply(): void {
    const queryStr = this.makeQueryStr()
    this.router.navigateByUrl(`/catalog${queryStr}`).then(() => {
      let payload = this.getSimpleKeyValueMap()
      this.onChange.emit(payload)
    })
  }
  selectedColumns!: string[]

  ngOnInit(): void {
    this.selectedColumns = []
  }

  currentDropBoxName: string | undefined
  @Input()
  dropBoxPropsMapConfig!: Map<string, any>

  onCurrentDropBoxNameChnaged(obj: { propsMap: Map<string, any>, currentName: string | undefined }): void {
    this.currentDropBoxName = obj.currentName
    this.dropBoxPropsMapConfig = obj.propsMap
  }

  onRuComponentTypeChanged(): void {
    if (this.tableColumns.size) {
      let keys: any = this.tableColumns!.keys()
      let columns: string[] = Array.from(keys)
      console.log(columns)
      this.selectedColumns = columns
        .filter(function (value) {
          if (value === 'ruComponentType' || value === 'ruComponentKind' || value === 'manufacturerName') {
            return false
          }
          return true
        })
    }
    else {
      this.selectedColumns = []
    }
  }
  // onRuComponentTypeChanged(obj: { propsMap: Map<string, any>, currentName: string | undefined }): void {
  // const ruComponentType = obj.propsMap.get('ruComponentType').currentValue
  // if (ruComponentType !== AppEnum.ALL) {
  //   let keys: any = this.tableColumns.get(ruComponentType)!.keys()
  //   let columns: string[] = Array.from(keys)
  //   console.log(columns)
  //   this.selectedColumns = columns
  //     .filter(function (value) {
  //       if (value === 'ruComponentType' || value === 'ruComponentKind' || value === 'manufacturerName') {
  //         return false
  //       }
  //       return true
  //     })
  // }
  // else {
  //   this.selectedColumns = []
  // }
  // }
}

import { Component, EventEmitter, input, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AppEnum, ComponentTypeRuEnum } from '../../../utils/enum/app.enum';
import ManufacturerNameFilters from '../../../utils/fnc1/filters/manufacturer-name';
import componentKindFilters from '../../../utils/fnc1/filters/component-kind';
import componentTypeFilters from '../../../utils/fnc1/filters/component-type';
import { NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../../services/api.services';
import { HttpClientModule } from '@angular/common/http';
import { DropboxProviderComponent } from "../dropbox-provider/dropbox-provider.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-filters',
  imports: [HttpClientModule, DropboxProviderComponent, NgFor],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css', '../styles/button.css'],
  providers: [ApiService]
})
export class FiltersComponent implements OnChanges {
  @Input()
  all!: any[]
  @Input()
  alias!: Map<string, string>
  @Input()
  tableColumns!: Map<string, string>
  @Input()
  columns: string[] = []

  constructor(
    private api: ApiService,
    private router: Router
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
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

      if (key === 'RuComponentType' && val !== AppEnum.ALL && val) {
        str += `${key}=${val}&`
      }
      if (key === 'RuComponentKind' && val !== AppEnum.ALL && val) {
        str += `${key}=${val}&`
      }
      if (key === 'ManufacturerName' && val !== AppEnum.ALL && val) {
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
      if (key === 'RuComponentType' && val !== AppEnum.ALL && val) {
        map.set(key, val)
      }
      if (key === 'RuComponentKind' && val !== AppEnum.ALL && val) {
        map.set(key, val)
      }
      if (key === 'ManufacturerName' && val !== AppEnum.ALL && val) {
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
    this.router.navigateByUrl(`/filters${queryStr}`).then(() => {
      let payload = this.getSimpleKeyValueMap()
      this.onChange.emit(payload)
    })
  }
  selectedColumns: string[] = []
  currentDropBoxName: string | undefined
  @Input()
  dropBoxPropsMapConfig!: Map<string, any>

  onCurrentDropBoxNameChnaged(obj: { propsMap: Map<string, any>, currentName: string | undefined }): void {
    this.currentDropBoxName = obj.currentName
    this.dropBoxPropsMapConfig = obj.propsMap
  }

  onRuComponentTypeChanged(): void {
    if (this.columns.length) {
      this.selectedColumns = Array.from(this.columns)
    }
    else {
      this.selectedColumns = []
    }
  }
}

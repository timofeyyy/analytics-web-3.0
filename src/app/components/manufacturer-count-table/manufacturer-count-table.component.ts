import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { map, catchError } from 'rxjs';
import { ApiService1 } from '../../../services/api.services1';
import getBestManufacturer from '../../../utils/fnc1/other/best_manufacturer_prod.fnc';
import getManufacturersProd from '../../../utils/fnc1/other/paramter-value-count-stat.fnc';
import { HttpClientModule } from '@angular/common/http';
import { NgFor, NgStyle } from '@angular/common';

@Component({
  selector: 'app-manufacturer-count-table',
  imports: [NgFor, NgStyle],
  templateUrl: './manufacturer-count-table.component.html',
  styleUrls: ['./manufacturer-count-table.component.css', '../styles/input.css']
})
export class ManufacturerCountTableComponent implements OnChanges {

  rows!: any[]
  orig!: any[]
  @Input()
  all!: any[]
  @Input() 
  noRedirect!: boolean
   @Input()
  borderRadius: string= '.5vw'
  // @Input()
  // activatedColumns!: any[]
  currentValue: string | undefined
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.rows = getManufacturersProd(this.all, 'manufacturerName') as any[]
    this.orig = Array.from(this.rows)
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
    // this.activatedColumns = []
    // if (this.activatedColumns.findIndex((val) => val['manufacturerName']) === -1) {
    // this.activatedColumns.push({ manufacturerName: manufacturer })
    // }
    // for (const column of this.activatedColumns) {
    // const pair = Object.entries(column)
    url += `manufacturerName=${manufacturer}`
    // }
 
    this.router.navigateByUrl(url)
  }
  @Output()
  public onValueChanged = new EventEmitter<string>()
  getValue(value: string): void {
    this.currentValue = (this.currentValue == value ? undefined : value)
    this.onValueChanged.emit(value)
  }
}
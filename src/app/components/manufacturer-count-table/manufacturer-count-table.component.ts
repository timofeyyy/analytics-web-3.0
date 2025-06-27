import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ComponentLabel, ComponentOptions, ComponentTypesCheckBoxes, Manufacturer } from '../../../utils/types/app';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { map, catchError } from 'rxjs';
import { ApiService1 } from '../../../services/api.services1';
import getBestManufacturer from '../../../utils/fnc1/other/best_manufacturer_prod.fnc';
import getManufacturersProd from '../../../utils/fnc1/other/manufacturers_prod.fnc';
import { ImageName } from '../../../utils/types/config';
import { HttpClientModule } from '@angular/common/http';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-manufacturer-count-table',
  imports: [NgFor],
  templateUrl: './manufacturer-count-table.component.html',
  styleUrls: ['./manufacturer-count-table.component.css', '../styles/input.css']
})
export class ManufacturerCountTableComponent implements OnChanges {

  rows!: Manufacturer[]
  orig!: Manufacturer[]
  @Input()
  all!: any[]

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.rows = getManufacturersProd(this.all) as Manufacturer[]
    this.orig = Array.from(this.rows)

  }
  search(event: any): void {
    let value: string = event.target.value
    this.rows = []
    this.orig.forEach((manufacturer: Manufacturer) => {
      if (this.include(manufacturer, value)) {
        this.rows.push(manufacturer)
      }
    })
  }

  include(manufacturer: Manufacturer, value: string): boolean {
    let manufacturerName: string = manufacturer.manufacturerName
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
    let url = "/catalog?"
    console.log(this.route.snapshot.queryParamMap)
    const object = (this.route.snapshot.queryParamMap as any).params
    if (!object['manufacturerName']) {
      url += `manufacturerName=${manufacturer}&`
    }
    for (const key in object) {
      url += `${key}=${object[key]}&`
    }
    this.router.navigateByUrl(url)
  }


}

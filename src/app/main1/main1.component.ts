import { NgFor, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, Output, ViewEncapsulation } from '@angular/core';
// import { AppEnum, ComponentTypeRuEnum } from '../../utils/enum/app.enum';
// import { ChartConfig, ChartRoute, ComponentData, ComponentType, Config, Country, CountryOptions, DropdownOptions, Option, OptionsApi } from '../../utils/types/app';
import { catchError, map } from 'rxjs';
import { AppEnum } from '../../utils/enum/app.enum';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ComponentLabel, ComponentTypesCheckBoxes, FilterDropBox, Manufacturer } from '../../utils/types/app';
import { HttpClientModule } from '@angular/common/http';
import { ImageName } from '../../utils/types/config';
import getBestManufacturer from '../../utils/fnc1/other/best_manufacturer_prod.fnc';
import getManufacturersProd from '../../utils/fnc1/other/manufacturers_prod.fnc';
import { CountrySelectionComponent } from '../components/selection/country_selection/country_selection.component';
import { LoaderComponent } from '../components/loader/loader.component';
import { NavigatorComponent } from '../components/navigator/navigator.component';
import { ApiService1 } from '../../services/api.services1';

@Component({
  selector: 'app-main1',
  imports: [NgStyle, NgFor, HttpClientModule, LoaderComponent, NavigatorComponent, CountrySelectionComponent],
  templateUrl: './main1.component.html',
  styleUrls: ['./main1.component.css', '../components/selection/selection.css', '../components/styles/filter.css', '../components/styles/m-table.css'],
  providers: [ApiService1]
})
export class Main1Component implements OnInit {
  // componentList!: OptionsApi[]


  componentTypes!: ComponentTypesCheckBoxes[]

  loader!: boolean
  rows!: Manufacturer[]
  orig!: Manufacturer[]
  url!: SafeResourceUrl


  constructor(
    private api: ApiService1,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.rows = []
    this.componentTypes = []

    this.loader = true
    let countries: Partial<ImageName>[] = this.api.getCountriesFromConfig();
    countries.unshift({ nameRu: AppEnum.ALL })

    this.getApi()

    this.selectComponentTypes()
  }

  getApi(): void {
    this.api.getComponentsApi()?.pipe(map((options: ComponentLabel[]) => {

      let componetns: ImageName[] = this.api.getComponentsFromConfig()

      options.forEach((row: ComponentLabel) => {
        if (this.getComponentTypeIndexByValue(row.ruComponentType) === -1) {

          let cItemIndex = componetns.findIndex(
            (cItem: ImageName) => cItem.nameRu === row.ruComponentType
          )
          if (cItemIndex !== -1) {
            let record: ComponentTypesCheckBoxes = {
              checked: false,
              manufacturer: getBestManufacturer(options, row.ruComponentType),
              image: {
                image: componetns[cItemIndex].image,
                nameRu: row.ruComponentType
              }
            }
            this.componentTypes.push(record)
          }
        }
      })
      this.rows = getManufacturersProd(options) as Manufacturer[]
      this.orig = this.rows
      this.loader = false
    }),
      catchError((err: any) => {
        console.log(err.message)
        this.router.navigate([`/not-found`])
        return [];
      })
    ).subscribe()
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

  getComponentTypeIndexByValue(value: string): number {
    let index: number = this.componentTypes.findIndex(
      (val: ComponentTypesCheckBoxes) => val.image.nameRu === value
    )
    return index
  }
  selectComponentTypes(value: string | void): void {
    let url = "chart1/parent/components/componentTypes/bar?child_req_name=components&&child_chart_name=componentKinds&&"
    this.componentTypes.forEach((type: ComponentTypesCheckBoxes) => {
      if (value === type.image.nameRu) {
        type.checked = !type.checked
        if (type.checked) {
          url += `ruComponentType=${value}`
        }
      }
      else {
        type.checked = false
      }
    })
    this.url = this.getSafeUrl(url)
  }

  getSafeUrl(url: string): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }

  openCatalog(manufacturer: string): any {
    this.router.navigateByUrl(`/catalog?manufacturerName=${manufacturer}`)
  }
}

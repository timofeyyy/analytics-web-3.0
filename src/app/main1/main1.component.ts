import { NgFor, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, Output, ViewEncapsulation } from '@angular/core';
// import { AppEnum, ComponentTypeRuEnum } from '../../utils/enum/app.enum';
// import { ChartConfig, ChartRoute, ComponentData, ComponentType, Config, Country, CountryOptions, DropdownOptions, Option, OptionsApi } from '../../utils/types/app';
import { catchError, map } from 'rxjs';
import { AppEnum } from '../../utils/enum/app.enum';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiService } from '../../services/api.services';
import { ComponentType, CountryOptions, Manufacturer, Option, OptionsApi } from '../../utils/types/app';
import { HttpClientModule } from '@angular/common/http';
import { ImageName } from '../../utils/types/config';
import getBestManufacturer from '../../utils/fnc/other/best_manufacturer_prod.fnc';
import getManufacturersProd from '../../utils/fnc/other/manufacturers_prod.fnc';
import { CountrySelectionComponent } from '../components/selection/country-selection/country-selection.component';
import { LoaderComponent } from '../components/loader/loader.component';
import { NavigatorComponent } from '../components/navigator/navigator.component';
// import { Diod } from '../../utils/types/diod';
// import { Capacitor } from '../../utils/types/capacitor';
// import { Transistor } from '../../utils/types/transistor';
// import { Microchip } from '../../utils/types/microchip';
// import { ActivatedRoute, Router } from '@angular/router';
// import { DomSanitizer } from '@angular/platform-browser';
// import { HttpClientModule } from '@angular/common/http';
// import { LoaderComponent } from '../loader/loader.component';
// import { TableComponent } from "../components/table/table.component";
// import { ItemComponent } from "../components/item/item.component";

@Component({
  selector: 'app-main1',
  imports: [NgStyle, NgFor, HttpClientModule, LoaderComponent, NavigatorComponent, CountrySelectionComponent],
  templateUrl: './main1.component.html',
  styleUrls: ['./main1.component.css', '../components/selection/selection.css', '../components/styles/filter.css', '../components/styles/m-table.css'],
  providers: [ApiService]
})
export class Main1Component implements OnInit {
  componentList!: OptionsApi[]
  componentTypes!: ComponentType[]
  // openFilters!: boolean
  loader!: boolean
  rows!: Manufacturer[]
  orig!: Manufacturer[]
  // storage!: ComponentData
  // properties!: string
  // content: any
  url!: SafeResourceUrl
  // selectedCountry!: Country
  // currentcomponentType!: string

  countyOptions!: CountryOptions
  manufacutrerOptions!: Option

  constructor(
    private api: ApiService,
    private router: Router,
    private sanitizer: DomSanitizer,
    // private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    //   this.componentTypes = []
    //   this.storage = {}
    this.rows = []
    this.componentTypes = []

    this.loader = true
    //   this.openFilters = false
    let countries: Partial<ImageName>[] = this.api.getCountriesFromConfig();
    countries.unshift({ nameRu: AppEnum.ALL })


    this.countyOptions = {
      currentValue: {
        nameRu: AppEnum.ALL
      },
      values: countries,
      open: false
    };
    this.manufacutrerOptions = {
      currentvalue: AppEnum.ALL,
      values: [AppEnum.ALL],
      open: false
    }
    this.getApi()

    this.selectComponentTypes()
  }

  getApi(): void {

    this.api.getOptionsApi()?.pipe(map((options: OptionsApi[]) => {

      // this.componentList = options
      options.forEach((item: OptionsApi) => {
        if (this.getManufacturerIndexByValue(item.manufacturerName) === -1) {
          this.manufacutrerOptions.values.push(item.manufacturerName)
        }
      })
      let componetns: ImageName[] = this.api.getComponentsFromConfig()


      options.forEach((row: OptionsApi) => {
        if (this.getComponentTypeIndexByValue(row.ruComponentType) === -1) {

          let cItemIndex = componetns.findIndex(
            (cItem: ImageName) => cItem.nameRu === row.ruComponentType
          )
          if (cItemIndex !== -1) {
            let record: ComponentType = {
              checked: false,
              value: row.ruComponentType,
              manufacturer: getBestManufacturer(options, row.ruComponentType),
              image: componetns[cItemIndex].image
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
      if(this.include(manufacturer, value)) {
        this.rows.push(manufacturer)
      }
    })
  }

  include(manufacturer: Manufacturer, value: string):boolean {
    let manufacturerName: string = manufacturer.manufacturerName
    let length: number = manufacturerName.length >= value.length ? value.length : manufacturerName.length   
    let extractedPart = manufacturerName.slice(0, length).split('')
    for (let i = 0; i < extractedPart.length; i++) {
      if(value[i].toLocaleLowerCase() !== extractedPart[i].toLocaleLowerCase()) {
        return false;
      } 
    }
    return true;
  }

  // selectManufacrurer(currentValue: string): void {
  //   this.rows = [AppEnum.ALL]
  //   this.manufacutrerOptions.currentvalue = currentValue
  //   this.manufacutrerOptions.open = !this.manufacutrerOptions.open
  //   this.componentList.forEach((item: OptionsApi) => {
  //     if (item.manufacturerName === currentValue || item.manufacturerName === AppEnum.ALL) {

  //       // if (this.getComponentKindIndexByValue(item.ruComponentKind) === -1) {
  //       //   this.dropdownOptions.componentKind.values.push(item.ruComponentKind)
  //       // }
  //       // if (this.getComponentNameIndexByValue(item.componentName) === -1) {
  //       //   this.dropdownOptions.componentName.values.push(item.componentName)
  //       // }
  //     }
  //   })
  // }
  // setCountryImageSrc(): string {
  //   return (this.countyOptions.currentValue as Country).image;
  // }
  // setCountryValue(): string {
  //   return (this.countyOptions.currentValue as Country).name;
  // }
  // findChecked(): string | undefined {
  //   let value: string | undefined

  //   this.componentTypes.forEach((type: ComponentType) => {
  //     if (type.checked) {
  //       value = type.value
  //     }
  //   })

  //   return value;
  // }
  getManufacturerIndexByValue(value: string): number {
    let index: number = this.manufacutrerOptions.values.findIndex(
      (val: string) => val === value
    )

    return index
  }

  // item!: OptionsApi;
  // onSelectedRow(item: OptionsApi) {
  //   this.item = item;
  // }

  getComponentTypeIndexByValue(value: string): number {
    let index: number = this.componentTypes.findIndex(
      (val: ComponentType) => val.value === value
    )

    return index
  }
  selectComponentTypes(value: string | void): void {
    let url = "chart/manufacturers"
    // this.currentcomponentType = AppEnum.ALL
    this.componentTypes.forEach((type: ComponentType) => {
      if (value === type.value) {
        type.checked = !type.checked
        if (type.checked) {
          url += `?componenttype=${value}`
          // this.currentcomponentType = value
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
}

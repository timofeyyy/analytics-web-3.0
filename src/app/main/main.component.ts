// // import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// // import { LoaderComponent } from "../loader/loader.component";
// // import { NgFor, NgStyle } from '@angular/common';
// // import { ChartConfig, ChartRoute, ComponentData, ComponentKind, ComponentName, ComponentType, Config, DropdownOptions, Manufacturer, Option, OptionsApi } from '../../utils/types/app';
// // import { HttpClient, HttpClientModule } from '@angular/common/http';
// // import { catchError, map, pipe } from 'rxjs';
// // import config from '../../assets/app.config.json'
// // import { ApiService } from '../../services/api.services';
// // import { AppEnum, ComponentTypeRuEnum } from '../../utils/enum/app.enum';
// // import { ActivatedRoute, Router } from '@angular/router';
// // import { Microchip } from '../../utils/types/microchip';
// // import { DomSanitizer } from '@angular/platform-browser';
// // import { Transistor } from '../../utils/types/transistor';
// // import { Capacitor } from '../../utils/types/capacitor';
// // import { Diod } from '../../utils/types/diod';

// // @Component({
// //   selector: 'app-main',
// //   imports: [
// //     // LoaderComponent, NgStyle, HttpClientModule, NgFor
// //   ],
// //   templateUrl: './main.component.html',
// //   styleUrls: ['./main.component.css', './filter.css', './list.css', './m-table.css', './button.css'],
// //   // providers: [ApiService],
// //   // encapsulation: ViewEncapsulation.None
// // })
// export class MainComponent implements OnInit {
//   // dropdownOptions!: DropdownOptions;
//   // config!: Config
//   // optionsApi!: OptionsApi[]
//   // componentTypes!: ComponentType[]
//   // openFilters!: boolean
//   // loader!: boolean
//   // rows!: OptionsApi[]
//   // storage!: ComponentData
//   // properties!: string
//   // content: any
//   // url!: string

//   // constructor(
//   //   private api: ApiService,
//   //   private router: Router,
//   //   private sanitizer: DomSanitizer,
//   //   private route: ActivatedRoute
//   // ) {

//   // }

//   // ngOnInit(): void {
//   //   this.rows = []
//   //   this.componentTypes = []
//   //   this.storage = {}

//   //   this.loader = true
//   //   this.openFilters = false
//   //   this.dropdownOptions = {
//   //     manufacturerName: {
//   //       currentvalue: AppEnum.ALL,
//   //       values: [AppEnum.ALL],
//   //       open: false
//   //     },
//   //     componentName: {
//   //       currentvalue: AppEnum.ALL,
//   //       values: [AppEnum.ALL],
//   //       open: false
//   //     },
//   //     componentKind: {
//   //       currentvalue: AppEnum.ALL,
//   //       values: [AppEnum.ALL],
//   //       open: false
//   //     },
//   //     propertyName: {
//   //       currentroute: {
//   //         allias: AppEnum.NONE,
//   //         route: AppEnum.NONE
//   //       },
//   //       routes: [{
//   //         allias: AppEnum.NONE,
//   //         route: AppEnum.NONE
//   //       }],
//   //       open: false
//   //     },
//   //   }
//   //   this.getApi()
//   // }
//   // selectValue(keyProp: string): void {
//   //   for (const key in this.dropdownOptions) {
//   //     if (key in this.dropdownOptions && keyProp != key) {
//   //       this.dropdownOptions[key as keyof DropdownOptions].open = false
//   //     }
//   //     else {
//   //       this.dropdownOptions[key as keyof DropdownOptions].open = !this.dropdownOptions[key as keyof DropdownOptions].open
//   //     }
//   //   }
//   // }
//   // getApi(): void {
//   //   // this.api.getManufacturer()?.pipe(map((manufacturers: Manufacturer[]) => {
//   //   //   this.manufacturers = manufacturers
//   //   //   console.log(this.manufacturers)
//   //   // })).subscribe()

//   //   // this.api.getComponentKinds()?.pipe(map((kinds: ComponentKind[]) => {
//   //   //   this.kinds = kinds
//   //   //   console.log(this.kinds)
//   //   // })).subscribe()

//   //   // this.api.getComponentNames()?.pipe(map((names: ComponentName[]) => {
//   //   //   this.names = names
//   //   //   console.log(this.names)
//   //   // })).subscribe()

//   //   this.api.getMicrochips()?.pipe(map((microchips: Microchip[]) => {
//   //     this.storage[ComponentTypeRuEnum.MICROCHIP] = microchips;
//   //   }),
//   //     catchError((err: any) => {
//   //       alert(err.message)
//   //       this.router.navigate([`/not-found`])
//   //       return [];
//   //     })
//   //   ).subscribe()

//   //   this.api.getTransistors()?.pipe(map((transistors: Transistor[]) => {
//   //     this.storage[ComponentTypeRuEnum.TRANSISTOR] = transistors;
//   //   }),
//   //     catchError((err: any) => {
//   //       alert(err.message)
//   //       this.router.navigate([`/not-found`])
//   //       return [];
//   //     })
//   //   ).subscribe()

//   //   this.api.getCapacitors()?.pipe(map((capacitors: Capacitor[]) => {
//   //     this.storage[ComponentTypeRuEnum.CAPACITOR] = capacitors;
//   //   }),
//   //     catchError((err: any) => {
//   //       alert(err.message)
//   //       this.router.navigate([`/not-found`])
//   //       return [];
//   //     })
//   //   ).subscribe()

//   //   this.api.getDiods()?.pipe(map((diods: Diod[]) => {
//   //     this.storage[ComponentTypeRuEnum.DIOD] = diods;
//   //   }),
//   //     catchError((err: any) => {
//   //       alert(err.message)
//   //       this.router.navigate([`/not-found`])
//   //       return [];
//   //     })
//   //   ).subscribe()

//   //   this.api.getOptionsApi()?.pipe(map((options: OptionsApi[]) => {
//   //     this.optionsApi = options
//   //     // console.log(this.optionsApi)

//   //     this.optionsApi.forEach((item: OptionsApi) => {
//   //       if (this.getManufacturerIndexByValue(item.manufacturerName) === -1) {
//   //         this.dropdownOptions.manufacturerName.values.push(item.manufacturerName)
//   //       }
//   //     })
//   //     this.selectManufacrurer()
//   //     this.updateTable()
//   //     this.initComponentTypes()
//   //     this.updateChartList()
//   //     this.loader = false
//   //   }),
//   //     catchError((err: any) => {
//   //       alert(err.message)
//   //       this.router.navigate([`/not-found`])
//   //       return [];
//   //     })
//   //   ).subscribe()
//   // }
//   // findChecked(): string | undefined {
//   //   let value: string | undefined

//   //   this.componentTypes.forEach((type: ComponentType) => {
//   //     if (type.checked) {
//   //       value = type.value
//   //     }
//   //   })

//   //   return value;
//   // }
//   // getManufacturerIndexByValue(value: string): number {
//   //   let index: number = this.dropdownOptions.manufacturerName.values.findIndex(
//   //     (val: string) => val === value
//   //   )

//   //   return index
//   // }
//   // getComponentKindIndexByValue(value: string): number {
//   //   let index: number = this.dropdownOptions.componentKind.values.findIndex(
//   //     (val: string) => val === value
//   //   )

//   //   return index
//   // }
//   // getComponentNameIndexByValue(value: string): number {
//   //   let index: number = this.dropdownOptions.componentName.values.findIndex(
//   //     (val: string) => val === value
//   //   )

//   //   return index
//   // }
//   // getComponentTypeIndexByValue(value: string): number {
//   //   let index: number = this.componentTypes.findIndex(
//   //     (val: ComponentType) => val.value === value
//   //   )

//   //   return index
//   // }
//   // selectManufacrurer(): void {
//   //   this.dropdownOptions.componentKind.values = []
//   //   this.dropdownOptions.componentName.values = []

//   //   this.optionsApi.forEach((item: OptionsApi) => {

//   //     if (item.manufacturerName === this.dropdownOptions.manufacturerName.currentvalue || this.dropdownOptions.manufacturerName.currentvalue === AppEnum.ALL) {
//   //       if (this.getComponentKindIndexByValue(item.ruComponentKind) === -1) {
//   //         this.dropdownOptions.componentKind.values.push(item.ruComponentKind)
//   //       }
//   //       if (this.getComponentNameIndexByValue(item.componentName) === -1) {
//   //         this.dropdownOptions.componentName.values.push(item.componentName)
//   //       }
//   //     }
//   //   })

//   //   if (this.dropdownOptions.componentKind.values.length >= 2) {
//   //     this.dropdownOptions.componentKind.values.unshift(AppEnum.ALL)
//   //   }
//   //   if (this.dropdownOptions.componentName.values.length >= 2) {
//   //     this.dropdownOptions.componentName.values.unshift(AppEnum.ALL)
//   //   }

//   //   this.dropdownOptions.componentKind.currentvalue = this.dropdownOptions.componentKind.values[0]
//   //   this.dropdownOptions.componentName.currentvalue = this.dropdownOptions.componentName.values[0]


//   //   // console.log(this.dropdownOptions)
//   // }
//   // selectKind(): void {
//   //   this.dropdownOptions.componentName.values = []

//   //   this.optionsApi.forEach((item: OptionsApi) => {
//   //     if (this.dropdownOptions.componentKind.currentvalue === AppEnum.ALL) {
//   //       this.dropdownOptions.componentKind.values.forEach((kind: string) => {
//   //         if (this.dropdownOptions.manufacturerName.currentvalue === AppEnum.ALL) {
//   //           if (kind === this.dropdownOptions.componentKind.currentvalue) {
//   //             this.dropdownOptions.componentName.values.push(item.componentName)
//   //             return;
//   //           }
//   //         }
//   //         else if (item.manufacturerName === this.dropdownOptions.manufacturerName.currentvalue) {
//   //           if (kind === this.dropdownOptions.componentKind.currentvalue) {
//   //             this.dropdownOptions.componentName.values.push(item.componentName)
//   //             return;
//   //           }
//   //         }
//   //       })
//   //     }
//   //     else if (this.dropdownOptions.componentKind.currentvalue === item.ruComponentKind) {
//   //       if (this.dropdownOptions.manufacturerName.currentvalue === AppEnum.ALL) {
//   //         this.dropdownOptions.componentName.values.push(item.componentName)
//   //       }
//   //       else if (item.manufacturerName === this.dropdownOptions.manufacturerName.currentvalue) {
//   //         this.dropdownOptions.componentName.values.push(item.componentName)
//   //       }
//   //     }
//   //   })
//   //   if (this.dropdownOptions.componentName.values.length >= 2) {
//   //     this.dropdownOptions.componentName.values.unshift(AppEnum.ALL)
//   //   }
//   //   this.dropdownOptions.componentName.currentvalue = this.dropdownOptions.componentName.values[0]
//   // }
//   // updateTable(): void {
//   //   this.rows = []
//   //   this.optionsApi.forEach((item: OptionsApi) => {

//   //     let componentType: string | undefined = this.findChecked()
//   //     if (!componentType || componentType === item.ruComponentType) {
//   //       if (this.dropdownOptions.componentName.currentvalue === AppEnum.ALL) {
//   //         this.dropdownOptions.componentName.values.forEach((componentName: string) => {
//   //           if (item.componentName === componentName) {
//   //             this.rows.push(item)
//   //             return;
//   //           }
//   //         })
//   //       }
//   //       else if (this.dropdownOptions.componentName.currentvalue === item.componentName) {
//   //         this.rows.push(item)
//   //       }
//   //     }
//   //   })
//   // }
//   // initComponentTypes(): void {
//   //   this.componentTypes = []
//   //   this.rows.forEach((row: OptionsApi) => {
//   //     if (this.getComponentTypeIndexByValue(row.ruComponentType) === -1) {
//   //       this.componentTypes.push({ checked: false, value: row.ruComponentType })
//   //     }
//   //   })
//   // }
//   // table!: string | undefined
//   // updateChartList(): void {
//   //   let componentType: string | undefined = this.findChecked()
//   //   this.dropdownOptions.propertyName.routes = [{
//   //     allias: AppEnum.NONE,
//   //     route: AppEnum.NONE
//   //   }]
//   //   if (componentType) {
//   //     let chartConfig: ChartConfig[] = this.api.getChartConfig()
//   //     // console.log(componentType, chartConfig)
//   //     chartConfig.forEach((component: ChartConfig) => {
//   //       if (component.allias === componentType) {
//   //         this.table = component.name
//   //         component.routes.forEach((route: ChartRoute) => {
//   //           this.dropdownOptions.propertyName.routes?.push(route)
//   //         })
//   //       }
//   //     })
//   //   }
//   //   this.dropdownOptions.propertyName.currentroute = this.dropdownOptions.propertyName.routes[0]
//   // }
//   // selectComponentTypes(value: string): void {
//   //   this.componentTypes.forEach((type: ComponentType) => {
//   //     if (value === type.value) {
//   //       type.checked = !type.checked
//   //     }
//   //     else {
//   //       type.checked = false
//   //     }
//   //   })
//   //   this.updateTable()
//   //   this.updateChartList()
//   // }
//   // getItem(row: OptionsApi): void {
//   //   let content: string = ""

//   //   this.storage[row.ruComponentType].forEach((component: any) => {
//   //     if (component.componentName === row.componentName) {
//   //       for (const key in component) {
//   //         if (key in component) {
//   //           content +=
//   //             `<div class="prop">
//   //               <p class="key">${key}</p>
//   //               <p class="value">${component[key]}</p>
//   //             </div>`
//   //         }
//   //       }
//   //       return;
//   //     }
//   //   })

//   //   this.content = this.sanitizer
//   //     .bypassSecurityTrustHtml(content)
//   // }
//   // navigate(): void {
//   //   // console.log(this.dropdownOptions.propertyName.currentvalue.route)
//   //   if (this.rows.length <= 1) {
//   //     alert("Неудалось построить график:\nЗаписей должно быть больше чем 1")
//   //     return;
//   //   }

//   //   console.log(this.table)

//   //   let url: string = `chart/${this.table}/${this.dropdownOptions.propertyName.currentroute?.route}?`
//   //   if (this.dropdownOptions.manufacturerName.currentvalue !== AppEnum.ALL) {
//   //     url += `manufacturerName=${this.dropdownOptions.manufacturerName.currentvalue}&`
//   //   }
//   //   if (this.dropdownOptions.componentKind.currentvalue !== AppEnum.ALL) {
//   //     url += `componentKind=${this.dropdownOptions.componentKind.currentvalue}&`
//   //   }
//   //   if (this.dropdownOptions.componentName.currentvalue !== AppEnum.ALL) {
//   //     url += `componentName=${this.dropdownOptions.componentName.currentvalue}`
//   //   }
//   //   // console.log(url)
//   //   this.router.navigateByUrl(url)
//   // }
// }

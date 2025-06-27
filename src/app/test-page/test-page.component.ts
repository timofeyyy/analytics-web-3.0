import { Component, OnInit } from '@angular/core';
import { DropboxProviderComponent } from "../components/dropbox-provider/dropbox-provider.component";
import { ApiService1 } from '../../services/api.services1';
import { HttpClientModule } from '@angular/common/http';
import { ComponentOptions } from '../../utils/types/app';
import { forkJoin } from 'rxjs';
import { ComponentTypeRuEnum } from '../../utils/enum/app.enum';
import { props } from '../../assets/fetch.config';
import { ManufacturerCountTableComponent } from "../components/manufacturer-count-table/manufacturer-count-table.component";

@Component({
  selector: 'app-test-page',
  imports: [DropboxProviderComponent, HttpClientModule, ManufacturerCountTableComponent],
  providers: [ApiService1],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.css'
})
export class TestPageComponent implements OnInit {

  currentDropBoxName: string | undefined
  allias!: Map<string, string>
  all!: Partial<ComponentOptions>[]
  values!: any[]
  storage: any
  dropBoxPropsMap!: Map<string, any>
  onCurrentDropBoxNameChnaged(obj: { propsMap: Map<string, any>, currentName: string | undefined }): void {
    this.currentDropBoxName = obj.currentName
    this.dropBoxPropsMap = obj.propsMap
    console.log(this.dropBoxPropsMap)
  }

  constructor(private api: ApiService1) { }

  ngOnInit(): void {
    this.all = []
    this.values = []
    this.allias = new Map()
    this.storage = new Map()
    this.getApi()

    const dropBoxPropsClone: any = {};
    for (const [key, value] of Object.entries(props)) {
      dropBoxPropsClone[key] = { ...value };
    }
    this.dropBoxPropsMap = new Map(Object.entries(dropBoxPropsClone));
  }



  getApi(): void {
    forkJoin([
      this.api.getDiods(),
      this.api.getTransistors(),
      this.api.getCapacitors(),
      this.api.getMicrochips(),
      this.api.getResistors(),
      this.api.getAlias()
    ]).subscribe(res => {
      this.storage.set(ComponentTypeRuEnum.DIOD, (res as any[])[0])
      this.storage.set(ComponentTypeRuEnum.TRANSISTOR, (res as any[])[1])
      this.storage.set(ComponentTypeRuEnum.CAPACITOR, (res as any[])[2])
      this.storage.set(ComponentTypeRuEnum.MICROCHIP, (res as any[])[3])
      this.storage.set(ComponentTypeRuEnum.RESISTOR, (res as any[])[4])
      const allias = (res as any[])[5]
      this.allias = new Map<string, string>(Object.entries(allias))
      let copy: Partial<ComponentOptions>[] = []
      this.values = [
        ...(res as any[])[0],
        ...(res as any[])[1],
        ...(res as any[])[2],
        ...(res as any[])[3],
        ...(res as any[])[4],
      ]
      if (this.storage.size === 5) {
        this.storage.forEach((set: any) => {
          this.values.concat(set);
          (set as []).forEach((item: any) => {
            copy.push({
              component: item
            })
          })
        })
      }
      console.log(this.values)
      this.all = copy
    });
    // this.api.getComponentsApi()?.pipe(map((options: ComponentLabel[]) => {
    //   console.log(options)
    //   let componetns: ImageName[] = this.api.getComponentsFromConfig()
    //   options.forEach((row: ComponentLabel) => {
    //     if (this.getComponentTypeIndexByValue(row.ruComponentType) === -1) {
    //       let cItemIndex = componetns.findIndex(
    //         (cItem: ImageName) => cItem.nameRu === row.ruComponentType
    //       )
    //       if (cItemIndex !== -1) {
    //         let record: ComponentTypesCheckBoxes = {
    //           checked: false,
    //           manufacturer: getBestManufacturer(options, row.ruComponentType),
    //           image: {
    //             image: componetns[cItemIndex].image,
    //             nameRu: row.ruComponentType
    //           }
    //         }
    //         this.componentTypes.push(record)
    //       }
    //     }
    //   })
    //   this.rows = getManufacturersProd(options) as Manufacturer[]
    //   console.log(this.rows)
    //   this.orig = this.rows
    //   this.loader = false
    // }),
    //   catchError((err: any) => {
    //     console.log(err.message)
    //     this.router.navigate([`/not-found`])
    //     return [];
    //   })
    // ).subscribe()
  }
}

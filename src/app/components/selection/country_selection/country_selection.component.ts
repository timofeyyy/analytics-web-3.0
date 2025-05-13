import { Component, OnInit } from '@angular/core';
import { ComponentTypesCheckBoxes, DropBox } from '../../../../utils/types/app';
import { AppEnum } from '../../../../utils/enum/app.enum';
import { ApiService } from '../../../../services/api.services';
import { ImageName } from '../../../../utils/types/config';
import { NgFor, NgStyle } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-country-selection',
  imports: [NgStyle, NgFor, HttpClientModule],
  templateUrl: './country_selection.component.html',
  styleUrls: ['../selection.css', './country_selection.component.css'],
  providers: [ApiService]
})
export class CountrySelectionComponent implements OnInit {
  countyOptions!: DropBox

  constructor(
    private api: ApiService
  ) {}
 
  ngOnInit(): void {
 
    let countries: Partial<ImageName>[] = this.api.getCountriesFromConfig();
    countries.unshift({ nameRu: AppEnum.ALL })

    this.countyOptions = {
      currentValue: {
        nameRu: AppEnum.ALL
      },
      values: countries,
      open: false
    };
  }

}

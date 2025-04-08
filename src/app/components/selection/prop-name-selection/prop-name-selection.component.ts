import { Component, OnInit } from '@angular/core';
import { CountryOptions, Option } from '../../../../utils/types/app';
import { ImageName } from '../../../../utils/types/config';
import { ApiService } from '../../../../services/api.services';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-prop-name-selection',
  imports: [NgStyle],
  templateUrl: './prop-name-selection.component.html',
  styleUrls: ['./prop-name-selection.component.css', '../selection.css'],

})
export class PropNameSelectionComponent implements OnInit {
  options!: Partial<Option>

  constructor() {}

  ngOnInit(): void {

    this.options = {
      currentvalue: "битность",
      values: ["битность"],
      open: false
    };
  }
}

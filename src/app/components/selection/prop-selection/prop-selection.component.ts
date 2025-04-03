import { Component, OnInit } from '@angular/core';
import { CountryOptions, Option } from '../../../../utils/types/app';
import { ImageName } from '../../../../utils/types/config';
import { ApiService } from '../../../../services/api.services';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-prop-selection',
  imports: [NgStyle],
  templateUrl: './prop-selection.component.html',
  styleUrls: ['./prop-selection.component.css', '../selection.css'],

})
export class PropSelectionComponent implements OnInit {
  options!: Option

  constructor() {}

  ngOnInit(): void {

    this.options = {
      currentvalue: "битность",
      values: ["битность"],
      open: false
    };
  }
}

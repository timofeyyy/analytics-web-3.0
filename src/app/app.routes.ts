import { Routes } from '@angular/router';
import { Main1Component } from './main1/main1.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { ChartsComponent } from './charts/charts.component';
import { ChartComponent } from './components/charts/bar/manufacturer_stat/chart.component';
import { KindStatComponent } from './components/charts/bar/componentkind_stat/chart.component';
import { ComponentTypeStatComponent } from './components/charts/pie/componenttype_stat/chart.component';
import { ComponentTemplateComponent } from './component-template/component-template.component';
import { ManufacturersComponent } from './components/charts/pie/manufacturers_stat/chart.component';
import { ManufacturerBitDepthValueComponent } from './components/charts/pie/manufacturer_bitdepthvalue_stat/chart.component';
import { CatalogComponent } from './catalog/catalog.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component:  Main1Component },
    { path: 'charts', component:  ChartsComponent },
    { path: 'catalog', component: CatalogComponent },
    { path: 'not-found', component: NotfoundComponent },
    { path: ':componentType', component:  ComponentTemplateComponent },
    { path: 'chart/manufacturers', component:  ChartComponent },
    { path: 'chart/manufacturers/production', component:  KindStatComponent },
    { path: 'chart/componenttypes/stat', component:  ComponentTypeStatComponent },
    { path: 'chart/:componenttype/manufacturers/:chart', component: ManufacturersComponent },
    { path: 'chart/:componenttype/manufacturers/:chart/bitdepthvalue', component: ManufacturerBitDepthValueComponent },

];

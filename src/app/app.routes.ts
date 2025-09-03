import { Routes } from '@angular/router';
import { NotfoundComponent } from './notfound/notfound.component';
import { TypeTemplateComponent } from './component_type_template/component_type_template.component';
import { CatalogComponent } from './catalog/catalog.component';

import { ItemInfoTemplateComponent } from './item_info_template/item_info_template.component';
// import { ChartBuilderComponent } from './chart-builder/chart-builder.component';
import { TableBuilderComponent } from './table/table-builder/table-builder.component';
import { TestPageComponent } from './test-page/test-page.component';
import { ChartTemplateComponent } from './components/charts/chart_template.component';
import { HomeComponent } from './home/home.component';
import { TableChartTemplateComponent } from './table/table-chart-template/table-chart-template.component';
import { StepWindowComponent } from './selection/builder/step-window/step-window.component';
import { TablePage } from './table/table-page/table-page.component';
import { SelectionViewAllPage } from './selection/view/all/view-all-page.component';
  
export const routes: Routes = [
    { path: '', redirectTo: 'selection-builder', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'component', component: ItemInfoTemplateComponent },
    { path: 'filters', component: CatalogComponent },    { path: 'not-found', component: NotfoundComponent },
    { path: 'componentType/:ruComponentType', component: TypeTemplateComponent },
    { path: 'chart/:req_name/:chart_name/:type_name', component: ChartTemplateComponent },
    { path: 'selection-builder', component: StepWindowComponent },
    { path: 'table-builder', component: TableBuilderComponent },
    { path: 'selection-view-all', component: SelectionViewAllPage },
    { path: 'selection-view', component: TablePage },
    { path: 'test-page', component: TestPageComponent },
    { path: 'table-chart/:type_name', component: TableChartTemplateComponent },
];

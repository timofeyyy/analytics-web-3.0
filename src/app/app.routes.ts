import { Routes } from '@angular/router';
import { NotfoundComponent } from './notfound/notfound.component';
import { TypeTemplateComponent } from './component-type-template/component-type-template.component';
import { CatalogComponent } from './catalog/catalog.component';

import { ItemInfoTemplateComponent } from './item-info-template/item-info-template.component';
// import { ChartBuilderComponent } from './chart-builder/chart-builder.component';
// import { TableBuilderComponent } from './table/table-builder/table-builder.component';
import { TestPageComponent } from './test-page/test-page.component';
import { ChartTemplateComponent } from './components/charts/chart_template.component';
import { HomeComponent } from './home/home.component';
import { StepWindowComponent } from './selection/builder/step-window/step-window.component';
import { SelectionViewAllPage } from './selection/view/all/view-all-page.component';
import { TablePage } from './selection/view/priorities/view-page.component';
import { TableChartTemplateComponent } from './selection/view/charts/table-chart-template.component';
import { SelectionMainComponent } from './selection-main/selection-main.component';
import { ComponentAnalyticsComponent } from './component-analytics/component-analytics.component';

export const routes: Routes = [
    { path: '', redirectTo: 'selection-main', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'component', component: ItemInfoTemplateComponent },
    { path: 'filters', component: CatalogComponent },
    //   { path: 'not-found', component: NotfoundComponent },
    { path: 'componentType/:ruComponentType', component: TypeTemplateComponent },
    { path: 'component-analytic/:ruComponentType', component: ComponentAnalyticsComponent },
    { path: 'chart/:req_name/:chart_name/:type_name', component: ChartTemplateComponent },
    { path: 'selection-builder', component: StepWindowComponent },
    // { path: 'table-builder', component: TableBuilderComponent },
    { path: 'selection-view-all', component: SelectionViewAllPage },
    { path: 'selection-view', component: TablePage },
    { path: 'selection-main', component: SelectionMainComponent },
    { path: 'test-page', component: TestPageComponent },
    { path: 'table-chart/:type_name', component: TableChartTemplateComponent },
];

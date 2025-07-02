import { Routes } from '@angular/router';
import { Main1Component } from './main1/main1.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { TypeTemplateComponent } from './component_type_template/component_type_template.component';
import { CatalogComponent } from './catalog/catalog.component';

import { ItemInfoTemplateComponent } from './item_info_template/item_info_template.component';
// import { ChartBuilderComponent } from './chart-builder/chart-builder.component';
import { TableBuilderComponent } from './table-builder/table-builder.component';
import { TestPageComponent } from './test-page/test-page.component';
import { ChartTemplateComponent } from './components/charts/chart_type_template.component';
import { TablePage } from './table-page/table-page.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Main1Component },
    { path: 'component', component: ItemInfoTemplateComponent },
    { path: 'catalog', component: CatalogComponent },
    { path: 'not-found', component: NotfoundComponent },
    { path: 'componentType/:ruComponentType', component: TypeTemplateComponent },
    { path: 'chart/:req_name/:chart_name/:type_name', component: ChartTemplateComponent },
    { path: 'table-builder', component: TableBuilderComponent },
    { path: 'table-view', component: TablePage },
    { path: 'test-page', component: TestPageComponent },
];

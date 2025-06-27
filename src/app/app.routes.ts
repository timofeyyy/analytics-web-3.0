import { Routes } from '@angular/router';
import { Main1Component } from './main1/main1.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { TypeTemplateComponent } from './component_type_template/component_type_template.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ParentChartTemplateComponent } from './components/charts/chart_type_template_/parent/chart_type_template.component';
import { ChildChartTemplateComponent } from './components/charts/chart_type_template_/child/chart_type_template.component';
import { ItemInfoTemplateComponent } from './item_info_template/item_info_template.component';
// import { ChartBuilderComponent } from './chart-builder/chart-builder.component';
import { TableBuilderComponent } from './table-viewer/table-viewer.component';
import { TableComponent } from './components/table/table.component';
import { TestPageComponent } from './test-page/test-page.component';
import { ChartTemplateComponent } from './components/charts/chart_type_template.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Main1Component },
    { path: 'component', component: ItemInfoTemplateComponent },
    { path: 'catalog', component: CatalogComponent },
    { path: 'not-found', component: NotfoundComponent },
    { path: 'componentType/:ruComponentType', component: TypeTemplateComponent },
    { path: 'chart1/parent/:req_name/:chart_name/:type_name', component: ParentChartTemplateComponent },
    { path: 'chart1/child/:req_name/:chart_name/:type_name', component: ChildChartTemplateComponent },
    { path: 'chart/:req_name/:chart_name/:type_name', component: ChartTemplateComponent },
    { path: 'table-builder', component: TableBuilderComponent },
    { path: 'table-view', component: TableComponent },
    { path: 'test-page', component: TestPageComponent },
];

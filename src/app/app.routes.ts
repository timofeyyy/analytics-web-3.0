import { Routes } from '@angular/router';
import { CatalogComponent } from './catalog/catalog.component';
import { ItemInfoTemplateComponent } from './item-info-template/item-info-template.component';
import { ChartTemplateComponent } from './components/charts/chart-template.component';
import { HomeComponent } from './home/home.component';
import { StepWindowComponent } from './selection/builder/step-window/step-window.component';
import { SelectionMainComponent } from './selection/selection-main/selection-main.component';
import { ComponentAnalyticsComponent } from './component-analytics/component-analytics.component';
import { Home1Component } from './home1/home1.component';
import { SelectionPrioritiesComponent } from './selection/selection-priorities/selection-priorities.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    // { path: 'home', component: HomeComponent },
    { path: 'home', component: Home1Component },
    { path: 'component', component: ItemInfoTemplateComponent },
    // { path: 'filters', component: CatalogComponent },
    { path: 'component-analytic/:enComponentType', component: ComponentAnalyticsComponent },
    { path: 'chart/:req_name/:chart_name/:type_name', component: ChartTemplateComponent },
    { path: 'selection-builder', component: StepWindowComponent },
    { path: 'selection-main', component: SelectionMainComponent },
    { path: 'selection-priorities', component: SelectionPrioritiesComponent }
];
  
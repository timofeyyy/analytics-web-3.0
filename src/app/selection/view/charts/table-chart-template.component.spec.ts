import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableChartTemplateComponent } from './table-chart-template.component';

describe('TableChartTemplateComponent', () => {
  let component: TableChartTemplateComponent;
  let fixture: ComponentFixture<TableChartTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableChartTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableChartTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

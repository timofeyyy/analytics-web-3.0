import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentAnalyticsComponent } from './component-analytics.component';

describe('ComponentAnalyticsComponent', () => {
  let component: ComponentAnalyticsComponent;
  let fixture: ComponentFixture<ComponentAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

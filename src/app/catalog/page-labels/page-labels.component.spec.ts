import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLabelsComponent } from './page-labels.component';

describe('PageLabelsComponent', () => {
  let component: PageLabelsComponent;
  let fixture: ComponentFixture<PageLabelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageLabelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

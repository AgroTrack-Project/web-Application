import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotForm } from './plot-form';

describe('PlotForm', () => {
  let component: PlotForm;
  let fixture: ComponentFixture<PlotForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlotForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlotForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

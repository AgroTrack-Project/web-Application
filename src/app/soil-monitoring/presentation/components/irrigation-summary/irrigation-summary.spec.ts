import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrrigationSummary } from './irrigation-summary';

describe('IrrigationSummary', () => {
  let component: IrrigationSummary;
  let fixture: ComponentFixture<IrrigationSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IrrigationSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IrrigationSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

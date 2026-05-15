import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoilAdviceCard } from './soil-advice-card';

describe('SoilAdviceCard', () => {
  let component: SoilAdviceCard;
  let fixture: ComponentFixture<SoilAdviceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoilAdviceCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoilAdviceCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

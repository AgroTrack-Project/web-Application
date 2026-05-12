import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavbarComponent } from './navbar';

describe('NavbarComponent', () => {
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [provideRouter([])]
    });
    fixture = TestBed.createComponent(NavbarComponent);
  });

  it('should create', () => expect(fixture.componentInstance).toBeTruthy());
});

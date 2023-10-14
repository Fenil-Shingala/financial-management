import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainModuleComponent } from './main-module.component';

describe('MainModuleComponent', () => {
  let component: MainModuleComponent;
  let fixture: ComponentFixture<MainModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainModuleComponent]
    });
    fixture = TestBed.createComponent(MainModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

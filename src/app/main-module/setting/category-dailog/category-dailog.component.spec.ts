import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryDailogComponent } from './category-dailog.component';

describe('CategoryDailogComponent', () => {
  let component: CategoryDailogComponent;
  let fixture: ComponentFixture<CategoryDailogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryDailogComponent]
    });
    fixture = TestBed.createComponent(CategoryDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

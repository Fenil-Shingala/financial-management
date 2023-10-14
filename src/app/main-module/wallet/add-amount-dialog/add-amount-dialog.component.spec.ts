import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAmountDialogComponent } from './add-amount-dialog.component';

describe('AddAmountDialogComponent', () => {
  let component: AddAmountDialogComponent;
  let fixture: ComponentFixture<AddAmountDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddAmountDialogComponent]
    });
    fixture = TestBed.createComponent(AddAmountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

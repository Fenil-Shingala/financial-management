import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionDialogComponent } from './transaction-dialog.component';

describe('TransactionDialogComponent', () => {
  let component: TransactionDialogComponent;
  let fixture: ComponentFixture<TransactionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionDialogComponent]
    });
    fixture = TestBed.createComponent(TransactionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

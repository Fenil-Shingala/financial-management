import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MagloWalletComponent } from './maglo-wallet.component';

describe('MagloWalletComponent', () => {
  let component: MagloWalletComponent;
  let fixture: ComponentFixture<MagloWalletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MagloWalletComponent]
    });
    fixture = TestBed.createComponent(MagloWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

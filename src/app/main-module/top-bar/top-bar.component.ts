import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent {
  sidebarCollapes = false;
  title!: string;
  titleUnsubscribe!: Subscription;
  siderUnsubscribe!: Subscription;
  currentLoginUser = localStorage.getItem('loginUser')
    ? JSON.parse(localStorage.getItem('loginUser') || '')
    : null;

  constructor(private sharedService: SharedServiceService) {}

  ngOnInit() {
    this.titleUnsubscribe = this.sharedService.headerTitle.subscribe(
      (value) => {
        this.title = value as string;
      }
    );
    this.siderUnsubscribe = this.sharedService.sidebarCollapes.subscribe(
      (value) => {
        this.sidebarCollapes = value as boolean;
      }
    );
  }

  collapes(): void {
    this.sidebarCollapes = !this.sidebarCollapes;
    this.sharedService.sidebarCollapes.next(this.sidebarCollapes);
  }

  ngOnDestroy() {
    this.titleUnsubscribe.unsubscribe();
    this.siderUnsubscribe.unsubscribe();
  }
}

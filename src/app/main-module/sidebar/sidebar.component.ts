import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  sidebar = false;
  closeSidebar = false;
  siderUnsubscribe!: Subscription;

  constructor(
    private route: Router,
    private sharedService: SharedServiceService
  ) {}

  ngOnInit() {
    this.siderUnsubscribe = this.sharedService.sidebarCollapes.subscribe(
      (value) => {
        this.sidebar = value as boolean;
      }
    );
  }

  logout(): void {
    this.route.navigate(['/user-module/login']);
    localStorage.removeItem('loginUser');
  }

  closeCollapes(): void {
    this.sidebar = false;
    this.sharedService.sidebarCollapes.next(this.sidebar);
  }

  ngOnDestroy() {
    this.siderUnsubscribe.unsubscribe();
  }
}

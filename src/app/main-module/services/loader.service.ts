import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private activeRequestsCount = 0;
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);

  get isLoading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  show(): void {
    this.activeRequestsCount++;
    if (this.activeRequestsCount === 1) {
      this.loadingSubject.next(true);
    }
  }

  hide(): void {
    if (this.activeRequestsCount > 0) {
      this.activeRequestsCount--;
      if (this.activeRequestsCount === 0) {
        this.loadingSubject.next(false);
      }
    }
  }
}

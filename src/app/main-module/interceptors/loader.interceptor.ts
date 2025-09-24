import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(
    private loader: LoaderService,
    private sharedService: SharedServiceService
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const isJsonServerCall = req.url.startsWith(this.sharedService.userUrl);
    if (isJsonServerCall) {
      this.loader.show();
    }
    return next.handle(req).pipe(
      finalize(() => {
        if (isJsonServerCall) {
          this.loader.hide();
        }
      })
    );
  }
}

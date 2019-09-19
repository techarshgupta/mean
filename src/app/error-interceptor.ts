import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export class ErrorInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        alert(error.error.error.message);
        return throwError(error);
      })
    );
  }
}

import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  handleError(error: any): void {
    console.error('An error occurred:', error);
    alert('An unexpected error occurred. Please try again.');
  }
}
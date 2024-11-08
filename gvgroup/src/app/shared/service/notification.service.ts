import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);
  private readonly SNACKBAR_DURATION = 5000;

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: this.SNACKBAR_DURATION });
  }
}

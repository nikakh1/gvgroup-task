import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { UserProfile } from '../models/user-profile.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userDataSubject = new BehaviorSubject<UserProfile>(
    this.loadUserData()
  );
  private loadingStateSubject = new BehaviorSubject<boolean>(false);
  userData$ = this.userDataSubject.asObservable();
  loadingState$ = this.loadingStateSubject.asObservable();

  private notificationService = inject(NotificationService);

  private loadUserData(): UserProfile {
    const data = localStorage.getItem('userData');
    return data
      ? JSON.parse(data)
      : {
          firstName: 'Nika',
          lastName: 'Khonelidze',
          email: 'n.khonelidze2@gmail.com',
          phoneNumber: '596124477',
          profilePicture: null,
        };
  }

  public getUserProfile(): Observable<UserProfile> {
    this.loadingStateSubject.next(true);
    return this.userData$.pipe(
      delay(1000),
      tap(() => this.loadingStateSubject.next(false)),
      catchError(() => {
        this.notificationService.openSnackBar(
          'Failed to fetch user information',
          'Dismiss'
        );
        return EMPTY;
      })
    );
  }

  public updateUserProfile(user: UserProfile): Observable<UserProfile> {
    this.userDataSubject.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
    this.loadingStateSubject.next(true);
    return of(user).pipe(
      delay(1000),
      tap(() => {
        this.userDataSubject.next(user);
        this.loadingStateSubject.next(false);
      }),
      catchError(() => {
        this.notificationService.openSnackBar(
          'Failed to update user information',
          'Dismiss'
        );
        return EMPTY;
      })
    );
  }
}

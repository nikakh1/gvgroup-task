import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'edit-profile',
    pathMatch: 'full',
    loadComponent: () =>
      import('./user-profile-edit/user-profile-edit.component').then(
        (m) => m.UserProfileEditComponent
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./user-profile/user-profile.component').then(
        (m) => m.UserProfileComponent
      ),
  },
];

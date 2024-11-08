import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { UserService } from '../shared/service/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CommonModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  public userData$ = this.userService.userData$;
  public loading$ = this.userService.loadingState$;

  constructor(private userService: UserService, private router: Router) {}

  public onClick(): void {
    this.router.navigate(['/edit-profile']);
  }
}

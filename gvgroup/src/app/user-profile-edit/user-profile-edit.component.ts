import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { UserService } from '../shared/service/user.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ImagePreviewPipe } from '../shared/pipes/image-preview.pipe';
import { FileService } from '../shared/service/file.service';
import {
  emailValidator,
  numericValidator,
} from '../shared/utils/form-validators';
import { NotificationService } from '../shared/service/notification.service';
@Component({
  selector: 'app-user-profile-edit',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    CommonModule,
    ImagePreviewPipe,
  ],
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileEditComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private userService = inject(UserService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private fileService = inject(FileService);

  public editProfileForm: FormGroup = inject(FormBuilder).group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, emailValidator()]],
    phoneNumber: ['', numericValidator()],
    profilePicture: [''],
  });
  public loading$ = this.userService.loadingState$;

  ngOnInit() {
    this.getUserProfile();
  }

  private getUserProfile(): void {
    this.userService
      .getUserProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.editProfileForm.patchValue(user);
      });
  }

  public onFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.editProfileForm.patchValue({ profilePicture: file });
      this.editProfileForm.get('profilePicture')?.updateValueAndValidity();
    } else {
      this.notificationService.openSnackBar(
        'Please select a valid image file',
        'Dismiss'
      );
    }
  }

  public isFieldValid(fieldName: string): boolean {
    const control = this.editProfileForm.get(fieldName);
    return control?.valid || !(control?.dirty || control?.touched);
  }

  public onSubmit(): void {
    if (this.editProfileForm.valid) {
      const updatedUser = this.editProfileForm.value;

      if (updatedUser.profilePicture instanceof File) {
        this.fileService
          .readFileAsBase64(updatedUser.profilePicture)
          .then((result) => {
            updatedUser.profilePicture = result;
            this.saveProfile(updatedUser);
          });
      } else {
        this.saveProfile(updatedUser);
      }
    }
  }

  private saveProfile(updatedUser: any): void {
    this.userService
      .updateUserProfile(updatedUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.notificationService.openSnackBar(
          'User profile has been updated!',
          'Dismiss'
        );
        this.router.navigate(['/']);
      });
  }

  public onFormReset(): void {
    this.router.navigate(['/']);
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile-edit',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileEditComponent {
  public editProfileForm: FormGroup;
  public pfpImagePreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.editProfileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        ],
      ],
      phoneNumber: ['', Validators.pattern(/^\d+$/)],
      profilePicture: [''],
    });
  }

  public onFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.editProfileForm.patchValue({ profilePicture: file });
      this.editProfileForm.get('profilePicture')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.pfpImagePreview = reader.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  public isFieldValid(fieldName: string): boolean {
    if (
      this.editProfileForm.get(fieldName)?.invalid &&
      (this.editProfileForm.get(fieldName)?.dirty ||
        this.editProfileForm.get(fieldName)?.touched)
    ) {
      return false;
    }
    return true;
  }

  public onSubmit(): void {
    console.log(this.editProfileForm.value);
  }

  public onFormReset(): void {}
}

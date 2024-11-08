import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UserProfileEditComponent } from './user-profile-edit.component';
import { UserService } from '../shared/service/user.service';
import { NotificationService } from '../shared/service/notification.service';
import { FileService } from '../shared/service/file.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';

describe('UserProfileEditComponent', () => {
  let component: UserProfileEditComponent;
  let fixture: ComponentFixture<UserProfileEditComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let fileService: jasmine.SpyObj<FileService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;
  let debugElement: DebugElement;
  const mockUser = {
    firstName: 'Nika',
    lastName: 'Khonelidze',
    email: 'n.khonelidze2@gmail.com',
  };

  beforeEach(waitForAsync(() => {
    userService = jasmine.createSpyObj('UserService', [
      'getUserProfile',
      'updateUserProfile',
    ]);
    fileService = jasmine.createSpyObj('FileService', ['readFileAsBase64']);
    notificationService = jasmine.createSpyObj('NotificationService', [
      'openSnackBar',
    ]);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: FileService, useValue: fileService },
        { provide: NotificationService, useValue: notificationService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileEditComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load user profile on init and patch form values', () => {
    userService.getUserProfile.and.returnValue(of(mockUser));

    component.ngOnInit();

    expect(userService.getUserProfile).toHaveBeenCalled();
    expect(component.editProfileForm.value).toEqual(
      jasmine.objectContaining(mockUser)
    );
  });

  it('should handle file selection and update form control', () => {
    const file = new File([''], 'profile-pic.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [file] } } as any;

    component.onFileSelect(event);

    expect(component.editProfileForm.get('profilePicture')?.value).toBe(file);
  });

  it('should convert selected file to Base64 on submit if valid', async () => {
    const file = new File([''], 'profile-pic.jpg', { type: 'image/jpeg' });
    component.editProfileForm.patchValue({
      firstName: 'Nika',
      lastName: 'Khonelidze',
      email: 'n.khonelidze2@gmail.com',
      phoneNumber: '123123123',
      profilePicture: file,
    });

    const base64Mock = 'data:image/jpeg;base64,abc123';
    fileService.readFileAsBase64.and.returnValue(Promise.resolve(base64Mock));
    userService.updateUserProfile.and.returnValue(of(mockUser));

    await component.onSubmit();

    expect(fileService.readFileAsBase64).toHaveBeenCalledWith(file);
    expect(userService.updateUserProfile).toHaveBeenCalledWith(
      jasmine.objectContaining({ profilePicture: base64Mock })
    );
    expect(notificationService.openSnackBar).toHaveBeenCalledWith(
      'User profile has been updated!',
      'Dismiss'
    );
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should directly save profile if no file is selected on submit', () => {
    component.editProfileForm.patchValue({
      firstName: 'Nika',
      lastName: 'Khonelidze',
      email: 'n.khonelidze2@gmail.com',
      phoneNumber: '123123123',
      profilePicture: '',
    });

    userService.updateUserProfile.and.returnValue(
      of({
        firstName: 'Nika',
        lastName: 'Khonelidze',
        email: 'n.khonelidze2@gmail.com',
        phoneNumber: '123123123',
        profilePicture: '',
      })
    );

    component.onSubmit();

    expect(userService.updateUserProfile).toHaveBeenCalledWith(
      jasmine.objectContaining({ profilePicture: '' })
    );
    expect(notificationService.openSnackBar).toHaveBeenCalledWith(
      'User profile has been updated!',
      'Dismiss'
    );
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should reset form and navigate on form reset', () => {
    component.onFormReset();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});

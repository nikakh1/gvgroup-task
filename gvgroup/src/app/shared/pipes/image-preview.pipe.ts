import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imagePreview',
  standalone: true,
})
export class ImagePreviewPipe implements PipeTransform {
  transform(value: File | string | null): string | null {
    if (typeof value === 'string') {
      return value;
    }

    if (value instanceof File) {
      return URL.createObjectURL(value);
    }

    return null;
  }
}

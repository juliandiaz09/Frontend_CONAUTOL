import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone: true,
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | undefined): SafeResourceUrl | null {
    if (!value) return null;
    // Mark the URL as trusted for resource bindings (iframe src, etc.)
    return this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }
}

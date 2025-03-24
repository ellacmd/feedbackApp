import { Component, inject } from '@angular/core';
import { FeedbackService } from '../../core/services/feedback.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Location } from '@angular/common';
import { BehaviorSubject, finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-feedback',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './add-feedback.component.html',
  styleUrls: ['./add-feedback.component.css'],
})
export class AddFeedbackComponent {
  loading = new BehaviorSubject<boolean>(false);

  private _snackBar = inject(MatSnackBar);

  constructor(
    private readonly feedbackService: FeedbackService,
    private location: Location
  ) {}

  goBackToPrevPage(): void {
    this.location.back();
  }

  addFeedbackForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    category: new FormControl('', Validators.required),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(500),
    ]),
    status: new FormControl('suggestion', [Validators.required]),
  });

  addFeedback() {
    if (this.addFeedbackForm.invalid) return;
    this.loading.next(true);

    const { title, category, description, status } = this.addFeedbackForm.value;

    this.feedbackService
      .addFeedback(title!, category!, description!, status!)
      .pipe(
        finalize(() => {
          this.loading.next(false);
        })
      )
      .subscribe({
        next: () => {
          this._snackBar.open('Feedback added!', '', {
            duration: 3000,
            panelClass: ['success-toast'],
          });
          this.location.back();
          this.feedbackService.refreshFeedback();
        },
        error: ({ error }) => {
          this._snackBar.open('Failed to add feedback!', '', {
            duration: 3000,
            panelClass: ['error-toast'],
          });
        },
      });
  }

  get title() {
    return this.addFeedbackForm.get('title');
  }

  get description() {
    return this.addFeedbackForm.get('description');
  }
}

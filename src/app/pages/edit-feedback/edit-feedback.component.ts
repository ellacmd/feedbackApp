import { Component, OnInit, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, finalize } from 'rxjs';
import { FeedbackService } from '../../core/services/feedback.service';
import { CommonModule, Location } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Feedback } from '../../types/feedback';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-feedback',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './edit-feedback.component.html',
  styleUrl: './edit-feedback.component.css',
})
export class EditFeedbackComponent implements OnInit {

  loading = new BehaviorSubject<boolean>(false);
  feedbackId: string | null = null;
  feedback: Feedback | undefined;
  error = '';

  private _snackBar = inject(MatSnackBar);

  constructor(
    private router: Router,
    private readonly feedbackService: FeedbackService,
    private location: Location,
    private route: ActivatedRoute,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.feedbackId = params.get('id');
    });
    if (this.feedbackId) {
      this.getFeedbackDetails();
    }
  }

  goBackToPrevPage(): void {
    this.location.back();
  }

  editFeedbackForm!: FormGroup;

  initForm(): void {
    this.editFeedbackForm = this.fb.group({
      title: [
        this.feedback?.title || '',
        [Validators.required, Validators.maxLength(50)],
      ],
      category: [this.feedback?.category || 'feature', [Validators.required]],
      status: [this.feedback?.status || 'suggestion', [Validators.required]],
      description: [
        this.feedback?.description || '',
        [Validators.required, Validators.maxLength(500)],
      ],
    });
  }

  getFeedbackDetails(): void {
    if (!this.feedbackId) return;
    this.loading.next(true);

    this.feedbackService
      .getSingleFeedback(this.feedbackId)
      .pipe(
        finalize(() => {
          this.loading.next(false);
        })
      )
      .subscribe({
        next: ({ productRequest }) => {
          this.feedback = productRequest;
          this.initForm();
        },
        error: ({ error }: HttpErrorResponse) => {
          this.error = error.message;
        },
      });
  }

  editFeedback() {
    if (this.editFeedbackForm.invalid) return;
    if (!this.feedbackId) return;

    this.loading.next(true);

    const { title, category, description, status } =
      this.editFeedbackForm.value;

    this.feedbackService
      .editFeedback(title!, category!, description!, status!, this.feedbackId)
      .pipe(
        finalize(() => {
          this.loading.next(false);
        })
      )
      .subscribe({
        next: () => {
          this._snackBar.open('Feedback edited!', '', {
            duration: 3000,
            panelClass: 'success-toast',
          });
          this.location.back();
          this.feedbackService.refreshFeedback();
        },
        error: ({ error }) => {
          this._snackBar.open('Failed to edit feedback!', '', {
            duration: 3000,
            panelClass: 'error-toast',
          });
        },
      });
  }
  deleteFeedback() {
    if (!this.feedbackId) return;

    this.loading.next(true);

    this.feedbackService
      .deleteFeedback(this.feedbackId)
      .pipe(
        finalize(() => {
          this.loading.next(false);
        })
      )
      .subscribe({
        next: () => {
          this._snackBar.open('Feedback deleted!', '', {
            duration: 3000,
            panelClass: ['success-toast'],
          });
          this.router.navigate(['']);
          this.feedbackService.refreshFeedback();
        },
        error: ({ error }) => {
          this._snackBar.open('Failed to delete feedback!', '', {
            duration: 3000,
            panelClass: 'error-toast',
          });
        },
      });
  }

  get title() {
    return this.editFeedbackForm.get('title');
  }

  get description() {
    return this.editFeedbackForm.get('description');
  }
}

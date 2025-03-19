import { Component, OnInit } from '@angular/core';
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
  editFeedbackError: string | undefined;
  loading = new BehaviorSubject<boolean>(false);
  feedbackId: string | null = null;
  feedback: Feedback | undefined;
  error = '';

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
      this.getFeedbackDetails()
    }
  }

  goBackToPrevPage(): void {
    this.location.back();
  }

  editFeedbackForm = new FormGroup({
    title: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    status: new FormControl('suggestion', [Validators.required]),
  });

  initForm(): void {
    this.editFeedbackForm = this.fb.group({
      title: [this.feedback?.title || '', Validators.required],
      category: [this.feedback?.category || 'feature', Validators.required],
      status: [this.feedback?.status || 'suggestion', Validators.required],
      description: [this.feedback?.description || '', Validators.required],
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
          this.location.back();
          this.feedbackService.refreshFeedback();
        },
        error: ({ error }) => {
          this.editFeedbackError = error.message;
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

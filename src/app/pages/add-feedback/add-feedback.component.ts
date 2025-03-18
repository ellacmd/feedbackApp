import { Component } from '@angular/core';
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
  addFeedbackError: string | undefined;
  loading = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private readonly feedbackService: FeedbackService,
    private location: Location
  ) {}

  goBackToPrevPage(): void {
    this.location.back();
  }

  addFeedbackForm = new FormGroup({
    title: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
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
          this.router.navigate(['/']);
        },
        error: ({ error }) => {
          this.addFeedbackError = error.message;
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

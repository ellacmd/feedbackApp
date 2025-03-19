import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { authGuard } from './core/guards/auth.guard';
import { FeedbackDetailsComponent } from './pages/feedback-details/feedback-details.component';
import { AddFeedbackComponent } from './pages/add-feedback/add-feedback.component';
import { RoadmapComponent } from './pages/roadmap/roadmap.component';
import { EditFeedbackComponent } from './pages/edit-feedback/edit-feedback.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: 'details/:id',
    component: FeedbackDetailsComponent,
    title: 'Feedback Details',
  },
  {
    path: 'add-feedback',
    component: AddFeedbackComponent,
    title: 'Add Feedback',
  },
  {
    path: 'roadmap',
    component: RoadmapComponent,
    title: 'Roadmap',
  },
  {
    path: 'edit-feedback/:id',
    component: EditFeedbackComponent,
    title: 'Edit Feedback',
  },
];

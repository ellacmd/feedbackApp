import { User } from './user';

export interface Feedback {
  _id: string;
  user: string;
  title: string;
  category: string;
  upvotes: number;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  id: string;
  comments: Comment[];
  upvotedBy: string[]
}
export interface GetFeedbackResponse {
  productRequests: Feedback[];
  count: number;
  hasMore: boolean;
  page: number;
}

export interface GetSingleFeedbackResponse {
  productRequest: Feedback;
}

export type sortCriteria =
  | 'most-upvotes'
  | 'least-upvotes'
  | 'most-comments'
  | 'least-comments';

export interface Comment {
  createdAt: string;
  productRequest: string;
  updatedAt: string;
  user: User;
  content: string;
  replies:Comment[]
  replyingToUsername:string;
  replyingTo:string;
  _id:string;
}

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
  }
  export interface GetFeedbackResponse {
    productRequests: Feedback[];
    count: number;
    hasMore: boolean;
    page: number;
  }
  
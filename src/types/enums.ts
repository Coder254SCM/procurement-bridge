
export enum UserRole {
  BUYER = 'buyer',
  SUPPLIER = 'supplier',
  ADMIN = 'admin',
  EVALUATOR_FINANCE = 'evaluator_finance',
  EVALUATOR_TECHNICAL = 'evaluator_technical',
  EVALUATOR_PROCUREMENT = 'evaluator_procurement',
  EVALUATOR_ENGINEERING = 'evaluator_engineering',
  EVALUATOR_LEGAL = 'evaluator_legal',
  EVALUATOR_ACCOUNTING = 'evaluator_accounting'
}

export enum TenderStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  UNDER_REVIEW = 'under_review',
  AWARDED = 'awarded',
  CLOSED = 'closed',
  CANCELLED = 'cancelled'
}

export enum BidStatus {
  SUBMITTED = 'submitted',
  UNDER_EVALUATION = 'under_evaluation',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

export enum KycStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

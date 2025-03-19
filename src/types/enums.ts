
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

export enum VerificationLevel {
  NONE = 'none',
  BASIC = 'basic',
  INTERMEDIATE = 'intermediate',
  FULL = 'full'
}

export enum BusinessType {
  SOLE_PROPRIETORSHIP = 'sole_proprietorship',
  PARTNERSHIP = 'partnership',
  LIMITED_COMPANY = 'limited_company',
  CORPORATION = 'corporation',
  COOPERATIVE = 'cooperative',
  NGO = 'ngo',
  GOVERNMENT_ENTITY = 'government_entity',
  OTHER = 'other'
}

export enum TenderTemplateType {
  STANDARD = 'standard',
  CONSTRUCTION = 'construction',
  IT_SERVICES = 'it_services',
  CONSULTING = 'consulting',
  SUPPLIES = 'supplies',
  MEDICAL = 'medical',
  CUSTOM = 'custom'
}

export enum EvaluationCriteriaWeight {
  TECHNICAL = 'technical',
  FINANCIAL = 'financial',
  COMPLIANCE = 'compliance',
  EXPERIENCE = 'experience',
  QUALITY = 'quality',
  DELIVERY = 'delivery',
  SUSTAINABILITY = 'sustainability'
}

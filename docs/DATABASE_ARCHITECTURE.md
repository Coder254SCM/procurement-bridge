# Database Architecture - ProcureChain

## Overview
**Total Tables**: 73  
**Last Updated**: January 3, 2026

---

## Core Procurement Tables

| Table | Description | Key Columns |
|-------|-------------|-------------|
| `tenders` | Tender postings | buyer_id, status, deadline, blockchain_hash |
| `bids` | Supplier submissions | tender_id, supplier_id, bid_amount, status |
| `evaluations` | Bid scoring | bid_id, evaluator_id, score, criteria_scores |
| `contracts` | Awarded contracts | tender_id, winning_bid_id, contract_value |
| `contract_milestones` | Delivery tracking | contract_id, due_date, status, payment_percentage |
| `payment_schedules` | Payment tracking | contract_id, amount, due_date, paid_date |

---

## User Management

| Table | Description |
|-------|-------------|
| `profiles` | User/company profiles with verification status |
| `user_roles` | User role assignments (12 roles) |
| `user_subscriptions` | Subscription plan tracking |
| `user_trials` | Trial feature usage |

---

## Supplier Management

| Table | Description |
|-------|-------------|
| `supplier_qualifications` | Certifications, financial capacity |
| `supplier_performance_history` | Quality, delivery scores per contract |
| `vendor_blacklist` | Debarred suppliers with expiry dates |
| `risk_assessments` | Risk scoring and mitigation |
| `digital_identity_verification` | KYC verification records |

---

## AGPO & Compliance

| Table | Description |
|-------|-------------|
| `agpo_categories` | Youth, Women, PWD, MSME categories |
| `supplier_agpo_registration` | Supplier AGPO certifications |
| `tender_agpo_settings` | Per-tender AGPO requirements |
| `compliance_checks` | Automated validation results |
| `compliance_frameworks` | Regulatory requirements |

---

## Consortium & Addendum

| Table | Description |
|-------|-------------|
| `consortium_registrations` | Joint venture registrations |
| `consortium_members` | Member details, shares, documents |
| `tender_addendums` | Tender change notices |
| `addendum_acknowledgments` | Supplier acknowledgment tracking |

---

## Appeals

| Table | Description |
|-------|-------------|
| `procurement_appeals` | Appeal submissions, PPARB escalation |
| `appeal_timeline` | Appeal event history |

---

## ERP Integration

| Table | Description |
|-------|-------------|
| `erp_connections` | SAP, Oracle, Dynamics, Google Sheets |
| `erp_connector_configs` | Connection settings, field mappings |
| `erp_sync_queue` | Pending sync operations |
| `erp_sync_logs` | Sync history and errors |

---

## RTH Verification (Patent Pending)

| Table | Description |
|-------|-------------|
| `rth_verifiers` | Registered verifiers with expertise |
| `rth_verification_sessions` | Consensus sessions |
| `rth_verifications` | Individual verifier responses |
| `rth_phase_matrix` | Pairwise phase comparisons |
| `rth_field_validation` | Field-level interference detection |
| `rth_risk_monitoring` | Adaptive risk monitoring |
| `rth_pattern_library` | Historical patterns for matching |

---

## Financial

| Table | Description |
|-------|-------------|
| `budget_allocations` | Department budget tracking |
| `payment_schedules` | Contract payment schedules |
| `subscription_plans` | Available subscription tiers |

---

## Marketplace

| Table | Description |
|-------|-------------|
| `product_categories` | Hierarchical categories |
| `catalog_items` | E-catalog products |
| `framework_agreements` | Long-term supplier agreements |
| `reverse_auctions` | Dynamic bidding sessions |
| `auction_bids` | Auction bid entries |

---

## Workflows

| Table | Description |
|-------|-------------|
| `approval_workflows` | Configurable approval processes |
| `approval_instances` | Active workflow instances |
| `purchase_requisitions` | Purchase request tracking |

---

## Documents & Templates

| Table | Description |
|-------|-------------|
| `document_templates` | Reusable document templates |
| `report_templates` | Report generation templates |
| `specification_templates` | Tender specification templates |
| `generated_reports` | Generated report tracking |

---

## Audit & Security

| Table | Description |
|-------|-------------|
| `audit_logs` | All system actions with IP tracking |
| `api_access_logs` | API request logging |
| `data_access_logs` | Data access tracking |
| `rate_limit_tracking` | Rate limit enforcement |
| `blockchain_transactions` | Immutable hash records |
| `behavior_analysis` | AI fraud detection patterns |
| `fraud_alerts` | Detected anomalies |

---

## Notifications

| Table | Description |
|-------|-------------|
| `notifications` | In-app notifications |
| `push_notifications` | Mobile push notifications |
| `mobile_sessions` | Mobile app sessions |

---

## Data Retention

| Table | Description |
|-------|-------------|
| `data_retention_schedule` | Retention policies per data type |

**Retention Periods (Kenya Law)**:
- Procurement records: 7 years (PPRA 2015)
- Audit logs: 10 years (Evidence Act)
- User profiles: 7 years (DPA 2019)
- Blockchain hashes: Permanent (no PII)

---

## Additional Tables

| Table | Description |
|-------|-------------|
| `tender_specifications` | Tender technical specifications |
| `tender_reviews` | Supply chain reviews |
| `tender_fairness_metrics` | Fairness analysis scores |
| `capability_matches` | Supplier-tender matching |
| `submission_progress` | Multi-step form progress |
| `dispute_resolution` | Contract disputes |
| `performance_evaluations` | Supplier performance reviews |
| `external_integrations` | Third-party integrations |
| `system_settings` | Platform configuration |
| `translations` | Multi-language support |
| `supplier_lists` | Curated supplier lists |

---

## Row Level Security (RLS)

All tables have comprehensive RLS policies:

- **User Isolation**: Users access only their own data
- **Role-Based Access**: Admin, buyer, supplier, evaluator permissions
- **Party-Based Access**: Contract parties view related records
- **Public Data**: Published tenders visible to authenticated users
- **Service Role**: Backend functions manage system operations

---

## Edge Functions (19)

| Function | Purpose |
|----------|---------|
| `secure-tender-api` | Tender CRUD with validation |
| `secure-bid-api` | Bid submission handling |
| `secure-evaluation-api` | Evaluation processing |
| `blockchain-verification` | Hash verification |
| `rth-consensus` | RTH voting mechanism |
| `compliance-check` | Automated validation |
| `catalog-management` | E-catalog operations |
| `requisition-management` | Purchase requisitions |
| `budget-management` | Budget tracking |
| `framework-agreement-management` | Long-term agreements |
| `contract-performance-management` | Performance tracking |
| `supplier-qualification-management` | Qualification checks |
| `reverse-auction` | Real-time bidding |
| `trial-status` | Trial period tracking |
| `ai-pattern-detection` | Fraud detection |
| `procurement-intelligence` | Analytics |
| `kenya-ppip-integration` | Government integration |
| `vendor-blacklist-api` | Debarment management |
| `chaincode-explorer` | Blockchain queries |

---

## Indexes

- Foreign key indexes on all relationships
- Status indexes for filtering
- Date indexes for time queries
- GIN indexes on JSONB columns
- Blockchain hash indexes for verification

# Database Architecture - ProcureChain

## Overview
**Total Tables**: 50+  
**Last Updated**: December 22, 2025

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

## Supplier Management

| Table | Description |
|-------|-------------|
| `profiles` | User/company profiles with verification status |
| `supplier_qualifications` | Certifications, financial capacity |
| `supplier_performance_history` | Quality, delivery scores per contract |
| `vendor_blacklist` | Debarred suppliers with expiry dates |
| `risk_assessments` | Risk scoring and mitigation |

---

## AGPO & Compliance (NEW)

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

## Appeal Handling (NEW)

| Table | Description |
|-------|-------------|
| `procurement_appeals` | Appeal submissions, PPARB escalation |
| `appeal_timeline` | Appeal event history |

---

## ERP Integration (NEW)

| Table | Description |
|-------|-------------|
| `erp_connections` | SAP, Oracle, Dynamics, Google Sheets |
| `erp_connector_configs` | Connection settings, field mappings |
| `erp_sync_queue` | Pending sync operations |
| `erp_sync_logs` | Sync history and errors |

---

## Data Retention (NEW)

| Table | Description |
|-------|-------------|
| `data_retention_schedule` | Retention policies per data type |

**Retention Periods (Kenya Law)**:
- Procurement records: 7 years (PPRA 2015)
- Audit logs: 10 years (Evidence Act)
- User profiles: 7 years (DPA 2019)
- Blockchain hashes: Permanent (no PII)

---

## Blockchain & Audit

| Table | Description |
|-------|-------------|
| `blockchain_transactions` | Immutable hash records |
| `audit_logs` | All system actions with IP tracking |
| `behavior_analysis` | AI fraud detection patterns |
| `fraud_alerts` | Detected anomalies |

---

## RTH Verification (Patent Pending)

| Table | Description |
|-------|-------------|
| `rth_verifiers` | Registered verifiers with expertise |
| `rth_verification_sessions` | Consensus sessions |
| `rth_verifications` | Individual verifier responses |
| `rth_field_validation` | Field-level interference detection |
| `rth_pattern_library` | Historical patterns for matching |

---

## Additional Tables

| Category | Tables |
|----------|--------|
| Notifications | `notifications`, `push_notifications`, `mobile_sessions` |
| Subscriptions | `subscription_plans`, `user_subscriptions`, `user_trials` |
| Templates | `document_templates`, `report_templates`, `specification_templates` |
| System | `system_settings`, `translations`, `external_integrations` |
| Advanced | `framework_agreements`, `reverse_auctions`, `auction_bids` |

---

## Row Level Security (RLS)

All tables have comprehensive RLS policies:

- **User Isolation**: Users access only their own data
- **Role-Based Access**: Admin, buyer, supplier, evaluator permissions
- **Party-Based Access**: Contract parties view related records
- **Public Data**: Published tenders visible to authenticated users
- **Service Role**: Backend functions manage system operations

---

## Evaluation Criteria System

**Storage**: JSONB in `evaluations.criteria_scores`  
**Categories**: 14 major categories, ~200 criteria

1. Financial (27 criteria)
2. Technical (27 criteria)
3. Experience (21 criteria)
4. Operational (21 criteria)
5. Compliance (23 criteria)
6. Sustainability (26 criteria)
7. Risk Mitigation
8. Preliminary Checks
9. HSEC
10. Ethical Practices
11. Adaptability
12. Contract Management
13. Social Objectives
14. Market Dynamics

---

## Indexes

- Foreign key indexes on all relationships
- Status indexes for filtering
- Date indexes for time queries
- GIN indexes on JSONB columns
- Blockchain hash indexes for verification

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
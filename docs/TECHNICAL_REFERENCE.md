# ProcureChain Technical Reference

## Overview
**Platform**: Blockchain-Powered Procurement System  
**Stack**: React, TypeScript, Supabase, Hyperledger Fabric  
**Last Updated**: January 2026

---

## Database Architecture

### Tables (73 Total)

| Category | Tables |
|----------|--------|
| **Core** | tenders, bids, evaluations, contracts, profiles, user_roles |
| **AGPO** | agpo_categories, supplier_agpo_registration, tender_agpo_settings |
| **Consortium** | consortium_registrations, consortium_members |
| **Addendum** | tender_addendums, addendum_acknowledgments |
| **Appeals** | procurement_appeals, appeal_timeline |
| **ERP** | erp_connections, erp_connector_configs, erp_sync_queue, erp_sync_logs |
| **RTH** | rth_verifiers, rth_verification_sessions, rth_verifications, rth_phase_matrix, rth_field_validation, rth_risk_monitoring, rth_pattern_library |
| **Finance** | budget_allocations, payment_schedules, contracts, contract_milestones |
| **Compliance** | compliance_checks, compliance_frameworks, data_retention_schedule |
| **Blockchain** | blockchain_transactions, digital_identity_verification |
| **Analytics** | behavior_analysis, fraud_alerts, tender_fairness_metrics |
| **Operations** | notifications, audit_logs, document_templates, system_settings |

### Row Level Security
All tables have RLS policies for:
- User isolation (users access own data)
- Role-based access (admin, buyer, supplier, evaluator)
- Contract party access (parties view related records)

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

## RTH Consensus System

### Algorithm
Wave-based multi-party verification using circular statistics:
1. Minimum 4 verifiers (tetrahedral quorum)
2. Phase angle calculation between verifier values
3. Circular mean and variance computation
4. Confidence scoring (0-100%)
5. Decision: AUTHORIZE (≥75%), CAUTION (50-74%), BLOCK (<50%)

### Tables
- `rth_verifiers` - Registered verifiers
- `rth_verification_sessions` - Consensus sessions
- `rth_verifications` - Individual responses
- `rth_phase_matrix` - Pairwise phase comparisons

---

## Security Architecture

### Authentication
- JWT token-based authentication via Supabase
- Role-based access control (12 roles)
- Rate limiting per subscription tier

### Encryption
- AES-256 at rest (Supabase managed)
- TLS 1.3 in transit
- SHA-256 hashing for blockchain

### Compliance
- Kenya Data Protection Act 2019
- PPRA regulations
- 7-year document retention

---

## API Security

### Rate Limits
| Plan | Requests/Hour |
|------|---------------|
| Trial | 10 |
| Starter | 50 |
| Professional | 100 |
| Enterprise | 1000 |
| Government | 5000 |

### Headers
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

---

## Retention Periods

| Data Type | Retention | Legal Basis |
|-----------|-----------|-------------|
| Procurement records | 7 years | PPRA 2015 |
| Audit logs | 10 years | Evidence Act |
| User profiles | 7 years | DPA 2019 |
| Blockchain hashes | Permanent | No PII |

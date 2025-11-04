# Database Architecture - ProcureChain

## Complete Table Structure (37 Tables) ✅

### Core Procurement Tables (6)
| Table | Description | Key Features |
|-------|-------------|--------------|
| `tenders` | Tender postings and details | Blockchain hash, multiple procurement methods, RLS policies |
| `bids` | Supplier bid submissions | Document storage, technical details, supplier access control |
| `evaluations` | Bid evaluations | ~200 criteria stored as JSONB, multi-evaluator support |
| `contracts` | Award contracts | Milestone tracking, terms & conditions, party access |
| `contract_milestones` | Delivery milestones | Payment tracking, verification documents |
| `payment_schedules` | Payment tracking | Due dates, payment methods, status tracking |

### Supplier Management Tables (4)
| Table | Description | Key Features |
|-------|-------------|--------------|
| `supplier_qualifications` | Certifications & qualifications | Category-based, financial capacity, compliance scores |
| `supplier_performance_history` | Performance tracking | Quality, delivery, service scores per contract |
| `vendor_blacklist` | Debarred suppliers | Expiry dates, supporting documents, admin control |
| `risk_assessments` | Risk evaluation | Risk scores, mitigation actions, assessment criteria |

### Compliance & Verification Tables (4)
| Table | Description | Key Features |
|-------|-------------|--------------|
| `compliance_checks` | Automated validation | Check types, status tracking, result data |
| `compliance_frameworks` | Regulatory frameworks | Requirements, validation rules, penalties |
| `digital_identity_verification` | KYC/business verification | Blockchain hash, verification status, business IDs |
| `behavior_analysis` | AI pattern detection | Risk scores, analysis data, entity tracking |

### Blockchain & Audit Tables (2)
| Table | Description | Key Features |
|-------|-------------|--------------|
| `blockchain_transactions` | Immutable audit trail | Transaction hashes, metadata, entity tracking |
| `audit_logs` | System audit trail | Action tracking, old/new values, IP logging |

### Advanced Procurement Tables (7)
| Table | Description | Key Features |
|-------|-------------|--------------|
| `framework_agreements` | Long-term agreements | Supplier panels, evaluation criteria, max values |
| `reverse_auctions` | Dynamic pricing | Real-time bidding, reserve price, leader tracking |
| `auction_bids` | Auction bid tracking | Automatic bids, ranking, bid history |
| `purchase_requisitions` | Internal requisitions | Approval workflow, multi-approver support |
| `catalog_items` | E-catalog products | SKU, specifications, supplier assignments |
| `product_categories` | Catalog categories | Hierarchical structure, active/inactive status |
| `budget_allocations` | Budget management | Financial year tracking, allocation monitoring |

### Dispute & Review Tables (2)
| Table | Description | Key Features |
|-------|-------------|--------------|
| `dispute_resolution` | Dispute handling | Mediation support, resolution tracking, outcomes |
| `tender_reviews` | Supply chain reviews | Reviewer assignments, status, remarks |

### System & Notifications Tables (6)
| Table | Description | Key Features |
|-------|-------------|--------------|
| `notifications` | In-app notifications | Type categorization, read status, entity linking |
| `push_notifications` | Mobile push notifications | Delivery status, scheduling, error tracking |
| `mobile_sessions` | Mobile app sessions | Device info, push tokens, last active |
| `user_roles` | Role-based access | Admin, buyer, supplier, evaluator roles |
| `user_trials` | Trial tracking | IP tracking, trial types, usage data |
| `user_subscriptions` | Subscription management | Stripe integration, trial periods, status |

### Configuration & Templates Tables (6)
| Table | Description | Key Features |
|-------|-------------|--------------|
| `document_templates` | Document generation | Template types, versioning, active status |
| `report_templates` | Custom reports | Query templates, parameters, role-based access |
| `generated_reports` | Report history | File paths, generation time, status tracking |
| `system_settings` | Platform config | Setting types, public/private, JSON values |
| `translations` | Multi-language | Language codes, context, translation keys |
| `erp_connections` | ERP integrations | Connection configs, sync frequency, status |

## Evaluation Criteria System (~200 Criteria)

### Storage Architecture
- **Flexible JSONB Storage**: All evaluation criteria scores stored as JSONB in `evaluations.criteria_scores`
- **Code-Defined Schema**: Criteria definitions in `src/types/enums.ts` and `src/utils/evaluationCriteria.ts`
- **Dynamic Scoring**: Supports custom criteria per tender, default templates available

### Criteria Categories (14 Categories)

#### 1. Financial (27 Criteria)
Price Competitiveness, Financial Stability, Cost Effectiveness, Lifecycle Costs, Payment Terms, Budget Adherence, Pricing Structure Transparency, Inflation Adjustment, Credit Terms, Financial Reporting Accuracy, Profit Margin, Tax Compliance, Total Cost of Ownership, Discount Terms, Currency Risk Management, Financial Health Indicators, Creditworthiness, Cash Flow Stability, Bonding Capacity, Warranty Terms, Cost Escalation, Price Adjustment Flexibility, Financing Availability, Invoice Accuracy, Audit Transparency, Contractual Penalties, Value for Money

#### 2. Technical (27 Criteria)
Technical Capability, Methodology, Innovation, Quality Standards, Technical Compliance, Documentation Quality, System Integration, Prototyping & Testing, Scalability, Maintenance Support, Technology Maturity, Standards Compliance (ISO), Product Reliability, Product Performance, Design & Functionality, Technical Support, Technology Roadmap, Software Compatibility, Product Certification, Usability & UX, Customization Flexibility, Training Provision, Warranty Terms, R&D Focus, Environmental Compliance, Data Security Controls, Product Safety Standards

#### 3. Experience (21 Criteria)
Relevant Experience, Past Performance, Qualifications, Industry Expertise, Key Personnel, Project Management, Client References, Dispute History, Industry Awards, Repeat Business Rate, Training Programs, Subcontractor Management, Certifications, Cross-Industry Experience, Supplier Longevity, Market Reputation, On-Time Delivery Track Record, Innovation Experience, Crisis Management, Relationship Management, Scalability Experience

#### 4. Operational (21 Criteria)
Delivery Timeframe, Implementation Plan, Operational Capacity, Quality Assurance, SLAs, Resource Availability, Supply Chain Robustness, Contingency Planning, After-Sales Service, Customer Support, Training & Knowledge Transfer, Disaster Recovery, Inventory Management, Logistics Capability, Technology Infrastructure, Worksite Safety, Communication Transparency, Flexibility, Capacity to Scale, Business Continuity, Environmental Management

#### 5. Compliance (23 Criteria)
Legal Compliance, Regulatory Compliance, Risk Management, Insurance Coverage, Security Measures, Data Privacy, Ethical Sourcing, Anti-corruption, Health & Safety Record, Labor Standards, IP Rights, Transparency, Audit Readiness, Environmental Regulations, Trade Compliance, Export/Import Controls, Conflict of Interest, Procurement Rules, Social Responsibility, Anti-Bribery, Whistleblower Protections, Compliance Training, Disaster Compliance

#### 6. Sustainability (26 Criteria)
Environmental Sustainability, Social Responsibility, Local Content, Diversity & Inclusion, Community Impact, Carbon Footprint Reduction, Waste Management, Energy Efficiency, Water Usage, Circular Economy, Sustainable Procurement, Social Equity, Climate Risk Management, Sustainability Certifications, Renewable Energy, Emissions Monitoring, Resource Conservation, Stakeholder Engagement, Labor Rights, Supplier Diversity, Green Innovation, Ecological Impact, Long-term Goals, Environmental Reporting, Risk Mitigation, Climate Adaptation

#### 7. Risk Mitigation
Risk Identification, Risk Response Planning, Financial Risk Controls, Supply Chain Risk Management, Market Risk Analysis, Technical Risk Mitigation, Environmental Risk Management, Social Risk Management

#### 8. Preliminary / Mandatory Checks
Bid Completeness, Qualification Compliance, Registration Validation, Licenses & Permits, Tax Compliance, Submission Timeliness, Format Requirements

#### 9. Health, Safety, Environment, Community (HSEC)
Site Access Compliance, Health & Safety Policies, Environmental Management Plans, Community Engagement, Impact Mitigation, Emergency Response, Occupational Health Training, Worker Safety Equipment

#### 10. Supplier Ethical Practices
Fair Labor Certification, Conflict of Interest Declarations, Anti-Bribery Policies, Whistleblower Protection, Corporate Governance, Human Rights Compliance, Supply Chain Transparency, Ethical Sourcing Verification

#### 11. Adaptability & Flexibility
Change Management Capacity, Innovation Capacity, Responsiveness to Changes, Technology Change Management, Contract Term Flexibility, Service Scalability, Customization Options, Fast-track Delivery Ability

#### 12. Contract Management & Performance Monitoring
KPI Definition & Measurement, Contract Administration Experience, Reporting Plans, Continuous Improvement Plans, Dispute Resolution Mechanisms, Performance Incentives, Issue Escalation Procedures, Post-Contract Support

#### 13. Social and Economic Objectives
Local Content & Employment, SME Support, Empowerment of Disadvantaged Groups, Gender Equality Advancement, Regional Economic Development, Social Infrastructure Contribution, Supplier Diversity Initiatives, Community Development Programs

#### 14. Market and Competitive Dynamics
Market Position & Share, Partnership Potential, Co-Innovation Possibilities, Supply Base Diversity, Long-term Relationship Potential, Competitive Advantage Contributions, Technology Leadership, Industry Influence

## Row Level Security (RLS) Policies

All 37 tables have comprehensive RLS policies ensuring:
- **User Isolation**: Users only access their own data
- **Role-Based Access**: Admin, buyer, supplier, evaluator permissions
- **Party-Based Access**: Contract/tender parties can view related data
- **Public Data**: Published tenders visible to all
- **Service Role**: Backend functions can manage system data

## Blockchain Integration

### Hyperledger Fabric Integration
- **Transaction Recording**: All tenders, bids, evaluations, contracts
- **Hash Storage**: `blockchain_hash` columns in key tables
- **Verification**: `blockchain_transactions` table for audit trail
- **Edge Functions**: 
  - `blockchain-verification` - Basic verification
  - `advanced-blockchain-verification` - Enhanced verification
  - `fabric-gateway` - Direct Fabric network access
  - `chaincode-explorer` - Chaincode query interface

## Performance Optimizations

### Indexes Created
- Foreign key indexes on all relationship columns
- Status indexes for filtering (e.g., `idx_contracts_status`)
- Date indexes for time-based queries (e.g., `idx_notifications_created_at`)
- Blockchain hash indexes for verification lookups
- User ID indexes for RLS performance

### JSONB Indexes
- GIN indexes on JSONB columns for efficient querying
- Optimized criteria_scores searching in evaluations

## Migration Strategy

All tables created through Supabase migrations with:
- Automatic timestamp triggers (`created_at`, `updated_at`)
- Foreign key constraints with cascade/set null behavior
- Check constraints for status enums
- Default values for common fields
- Audit triggers where applicable

## Data Monetization Ready

The database structure supports TenderIntel analytics:
- Access tracking through audit logs
- Query patterns in behavior analysis
- Organization classification in profiles
- Payment tracking for usage-based billing
- Generated reports history for insights

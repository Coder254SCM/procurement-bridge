# Integration Guide
## Kenya e-GP Platform - External System Integration

## Table of Contents
1. [Payment Gateway Integration](#payment-gateway-integration)
2. [ERP System Integration](#erp-system-integration)
3. [Government System Integration](#government-system-integration)
4. [API Documentation](#api-documentation)
5. [Webhook Configuration](#webhook-configuration)
6. [Security Protocols](#security-protocols)

---

## Payment Gateway Integration

### Supported Payment Methods
```typescript
// Built-in Payment Gateway Support
PaymentGateways: {
  stripe: {
    setup: "Automatic Stripe integration",
    currencies: ["USD", "EUR", "GBP", "KES"],
    methods: ["Card", "Bank Transfer", "Mobile Money"]
  },
  
  mpesa: {
    setup: "Safaricom M-Pesa integration", 
    currencies: ["KES"],
    methods: ["Mobile Money", "Paybill", "Buy Goods"]
  },
  
  paypal: {
    setup: "PayPal Business integration",
    currencies: ["USD", "EUR", "GBP"],
    methods: ["PayPal Account", "Credit Cards"]
  },
  
  flutterwave: {
    setup: "African payment gateway",
    currencies: ["KES", "NGN", "GHS", "USD"], 
    methods: ["Cards", "Mobile Money", "Bank Transfer"]
  }
}
```

### Payment Integration Steps
```bash
# 1. Configure Payment Gateway
POST /api/settings/payment-gateway
{
  "gateway": "stripe|mpesa|paypal|flutterwave",
  "api_key": "your_api_key",
  "secret_key": "your_secret_key",
  "webhook_url": "https://yoursite.com/webhooks/payment",
  "currency": "KES",
  "test_mode": true
}

# 2. Process Payment
POST /api/payments/process
{
  "amount": 50000,
  "currency": "KES", 
  "payment_method": "mpesa",
  "phone_number": "+254700000000",
  "reference": "TENDER_001",
  "callback_url": "https://yoursite.com/payment-callback"
}

# 3. Verify Payment Status  
GET /api/payments/verify/{transaction_id}
```

---

## ERP System Integration

### SAP Ariba Integration
```typescript
// SAP Ariba Connector Configuration
AribaIntegration: {
  endpoint: "https://your-realm.ariba.com/api",
  auth_method: "OAuth 2.0",
  data_sync: [
    "Suppliers", "Purchase Orders", 
    "Contracts", "Invoices", "Catalogs"
  ],
  
  // Mapping Configuration
  field_mapping: {
    "supplier_id": "ariba.vendor.id",
    "supplier_name": "ariba.vendor.name", 
    "tax_id": "ariba.vendor.taxId",
    "contact_email": "ariba.vendor.primaryContact.email"
  }
}
```

### Oracle Procurement Cloud Integration  
```typescript
// Oracle Integration Setup
OracleIntegration: {
  endpoint: "https://your-domain.oraclecloud.com/fscmRestApi/resources",
  auth_method: "Basic Auth + OAuth",
  sync_frequency: "Real-time via webhooks",
  
  // Data Synchronization
  entities: [
    "suppliers", "purchase_requisitions",
    "purchase_orders", "receipts", "invoices"
  ],
  
  // Custom Field Mapping
  custom_fields: {
    "oracle.supplier.supplierNumber": "supplier_registration_number",
    "oracle.po.orderNumber": "purchase_order_reference"
  }
}
```

### Microsoft Dynamics 365 Integration
```typescript
// D365 Integration Configuration  
DynamicsIntegration: {
  endpoint: "https://yourorg.crm.dynamics.com/api/data/v9.1",
  auth_method: "Azure AD Authentication",
  
  // Entity Mapping
  entity_mapping: {
    "accounts": "suppliers",
    "quotes": "tenders", 
    "salesorders": "purchase_orders",
    "invoices": "supplier_invoices"
  }
}
```

---

## Government System Integration

### IFMIS (Integrated Financial Management Information System)
```typescript
// IFMIS Integration for Kenya Government
IFMISIntegration: {
  endpoint: "https://ifmis.treasury.go.ke/api/v1",
  auth_method: "Government API Key + Digital Certificate",
  
  // Budget Validation
  budget_check: {
    url: "/budget/validate",
    method: "POST",
    params: ["vote_code", "budget_line", "amount", "financial_year"]
  },
  
  // Payment Authorization
  payment_request: {
    url: "/payments/request", 
    method: "POST",
    params: ["supplier_pin", "amount", "payment_voucher", "supporting_docs"]
  },
  
  // Compliance Reporting
  compliance_report: {
    url: "/reports/procurement",
    method: "POST", 
    frequency: "Monthly",
    format: "XML"
  }
}
```

### KRA (Kenya Revenue Authority) Integration
```typescript
// Tax Compliance Verification
KRAIntegration: {
  endpoint: "https://itax.kra.go.ke/KRA-Portal/api",
  auth_method: "KRA API Token",
  
  // Tax Compliance Check
  tax_verification: {
    url: "/taxpayer/verify",
    method: "GET",
    params: ["pin_number"],
    response: {
      "compliance_status": "compliant|non_compliant",
      "tax_obligations": [...],
      "valid_until": "2024-12-31"
    }
  }
}
```

### Business Registration Service
```typescript
// Company Verification
BusinessRegistrationIntegration: {
  endpoint: "https://brs.go.ke/api/v1",
  auth_method: "Government Digital Certificate",
  
  // Company Verification
  verify_company: {
    url: "/company/verify",
    method: "GET", 
    params: ["registration_number", "company_name"],
    response: {
      "status": "active|suspended|dissolved",
      "directors": [...],
      "registration_date": "2020-01-15"
    }
  }
}
```

---

## API Documentation

### Authentication
```bash
# Get Access Token
POST /auth/login
{
  "email": "user@organization.gov.ke",
  "password": "secure_password"
}

Response:
{
  "access_token": "jwt_token_here", 
  "refresh_token": "refresh_token_here",
  "expires_in": 3600,
  "user_role": "buyer|supplier|evaluator|admin"
}

# Use Token in Requests
Authorization: Bearer jwt_token_here
```

### Core API Endpoints
```bash
# Tender Management
GET    /api/tenders                    # List all tenders
POST   /api/tenders                    # Create new tender  
GET    /api/tenders/{id}              # Get tender details
PUT    /api/tenders/{id}              # Update tender
DELETE /api/tenders/{id}              # Cancel tender

# Supplier Management  
GET    /api/suppliers                  # List suppliers
POST   /api/suppliers                  # Register supplier
GET    /api/suppliers/{id}/qualification # Get qualification status
POST   /api/suppliers/{id}/verify      # Verify supplier documents

# Bid Management
GET    /api/tenders/{id}/bids         # Get tender bids
POST   /api/tenders/{id}/bids         # Submit bid
PUT    /api/bids/{id}                 # Update bid
GET    /api/bids/{id}/evaluation      # Get evaluation results

# Contract Management
GET    /api/contracts                 # List contracts  
POST   /api/contracts                 # Create contract
GET    /api/contracts/{id}/performance # Performance metrics
POST   /api/contracts/{id}/milestones  # Update milestones

# Payment Management
GET    /api/payments                  # List payments
POST   /api/payments/request          # Request payment  
GET    /api/payments/{id}/status      # Payment status
POST   /api/payments/{id}/approve     # Approve payment

# Blockchain Verification
GET    /api/blockchain/transactions   # List blockchain transactions
GET    /api/blockchain/verify/{hash}  # Verify document integrity
POST   /api/blockchain/submit        # Submit to blockchain
```

### Webhook Events
```bash
# Available Webhook Events
tender.created         # New tender published
tender.closed          # Tender deadline reached  
bid.submitted          # New bid received
bid.evaluated          # Bid evaluation completed
contract.awarded       # Contract awarded to supplier
payment.requested      # Payment request submitted
payment.approved       # Payment approved
payment.completed      # Payment processed
supplier.verified      # Supplier verification completed
document.uploaded      # New document uploaded
```

---

## Webhook Configuration

### Setting Up Webhooks
```typescript
// Webhook Registration
POST /api/webhooks/register
{
  "url": "https://yourapp.com/webhook/procurement",
  "events": ["tender.created", "bid.submitted", "payment.completed"],
  "secret": "your_webhook_secret",
  "active": true
}

// Webhook Payload Example
{
  "event": "tender.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "tender_id": "TND-001",
    "title": "Office Supplies Procurement",
    "budget": 1000000,
    "deadline": "2024-02-15T17:00:00Z",
    "category": "supplies"
  },
  "signature": "sha256_signature_here"
}
```

### Webhook Security
```typescript
// Verify Webhook Signature
function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
```

---

## Security Protocols

### API Security
```typescript
SecurityMeasures: {
  authentication: "JWT tokens with RS256 signing",
  authorization: "Role-based access control (RBAC)", 
  rate_limiting: "100 requests per minute per API key",
  encryption: "TLS 1.3 for all communications",
  data_validation: "Input sanitization and validation",
  audit_logging: "All API calls logged with user attribution"
}
```

### Data Protection
```typescript
DataProtection: {
  encryption_at_rest: "AES-256 encryption",
  encryption_in_transit: "TLS 1.3", 
  pii_handling: "Automatic PII detection and masking",
  data_retention: "7-year retention with automatic cleanup",
  backup_encryption: "Encrypted database backups",
  access_logs: "Complete audit trail of data access"
}
```

### Compliance Standards
```typescript
ComplianceFrameworks: [
  "ISO 27001 (Information Security Management)",
  "SOC 2 Type II (Service Organization Control)", 
  "GDPR (General Data Protection Regulation)",
  "Kenya Data Protection Act 2019",
  "PPRA (Public Procurement Regulatory Authority) Requirements",
  "PCI DSS (Payment Card Industry Data Security Standard)"
]
```

---

## Integration Testing

### Test Environment Setup
```bash
# Test API Endpoint
BASE_URL: https://test-api.kenya-egp.gov.ke

# Test Credentials
API_KEY: test_pk_1234567890abcdef
SECRET_KEY: test_sk_abcdef1234567890

# Sample Test Calls
curl -X GET "https://test-api.kenya-egp.gov.ke/api/tenders" \
  -H "Authorization: Bearer YOUR_TEST_TOKEN" \
  -H "Content-Type: application/json"
```

### Integration Checklist
- [ ] API authentication working
- [ ] Data synchronization tested
- [ ] Webhook delivery confirmed  
- [ ] Error handling validated
- [ ] Performance benchmarks met
- [ ] Security scans passed
- [ ] Documentation reviewed
- [ ] Production deployment approved

---

## Support & Documentation

### Integration Support
- **Technical Documentation**: https://docs.kenya-egp.gov.ke/api
- **Developer Portal**: https://developers.kenya-egp.gov.ke  
- **Support Email**: integration@kenya-egp.gov.ke
- **Response Time**: 24 hours for technical issues
- **Phone Support**: +254-XXX-XXXX (Business hours)

### Training Resources
- **API Integration Workshop**: Monthly online sessions
- **Video Tutorials**: Step-by-step integration guides
- **Sample Code**: GitHub repository with examples
- **Postman Collection**: Ready-to-use API testing collection
- **SDKs Available**: PHP, Python, Node.js, Java, C#

**Integration Status: Full API documentation and webhook support implemented ✅**
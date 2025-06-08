
# ProcureChain - Blockchain-Powered Procurement Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Hyperledger Fabric](https://img.shields.io/badge/Hyperledger_Fabric-2F3134?logo=hyperledger&logoColor=white)](https://hyperledger-fabric.readthedocs.io/)

## Overview

ProcureChain is a comprehensive blockchain-based procurement platform designed specifically for the Kenyan market. It provides transparent, secure, and efficient procurement processes with advanced verification, compliance checking, and evaluation capabilities.

## 🌟 Key Features

### **Multi-Role System**
- **12 distinct user roles** including buyers, suppliers, evaluators, and auditors
- **Role-based access control** with specialized dashboards
- **Multi-role support** for users with multiple responsibilities

### **Advanced Verification System**
- **4-level verification**: None, Basic, Intermediate, Advanced
- **Blockchain-backed certificates** with immutable verification records
- **Integration with Kenya Revenue Authority** for tax compliance
- **Digital identity verification** with PPIP integration

### **Comprehensive Evaluation Process**
- **35+ evaluation criteria** across 6 major categories
- **Specialized evaluators** (Finance, Technical, Legal, Engineering, etc.)
- **Blockchain-recorded evaluations** for transparency
- **Automated compliance checking** with industry-specific validators

### **Procurement Methods**
- **14 procurement methods** including:
  - Open Tender, Restricted Tender
  - Request for Proposal (RFP), Request for Quotation (RFQ)
  - Electronic Reverse Auction, Forward Auction, Dutch Auction
  - Framework Agreement, Competitive Dialogue
  - Innovation Partnership, Design Competition
  - Two-Stage Tendering, Direct Procurement, Design Contest

### **Blockchain Integration**
- **Hyperledger Fabric** enterprise blockchain platform
- **Immutable audit trails** for all transactions
- **Smart contracts** for automated processes
- **Document integrity verification** with SHA-256 hashing

### **Compliance Framework**
- **KYC/AML compliance** with automated checking
- **Tax compliance** with KRA integration
- **Industry-specific validators** (Construction, Financial, Ethics, Procurement)
- **Real-time compliance monitoring** and reporting

## 🏗️ Architecture

### **Frontend**
- **React 18** with TypeScript
- **Tailwind CSS** for responsive design
- **shadcn/ui** component library
- **React Query** for state management
- **React Router** for navigation

### **Backend**
- **Supabase** for database and authentication
- **PostgreSQL** with Row Level Security (RLS)
- **Edge Functions** for serverless processing
- **Real-time subscriptions** for live updates

### **Blockchain**
- **Hyperledger Fabric** network
- **Chaincode** for smart contracts
- **Certificate Authority** for identity management
- **Private data collections** for sensitive information

### **Integrations**
- **Kenya Revenue Authority (KRA)** for tax verification
- **Public Procurement Information Portal (PPIP)** integration
- **Resend** for email notifications
- **Advanced encryption** for document security

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Supabase account
- (Optional) Docker for local blockchain development

### Installation

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
# Copy environment template
cp .env.example .env.local

# Configure your environment variables
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start development server**
```bash
npm run dev
```

5. **Access the application**
- Development: `http://localhost:5173`
- The app will be available with hot-reload enabled

### Supabase Setup

1. Create a new Supabase project
2. Run the database migrations from `/supabase/migrations`
3. Configure authentication providers
4. Set up Row Level Security policies
5. Deploy edge functions for advanced features

## 👥 User Roles & Permissions

### **Primary Roles**
- **Buyer**: Creates tenders, manages procurement processes, awards contracts
- **Supplier**: Submits bids, completes verification, delivers services
- **Admin**: Platform administration, user management, system configuration

### **Evaluator Roles**
- **Finance Evaluator**: Financial analysis and cost evaluation
- **Technical Evaluator**: Technical capability and specification compliance
- **Legal Evaluator**: Legal compliance and contract terms review
- **Procurement Evaluator**: Process compliance and procurement regulations
- **Engineering Evaluator**: Engineering specifications and technical feasibility
- **Accounting Evaluator**: Financial records and accounting compliance

### **Specialized Roles**
- **Supply Chain Professional**: Supply chain feasibility and logistics review
- **Auditor**: Compliance audits and blockchain record verification

## 🔐 Verification Levels

### **Level 0: None**
- Basic registration only
- Limited platform access
- Can browse public tenders

### **Level 1: Basic**
- Identity document verification
- Business registration check
- Basic KYC compliance
- Access to standard tenders

### **Level 2: Intermediate**
- Financial records verification
- Tax compliance check
- Operational capacity assessment
- Access to restricted tenders

### **Level 3: Advanced**
- Comprehensive compliance verification
- Performance history review
- Blockchain certificate issuance
- Access to all tender types
- Preferred supplier status

## 📊 Evaluation Criteria

### **Financial Criteria (5)**
- Price Competitiveness, Financial Stability, Cost Effectiveness, Lifecycle Costs, Payment Terms

### **Technical Criteria (5)**
- Technical Capability, Methodology, Innovation, Quality Standards, Technical Compliance

### **Experience Criteria (6)**
- Relevant Experience, Past Performance, Qualifications, Industry Expertise, Key Personnel, Project Management

### **Operational Criteria (5)**
- Delivery Timeframe, Implementation Plan, Operational Capacity, Quality Assurance, Service Level Agreements

### **Compliance Criteria (5)**
- Legal Compliance, Regulatory Compliance, Risk Management, Insurance Coverage, Security Measures

### **Sustainability Criteria (5)**
- Environmental Sustainability, Social Responsibility, Local Content, Diversity & Inclusion, Community Impact

### **Contract Criteria (5)**
- Warranty Terms, After-sales Support, Maintenance Capability, Intellectual Property, Contract Terms Acceptance

## 🔧 API Documentation

### **Authentication**
```bash
POST /auth/login
POST /auth/logout
POST /auth/refresh
```

### **Tender Management**
```bash
GET    /api/tenders
POST   /api/tenders
PUT    /api/tenders/:id
DELETE /api/tenders/:id
```

### **Bid Management**
```bash
POST   /api/bids
GET    /api/bids/:id
PATCH  /api/bids/:id/status
```

### **Verification**
```bash
POST /api/verification/start
GET  /api/verification/status
GET  /api/verification/blockchain
```

### **Webhook Events**
- `tender.created`, `tender.published`, `tender.closed`
- `bid.submitted`, `bid.evaluated`, `bid.awarded`
- `verification.completed`, `certificate.issued`
- `compliance.violation_detected`, `audit.trail_created`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   ├── evaluations/    # Evaluation system components
│   ├── marketplace/    # Marketplace and supplier components
│   ├── profile/        # User profile components
│   ├── tenders/        # Tender management components
│   ├── ui/             # Base UI components (shadcn/ui)
│   └── verification/   # Verification system components
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   ├── blockchain/     # Blockchain integration
│   └── supabase/       # Supabase configuration
├── pages/              # Page components
├── services/           # Business logic services
│   ├── compliance/     # Compliance validators
│   └── contracts/      # Contract management
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🔗 Blockchain Integration

### **Hyperledger Fabric Network**
- **Channel**: `procurechain-channel`
- **Chaincode**: Smart contracts for procurement processes
- **Organizations**: Buyers, Suppliers, Regulators
- **Consensus**: RAFT ordering service

### **Smart Contract Functions**
- `CreateTender`: Register new tender on blockchain
- `SubmitBid`: Record bid submission
- `EvaluateBid`: Store evaluation results
- `AwardContract`: Record contract award
- `VerifyDocument`: Validate document integrity

### **Data Privacy**
- **Private Data Collections** for sensitive information
- **Hash-only storage** for public verification
- **Access control** based on organization membership

## 🛡️ Security Features

- **End-to-end encryption** for data transmission
- **Blockchain immutability** for critical records
- **Multi-factor authentication** support
- **Role-based access control** (RBAC)
- **Comprehensive audit logging**
- **Regular security audits**
- **Document encryption** before storage
- **Access logging** for accountability

## 📈 Compliance & Regulatory

### **Kenya Regulatory Compliance**
- **Public Procurement Regulatory Authority (PPRA)** compliance
- **Kenya Revenue Authority (KRA)** tax verification
- **Competition Authority of Kenya** anti-competition checks
- **Central Bank of Kenya** financial compliance (where applicable)

### **International Standards**
- **ISO 27001** security management
- **ISO 9001** quality management
- **Anti-Money Laundering (AML)** compliance
- **Know Your Customer (KYC)** requirements

## 🚀 Deployment

### **Production Deployment**
1. **Lovable Platform**: One-click deployment via Lovable interface
2. **Custom Domain**: Configure custom domain in project settings
3. **Environment Variables**: Set production environment variables
4. **Supabase**: Configure production Supabase instance

### **Self-Hosting Options**
1. **Vercel**: Deploy directly from GitHub repository
2. **Netlify**: Static site deployment with edge functions
3. **AWS**: Full cloud deployment with custom infrastructure
4. **Docker**: Containerized deployment for any environment

## 📞 Support & Documentation

- **Documentation**: Complete user guides and API documentation available in-app
- **Support**: Enterprise support available for production deployments
- **Community**: Join our community for discussions and support
- **Training**: Comprehensive training programs for all user roles

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hyperledger Foundation** for the blockchain infrastructure
- **Supabase** for the backend platform
- **Kenya Government** for regulatory framework guidance
- **Open source community** for the excellent tooling

---

**ProcureChain** - Transforming procurement through blockchain technology and transparency.

For more information, visit our [documentation](https://docs.procurechain.co.ke) or contact our team.

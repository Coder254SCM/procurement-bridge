
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText, Users, ShieldCheck } from 'lucide-react';

const Guides = () => {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Guides & Tutorials</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your complete guide to using ProcureChain effectively.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users /> For Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Getting Started</AccordionTrigger>
                <AccordionContent>
                  <strong>1. Account Creation:</strong> Sign up using your business email.
                  <br />
                  <strong>2. Profile Completion:</strong> Fill out your company details, including areas of expertise and operational capacity. A complete profile increases your visibility.
                  <br />
                  <strong>3. Verification:</strong> Upload required documents like your business registration and tax compliance certificates. Our team will review them to verify your account, which is crucial for building trust with buyers.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Finding Tenders</AccordionTrigger>
                <AccordionContent>
                  <strong>1. Browse Marketplace:</strong> Use our advanced search filters to find tenders by category, location, or value.
                  <br />
                  <strong>2. Set Up Alerts:</strong> Save your searches and enable email notifications to get alerts for new tenders that match your criteria.
                  <br />
                  <strong>3. Understand Requirements:</strong> Carefully read the tender documents, paying close attention to the scope of work, eligibility criteria, and submission deadlines.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Submitting Bids</AccordionTrigger>
                <AccordionContent>
                  <strong>1. Prepare Documents:</strong> Compile all required documents for your proposal.
                  <br />
                  <strong>2. Secure Submission:</strong> Use our submission portal to upload your bid. All submissions are encrypted and recorded on the blockchain, making them tamper-proof.
                  <br />
                  <strong>3. Track Status:</strong> Monitor the status of your bid—from "Submitted" to "Under Evaluation" and "Awarded"—right from your dashboard.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText /> For Buyers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Creating a Tender</AccordionTrigger>
                <AccordionContent>
                  Our step-by-step wizard makes it easy to create a tender. You'll define the scope, set a budget and timeline, specify weighted evaluation criteria, and list all required documents for suppliers to submit.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Evaluating Bids</AccordionTrigger>
                <AccordionContent>
                  Access submitted bids securely. Our platform supports a multi-evaluator workflow and hides supplier identities during the initial review to prevent bias. Use our tools to score and compare proposals side-by-side.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Awarding Contracts</AccordionTrigger>
                <AccordionContent>
                  After evaluations are complete, generate a final report. You can then notify both the winning and unsuccessful suppliers through the platform and proceed to create and digitally sign the contract with the selected supplier.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck /> For Evaluators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Evaluation Workflow</AccordionTrigger>
                <AccordionContent>
                  Once assigned to a tender, you'll see it on your dashboard. You can then access all relevant bids and documents for your review. Be mindful of the evaluation deadlines set by the buyer.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Scoring Bids</AccordionTrigger>
                <AccordionContent>
                  Use the provided scoring rubric to evaluate each bid against the pre-defined criteria. It is essential to provide clear, concise comments to justify your scores for transparency and auditing purposes.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Maintaining Impartiality</AccordionTrigger>
                <AccordionContent>
                  Before starting, you must declare any potential conflicts of interest. The platform helps ensure impartiality by keeping supplier identities anonymous during evaluation. Every action you take is recorded on an immutable blockchain ledger to guarantee process integrity.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Guides;

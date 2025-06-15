
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
                  Learn how to create your supplier account, complete your profile, and get verified on the platform to start bidding on tenders.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Finding Tenders</AccordionTrigger>
                <AccordionContent>
                  Discover how to browse the marketplace, set up alerts for relevant tenders, and understand tender requirements.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Submitting Bids</AccordionTrigger>
                <AccordionContent>
                  A step-by-step guide on preparing your bid documents, submitting your proposal securely, and tracking its status.
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
                  Follow our guide to create, configure, and publish a new tender, including setting evaluation criteria and required documents.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Evaluating Bids</AccordionTrigger>
                <AccordionContent>
                  Understand the evaluation process, how to review submitted bids, and use our tools to compare proposals effectively.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Awarding Contracts</AccordionTrigger>
                <AccordionContent>
                  Learn the process for awarding a contract to the winning supplier and initiating the next steps on the platform.
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
                  A guide on your role in the procurement process, how to access assigned bids, and the workflow for submitting your evaluations.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Scoring Bids</AccordionTrigger>
                <AccordionContent>
                  Learn how to use the platform's scoring tools, provide justifications for your scores, and ensure a fair and transparent evaluation.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Maintaining Impartiality</AccordionTrigger>
                <AccordionContent>
                  Understand the importance of impartiality and how our blockchain-based platform helps ensure the integrity of the evaluation process.
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


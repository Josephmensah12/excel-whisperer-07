
import React from "react";
import Footer from "@/components/Footer";
import NavMenu from "@/components/NavMenu";
import { FileCheck } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <NavMenu />
      <div className="relative mb-8">
        <div className="absolute inset-0 z-0">
          <img 
            src="/lovable-uploads/59e84bd9-8a22-429c-97cf-cb076a5c5b43.png" 
            alt="Container yard showing regulatory compliance and shipping terms visualization" 
            className="w-full h-48 md:h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 h-48 md:h-64 flex items-center justify-center">
          <div className="text-center text-white">
            <FileCheck className="h-16 w-16 mx-auto mb-2" />
            <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white shadow rounded-lg p-6 md:p-8 prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold mb-4 text-center">GOLD COAST GLOBAL LOGISTICS - TERMS OF SERVICE AGREEMENT</h2>
          <p className="mb-6">
            Please read the following terms of service ("Agreement") carefully. By using the services of Gold Coast Global Logistics ("Company"), you are agreeing to be bound by the terms and conditions described below.
          </p>
          
          <h3 className="text-xl font-semibold">1. Customs Delays and Associated Costs:</h3>
          <p className="ml-5">
            a) In the event that a shipment is delayed by customs due to a random inspection at any USA port, the customer acknowledges and agrees that any costs incurred as a result will be deferred to them.<br/>
            b) The aforementioned costs will be allocated to customers proportional to the volume of items they have shipped within the container.
          </p>
          
          <h3 className="text-xl font-semibold mt-6">2. Limitation of Liability:</h3>
          <p className="ml-5">
            a) Gold Coast Global Logistics shall not be liable for any loss or damage to property caused by parties other than the Company.<br/>
            b) In cases where the Company is found liable, its liability for any loss or damage will not exceed the amount of $350 per shipment.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 mt-10 text-center">GOLD COAST GLOBAL LOGISTICS - PROHIBITED ITEMS ATTESTATION</h2>
          <p className="mb-6">
            By signing this Agreement, the customer acknowledges and attests to the following:
          </p>
          
          <h3 className="text-xl font-semibold">1. Prohibited Items:</h3>
          <p className="ml-5">
            a) I, the undersigned, confirm that my shipment does not contain any of the following prohibited items:
          </p>
          <ul className="ml-10 list-disc">
            <li>Ammunition</li>
            <li>Firearms or guns</li>
            <li>Cash</li>
            <li>Any other items deemed illegal or prohibited by applicable laws and regulations.</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6">2. Rights of Gold Coast Global Logistics:</h3>
          <p className="ml-5">
            a) I understand and acknowledge that Gold Coast Global Logistics ("Company") reserves the right to inspect shipments to ensure compliance with this attestation.<br/>
            b) If any prohibited items are found in my shipment, I understand that the Company reserves the right to take appropriate action, which may include refusing the shipment or contacting law enforcement agencies.
          </p>
          
          <h3 className="text-xl font-semibold mt-6">3. Information Disclosure:</h3>
          <p className="ml-5">
            a) I agree that, in the event of a breach of this Agreement, Gold Coast Global Logistics is authorized to provide my personal and shipment details to the appropriate law enforcement agencies.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;

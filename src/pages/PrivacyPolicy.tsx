
import React from "react";
import NavMenu from "@/components/NavMenu";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-14">
      <NavMenu />
      
      <div className="relative mb-8">
        <div className="absolute inset-0 z-0">
          <img 
            src="/lovable-uploads/476e5cd0-2127-42ed-aefc-780c3773998c.png" 
            alt="Data security and privacy protection visual" 
            className="w-full h-48 md:h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 h-48 md:h-64 flex items-center justify-center">
          <div className="text-center text-white">
            <Shield className="h-16 w-16 mx-auto mb-2" />
            <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">        
        <div className="prose prose-blue max-w-none bg-white p-8 rounded-lg shadow">
          <p className="text-lg mb-6">
            Last Updated: May 15, 2025
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p>
              Gold Coast Global Logistics ("we", "our", or "us") is committed to protecting the privacy of our clients and visitors. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website or shipping services.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="mb-4">We may collect the following types of information:</p>
            <ul className="list-disc ml-6 mb-4">
              <li className="mb-2"><strong>Personal Information:</strong> Name, email address, phone number, shipping/billing addresses, and other contact details when you request a quote or service.</li>
              <li className="mb-2"><strong>Shipping Information:</strong> Origin, destination, type of goods, weight, dimensions, and other details related to your shipment.</li>
              <li className="mb-2"><strong>Communication Information:</strong> Records of your interactions with us, including inquiries and service requests.</li>
              <li className="mb-2"><strong>Website Usage Information:</strong> IP address, browser type, pages visited, and time spent on our website.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="mb-4">We use the collected information for the following purposes:</p>
            <ul className="list-disc ml-6 mb-4">
              <li className="mb-2">To provide and manage our shipping services</li>
              <li className="mb-2">To respond to your inquiries and requests</li>
              <li className="mb-2">To process payments and transactions</li>
              <li className="mb-2">To improve our website and services</li>
              <li className="mb-2">To send you important service information and updates</li>
              <li className="mb-2">To comply with legal obligations</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
            <p className="mb-4">
              We may share your information with the following third parties:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li className="mb-2"><strong>Service Providers:</strong> Shipping carriers, customs brokers, and other partners necessary to complete your shipment</li>
              <li className="mb-2"><strong>Legal Requirements:</strong> When required by law or to protect our legal rights</li>
            </ul>
            <p>
              We do not sell or rent your personal information to third parties for marketing purposes.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p>
              We implement appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li className="mb-2">Accessing your personal information</li>
              <li className="mb-2">Correcting inaccurate information</li>
              <li className="mb-2">Deleting your information</li>
              <li className="mb-2">Opting out of marketing communications</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided at the end of this policy.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              Email: privacy@goldcoastlogistics.com<br />
              Phone: (832) 295-9347
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

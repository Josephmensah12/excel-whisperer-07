
import { Routes, Route } from "react-router-dom";
import RequestCall from "@/pages/RequestCall";
import RequestQuote from "@/pages/RequestQuote";
import ShippingCalculatorPage from "@/pages/ShippingCalculatorPage";
import TermsOfService from "@/pages/TermsOfService";
import FrequentlyShippedItems from "@/pages/FrequentlyShippedItems";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Index from "@/pages/Index";
import { Toaster } from "@/components/ui/toaster";
import WhatsAppButton from "@/components/WhatsAppButton";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/request-call" element={<RequestCall />} />
        <Route path="/request-quote" element={<RequestQuote />} />
        <Route path="/shipping-calculator" element={<ShippingCalculatorPage />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/frequently-shipped-items" element={<FrequentlyShippedItems />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
      <WhatsAppButton />
      <Toaster />
    </>
  );
}

export default App;

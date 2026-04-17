import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, MapPin, Calendar, CheckCircle, AlertCircle, Truck, Ship, Clock, Phone, FileText, DollarSign } from "lucide-react";
import NavMenu from "@/components/NavMenu";
import Footer from "@/components/Footer";
import ShipmentProgressRoute from "@/components/ShipmentProgressRoute";
import { useToast } from "@/hooks/use-toast";

const GCGL_API = "https://gcgl-admin-backend-production.up.railway.app";

/* ── Types matching the GCGL admin public tracking API response ── */

interface TrackingEvent {
  type: string;
  date: string;
  location: string | null;
  vessel: string | null;
  voyage: string | null;
  description: string | null;
}

interface ShipmentInfo {
  name: string;
  status: string;
  carrier: string | null;
  trackingNumber: string | null;
  vesselName: string | null;
  voyageNumber: string | null;
  eta: string | null;
  departureDate: string | null;
}

interface TrackingResult {
  invoiceNumber: number;
  customerName: string;
  recipientName: string;
  recipientCity: string | null;
  status: string;
  createdAt: string;
  itemCount: number;
  items: { name: string; quantity: number }[];
  outstandingBalance: number;
  paymentStatus: string;
  shipment: ShipmentInfo | null;
  events: TrackingEvent[];
}

/* ── Map GCGL admin shipment statuses → website's 7-step progress labels ── */

function mapToWebsiteStatus(shipment: ShipmentInfo | null, invoiceStatus: string): string {
  const status = (shipment?.status || invoiceStatus || "").toLowerCase();
  switch (status) {
    case "collecting":  return "Received";
    case "ready":       return "Processing";
    case "shipped":     return "Shipped from USA";
    case "transit":     return "In Transit";
    case "customs":     return "Arrived Ghana";
    case "delivery":    return "Delivery Ongoing";
    case "delivered":   return "Delivered";
    default:            return "Received";
  }
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  "Received":           { color: "bg-blue-100 text-blue-800",    icon: <Package className="w-4 h-4" /> },
  "Processing":         { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-4 h-4" /> },
  "Shipped from USA":   { color: "bg-purple-100 text-purple-800", icon: <Ship className="w-4 h-4" /> },
  "In Transit":         { color: "bg-indigo-100 text-indigo-800", icon: <Truck className="w-4 h-4" /> },
  "Arrived Ghana":      { color: "bg-green-100 text-green-800",  icon: <MapPin className="w-4 h-4" /> },
  "Clearing from port": { color: "bg-orange-100 text-orange-800", icon: <Clock className="w-4 h-4" /> },
  "Delivery scheduling":{ color: "bg-cyan-100 text-cyan-800",    icon: <Calendar className="w-4 h-4" /> },
  "Delivered":          { color: "bg-emerald-100 text-emerald-800", icon: <CheckCircle className="w-4 h-4" /> },
  "Delivery Ongoing":   { color: "bg-lime-100 text-lime-800",     icon: <Truck className="w-4 h-4" /> },
};

export default function Track() {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invoiceNumber.trim() || !phoneNumber.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both invoice number and phone number.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(
        `${GCGL_API}/api/public/track?invoice=${encodeURIComponent(invoiceNumber.trim())}&phone=${encodeURIComponent(phoneNumber.trim())}`
      );
      const json = await res.json();

      if (!json.success) {
        setResult(null);
        return;
      }
      setResult(json.data);
    } catch (error) {
      console.error("Tracking lookup error:", error);
      toast({
        title: "Error",
        description: "Unable to connect to tracking service. Please try again later.",
        variant: "destructive",
      });
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Not available";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Not available";
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit",
    });
  };

  const etaCountdown = (eta: string | null): string | null => {
    if (!eta) return null;
    const target = new Date(eta);
    if (isNaN(target.getTime())) return null;
    const days = Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days > 1) return `${days} days away`;
    if (days === 1) return "tomorrow";
    if (days === 0) return "today";
    return `${Math.abs(days)}d ago`;
  };

  const currentStatus = result ? mapToWebsiteStatus(result.shipment, result.status) : "Received";
  const statusStyle = statusConfig[currentStatus] || { color: "bg-gray-100 text-gray-800", icon: <Package className="w-4 h-4" /> };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavMenu />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Track Your Shipment</h1>
            <p className="text-muted-foreground">
              Enter your invoice number and phone number to view your shipment status
            </p>
          </div>

          {/* Lookup Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Shipment Lookup
              </CardTitle>
              <CardDescription>
                Enter the details from your shipping invoice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Invoice Number
                    </Label>
                    <Input
                      id="invoiceNumber"
                      placeholder="e.g., 601"
                      inputMode="numeric"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      placeholder="e.g., 346-702-8488"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    "Track Shipment"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          {searched && !loading && (
            <>
              {result ? (
                <div className="space-y-6">
                  {/* Visual Progress Route */}
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <CardTitle className="flex items-center gap-2">
                          <Truck className="w-5 h-5" />
                          Shipment Progress
                        </CardTitle>
                        <Badge className={`${statusStyle.color} flex items-center gap-1 px-3 py-1 text-sm`}>
                          {statusStyle.icon}
                          {currentStatus}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ShipmentProgressRoute currentStatus={currentStatus} />
                    </CardContent>
                  </Card>

                  {/* Outstanding Balance Warning */}
                  {result.outstandingBalance > 0 && (
                    <Card className="border-amber-300 bg-amber-50">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-amber-700" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-amber-900">Outstanding Balance: ${result.outstandingBalance.toFixed(2)}</h3>
                            <p className="text-sm text-amber-800 mt-1">
                              Please make payment as soon as possible to avoid any delays in delivery.
                              Contact us at{" "}
                              <a href="tel:+18322959347" className="underline font-medium">(832) 295-9347</a>
                              {" "}or{" "}
                              <a href="https://wa.me/17138261087" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                                WhatsApp (713) 826-1087
                              </a>
                              {" "}to arrange payment.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Invoice & Shipment Details */}
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <CardTitle className="text-xl">Invoice #{result.invoiceNumber}</CardTitle>
                          <CardDescription>
                            <span className="block mt-1">
                              From <span className="font-medium">{result.customerName}</span>
                              {" to "}
                              <span className="font-medium">{result.recipientName}</span>
                              {result.recipientCity && (
                                <span className="flex items-center gap-1 mt-0.5 inline-flex">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {result.recipientCity}
                                </span>
                              )}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {result.shipment && (
                        <div className="grid md:grid-cols-2 gap-4">
                          {result.shipment.departureDate && (
                            <div className="bg-muted rounded-lg p-4">
                              <p className="text-sm text-muted-foreground">Departure</p>
                              <p className="font-semibold">{formatDate(result.shipment.departureDate)}</p>
                            </div>
                          )}
                          {result.shipment.eta && (
                            <div className="bg-muted rounded-lg p-4">
                              <p className="text-sm text-muted-foreground">ETA</p>
                              <p className="font-semibold">
                                {formatDate(result.shipment.eta)}
                                {etaCountdown(result.shipment.eta) && (
                                  <span className="ml-2 text-primary text-xs font-normal">
                                    ({etaCountdown(result.shipment.eta)})
                                  </span>
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Items List */}
                  {result.items.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          Items ({result.itemCount})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="divide-y">
                          {result.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-3 text-sm">
                              <span>{item.name}</span>
                              <span className="text-muted-foreground font-medium">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                </div>
              ) : (
                <Card className="border-destructive">
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Shipment Found</h3>
                      <p className="text-muted-foreground">
                        Verify your invoice number and phone number are correct and try again.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

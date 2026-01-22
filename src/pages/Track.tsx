import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, MapPin, Calendar, CheckCircle, AlertCircle, Truck, Ship, Clock, Phone, FileText, Camera } from "lucide-react";
import NavMenu from "@/components/NavMenu";
import Footer from "@/components/Footer";
import ShipmentProgressRoute from "@/components/ShipmentProgressRoute";
import { useToast } from "@/hooks/use-toast";

interface ShipmentEvent {
  id: string;
  status: string;
  event_date: string;
  notes: string | null;
}

interface ShipmentPhoto {
  id: string;
  photo_url: string;
}

interface ShipmentData {
  id: string;
  invoice_number: string;
  status: string | null;
  destination_zone_or_city: string | null;
  eta_to_ghana: string | null;
  eta_delivery: string | null;
  delivery_address_flag: boolean;
  outstanding_balance_flag: boolean;
  events: ShipmentEvent[];
  photos: ShipmentPhoto[];
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  "Received": { color: "bg-blue-100 text-blue-800", icon: <Package className="w-4 h-4" /> },
  "Processing": { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-4 h-4" /> },
  "Shipped from USA": { color: "bg-purple-100 text-purple-800", icon: <Ship className="w-4 h-4" /> },
  "In Transit": { color: "bg-indigo-100 text-indigo-800", icon: <Truck className="w-4 h-4" /> },
  "Arrived Ghana": { color: "bg-green-100 text-green-800", icon: <MapPin className="w-4 h-4" /> },
  "Clearing from port": { color: "bg-orange-100 text-orange-800", icon: <Clock className="w-4 h-4" /> },
  "Delivery scheduling": { color: "bg-cyan-100 text-cyan-800", icon: <Calendar className="w-4 h-4" /> },
  "Delivered": { color: "bg-emerald-100 text-emerald-800", icon: <CheckCircle className="w-4 h-4" /> },
  "Hold": { color: "bg-red-100 text-red-800", icon: <AlertCircle className="w-4 h-4" /> },
  "Cancelled": { color: "bg-gray-100 text-gray-800", icon: <AlertCircle className="w-4 h-4" /> },
};

export default function Track() {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState<ShipmentData | null>(null);
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
      const { data, error } = await supabase.rpc('lookup_shipment', {
        p_invoice_number: invoiceNumber.trim(),
        p_phone_number: phoneNumber.trim()
      });

      if (error) throw error;
      
      setShipment(data as unknown as ShipmentData | null);
    } catch (error) {
      console.error("Lookup error:", error);
      toast({
        title: "Error",
        description: "An error occurred while looking up your shipment.",
        variant: "destructive",
      });
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Not available";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Use the status from shipments table (synced with latest event), fallback to first event if needed
  const currentStatus = shipment?.status || shipment?.events?.[0]?.status || "Received";
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
                      placeholder="e.g., INV-2024-001"
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
                      placeholder="e.g., +1 234 567 8900"
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
              {shipment ? (
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

                  {/* Status Card */}
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <CardTitle className="text-xl">Invoice: {shipment.invoice_number}</CardTitle>
                          <CardDescription>
                            {shipment.destination_zone_or_city && (
                              <span className="flex items-center gap-1 mt-1">
                                <MapPin className="w-4 h-4" />
                                Destination: {shipment.destination_zone_or_city}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-muted rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">ETA to Ghana</p>
                          <p className="font-semibold">{formatDate(shipment.eta_to_ghana)}</p>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">ETA Delivery</p>
                          <p className="font-semibold">{formatDate(shipment.eta_delivery)}</p>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Delivery Address</p>
                          <p className="font-semibold">{shipment.delivery_address_flag ? "Yes" : "No"}</p>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                          <p className="font-semibold">{shipment.outstanding_balance_flag ? "Yes" : "No"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Timeline */}
                  {shipment.events && shipment.events.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Tracking Timeline
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {shipment.events.map((event, index) => {
                            const eventStyle = statusConfig[event.status] || { color: "bg-gray-100 text-gray-800", icon: <Package className="w-4 h-4" /> };
                            return (
                              <div 
                                key={event.id} 
                                className={`flex gap-4 pb-4 ${index !== shipment.events.length - 1 ? 'border-b' : ''}`}
                              >
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${eventStyle.color}`}>
                                  {eventStyle.icon}
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                    <p className="font-semibold">{event.status}</p>
                                    <p className="text-sm text-muted-foreground">{formatDate(event.event_date)}</p>
                                  </div>
                                  {event.notes && (
                                    <p className="text-sm text-muted-foreground mt-1">{event.notes}</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Delivery Photos */}
                  {shipment.photos && shipment.photos.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Camera className="w-5 h-5" />
                          Proof of Delivery
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {shipment.photos.map((photo) => (
                            <a 
                              key={photo.id} 
                              href={photo.photo_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block overflow-hidden rounded-lg border hover:shadow-lg transition-shadow"
                            >
                              <img 
                                src={photo.photo_url} 
                                alt="Proof of delivery" 
                                className="w-full h-40 object-cover"
                              />
                            </a>
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
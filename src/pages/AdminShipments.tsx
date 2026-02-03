import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Upload, Search, Package, Plus, Camera, LogOut, RefreshCw, Download, AlertTriangle, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NavMenu from "@/components/NavMenu";
import Footer from "@/components/Footer";
import { parseExcelFile, detectColumnMapping, ColumnMapping, ParsedShipment, normalizePhone } from "@/lib/excelParser";
import { downloadShipmentTemplate } from "@/lib/excelTemplate";
import { SHIPMENT_STATUSES, ShipmentStatus } from "@/constants/shipmentStatuses";

interface Shipment {
  id: string;
  invoice_number: string;
  phone_raw: string;
  destination_zone_or_city: string | null;
  eta_to_ghana: string | null;
  eta_delivery: string | null;
  delivery_address_flag: boolean;
  outstanding_balance_flag: boolean;
  whatsapp_opt_in: boolean;
  created_at: string;
}

interface ShipmentEvent {
  id: string;
  status: string;
  event_date: string;
  notes: string | null;
}

interface ShipmentPhoto {
  id: string;
  photo_url: string;
  is_final_delivery_proof: boolean;
}

export default function AdminShipments() {
  const { user, role, loading: authLoading, signOut, hasAnyRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Excel upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [showMappingDialog, setShowMappingDialog] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedShipment[]>([]);
  const [importResult, setImportResult] = useState<{ created: number; replaced: number; events: number; errors: number } | null>(null);

  // Selected shipment for details
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [shipmentEvents, setShipmentEvents] = useState<ShipmentEvent[]>([]);
  const [shipmentPhotos, setShipmentPhotos] = useState<ShipmentPhoto[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Add event state
  const [newEventStatus, setNewEventStatus] = useState<ShipmentStatus>("Received");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventNotes, setNewEventNotes] = useState("");
  const [addingEvent, setAddingEvent] = useState(false);

  // Photo upload state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isFinalDeliveryProof, setIsFinalDeliveryProof] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (user && hasAnyRole) {
      fetchShipments();
    }
  }, [user, hasAnyRole]);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("shipments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setShipments((data as Shipment[]) || []);
    } catch (error) {
      console.error("Error fetching shipments:", error);
      toast({ title: "Error", description: "Failed to load shipments", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFile(file);
    
    try {
      const result = await parseExcelFile(file, {});
      setHeaders(result.headers);
      const detectedMapping = detectColumnMapping(result.headers);
      setMapping(detectedMapping);
      setShowMappingDialog(true);
    } catch (error) {
      console.error("Error parsing file:", error);
      toast({ title: "Error", description: "Failed to parse Excel file", variant: "destructive" });
    }
  };

  const handleImport = async () => {
    if (!uploadFile) return;

    setUploading(true);
    setImportResult(null);

    try {
      const result = await parseExcelFile(uploadFile, mapping);
      setParsedData(result.shipments);

      let created = 0;
      let replaced = 0;
      let eventsAdded = 0;

      for (const shipment of result.shipments) {
        // Check for existing shipment with same invoice number
        const { data: existingShipment } = await supabase
          .from("shipments")
          .select("id")
          .eq("invoice_number", shipment.invoice_number)
          .maybeSingle();

        if (existingShipment) {
          // Delete existing shipment and all related data (events, photos, notifications)
          await supabase
            .from("shipment_events")
            .delete()
            .eq("shipment_id", existingShipment.id);
          
          await supabase
            .from("shipment_photos")
            .delete()
            .eq("shipment_id", existingShipment.id);
          
          await supabase
            .from("notification_queue")
            .delete()
            .eq("shipment_id", existingShipment.id);
          
          await supabase
            .from("shipments")
            .delete()
            .eq("id", existingShipment.id);

          replaced++;
        }

        // Determine the initial status from Excel or default to 'Received'
        const statusValue = shipment.timeline_status as ShipmentStatus;
        const initialStatus = (shipment.timeline_status && SHIPMENT_STATUSES.includes(statusValue)) 
          ? statusValue 
          : "Received";

        // Create new shipment with status from Excel
        const { data: newShipment, error } = await supabase
          .from("shipments")
          .insert({
            invoice_number: shipment.invoice_number,
            phone_raw: shipment.phone_raw,
            phone_normalized: shipment.phone_normalized,
            destination_zone_or_city: shipment.destination_zone_or_city,
            eta_to_ghana: shipment.eta_to_ghana,
            eta_delivery: shipment.eta_delivery,
            delivery_address_flag: shipment.delivery_address_flag,
            outstanding_balance_flag: shipment.outstanding_balance_flag,
            whatsapp_opt_in: shipment.whatsapp_opt_in,
            status: initialStatus,
          })
          .select("id")
          .single();

        if (error) {
          console.error("Error creating shipment:", error);
          continue;
        }

        created++;

        // Add initial timeline event
        if (shipment.timeline_status && shipment.timeline_date && newShipment) {
          if (SHIPMENT_STATUSES.includes(statusValue)) {
            await supabase.from("shipment_events").insert({
              shipment_id: newShipment.id,
              status: statusValue,
              event_date: shipment.timeline_date,
              notes: shipment.timeline_notes,
              created_by: user?.id,
            });
            eventsAdded++;
          }
        }
      }

      setImportResult({
        created,
        replaced,
        events: eventsAdded,
        errors: result.errors.length,
      });

      toast({
        title: "Import Complete",
        description: `New: ${created - replaced}, Replaced: ${replaced}, Events: ${eventsAdded}`,
      });

      setShowMappingDialog(false);
      setUploadFile(null);
      fetchShipments();
    } catch (error) {
      console.error("Import error:", error);
      toast({ title: "Import Failed", description: "An error occurred during import", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const fetchShipmentDetails = async (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setLoadingDetails(true);

    try {
      const [eventsRes, photosRes] = await Promise.all([
        supabase
          .from("shipment_events")
          .select("*")
          .eq("shipment_id", shipment.id)
          .order("event_date", { ascending: false }),
        supabase
          .from("shipment_photos")
          .select("*")
          .eq("shipment_id", shipment.id)
          .order("created_at", { ascending: false }),
      ]);

      setShipmentEvents((eventsRes.data as ShipmentEvent[]) || []);
      setShipmentPhotos((photosRes.data as ShipmentPhoto[]) || []);
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleAddEvent = async () => {
    if (!selectedShipment || !newEventDate) return;

    setAddingEvent(true);
    try {
      // Insert event
      const { error } = await supabase.from("shipment_events").insert({
        shipment_id: selectedShipment.id,
        status: newEventStatus,
        event_date: newEventDate,
        notes: newEventNotes || null,
        created_by: user?.id,
      });

      if (error) throw error;

      // Update shipment's status column to match latest event
      await supabase
        .from("shipments")
        .update({ status: newEventStatus as Database["public"]["Enums"]["shipment_status"] })
        .eq("id", selectedShipment.id);

      toast({ title: "Event Added", description: `Added ${newEventStatus} event` });
      setNewEventDate("");
      setNewEventNotes("");
      fetchShipmentDetails(selectedShipment);
      fetchShipments(); // Refresh list to show updated status

      // Queue WhatsApp notification if opted in
      const shipmentData = shipments.find(s => s.id === selectedShipment.id);
      if (shipmentData?.whatsapp_opt_in) {
        await supabase.from("notification_queue").insert({
          shipment_id: selectedShipment.id,
          phone_number: shipmentData.phone_raw,
          message: `Gold Coast Global Logistics update: Invoice ${shipmentData.invoice_number} is now ${newEventStatus} on ${newEventDate}. Track anytime at www.goldcoastgloballogistics.com/track`,
        });
      }
    } catch (error) {
      console.error("Error adding event:", error);
      toast({ title: "Error", description: "Failed to add event", variant: "destructive" });
    } finally {
      setAddingEvent(false);
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedShipment || !photoFile) return;

    setUploadingPhoto(true);
    try {
      const fileExt = photoFile.name.split(".").pop();
      const fileName = `${selectedShipment.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("shipment-photos")
        .upload(fileName, photoFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("shipment-photos")
        .getPublicUrl(fileName);

      await supabase.from("shipment_photos").insert({
        shipment_id: selectedShipment.id,
        photo_url: urlData.publicUrl,
        is_final_delivery_proof: isFinalDeliveryProof,
        uploaded_by: user?.id,
      });

      toast({ title: "Photo Uploaded", description: "Photo has been uploaded successfully" });
      setPhotoFile(null);
      setIsFinalDeliveryProof(false);
      fetchShipmentDetails(selectedShipment);
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({ title: "Error", description: "Failed to upload photo", variant: "destructive" });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const filteredShipments = shipments.filter(
    (s) =>
      s.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone_raw.includes(searchQuery)
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasAnyRole) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <NavMenu />
        <main className="flex-1 pt-24 pb-12 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Access Denied
              </CardTitle>
              <CardDescription>
                Your account does not have permission to access this page.
                Please contact an administrator to assign your role.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={signOut} variant="outline" className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavMenu />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Shipment Management</h1>
              <p className="text-muted-foreground">
                Logged in as {user?.email} ({role})
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={fetchShipments}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          <Tabs defaultValue="shipments">
            <TabsList>
              <TabsTrigger value="shipments">Shipments</TabsTrigger>
              <TabsTrigger value="upload">Excel Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="shipments" className="space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by invoice number or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredShipments.map((shipment) => (
                    <Card
                      key={shipment.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => fetchShipmentDetails(shipment)}
                    >
                      <CardContent className="pt-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <p className="font-semibold">{shipment.invoice_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {shipment.phone_raw} • {shipment.destination_zone_or_city || "No destination"}
                            </p>
                          </div>
                          <div className="flex gap-2 items-center">
                            {shipment.phone_raw && (
                              <a
                                href={`https://wa.me/${shipment.phone_raw.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-md transition-colors"
                              >
                                <MessageCircle className="w-3 h-3" />
                                WhatsApp
                              </a>
                            )}
                            {shipment.outstanding_balance_flag && (
                              <Badge variant="destructive">Balance Due</Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredShipments.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No shipments found
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Import Excel File
                  </CardTitle>
                  <CardDescription>
                    Upload a SalesBinder export file (.xls or .xlsx) to import or update shipments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <Label htmlFor="excel-file">Select Excel File</Label>
                        <Input
                          id="excel-file"
                          type="file"
                          accept=".xls,.xlsx"
                          onChange={handleFileChange}
                          className="mt-2"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button variant="outline" onClick={downloadShipmentTemplate}>
                          <Download className="w-4 h-4 mr-2" />
                          Download Template
                        </Button>
                      </div>
                    </div>

                    {importResult && (
                      <div className="bg-muted rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Last Import Summary</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">New</p>
                            <p className="font-semibold text-green-600">{importResult.created - importResult.replaced}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Replaced</p>
                            <p className="font-semibold text-blue-600">{importResult.replaced}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Events Added</p>
                            <p className="font-semibold">{importResult.events}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Errors</p>
                            <p className="font-semibold text-red-600">{importResult.errors}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Shipment Details Dialog */}
          <Dialog open={!!selectedShipment} onOpenChange={() => setSelectedShipment(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Shipment: {selectedShipment?.invoice_number}</DialogTitle>
                <DialogDescription>
                  {selectedShipment?.destination_zone_or_city || "No destination set"}
                </DialogDescription>
              </DialogHeader>

              {loadingDetails ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Add Event */}
                  <div className="space-y-4 border rounded-lg p-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Timeline Event
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Status</Label>
                        <Select
                          value={newEventStatus}
                          onValueChange={(val) => setNewEventStatus(val as ShipmentStatus)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SHIPMENT_STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={newEventDate}
                          onChange={(e) => setNewEventDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Notes (optional)</Label>
                      <Textarea
                        value={newEventNotes}
                        onChange={(e) => setNewEventNotes(e.target.value)}
                        placeholder="Additional notes..."
                      />
                    </div>
                    <Button onClick={handleAddEvent} disabled={addingEvent || !newEventDate}>
                      {addingEvent ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      Add Event
                    </Button>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h4 className="font-semibold mb-2">Timeline</h4>
                    {shipmentEvents.length > 0 ? (
                      <div className="space-y-2">
                        {shipmentEvents.map((event) => (
                          <div key={event.id} className="flex justify-between items-start border-b pb-2">
                            <div>
                              <Badge variant="outline">{event.status}</Badge>
                              {event.notes && (
                                <p className="text-sm text-muted-foreground mt-1">{event.notes}</p>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{event.event_date}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No events recorded</p>
                    )}
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-4 border rounded-lg p-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Upload Photo
                    </h4>
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="final-proof"
                        checked={isFinalDeliveryProof}
                        onCheckedChange={(checked) => setIsFinalDeliveryProof(!!checked)}
                      />
                      <Label htmlFor="final-proof">Mark as Final Delivery Proof</Label>
                    </div>
                    <Button
                      onClick={handlePhotoUpload}
                      disabled={uploadingPhoto || !photoFile}
                    >
                      {uploadingPhoto ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      Upload Photo
                    </Button>
                  </div>

                  {/* Photos */}
                  {shipmentPhotos.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Photos</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {shipmentPhotos.map((photo) => (
                          <div key={photo.id} className="relative">
                            <a href={photo.photo_url} target="_blank" rel="noopener noreferrer">
                              <img
                                src={photo.photo_url}
                                alt="Shipment photo"
                                className="w-full h-24 object-cover rounded"
                              />
                            </a>
                            {photo.is_final_delivery_proof && (
                              <Badge className="absolute top-1 right-1 text-xs">
                                Final
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Column Mapping Dialog */}
          <Dialog open={showMappingDialog} onOpenChange={setShowMappingDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Map Excel Columns</DialogTitle>
                <DialogDescription>
                  Match your Excel columns to the shipment fields
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {Object.entries({
                  invoice_number: "Invoice Number *",
                  phone_number: "Phone Number *",
                  destination_zone_or_city: "Destination Zone/City",
                  eta_to_ghana: "ETA to Ghana",
                  eta_delivery: "ETA Delivery",
                  delivery_address_flag: "Has Delivery Address",
                  outstanding_balance_flag: "Outstanding Balance",
                  whatsapp_opt_in: "WhatsApp Opt-In",
                  timeline_status: "Status",
                  timeline_date: "Status Date",
                  timeline_notes: "Status Notes",
                }).map(([key, label]) => (
                  <div key={key} className="grid grid-cols-2 gap-4 items-center">
                    <Label>{label}</Label>
                    <Select
                      value={mapping[key as keyof ColumnMapping] || "__none__"}
                      onValueChange={(val) =>
                        setMapping((prev) => ({ ...prev, [key]: val === "__none__" ? undefined : val }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select column" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">-- Not mapped --</SelectItem>
                        {headers.map((header) => (
                          <SelectItem key={header} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowMappingDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={uploading || !mapping.invoice_number || !mapping.phone_number}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Import Data
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <Footer />
    </div>
  );
}
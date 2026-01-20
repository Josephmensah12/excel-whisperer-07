import React from "react";
import NavMenu from "@/components/NavMenu";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const FrequentlyShippedItems = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <NavMenu />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
        <h1 className="text-4xl font-bold text-center mb-8">Frequently Shipped Items</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Gold Coast Large Box Item Card */}
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-white p-0">
              <AspectRatio ratio={4/3} className="bg-white relative">
                <img 
                  src="/lovable-uploads/988cb0a5-695e-4910-8ad1-1888c7e766c5.png" 
                  alt="Gold Coast Large Box 24.5x24.5x27" 
                  className="object-contain absolute inset-0 w-full h-full scale-125"
                />
              </AspectRatio>
            </div>
            <CardContent className="p-6">
              <div className="inline-block px-2 py-0.5 mb-2 bg-amber-100 text-amber-800 rounded-full font-medium text-xs">Featured</div>
              <h3 className="text-xl font-bold mb-2">Gold Coast Large Box (24.5x24.5x27)</h3>
              <div className="flex justify-between items-center">
                <div className="text-gray-600">Shipping Cost:</div>
                <div className="text-2xl font-bold text-blue-600">$180</div>
              </div>
              <p className="text-gray-500 mt-4 text-sm mb-4">
                Sturdy cardboard box with Gold Coast branding, perfect for shipping household goods. Box included free with shipping.
              </p>
              <div className="mt-2">
                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <p className="text-sm text-amber-800 font-medium">
                    Box drop-off available for $10 (credited towards shipping)
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white">
                  Request Box
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* U-Haul Large Electronics Box Item Card - MOVED to be next to Gold Coast Large Box */}
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-white p-4">
              <AspectRatio ratio={4/3} className="bg-white relative">
                <img 
                  src="/lovable-uploads/6412b453-7bf3-467c-a48f-5ff83e8b286a.png" 
                  alt="U-Haul Large Electronics Box" 
                  className="object-contain absolute inset-0 w-full h-full p-2"
                />
              </AspectRatio>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Large Electronics Box</h3>
              <div className="flex justify-between items-center">
                <div className="text-gray-600">Shipping Cost:</div>
                <div className="text-2xl font-bold text-blue-600">$170</div>
              </div>
              <p className="text-gray-500 mt-4 text-sm mb-4">
                Double-walled box designed for electronics, measuring 24½" x 24½" x 27½" with 9.55 cu ft capacity. Perfect for shipping speakers, gaming systems, and other large electronics.
              </p>
              <div className="mt-4">
                <a href="https://www.uhaul.com/MovingSupplies/Boxes/Electronics-Boxes/Large-Electronics-Box/?id=21387" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Buy at U-Haul
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* TV Item Card */}
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-white p-4">
              <AspectRatio ratio={4/3} className="bg-white relative">
                <img 
                  src="/lovable-uploads/42e28466-9ebe-4e9b-9e80-b39c421cd9d1.png" 
                  alt="Flat Screen TV" 
                  className="object-contain absolute inset-0 w-full h-full p-2"
                />
              </AspectRatio>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Flat Screen TV Shipping</h3>
              <Table className="w-full mb-4">
                <TableBody>
                  <TableRow>
                    <TableCell className="py-1 pl-0">32" to 42" TV</TableCell>
                    <TableCell className="py-1 text-right font-bold text-blue-600">$150</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-1 pl-0">50" to 62" TV</TableCell>
                    <TableCell className="py-1 text-right font-bold text-blue-600">$220</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-1 pl-0">65" to 75" TV</TableCell>
                    <TableCell className="py-1 text-right font-bold text-blue-600">$400</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-1 pl-0">Above 75" TV</TableCell>
                    <TableCell className="py-1 text-right font-bold text-blue-600">$550</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 30QT Ice Chest Item Card */}
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-white p-4">
              <AspectRatio ratio={4/3} className="bg-white relative">
                <img 
                  src="/lovable-uploads/08645857-300e-4fc4-974c-2d2e87248420.png" 
                  alt="30QT Ice Chest" 
                  className="object-contain absolute inset-0 w-full h-full p-2"
                />
              </AspectRatio>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">30QT Ice Chest</h3>
              <div className="flex justify-between items-center">
                <div className="text-gray-600">Shipping Cost:</div>
                <div className="text-2xl font-bold text-blue-600">$70</div>
              </div>
              <p className="text-gray-500 mt-4 text-sm mb-4">
                Durable 30-quart cooler, ideal for shipping temperature-sensitive items or for recreational use. Features a comfort grip handle and secure lid.
              </p>
              <div className="mt-4">
                <a href="https://www.igloocoolers.com/collections/hard-sided-coolers" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  <Button variant="outline" className="w-full border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Buy at Igloo
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* 150QT Ice Chest Item Card */}
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-white p-4">
              <AspectRatio ratio={4/3} className="bg-white relative">
                <img 
                  src="/lovable-uploads/8170031d-803c-4899-a9c3-52d6e69d49a0.png" 
                  alt="150QT Ice Chest" 
                  className="object-contain absolute inset-0 w-full h-full p-2"
                />
              </AspectRatio>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">150QT Ice Chest</h3>
              <div className="flex justify-between items-center">
                <div className="text-gray-600">Shipping Cost:</div>
                <div className="text-2xl font-bold text-blue-600">$130</div>
              </div>
              <p className="text-gray-500 mt-4 text-sm mb-4">
                Large 150-quart Coleman cooler, perfect for shipping larger quantities of temperature-sensitive items. Features durable construction with a secure-fit lid and easy-grip handles.
              </p>
              <div className="mt-4">
                <a href="https://www.coleman.com/coolers/hard-coolers/" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  <Button variant="outline" className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Buy at Coleman
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Jasmine Rice 25lbs Item Card */}
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-white p-4">
              <AspectRatio ratio={4/3} className="bg-white relative">
                <img 
                  src="/lovable-uploads/370868fe-0410-4485-b470-5b7404746f27.png" 
                  alt="Member's Mark Thai Hom Mali Jasmine Rice" 
                  className="object-contain absolute inset-0 w-full h-full p-2"
                />
              </AspectRatio>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Jasmine Rice (25lbs)</h3>
              <div className="flex justify-between items-center">
                <div className="text-gray-600">Shipping Cost:</div>
                <div className="text-2xl font-bold text-blue-600">$5</div>
              </div>
              <p className="text-gray-500 mt-4 text-sm mb-4">
                High-quality Thai Hom Mali Jasmine Rice, perfect for shipping to family and friends. This aromatic rice is a staple in many households.
              </p>
              <div className="mt-4">
                <a href="https://www.samsclub.com/p/mm-jasmine-rice-25lb/prod21291410" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  <Button variant="outline" className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Buy at Sam's Club
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Kirkland 50lbs Jasmine Rice Item Card */}
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-white p-4">
              <AspectRatio ratio={4/3} className="bg-white relative">
                <img 
                  src="/lovable-uploads/4676b2b7-950f-4d1b-97b5-bb70587714f8.png" 
                  alt="Kirkland Thai Hom Mali Jasmine Rice 50lbs" 
                  className="object-contain absolute inset-0 w-full h-full p-2"
                />
              </AspectRatio>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Jasmine Rice (50lbs)</h3>
              <div className="flex justify-between items-center">
                <div className="text-gray-600">Shipping Cost:</div>
                <div className="text-2xl font-bold text-blue-600">$10</div>
              </div>
              <p className="text-gray-500 mt-4 text-sm mb-4">
                Kirkland Signature Thai Hom Mali Jasmine Rice, 50 pound bag. Premium quality, naturally fragrant long grain white rice from Thailand.
              </p>
              <div className="mt-4">
                <a href="https://www.costco.com/kirkland-signature-thai-hom-mali-jasmine-rice%2c-50-lbs.product.100334875.html" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  <Button variant="outline" className="w-full border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Buy at Costco
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* 27 Gallon Tote Item Card */}
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-white p-4">
              <AspectRatio ratio={4/3} className="bg-white relative">
                <img 
                  src="/lovable-uploads/da6e6582-591b-4fb1-8a04-99f62c5c2dc9.png" 
                  alt="27 Gallon Storage Tote with yellow lid and black container" 
                  className="object-contain absolute inset-0 w-full h-full p-2"
                />
              </AspectRatio>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">27 Gallon Storage Tote</h3>
              <div className="flex justify-between items-center">
                <div className="text-gray-600">Shipping Cost:</div>
                <div className="text-2xl font-bold text-blue-600">$70</div>
              </div>
              <p className="text-gray-500 mt-4 text-sm mb-4">
                Sturdy plastic storage container with secure lid, perfect for shipping personal belongings, household items, and more.
              </p>
              <div className="mt-4">
                <a href="https://www.homedepot.com/p/Husky-27-Gal-Storage-Tote-with-Lid-Heavy-Duty-249043/314096242" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  <Button variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Buy at Home Depot
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Gold Coast Large Box Item Card - 18x18x24 */}
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-white p-0">
              <AspectRatio ratio={4/3} className="bg-white relative">
                <img 
                  src="/lovable-uploads/cfa9a1b5-7f08-4828-a5ac-e71e99596f8b.png" 
                  alt="Gold Coast Regular Box 18x18x24" 
                  className="object-contain absolute inset-0 w-full h-full scale-125"
                />
              </AspectRatio>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Gold Coast Regular Box (18x18x24)</h3>
              <div className="flex justify-between items-center">
                <div className="text-gray-600">Shipping Cost:</div>
                <div className="text-2xl font-bold text-blue-600">$80</div>
              </div>
              <p className="text-gray-500 mt-4 text-sm mb-4">
                Sturdy cardboard box with Gold Coast branding, perfect for shipping household goods. Box included free with shipping.
              </p>
              <div className="mt-2">
                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <p className="text-sm text-amber-800 font-medium">
                    Box drop-off available for $10 (credited towards shipping)
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white">
                  Request Box
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Heavy Duty Large Box Item Card */}
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-white p-4">
              <AspectRatio ratio={4/3} className="bg-white relative">
                <img 
                  src="/lovable-uploads/f0e18bcc-7342-4b62-bcb1-21f77ad0b1de.png" 
                  alt="Lowe's Heavy Duty Large Box" 
                  className="object-contain absolute inset-0 w-full h-full p-2"
                />
              </AspectRatio>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Lowe's Heavy Duty Large Box</h3>
              <div className="flex justify-between items-center">
                <div className="text-gray-600">Shipping Cost:</div>
                <div className="text-2xl font-bold text-blue-600">$80</div>
              </div>
              <p className="text-gray-500 mt-4 text-sm mb-4">
                Heavy-duty cardboard box (18x18x24) with reinforced corners, ideal for shipping books, kitchen items, and other household goods. This box provides excellent protection during transit.
              </p>
              <div className="mt-4">
                <a href="https://www.lowes.com/pd/PACK-N-SEND-Heavy-Duty-Large-Moving-Box/1000192793" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  <Button variant="outline" className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Buy at Lowe's
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* 55 Gallon Blue Barrel Item Card */}
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-white p-4">
              <AspectRatio ratio={4/3} className="bg-white relative">
                <img 
                  src="/lovable-uploads/74ee2aad-6ab6-4fd0-98fc-35f8aa3a00de.png" 
                  alt="55 Gallon Blue Barrel" 
                  className="object-contain absolute inset-0 w-full h-full p-2"
                />
              </AspectRatio>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">55 Gallon Barrel</h3>
              <div className="flex justify-between items-center">
                <div className="text-gray-600">Shipping Cost:</div>
                <div className="text-2xl font-bold text-blue-600">$170</div>
              </div>
              <p className="text-gray-500 mt-4 text-sm mb-4">
                Heavy-duty plastic drum with secure lid and 55-gallon capacity. Ideal for shipping or storing liquids, powders, and other bulk materials.
              </p>
              <div className="mt-4">
                <a href="https://www.uline.com/Product/Detail/S-10755BLU/Drums/Plastic-Drum-55-Gallon-Open-Top-Blue" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Buy at Uline
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-16 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Why Ship with Gold Coast?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Reliable door-to-door delivery service</li>
            <li>Competitive and transparent pricing</li>
            <li>Real-time tracking and updates</li>
          </ul>
          <p className="mt-4">
            Contact us today for more information about shipping other items not listed here.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FrequentlyShippedItems;

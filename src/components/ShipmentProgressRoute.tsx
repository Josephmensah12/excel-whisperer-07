import { useEffect, useState, useRef } from "react";
import { Check, Truck, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Ordered route steps (excluding Hold and Cancelled which are special states)
const ROUTE_STEPS = [
  { status: "Received", label: "Received" },
  { status: "Processing", label: "Processing" },
  { status: "Shipped from USA", label: "Left USA" },
  { status: "In Transit", label: "In Transit" },
  { status: "Arrived Ghana", label: "Ghana Port Processing" },
  { status: "Delivery scheduling", label: "Scheduling" },
  { status: "Delivered", label: "Delivered" },
] as const;

// Map database statuses to step indices (Clearing from port maps to same step as Arrived Ghana)
const STATUS_TO_STEP_INDEX: Record<string, number> = {
  "Received": 0,
  "Processing": 1,
  "Shipped from USA": 2,
  "In Transit": 3,
  "Arrived Ghana": 4,
  "Clearing from port": 4, // Maps to same step as Arrived Ghana
  "Delivery scheduling": 5,
  "Delivered": 6,
};

type RouteStatus = typeof ROUTE_STEPS[number]["status"];

interface ShipmentProgressRouteProps {
  currentStatus: string;
  className?: string;
}

export default function ShipmentProgressRoute({ currentStatus, className }: ShipmentProgressRouteProps) {
  const [animatedStep, setAnimatedStep] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const prefersReducedMotion = useRef(false);

  // Determine if this is a special state
  const isHold = currentStatus === "Hold";
  const isCancelled = currentStatus === "Cancelled";

  // Find the current step index using the mapping
  const getCurrentStepIndex = () => {
    if (isCancelled) return -1;
    if (isHold) return -1;
    
    const index = STATUS_TO_STEP_INDEX[currentStatus];
    return index !== undefined ? index : 0;
  };

  const currentStepIndex = getCurrentStepIndex();

  // For Hold state, we'd need to track the last completed step
  // Since we only have currentStatus, we'll default to showing at step 0 for Hold
  const truckPosition = isHold ? 0 : isCancelled ? -1 : currentStepIndex;

  useEffect(() => {
    // Check for reduced motion preference
    prefersReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion.current || isCancelled) {
      setAnimatedStep(truckPosition);
      setAnimationComplete(true);
      return;
    }

    // Animate the truck from start to current position
    setAnimatedStep(0);
    setAnimationComplete(false);

    const targetStep = Math.max(0, truckPosition);
    const stepDuration = Math.min(400, 1500 / Math.max(targetStep, 1)); // ~1.5s total max

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep >= targetStep) {
        clearInterval(interval);
        setAnimationComplete(true);
        return;
      }
      currentStep++;
      setAnimatedStep(currentStep);
    }, stepDuration);

    return () => clearInterval(interval);
  }, [truckPosition, isCancelled]);

  const isStepCompleted = (index: number) => {
    if (isCancelled) return false;
    return index < currentStepIndex;
  };

  const isStepCurrent = (index: number) => {
    if (isCancelled || isHold) return false;
    return index === currentStepIndex;
  };

  const isStepFuture = (index: number) => {
    if (isCancelled) return true;
    return index > currentStepIndex;
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Hold Warning Banner */}
      {isHold && (
        <div className="mb-4 flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">Shipment on Hold</span>
          <span className="text-sm">- Please contact support for assistance</span>
        </div>
      )}

      {/* Cancelled Banner */}
      {isCancelled && (
        <div className="mb-4 flex items-center gap-2 bg-gray-100 border border-gray-300 text-gray-600 px-4 py-3 rounded-lg">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">Shipment Cancelled</span>
        </div>
      )}

      {/* Desktop: Horizontal Stepper */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress Line Background */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-muted rounded-full" />
          
          {/* Progress Line Filled */}
          <div 
            className={cn(
              "absolute top-5 left-0 h-1 rounded-full transition-all duration-500",
              isCancelled ? "bg-gray-300" : "bg-primary"
            )}
            style={{ 
              width: isCancelled 
                ? "0%" 
                : `${(animatedStep / (ROUTE_STEPS.length - 1)) * 100}%` 
            }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {ROUTE_STEPS.map((step, index) => {
              const completed = isStepCompleted(index);
              const current = isStepCurrent(index);
              const future = isStepFuture(index);
              const showTruck = animatedStep === index && !isCancelled;

              return (
                <div key={step.status} className="flex flex-col items-center" style={{ width: `${100 / ROUTE_STEPS.length}%` }}>
                  {/* Step Node */}
                  <div className="relative">
                    {/* Truck Icon */}
                    {showTruck && (
                      <div 
                        className={cn(
                          "absolute -top-8 left-1/2 -translate-x-1/2 z-10",
                          !animationComplete && "animate-bounce"
                        )}
                      >
                        <div className={cn(
                          "p-1.5 rounded-full",
                          isHold ? "bg-amber-500" : "bg-primary"
                        )}>
                          <Truck className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Circle */}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                        completed && "bg-primary border-primary text-primary-foreground",
                        current && !isHold && "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20",
                        future && "bg-background border-muted-foreground/30 text-muted-foreground",
                        isCancelled && "bg-gray-100 border-gray-300 text-gray-400",
                        isHold && current && "bg-amber-500 border-amber-500 text-white"
                      )}
                    >
                      {completed ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                  </div>

                  {/* Label */}
                  <span 
                    className={cn(
                      "mt-2 text-xs font-medium text-center",
                      completed && "text-primary",
                      current && "text-primary font-semibold",
                      future && "text-muted-foreground",
                      isCancelled && "text-gray-400"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: Vertical Stepper */}
      <div className="md:hidden">
        <div className="relative pl-8">
          {/* Vertical Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />
          
          {/* Filled Line */}
          <div 
            className={cn(
              "absolute left-4 top-0 w-0.5 transition-all duration-500",
              isCancelled ? "bg-gray-300" : "bg-primary"
            )}
            style={{ 
              height: isCancelled 
                ? "0%" 
                : `${((animatedStep + 0.5) / ROUTE_STEPS.length) * 100}%` 
            }}
          />

          {/* Steps */}
          <div className="space-y-4">
            {ROUTE_STEPS.map((step, index) => {
              const completed = isStepCompleted(index);
              const current = isStepCurrent(index);
              const future = isStepFuture(index);
              const showTruck = animatedStep === index && !isCancelled;

              return (
                <div key={step.status} className="relative flex items-center gap-4">
                  {/* Circle with Truck */}
                  <div className="absolute -left-4 flex items-center">
                    {showTruck && (
                      <div 
                        className={cn(
                          "absolute -left-6 z-10",
                          !animationComplete && "animate-bounce"
                        )}
                      >
                        <div className={cn(
                          "p-1 rounded-full",
                          isHold ? "bg-amber-500" : "bg-primary"
                        )}>
                          <Truck className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}
                    
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                        completed && "bg-primary border-primary text-primary-foreground",
                        current && !isHold && "bg-primary border-primary text-primary-foreground ring-2 ring-primary/20",
                        future && "bg-background border-muted-foreground/30 text-muted-foreground",
                        isCancelled && "bg-gray-100 border-gray-300 text-gray-400",
                        isHold && current && "bg-amber-500 border-amber-500 text-white"
                      )}
                    >
                      {completed ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </div>
                  </div>

                  {/* Label */}
                  <span 
                    className={cn(
                      "text-sm font-medium ml-6",
                      completed && "text-primary",
                      current && "text-primary font-semibold",
                      future && "text-muted-foreground",
                      isCancelled && "text-gray-400"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

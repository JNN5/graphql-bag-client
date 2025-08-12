
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Luggage, Plane, Ship, Info, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { BagTrackingData } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { Label } from '@/components/ui/label';

const startTrackingSchema = z.object({
  bagTagNumber: z.string().min(1, 'Bag tag number is required'),
  flightId: z.string().min(1, 'Flight ID is required'),
  cruiseNumber: z.string().min(1, 'Cruise number is required'),
  journey: z.string().min(1, 'Journey is required'),
  status: z.string().min(1, 'Status is required'),
  // For Start Tracking, origin and destination will be populated from flightId and cruiseNumber
  origin: z.string().optional(),
  destination: z.string().optional(),
});

const updateTrackingSchema = z.object({
  bagTagNumber: z.string().min(1, 'Bag tag number is required'),
  journey: z.string().min(1, 'Journey is required'),
  status: z.string().min(1, 'Status is required'),
  origin: z.string().optional(),
  destination: z.string().optional(),
  vehicle_number: z.string().optional(),
});

interface BagTrackingFormProps {
  onSubmit: (data: BagTrackingData, isStartTracking: boolean) => void;
  isLoading: boolean;
}

const journeyOptions = [
  { value: 'FLYCRUISE', label: 'Fly Cruise' },
];

const statusOptions = [
  { value: 'EXPECTED', label: 'Expected' },
  { value: 'APPROVED_FOR_TRANSPORT', label: 'Approved for transport' },
];

const BagTrackingForm = ({ onSubmit, isLoading }: BagTrackingFormProps) => {
  const [isStartTracking, setIsStartTracking] = useState(true);

  const form = useForm<BagTrackingData>({
    resolver: zodResolver(isStartTracking ? startTrackingSchema : updateTrackingSchema),
    defaultValues: {
      bagTagNumber: '',
      flightId: '',
      cruiseNumber: '',
      journey: 'FLYCRUISE',
      status: 'EXPECTED',
      origin: '',
      destination: '',
      vehicle_number: '',
    },
    mode: 'onSubmit',
  });

  // Create a custom submit handler that pre-processes the data before validation
  const handleSubmit = async (data: BagTrackingData) => {
    console.log('Form submitted with data:', data);
    
    try {
      // Create a copy of the data to avoid mutations on the form data
      const submissionData = { ...data };
      
      // If using start tracking mode, set origin and destination from flightId and cruiseNumber
      if (isStartTracking) {
        // Update the form values directly before validation happens
        form.setValue('origin', data.flightId);
        form.setValue('destination', data.cruiseNumber);
        
        // Also update our submission data
        submissionData.origin = data.flightId;
        submissionData.destination = data.cruiseNumber;
      }
      
      // Trigger validation manually
      const isValid = await form.trigger();
      if (isValid) {
        onSubmit(submissionData, isStartTracking);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleTrackingModeToggle = (checked: boolean) => {
    setIsStartTracking(checked);
    
    // Reset form when switching modes
    if (checked) {
      // Switching to Start Tracking mode
      const currentValues = form.getValues();
      form.reset({
        ...currentValues,
        bagTagNumber: currentValues.bagTagNumber || '',
        // Pre-fill origin and destination with empty values
        // These will be set at submission time from flightId and cruiseNumber
        origin: '',
        destination: '',
      });
    } else {
      // Switching to Update Tracking mode
      const currentValues = form.getValues();
      form.reset({
        ...currentValues,
        bagTagNumber: currentValues.bagTagNumber || '',
      });
    }
  };

  return (
    <Card className="border-border shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Luggage className="h-5 w-5" />
            <span>Bag Tracking Information</span>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="tracking-mode" 
              checked={isStartTracking}
              onCheckedChange={handleTrackingModeToggle}
            />
            <Label htmlFor="tracking-mode">
              {isStartTracking ? 'Start Tracking' : 'Update Tracking'}
            </Label>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = form.getValues();
            handleSubmit(formData);
          }} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="bagTagNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Luggage className="h-4 w-4" />
                      Bag Tag Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 618123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {isStartTracking && (
                <>
                  <FormField
                    control={form.control}
                    name="flightId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <Plane className="h-4 w-4" />
                          Flight ID (Origin)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 2025-04-07_SQ25" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cruiseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <Ship className="h-4 w-4" />
                          Cruise Number (Destination)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 1234" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {!isStartTracking && (
                <>
                  <FormField
                    control={form.control}
                    name="origin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <Plane className="h-4 w-4" />
                          Origin (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., SIN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <Ship className="h-4 w-4" />
                          Destination (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., MIA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="vehicle_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <RefreshCw className="h-4 w-4" />
                          Vehicle Number (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., V12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="optional-fields">
                <AccordionTrigger className="text-sm font-medium">
                  <div className="flex items-center gap-1.5">
                    <Info className="h-4 w-4 text-white" />
                    <span className="text-white">Journey & Status</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <FormField
                      control={form.control}
                      name="journey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Journey</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value || "FLYCRUISE"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select journey type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {journeyOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value || "EXPECTED"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {statusOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                isStartTracking ? 'Start Tracking' : 'Update Tracking'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BagTrackingForm;
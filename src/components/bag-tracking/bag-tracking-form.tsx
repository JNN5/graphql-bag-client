
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Luggage, Plane, Ship, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { BagTrackingData } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const formSchema = z.object({
  bagTagNumber: z.string().min(1, 'Bag tag number is required'),
  flightId: z.string().min(1, 'Flight ID is required'),
  cruiseNumber: z.string().min(1, 'Cruise number is required'),
  journey: z.string().optional(),
  status: z.string().optional(),
});

interface BagTrackingFormProps {
  onSubmit: (data: BagTrackingData) => void;
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
  const form = useForm<BagTrackingData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bagTagNumber: '',
      flightId: '',
      cruiseNumber: '',
      journey: 'FLYCRUISE',
      status: 'EXPECTED',
    },
  });

  const handleSubmit = (data: BagTrackingData) => {
    onSubmit(data);
  };

  return (
    <Card className="border-border shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Luggage className="h-5 w-5" />
          <span>Bag Tracking Information</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
              
              <FormField
                control={form.control}
                name="flightId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Plane className="h-4 w-4" />
                      Flight ID
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
                      Cruise Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="optional-fields">
                <AccordionTrigger className="text-sm font-medium">
                  <div className="flex items-center gap-1.5">
                    <Info className="h-4 w-4 text-white" />
                    <span className="text-white">Optional Fields</span>
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
                'Track Bag'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BagTrackingForm;
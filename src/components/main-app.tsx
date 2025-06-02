import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApiSetup } from '@/contexts/api-setup-context';
import BagTrackingForm from '@/components/bag-tracking/bag-tracking-form';
import SampleBags from '@/components/bag-tracking/sample-bags';
import ApiHeader from '@/components/layout/api-header';
import ResultDisplay from '@/components/results/result-display';
import { executeGraphQLMutation } from '@/lib/graphql';

// Types
import { BagTrackingData, MutationResult } from '@/lib/types';

const MainApp = () => {
  const { apiUrl, apiKey } = useApiSetup();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MutationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: BagTrackingData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Prepare the variables for GraphQL mutation
      const variables = {
        journey: data.journey || "FLYCRUISE",
        status: data.status || "EXPECTED",
        bags: [{
          bag_tag_no: data.bagTagNumber,
          flight_id: data.flightId
        }],
        required_inputs: JSON.stringify({ cruise_id: data.cruiseNumber })
      };

      // Execute the GraphQL mutation
      const response = await executeGraphQLMutation(apiUrl, apiKey, variables);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ApiHeader />
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-8 text-center">Bag Tracking System</h1>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] xl:gap-12">
            <div className="space-y-8">
              <BagTrackingForm onSubmit={handleSubmit} isLoading={isLoading} />
              <AnimatePresence mode="wait">
                <motion.div
                  key={result ? 'result' : 'no-result'}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ResultDisplay result={result} error={error} isLoading={isLoading} />
                </motion.div>
              </AnimatePresence>
            </div>
            
            <SampleBags />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainApp;
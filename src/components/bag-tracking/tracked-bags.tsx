import { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { RefreshCw } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { executeGraphQLQuery } from '@/lib/graphql';
import { useApiSetup } from '@/contexts/api-setup-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TrackedBag {
  bag_id: string;
  journey: string;
  status: string;
  last_updated: string;
  bag_images: { url: string }[];
}

const JOURNEY_OPTIONS = [
  { value: 'FLYCRUISE', label: 'Fly Cruise' },
  { value: 'CRUISEFLY', label: 'Cruise Fly' },
];

const TrackedBags = () => {
  const { apiUrl, apiKey } = useApiSetup();
  const [bags, setBags] = useState<TrackedBag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [journey, setJourney] = useState('FLYCRUISE');
  const [error, setError] = useState<string | null>(null);

  const fetchBags = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const query = `
        query GetTrackedBags($journey: String!, $date: String!) {
          getTrackedBagsByDate(journey: $journey, date: $date) {
            bag_id
            journey
            status
            last_updated
            bag_images {
                url
            }
          }
        }
      `;

      const variables = {
        journey,
        date: today,
      };

      const response = await executeGraphQLQuery(apiUrl, apiKey, query, variables);
      setBags(response.data.getTrackedBagsByDate);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tracked bags');
    } finally {
      setIsLoading(false);
    }
  }, [journey, apiUrl, apiKey]);

  useEffect(() => {
    fetchBags();
  }, [journey, apiUrl, apiKey, fetchBags]);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SCREENING_PASSED':
        return 'bg-green-100 text-green-800';
      case 'AT_MBCCS':
        return 'bg-gray-100 text-gray-800';
      case 'SCREENING_FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Tracked Bags</CardTitle>
            <CardDescription>View all tracked bags for today</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={fetchBags}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Select value={journey} onValueChange={setJourney}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select journey" />
              </SelectTrigger>
              <SelectContent>
                {JOURNEY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading tracked bags...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : bags.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No tracked bags found for today</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {bags.map((bag) => (
              <Card key={bag.bag_id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      {/* <div className="text-sm text-gray-500">{bag.bag_id}</div> */}
                      <div className="font-medium">{bag.bag_id.split('_')[2]}</div>
                      <div className="text-sm">Flight ID: {bag.bag_id.split('_')[0]}_{bag.bag_id.split('_')[1]}</div>
                      <div className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(bag.status)}`}>
                        {bag.status}
                      </div>
                    </div>
                    {bag.bag_images.map( image => (
                      <div className="relative w-full h-40 rounded-lg overflow-hidden">
                        <img
                          src={image.url}
                          alt={`Bag ${bag.bag_id}`}
                          className="max-w-80 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrackedBags;

import { CheckCircle, XCircle, Loader2, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraphQLResult, TrackingPoint } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ResultDisplayProps {
  result: GraphQLResult<{[key: string]: TrackingPoint | TrackingPoint[]}> | null;
  error: string | null;
  isLoading: boolean;
}

const ResultDisplay = ({ result, error, isLoading }: ResultDisplayProps) => {
  if (isLoading) {
    return (
      <LoadingState />
    );
  }

  if (error) {
    return (
      <ErrorState message={error} />
    );
  }

  if (result) {
    return (
      <SuccessState result={result} />
    );
  }

  return (
    <EmptyState />
  );
};

const EmptyState = () => (
  <Card className="border-border h-full flex flex-col justify-center p-4 rounded-md glass text-white">
    <CardHeader className="text-center pb-2">
      <CardTitle className="text-xl text-gray-300 ">Results</CardTitle>
      <CardDescription>
        Submit the form to see tracking results
      </CardDescription>
    </CardHeader>
    <CardContent className="flex-1 flex items-center justify-center p-6">
      <div className="text-center p-8">
        <Info className="mx-auto h-12 w-12 text-gray-300 opacity-50" />
        <p className="mt-4 text-gray-300 ">
          Tracking information will appear here after submission
        </p>
      </div>
    </CardContent>
  </Card>
);

const LoadingState = () => (
  <Card className="border-border shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <span>Processing Request</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col items-center justify-center p-12">
      <Loader2 className="h-16 w-16 
      animate-spin mb-4" />
      <p className="text-center text-muted-foreground mt-4">
        Sending request to GraphQL API...
      </p>
    </CardContent>
  </Card>
);

const ErrorState = ({ message }: { message: string }) => (
  <Card className="border-border border-destructive/20 shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-destructive">
        <XCircle className="h-5 w-5" />
        <span>Error</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="rounded-md bg-destructive/10 p-4 mb-4">
        <div className="flex items-start">
          <XCircle className="h-5 w-5 text-destructive mt-0.5 mr-2" />
          <div>
            <p className="text-destructive font-medium">Request Failed</p>
            <p className="text-destructive/80 text-sm mt-1">{message}</p>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Please check your API settings and try again. If the problem persists,
        verify that your GraphQL endpoint is accessible.
      </p>
    </CardContent>
  </Card>
);

const SuccessState = ({ result }: { result: GraphQLResult<{[key: string]: TrackingPoint | TrackingPoint[]}> }) => {
  // Extract the response data
  const responseKey = Object.keys(result.data || {})[0];
  const responseData = result.data ? result.data[responseKey] : null;
  
  // Check if it's a single tracking point or an array
  const trackingPoints = responseData 
    ? Array.isArray(responseData) 
      ? responseData 
      : [responseData as TrackingPoint]
    : [];
  
  return (
    <Card className="border-border shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-5 w-5" />
          <span>Success</span>
        </CardTitle>
        <CardDescription>
          The tracking information was successfully recorded
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-green-50 dark:bg-green-950/20 p-4 mb-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
            <p className="text-green-700 dark:text-green-400 font-medium">
              Request completed successfully
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="font-medium mb-2">Response Details:</h3>
          <div className="space-y-3">
            {trackingPoints.map((bag, index) => (
              <div key={index} className="bg-muted/40 rounded-md p-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Bag Tag No:</div>
                  <div>{bag.bag_tag_no}</div>
                  
                  <div className="font-medium">Journey:</div>
                  <div>{bag.journey}</div>
                  
                  <div className="font-medium">Status:</div>
                  <div>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      bag.status === "EXPECTED" && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
                      bag.status === "RECEIVED" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                      bag.status === "IN_TRANSIT" && "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
                      bag.status === "DELIVERED" && "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
                      bag.status === "APPROVED_FOR_TRANSPORT" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                    )}>
                      {bag.status}
                    </span>
                  </div>

                  {bag.origin && (
                    <>
                      <div className="font-medium">Origin:</div>
                      <div>{bag.origin}</div>
                    </>
                  )}
                  
                  {bag.destination && (
                    <>
                      <div className="font-medium">Destination:</div>
                      <div>{bag.destination}</div>
                    </>
                  )}
                  
                  {bag.vehicle_number && (
                    <>
                      <div className="font-medium">Vehicle Number:</div>
                      <div>{bag.vehicle_number}</div>
                    </>
                  )}
                  
                  {bag.tracking_point_id && (
                    <>
                      <div className="font-medium">Tracking Point ID:</div>
                      <div>{bag.tracking_point_id}</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultDisplay;
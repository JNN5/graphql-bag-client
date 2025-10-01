import { useState } from "react";

import { useApiSetup } from "@/contexts/api-setup-context";
import BagTrackingForm from "@/components/bag-tracking/bag-tracking-form";
import SampleBags from "@/components/bag-tracking/sample-bags";
import ApiHeader from "@/components/layout/api-header";
import ResultDisplay from "@/components/results/result-display";
import TrackedBags from "@/components/bag-tracking/tracked-bags";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { startTrackingPointJourney, saveTrackingPoint } from "@/lib/graphql";

// Types
import { BagTrackingData, GraphQLResult, TrackingPoint } from "@/lib/types";

const MainApp = () => {
    const { apiUrl, apiKey } = useApiSetup();
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<GraphQLResult<{
        [key: string]: TrackingPoint | TrackingPoint[];
    }> | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (
        data: BagTrackingData,
        isStartTracking: boolean,
    ) => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            let response;

            // Handle different tracking modes with appropriate mutations
            if (isStartTracking) {
                // Use MUTATION_START_TRACKING_POINT_JOURNEY
                response = await startTrackingPointJourney(
                    apiUrl,
                    apiKey,
                    data.bagTagNumber,
                    data.journey || "FLYCRUISE",
                    data.status || "EXPECTED",
                    data.origin || "",
                    data.destination || "",
                    data.origin_date,
                    data.destination_date,
                );
                setResult(
                    response as GraphQLResult<{
                        startTrackingPointJourney: TrackingPoint;
                    }>,
                );
            } else {
                // Use MUTATION_SAVE_TRACKING_POINT
                response = await saveTrackingPoint(
                    apiUrl,
                    apiKey,
                    data.journey || "FLYCRUISE",
                    data.status || "EXPECTED",
                    data.bagTagNumber,
                    data.origin,
                    data.destination,
                    data.origin_date,
                    data.destination_date,
                    data.vehicle_number,
                );
                setResult(
                    response as GraphQLResult<{
                        saveTrackingPoint: TrackingPoint;
                    }>,
                );
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An unknown error occurred",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <ApiHeader />

            <main className="container mx-auto py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <Tabs defaultValue="track" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 gap-0">
                            <TabsTrigger
                                value="track"
                                className="data-[state=inactive]:text-white"
                            >
                                Track Bag
                            </TabsTrigger>
                            <TabsTrigger
                                value="view"
                                className="data-[state=inactive]:text-white"
                            >
                                View Tracked Bags
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="track">
                            <div className="grid gap-8 lg:grid-cols-[1fr_1fr] xl:gap-12">
                                <div className="space-y-8">
                                    <BagTrackingForm
                                        onSubmit={handleSubmit}
                                        isLoading={isLoading}
                                    />
                                    <div>
                                        <ResultDisplay
                                            result={result}
                                            error={error}
                                            isLoading={isLoading}
                                        />
                                    </div>
                                </div>
                                <SampleBags />
                            </div>
                        </TabsContent>
                        <TabsContent value="view" className="min-h-[800px]">
                            <TrackedBags />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
};

export default MainApp;

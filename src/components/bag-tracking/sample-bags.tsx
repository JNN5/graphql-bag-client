import { useState } from "react";

import { format } from "date-fns";
import { Loader2, Package, Tag } from "lucide-react";
import Barcode from "@/components/ui/barcode";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApiSetup } from "@/contexts/api-setup-context";
import { getTenBags } from "@/lib/graphql";
import { Bag, SampleBagsResult } from "@/lib/types";

const SampleBags = () => {
    const { apiUrl, apiKey } = useApiSetup();
    const [bags, setBags] = useState<Bag[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadSampleBags = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = (await getTenBags(
                apiUrl,
                apiKey,
            )) as SampleBagsResult;
            if (result.data?.getTenBags) {
                setBags(result.data.getTenBags);
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load sample bags",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "N/A";

        try {
            return format(new Date(dateString), "MMM d, yyyy HH:mm");
        } catch {
            return dateString;
        }
    };

    return (
        <Card className="">
            <CardHeader className="p-4 rounded-md glass text-white mb-4">
                <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    <span>Sample Bags</span>
                </CardTitle>
                <CardDescription>
                    Load and view sample bag tracking data
                </CardDescription>
                <Button
                    onClick={loadSampleBags}
                    className="w-full mb-4bg bg-teal-600 hover:bg-teal-600/90 text-white"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading Samples...
                        </>
                    ) : (
                        "Load Sample Bags"
                    )}
                </Button>

                {error && (
                    <div className="text-destructive text-sm mb-4 p-3 bg-destructive/10 rounded-md">
                        {error}
                    </div>
                )}
            </CardHeader>
            <CardContent>
                {bags.length > 0 && (
                    <div className="space-y-4">
                        <ScrollArea className="h-[600px] border rounded-lg border-gray-500 p-4">
                            {bags.map((bag) => (
                                <div
                                    key={bag.bag_tag_no}
                                    className="mb-4 last:mb-0"
                                >
                                    <Card>
                                        <CardContent className="p-4 rounded-md glass text-white">
                                            <div className="grid gap-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Tag className="h-4 w-4" />
                                                        <span className="font-semibold">
                                                            {bag.bag_tag_no}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-muted-foreground">
                                                            Flight ID:
                                                        </span>
                                                        <p className="font-medium">{`${bag.scheduled_date}_${bag.flight_no}`}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">
                                                            Journey:
                                                        </span>
                                                        <p className="font-medium">
                                                            {bag.bag_journey}
                                                        </p>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <div className="flex w-full justify-center p-2 rounded-md">
                                                            <Barcode
                                                                text={
                                                                    bag.bag_tag_no
                                                                }
                                                                scale={3}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default SampleBags;

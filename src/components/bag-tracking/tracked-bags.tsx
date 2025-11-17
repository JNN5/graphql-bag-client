import { useEffect, useState, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogHeader,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { RefreshCw, ZoomIn } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTrackedBagsByDate } from "@/lib/graphql";
import { useApiSetup } from "@/contexts/api-setup-context";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Barcode from "@/components/ui/barcode";
// Using the TrackedBag interface from types.ts
import { TrackedBag as TrackedBagType } from "@/lib/types";

const JOURNEY_OPTIONS = [
    { value: "FLYCRUISE", label: "FLYCRUISE" },
    { value: "OACI", label: "OACI" },
    { value: "DEPARTURE", label: "DEPARTURE" },
    { value: "TERMINAL_TRANSFER", label: "TERMINAL_TRANSFER" },
];

const TrackedBags = () => {
    const { apiUrl, apiKey } = useApiSetup();
    const [bags, setBags] = useState<TrackedBagType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [journey, setJourney] = useState("FLYCRUISE");
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<{
        url: string;
        alt: string;
        bagTagNo: string;
    } | null>(null);
    const [imageLoading, setImageLoading] = useState(false);

    const fetchBags = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const today = format(new Date(), "yyyy-MM-dd");

            const response = (await getTrackedBagsByDate(
                apiUrl,
                apiKey,
                journey,
                today,
            )) as {
                data?: {
                    getTrackedBagsByDate: TrackedBagType[];
                };
            };

            if (response.data && response.data.getTrackedBagsByDate) {
                setBags(response.data.getTrackedBagsByDate);
            } else {
                setError("No tracked bags data received");
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to fetch tracked bags",
            );
        } finally {
            setIsLoading(false);
        }
    }, [journey, apiUrl, apiKey]);

    useEffect(() => {
        fetchBags();
    }, [journey, apiUrl, apiKey, fetchBags]);

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case "SCREENING_PASSED":
                return "bg-green-100 text-green-800";
            case "AT_MBCCS":
                return "bg-gray-100 text-gray-800";
            case "SCREENING_FAILED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-blue-100 text-gray-800";
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between items-center p-4 rounded-md glass mb-4 text-white">
                    <div>
                        <CardTitle>Tracked Bags</CardTitle>
                        <CardDescription>
                            View all tracked bags for today
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            className="bg-teal-600 hover:bg-teal-600/90 glass"
                            size="icon"
                            onClick={fetchBags}
                            disabled={isLoading}
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                            />
                        </Button>
                        <Select value={journey} onValueChange={setJourney}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select journey" />
                            </SelectTrigger>
                            <SelectContent>
                                {JOURNEY_OPTIONS.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
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
                    <div className="text-center text-white py-4">
                        Loading tracked bags...
                    </div>
                ) : error ? (
                    <div className="text-center py-4 glass text-white">{error}</div>
                ) : bags.length === 0 ? (
                    <div className="text-center py-4 glass text-white">
                        No tracked bags found for today
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {bags.map((bag) => (
                            <Card key={bag.bag_tag_no}>
                                <CardContent className="p-4 rounded-md glass text-white">
                                    <div className="space-y-3">
                                        <div className="space-y-2">
                                            <div className="font-medium">
                                                {bag.bag_tag_no}
                                            </div>
                                            {/*<div className="text-sm">Journey: {bag.journey}</div>*/}
                                            <div className="text-sm">
                                                Origin: {bag.origin} ({bag.origin_date})→
                                                Destination: {bag.destination} ({bag.destination_date})
                                            </div>
                                            {bag.damaged && (
                                                <div className="py-1 text-xs bg-red-900 rounded-md">
                                                    DAMAGED
                                                </div>
                                            )}
                                            <div
                                                className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(bag.status)}`}
                                            >
                                                {bag.status}
                                            </div>
                                            {bag.vehicle_number && (
                                                <div className="text-sm">
                                                    Vehicle:{" "}
                                                    {bag.vehicle_number}
                                                </div>
                                            )}
                                            {bag.location && (
                                                <div className="text-sm">
                                                    Location: {bag.location}
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid place-items-center text-white">
                                            {!isNaN(Number(bag.bag_tag_no)) &&
                                                Number.isInteger(
                                                    Number(bag.bag_tag_no),
                                                ) && (
                                                    <Barcode
                                                        text={bag.bag_tag_no}
                                                        scale={2}
                                                    />
                                                )}
                                        </div>
                                        <div className="grid grid-cols-3 gap-1">
                                            {bag.bag_images?.map((image) => (
                                                <Dialog
                                                    key={image.url}
                                                    open={
                                                        selectedImage?.url ===
                                                        image.url
                                                    }
                                                    onOpenChange={(open) => {
                                                        if (!open)
                                                            setSelectedImage(
                                                                null,
                                                            );
                                                    }}
                                                >
                                                    <DialogTrigger asChild>
                                                        <div
                                                            className="relative w-full h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity group"
                                                            onClick={() => {
                                                                setSelectedImage(
                                                                    {
                                                                        url: image.url,
                                                                        alt: `Bag ${bag.bag_tag_no}`,
                                                                        bagTagNo:
                                                                            bag.bag_tag_no,
                                                                    },
                                                                );
                                                                setImageLoading(
                                                                    true,
                                                                );
                                                            }}
                                                        >
                                                            <img
                                                                src={image.url}
                                                                alt={`Bag ${bag.bag_tag_no}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                                                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6" />
                                                            </div>
                                                        </div>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Bag Image -{" "}
                                                                {bag.bag_tag_no}
                                                            </DialogTitle>
                                                        </DialogHeader>
                                                        <div className="flex items-center justify-center p-2 min-h-[50vh]">
                                                            {imageLoading && (
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                                                                </div>
                                                            )}
                                                            <img
                                                                src={image.url}
                                                                alt={`Bag ${bag.bag_tag_no}`}
                                                                className="max-h-[70vh] max-w-full object-contain rounded-md"
                                                                onLoad={() =>
                                                                    setImageLoading(
                                                                        false,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            ))}
                                        </div>
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

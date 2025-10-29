import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Luggage, Plane, Ship, Info, RefreshCw } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BagTrackingData } from "@/lib/types";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const startTrackingSchema = z.object({
    bagTagNumber: z.string().min(1, "Bag tag number is required"),
    origin: z.string().min(1, "Origin is required"),
    destination: z.string().min(1, "Destination is required"),
    journey: z.string().min(1, "Journey is required"),
    status: z.string().min(1, "Status is required"),
    origin_date: z
        .string()
        .regex(dateRegex, "Use YYYY-MM-DD")
        .optional(),
        // .or(z.literal(null)),
    destination_date: z
        .string()
        .regex(dateRegex, "Use YYYY-MM-DD")
        .optional(),
        // .or(z.literal(null)),
    vehicle_number: z.string().optional(), // not used in start mode
});

const updateTrackingSchema = z.object({
    bagTagNumber: z.string().min(1, "Bag tag number is required"),
    journey: z.string().min(1, "Journey is required"),
    status: z.string().min(1, "Status is required"),
    origin: z.string().optional(),
    destination: z.string().optional(),
    origin_date: z
        .string()
        .regex(dateRegex, "Use YYYY-MM-DD")
        .optional(),
        // .or(z.literal("")),
    destination_date: z
        .string()
        .regex(dateRegex, "Use YYYY-MM-DD")
        .optional(),
        // .or(z.literal("")),
    vehicle_number: z.string().optional(),
});

interface BagTrackingFormProps {
    onSubmit: (data: BagTrackingData, isStart: boolean) => void;
    isLoading: boolean;
}

const journeyOptions = [
    { value: "FLYCRUISE", label: "FLYCRUISE" },
    { value: "OACI", label: "OACI" },
    { value: "DEPARTURE", label: "DEPARTURE" },
    { value: "TERMINAL_TRANSFER", label: "TERMINAL_TRANSFER" },
];

const statusOptions = [
    { value: "EXPECTED", label: "Expected" },
    { value: "APPROVED_FOR_TRANSPORT", label: "Approved for transport" },
];

const BagTrackingForm = ({ onSubmit, isLoading }: BagTrackingFormProps) => {
    const [isStartTracking, setIsStartTracking] = useState(true);

    const form = useForm<BagTrackingData>({
        resolver: zodResolver(
            isStartTracking ? startTrackingSchema : updateTrackingSchema,
        ),
        defaultValues: {
            bagTagNumber: "",
            origin: "",
            destination: "",
            journey: "FLYCRUISE",
            status: "EXPECTED",
            origin_date: undefined,
            destination_date: undefined,
            vehicle_number: "",
        },
        mode: "onSubmit",
    });

    const handleSubmitInternal = async () => {
        const valid = await form.trigger();
        if (!valid) return;
        onSubmit(form.getValues(), isStartTracking);
    };

    const handleTrackingModeToggle = (checked: boolean) => {
        setIsStartTracking(checked);
        const current = form.getValues();
        form.reset({
            ...current,
            origin: current.origin || "",
            destination: current.destination || "",
        });
    };

    return (
        <Card className="border-border shadow-md">
            <CardHeader className="mb-4">
                <CardTitle className="flex items-center justify-between rounded-md glass w-full p-4">
                    <div className="flex items-center gap-2 text-white">
                        <Luggage className="h-5 w-5" />
                        <span>Bag Tracking Information</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white">
                        <Switch
                            id="tracking-mode"
                            checked={isStartTracking}
                            onCheckedChange={handleTrackingModeToggle}
                        />
                        <Label htmlFor="tracking-mode">
                            {isStartTracking
                                ? "Start Tracking"
                                : "Update Tracking"}
                        </Label>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="rounded-md glass text-white p-8">
                <Form {...form}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmitInternal();
                        }}
                        className="space-y-6"
                    >
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
                                            <Input
                                                placeholder="e.g., 618123456"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {isStartTracking && (
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="origin"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-1.5">
                                                    <Plane className="h-4 w-4" />
                                                    Origin
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g., SIN"
                                                        {...field}
                                                    />
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
                                                    Destination
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g., MIA"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            {!isStartTracking && (
                                <div className="grid gap-4 md:grid-cols-2">
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
                                                    <Input
                                                        placeholder="e.g., SIN"
                                                        {...field}
                                                    />
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
                                                    <Input
                                                        placeholder="e.g., MIA"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="origin_date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Origin Date (YYYY-MM-DD)
                                                (Optional)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="2025-04-07"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="destination_date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Destination Date (YYYY-MM-DD)
                                                (Optional)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="2025-04-15"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {!isStartTracking && (
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
                                                <Input
                                                    placeholder="e.g., V12345"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="meta">
                                <AccordionTrigger className="text-sm font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <Info className="h-4 w-4 text-white" />
                                        <span className="text-white">
                                            Journey & Status
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-4 pt-2">
                                        <FormField
                                            control={form.control}
                                            name="journey"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Journey
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value ||
                                                            "FLYCRUISE"
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select journey type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {journeyOptions.map(
                                                                (opt) => (
                                                                    <SelectItem
                                                                        key={
                                                                            opt.value
                                                                        }
                                                                        value={
                                                                            opt.value
                                                                        }
                                                                    >
                                                                        {
                                                                            opt.label
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
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
                                                    <FormLabel>
                                                        Status
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value ||
                                                            "EXPECTED"
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {statusOptions.map(
                                                                (opt) => (
                                                                    <SelectItem
                                                                        key={
                                                                            opt.value
                                                                        }
                                                                        value={
                                                                            opt.value
                                                                        }
                                                                    >
                                                                        {
                                                                            opt.label
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
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
                            className="w-full bg-teal-600 hover:bg-teal-600/90"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : isStartTracking ? (
                                "Start Tracking"
                            ) : (
                                "Update Tracking"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default BagTrackingForm;

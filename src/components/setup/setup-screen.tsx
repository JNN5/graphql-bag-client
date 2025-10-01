import { useState, useEffect } from "react";
import { useApiSetup } from "@/contexts/api-setup-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Plane, ShieldCheck, Loader2 } from "lucide-react";

interface SetupScreenProps {
    onSetupComplete: () => void;
}

const SetupScreen = ({ onSetupComplete }: SetupScreenProps) => {
    const { setApiConfig, isConfigured } = useApiSetup();
    const [url, setUrl] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isConfigured) {
            onSetupComplete();
        }
    }, [isConfigured, onSetupComplete]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Basic validation
        if (!url || !apiKey) {
            setError("Please provide both API URL and API Key");
            return;
        }

        // URL format validation
        try {
            new URL(url);
        } catch {
            setError("Please enter a valid URL");
            return;
        }

        setIsValidating(true);

        // In a real app, you might want to test the connection here
        // This is simulated for demonstration purposes
        setTimeout(() => {
            setApiConfig(url, apiKey);
            setIsValidating(false);
            onSetupComplete();
        }, 1500);
    };

    return (
        <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
            <Card>
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-6">
                        <div className="rounded-full glass p-3">
                            <Plane className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <div className="p-8 rounded-md glass">
                        <CardTitle className="text-2xl font-semibold text-center text-white">
                            API Configuration
                        </CardTitle>
                        <CardDescription className="text-center text-white">
                            Enter your GraphQL API details to get started
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-2 mt-4">
                        <div className="space-y-2 rounded-md glass">
                            <Input
                                id="url"
                                placeholder="https://api.example.com/graphql"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2 rounded-md glass">
                            <div className="relative">
                                <Input
                                    id="apiKey"
                                    type="password"
                                    placeholder="Your API key"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="w-full pr-10"
                                />
                                <ShieldCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>

                        {error && (
                            <div className="text-destructive text-sm py-2">
                                {error}
                            </div>
                        )}
                    </form>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full mt-4 bg bg-teal-600 hover:bg-teal-600/90 glass"
                        onClick={handleSubmit}
                        disabled={isValidating}
                    >
                        {isValidating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Connecting...
                            </>
                        ) : (
                            "Connect to API"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default SetupScreen;

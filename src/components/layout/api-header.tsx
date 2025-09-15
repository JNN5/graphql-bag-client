import { useState } from "react";
// framer-motion import removed (motion no longer used)
import { Settings, LogOut } from "lucide-react";
import { useApiSetup } from "@/contexts/api-setup-context";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ApiHeader = () => {
    const { apiUrl, apiKey, setApiConfig, clearApiConfig } = useApiSetup();
    const [newApiUrl, setNewApiUrl] = useState(apiUrl);
    const [newApiKey, setNewApiKey] = useState(apiKey);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSaveSettings = () => {
        setApiConfig(newApiUrl, newApiKey);
        setIsDialogOpen(false);
    };

    const resetForm = () => {
        setNewApiUrl(apiUrl);
        setNewApiKey(apiKey);
    };

    return (
        <header className="py-3 px-4 sticky top-0 z-10 shadow-sm">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg text-white font-semibold">
                        GraphQL Bag Tracker
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    <Dialog
                        open={isDialogOpen}
                        onOpenChange={(open) => {
                            setIsDialogOpen(open);
                            if (open) resetForm();
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button
                                size="sm"
                                className="gap-1.5 glass"
                            >
                                <Settings className="h-4 w-4" />
                                <span>API Settings</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>API Configuration</DialogTitle>
                                <DialogDescription>
                                    Update your GraphQL API settings
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="api-url">API URL</Label>
                                    <Input
                                        id="api-url"
                                        value={newApiUrl}
                                        onChange={(e) =>
                                            setNewApiUrl(e.target.value)
                                        }
                                        placeholder="https://api.example.com/graphql"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="api-key">API Key</Label>
                                    <Input
                                        id="api-key"
                                        value={newApiKey}
                                        onChange={(e) =>
                                            setNewApiKey(e.target.value)
                                        }
                                        type="password"
                                        placeholder="Your API key"
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveSettings}>
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                size="sm"
                                className="text-white gap-1.5 glass"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="sr-only sm:not-sr-only">
                                    Logout
                                </span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will clear your API settings and return
                                    you to the setup screen.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={clearApiConfig}>
                                    Logout
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </header>
    );
};

export default ApiHeader;

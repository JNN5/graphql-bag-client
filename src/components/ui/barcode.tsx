import { useCallback, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Dynamically load bwip-js only when needed to keep initial bundle smaller.
let _bwipPromise: Promise<typeof import("bwip-js")> | null = null;
function loadBwip() {
    if (!_bwipPromise) {
        _bwipPromise = import("bwip-js");
    }
    return _bwipPromise;
}

export interface BarcodeProps {
    text: string;
    scale: number;
}

export default function Barcode({ text, scale }: BarcodeProps) {
    const [open, setOpen] = useState(false);

    const renderBarcode = useCallback(
        (canvas: HTMLCanvasElement | null, large: boolean) => {
            if (!canvas) return;

            // Defer library load until actually needed.
            loadBwip()
                .then((mod) => {
                    const bwip = mod.default;
                    try {
                        bwip.toCanvas(canvas, {
                            bcid: "interleaved2of5",
                            text,
                            scale: large ? 50 : scale,
                            height: 15,
                            includetext: true,
                            textxalign: "center",
                            barcolor: "000000",
                            textcolor: "000000",
                        });
                    } catch {
                        // Swallow rendering errors (invalid data etc.)
                    }
                })
                .catch(() => {
                    // Swallow dynamic import errors silently; optionally log
                });
        },
        [text, scale],
    );

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <div
                    className="flex glass-white p-4"
                    onClick={() => setOpen(true)}
                >
                    <canvas
                        ref={(c) => renderBarcode(c, false)}
                        className="relative cursor-pointer select-none max-w-full"
                    />
                </div>
                <DialogContent className="sm:max-w-3xl">
                    <div className="flex flex-col items-center gap-4 glass-white p-4">
                        <canvas
                            ref={(c) => renderBarcode(c, true)}
                            className="relative max-w-full"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

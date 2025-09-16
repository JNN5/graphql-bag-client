import { useCallback, useState } from "react";
import bwipjs from "bwip-js";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export interface BarcodeProps {
    text: string;
}

export default function Barcode({ text }: BarcodeProps) {
    const [open, setOpen] = useState(false);

    const renderBarcode = useCallback(
        (canvas: HTMLCanvasElement | null, large: boolean) => {
            if (!canvas) return;
            try {
                bwipjs.toCanvas(canvas, {
                    bcid: "interleaved2of5",
                    text: text,
                    scale: large ? 5 : 2.5,
                    height: large ? 20 : 10,
                    includetext: true,
                    textxalign: "center",
                    barcolor: "000000",
                    textcolor: "000000",
                });
            } catch {
                // Silently ignore for now; could add logging if desired
                // console.error('Failed to render barcode');
            }
        },
        [text],
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div className="inline-block glass-white p-4" onClick={() => setOpen(true)}>
                <canvas
                    ref={(c) => renderBarcode(c, false)}
                    className="cursor-pointer select-none"
                />
            </div>
            <DialogContent className="sm:max-w-lg">
                <div className="flex flex-col items-center gap-4 glass-white p-4">
                    <canvas
                        ref={(c) => renderBarcode(c, true)}
                        className="max-w-full"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

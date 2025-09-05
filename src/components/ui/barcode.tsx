import bwipjs from 'bwip-js';

export interface BarcodeProps {
  text: string
}

export default function Barcode({text}: BarcodeProps) {
  return (
    <canvas
      ref={(canvas) => {
        if (!canvas) {
          return;
        }

        bwipjs.toCanvas(canvas, {
          bcid:        'interleaved2of5',
          text:        text,
          scale:       2.5,
          height:      10,
          includetext: true,
          textxalign:  'center',
        });
      }}
    />
  );
}
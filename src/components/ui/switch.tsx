import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'SwitchRoot peer w-[42px] h-[25px] bg-[var(--black-a9)] rounded-full relative focus:shadow-[0_0_0_2px_black] bg-black',
      'after:content-[""] after:block after:absolute after:w-[21px] after:h-[21px] after:bg-white after:rounded-full after:top-[1px] after:left-[2px]',
      'after:transition-transform after:duration-100 after:will-change-transform data-[state=checked]:after:translate-x-[17px]',
      className
    )}
    {...props}
    ref={ref}
  />
));
Switch.displayName = SwitchPrimitives.Root.displayName;

// Label component as provided in your CSS
const Label = React.forwardRef<
  HTMLLabelElement,
  React.HTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    className={cn(
      'Label text-white text-[15px] leading-none select-none',
      className
    )}
    {...props}
    ref={ref}
  />
));
Label.displayName = 'Label';

export { Switch, Label };

import { createContext, useContext, useState } from 'react';
import { cn } from '../../lib/utils';

const AlertDialogContext = createContext();

export function AlertDialog({ children, open: controlledOpen, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

export function AlertDialogTrigger({ children, asChild, ...props }) {
  const { setOpen } = useContext(AlertDialogContext);

  return (
    <div
      {...props}
      onClick={() => setOpen(true)}
    >
      {children}
    </div>
  );
}

export function AlertDialogContent({ children, className, ...props }) {
  const { open, setOpen } = useContext(AlertDialogContext);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          'relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export function AlertDialogHeader({ className, ...props }) {
  return (
    <div
      className={cn('flex flex-col space-y-2 text-center sm:text-left', className)}
      {...props}
    />
  );
}

export function AlertDialogTitle({ className, ...props }) {
  return (
    <h2
      className={cn('text-lg font-semibold', className)}
      {...props}
    />
  );
}

export function AlertDialogDescription({ className, ...props }) {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

export function AlertDialogFooter({ className, ...props }) {
  return (
    <div
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
      {...props}
    />
  );
}

export function AlertDialogAction({ className, ...props }) {
  const { setOpen } = useContext(AlertDialogContext);

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
        'bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4',
        className
      )}
      onClick={(e) => {
        props.onClick?.(e);
        setOpen(false);
      }}
      {...props}
    />
  );
}

export function AlertDialogCancel({ className, ...props }) {
  const { setOpen } = useContext(AlertDialogContext);

  return (
    <button
      className={cn(
        'mt-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
        'border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 sm:mt-0',
        className
      )}
      onClick={() => setOpen(false)}
      {...props}
    />
  );
}

// app/components/ui/use-toast.ts
'use client';
import { toast } from 'sonner';

type ToastOptions = {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

export const useToast = () => {
  return {
    toast: ({ title, description, variant }: ToastOptions) => {
      toast(title, {
        description,
        ...(variant === 'destructive' && {
          classNames: {
            toast: 'bg-destructive text-destructive-foreground'
          }
        })
      });
    }
  };
};

import { toast as sonnerToast } from "sonner";

type ToasterToast = {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

const useToast = () => {
  const toast = (props: ToasterToast) => {
    if (props.variant === "destructive") {
      sonnerToast.error(props.title as string, {
        description: props.description,
      });
    } else {
      sonnerToast(props.title as string, {
        description: props.description,
      });
    }
  };

  return {
    toast,
    toasts: [] as ToasterToast[],
    dismiss: sonnerToast.dismiss,
  };
};

export { useToast, sonnerToast as toast };

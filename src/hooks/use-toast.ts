
import { ToastT, toast as sonnerToast } from "sonner";

type ToasterToast = ToastT & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
};

const useToast = () => {
  const toast = (props: ToasterToast) => {
    sonnerToast(props.title as string, {
      description: props.description,
      action: props.action,
      ...props
    });
  };

  return {
    toast,
    toasts: [] as ToasterToast[],
    dismiss: sonnerToast.dismiss,
  };
};

export { useToast, sonnerToast as toast };

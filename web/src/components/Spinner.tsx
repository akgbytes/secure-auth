import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

interface SpinnerProps {
  className?: string;
  text?: string;
}

const Spinner = ({ className, text }: SpinnerProps) => {
  return (
    <>
      <LoaderCircle
        className={
          className
            ? cn("animate-spin w-5 h-5", className)
            : "animate-spin w-5 h-5"
        }
      />
      {text && <>{text}...</>}
    </>
  );
};

export default Spinner;

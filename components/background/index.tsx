import React, { forwardRef } from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Background = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          "fixed inset-0 h-full w-full z-10",
          className
        )}
        ref={ref}
        {...props}
      >
        {
          children
        }
      </motion.div>
    )
  }
);

Background.displayName = "Background";

export default Background;
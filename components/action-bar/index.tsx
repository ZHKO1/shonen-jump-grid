import React from "react";
import { motion } from "framer-motion";
import { ClassValue } from "clsx";
import { cn } from "@/lib/utils";

export interface ActionType {
  Icon: React.FC,
  onClick: React.MouseEventHandler<HTMLButtonElement>,
  iconkey?: string,
}

function ActionButton({ Icon, onClick }: ActionType) {
  return (<motion.button
    layout
    initial={{
      opacity: 0,
    }}
    animate={{
      opacity: 1,
    }}
    exit={{
      opacity: 0,
      transition: {
        duration: 0.05,
      },
    }}
    className="flex items-center justify-center bg-white rounded-full h-12 w-12 text-lg"
    onClick={onClick}
  >
    <Icon />
  </motion.button>);
}

export default function ActionBar({ actions, className }: { actions: ActionType[], className?: ClassValue }) {
  return (<div className={cn("flex items-center gap-4", className)}>
    {actions.map((action) => (<ActionButton key={action.iconkey || action.Icon.name} {...action} />))}
  </div>);
}


'use client';
import { CSSProperties } from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface LogoContentProps extends HTMLMotionProps<"div"> {
    disableMotion?: boolean,
    url?: string
};

const LogoContent: React.FC<LogoContentProps> = ({ className, url, disableMotion, ...props }) => {
    const Comp = (disableMotion ? "div" : motion.div) as (typeof motion.div)
    const extraProps = (disableMotion ? {} : { layoutId: `grid-logo` })

    return <Comp
        className={cn(
            "absolute flex flex-wrap content-center justify-center z-10 before:absolute before:border-dotted before:border-4 before:border-gray-900 before:box-border before:top-0 before:bottom-0 before:left-0 before:right-0",
            className
        )}
        {
        ...extraProps
        }
        {...props}
    >
        {url &&
            <img
                className="absolute w-full h-full select-none"
                width={500}
                height={500}
                src={url}
                alt={"background"} />
        }
    </Comp>
}

export default LogoContent
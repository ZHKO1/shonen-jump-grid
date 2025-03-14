'use client';
import { HTMLMotionProps, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LogoDefaultCenterX, LogoDefaultCenterY, LogoDefaultHeight, LogoDefaultWidth } from '@/components/comic/core/config';
import { CanvasPageConfig } from '../types';

export interface LogoProps extends HTMLMotionProps<"div"> {
    logo: CanvasPageConfig["logo"],
    disableMotion?: boolean,
};

const Logo: React.FC<LogoProps> = ({ className, logo, disableMotion }) => {
    const Comp = (disableMotion ? "div" : motion.div) as (typeof motion.div)
    const logoConfig = {
        centerX: LogoDefaultCenterX,
        centerY: LogoDefaultCenterY,
        width: LogoDefaultWidth,
        height: LogoDefaultHeight,
        ...logo
    }

    const logoPosStyle = {
        left: logoConfig.centerX - logoConfig.width / 2,
        top: logoConfig.centerY - logoConfig.height / 2,
    }

    const logoSizeStyle = {
        width: logoConfig.width,
        height: logoConfig.height,
    }
    
    const logoStyle = {
        ...logoPosStyle,
        ...logoSizeStyle,
    }

    return <Comp
        className={cn(
            "bg-slate-400 absolute flex flex-wrap content-center justify-center z-10",
            className
        )}
        layoutId={`grid-logo`} 
        style={logoStyle}
    >
        {logoConfig.url &&
            <div className="absolute"
                style={logoSizeStyle}>
                <img
                    className="absolute w-full h-full select-none"
                    width={500}
                    height={500}
                    src={logoConfig.url}
                    alt={"background"} />
            </div>
        }
    </Comp>
}

export default Logo
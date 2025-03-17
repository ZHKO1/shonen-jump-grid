"use client";
import { createContext, RefObject } from "react";

export const ContainerContext = createContext<{ container: RefObject<HTMLDivElement | null>, scale: number }>({ container: { current: null }, scale: 1 });
"use client";
import { createContext, RefObject } from "react";

export const ContainerContext = createContext<{ container: RefObject<HTMLDivElement | null> }>({ container: { current: null } });
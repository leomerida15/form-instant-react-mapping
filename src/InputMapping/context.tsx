"use client";
import { createContext } from "use-context-selector";
import { InputMapping } from "./class";

export const InputMappingContext = createContext<InputMapping>(new InputMapping());

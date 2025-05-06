// app/components/theme-provider.tsx
"use client"; // Provider precisa ser um Client Component

import * as React from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    // attribute="class": Adiciona a classe 'light' ou 'dark' ao elemento <html>
    // defaultTheme="system": Usa o tema do sistema operacional como padrão
    // enableSystem: Habilita a detecção automática do tema do sistema
    // disableTransitionOnChange: Evita transições bruscas ao mudar de tema/página
    <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
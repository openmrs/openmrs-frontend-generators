import React from "react";

export function defineConfigSchema() {}

export function useConfig() {
  return {
    displayGreeting: true,
  };
}

export const ModuleNameContext = React.createContext("fake-module-config");

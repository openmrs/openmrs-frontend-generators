import React from "react";

export function defineConfigSchema() {}

export const validators = {
  isBoolean: jest.fn(),
  isString: jest.fn()
};

export function useConfig() {
  return {
    displayGreeting: true,
  };
}

export const ModuleNameContext = React.createContext("fake-module-config");

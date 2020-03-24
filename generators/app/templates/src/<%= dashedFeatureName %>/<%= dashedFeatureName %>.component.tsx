import React from "react";
import styles from "./my-thing.component.css";
import { useConfig } from "@openmrs/esm-module-config";

export default function <%= componentName %>(props: <%= componentName %>Props) {
  const config = useConfig();
  return config.displayGreeting ? (
    <div className={styles.greeting}>Hello <%= featureName %>!</div>
  ) : null;
}

type <%= componentName %>Props = {};

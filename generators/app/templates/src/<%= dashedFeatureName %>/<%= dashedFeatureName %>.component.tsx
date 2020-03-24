import React from "react";
import { useConfig } from "@openmrs/esm-module-config";
import { Trans } from "react-i18next";
import styles from "./<%= dashedFeatureName %>.css";

export default function <%= componentName %>(props: <%= componentName %>Props) {
  const config = useConfig();
  return config.displayGreeting ? (
    <div className={styles.greeting}>
      <Trans i18nKey="hello-from">Hello from</Trans>
      {' '} <%= featureName %>!
    </div>
  ) : null;
}

type <%= componentName %>Props = {};

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { defineConfigSchema } from '@openmrs/esm-module-config';
import openmrsRootDecorator from '@openmrs/react-root-decorator';

defineConfigSchema('@openmrs/esm-<%= name %>', {});

const Root: React.FC = () => (
  <BrowserRouter basename={window['getOpenmrsSpaBase']()}>
    <div>Fill me with content!</div>
  </BrowserRouter>
);

export default openmrsRootDecorator({
  featureName: '<%= name %>',
  moduleName: '@openmrs/esm-<%= name %>',
})(Root);

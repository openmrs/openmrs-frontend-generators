import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Root from './root.component';

window['getOpenmrsSpaBase'] = jest.fn().mockImplementation(() => '/');

describe(`<Root />`, () => {
  afterEach(cleanup);

  it(`renders without dying`, () => {
    const wrapper = render(<Root />);
  });
});

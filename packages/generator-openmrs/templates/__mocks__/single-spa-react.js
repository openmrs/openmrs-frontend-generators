const React = require("react");

const SingleSpaContext = React.createContext({
  mountParcel: () => jest.fn(),
});

module.exports = {
  SingleSpaContext,
};

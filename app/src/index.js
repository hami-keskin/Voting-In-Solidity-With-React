import React from 'react';
import ReactDOM from 'react-dom';
import { ThirdwebProvider, ConnectWallet } from "@thirdweb-dev/react";
import { Sepolia } from '@thirdweb-dev/chains';

import App from './App';

ReactDOM.render(
  <ThirdwebProvider activeChain={Sepolia}>
    <ConnectWallet />
    <App />
  </ThirdwebProvider>,
  document.getElementById('root')
);

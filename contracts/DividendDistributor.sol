// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
}

contract DividendDistributor {
    IERC20 public token;
    uint256 public totalDividendsDistributed;

    mapping(address => uint256) public lastDividendsClaimed;
    mapping(address => uint256) public credit;

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }

    function distributeDividends() public payable {
        require(msg.value > 0, "No ether sent for dividends.");
        totalDividendsDistributed += msg.value;
    }

    function updateCredit(address account) public {
        uint256 owed = (totalDividendsDistributed - lastDividendsClaimed[account]) * token.balanceOf(account) / token.totalSupply();
        credit[account] += owed;
        lastDividendsClaimed[account] = totalDividendsDistributed;
    }

    function claimDividends() public {
        updateCredit(msg.sender);
        uint256 amount = credit[msg.sender];
        require(amount > 0, "No dividends to claim.");
        credit[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Failed to send Ether");
    }
}

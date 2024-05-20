// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract TransferGateway is Ownable, Pausable, ReentrancyGuard {
    // Constructor to set the initial owner
    constructor(address initialOwner) Ownable(initialOwner) {}

    // Mapping to store allowed tokens for transfers
    mapping(address => bool) public allowedTokens;

    // Fee in basis points (1 bps = 0.01%)
    uint256 public feeBps = 50;  // Initial fee of 0.5%
    uint256 public constant MAX_FEE_BPS = 100;  // Maximum fee limit in basis points (1.0%)

    // Events for logging transfer and fee updates
    event TransferNative(address indexed sender, address indexed recipient, uint256 amount, uint256 fee);
    event TransferToken(address indexed sender, address indexed recipient, address token, uint256 amount, uint256 fee);
    event FeeUpdated(uint256 newFeeBps);

    /**
     * @dev Add or remove tokens from the whitelist.
     * @param token The address of the token to be allowed or disallowed.
     * @param isAllowed Boolean indicating whether the token is allowed.
     */
    function setTokenWhitelist(address token, bool isAllowed) external onlyOwner {
        allowedTokens[token] = isAllowed;
    }

    /**
     * @dev Transfer native currency with a fee.
     * @param recipient The address of the recipient.
     */
    function transferNative(address payable recipient) external payable whenNotPaused nonReentrant {
        require(msg.value > 0, "Amount must be greater than zero");
        uint256 fee = (msg.value * feeBps) / 10000;
        uint256 amountAfterFee = msg.value - fee;

        // Prevent reentrancy by updating state before transferring funds
        (bool successRecipient, ) = recipient.call{value: amountAfterFee}("");
        require(successRecipient, "Transfer to recipient failed");
        
        (bool successOwner, ) = owner().call{value: fee}("");
        require(successOwner, "Transfer to owner failed");

        emit TransferNative(msg.sender, recipient, amountAfterFee, fee);
    }

    /**
     * @dev Transfer ERC20 tokens with a fee.
     * @param token The address of the token to transfer.
     * @param recipient The address of the recipient.
     * @param amount The amount of tokens to transfer.
     */
    function transferToken(address token, address recipient, uint256 amount) external whenNotPaused nonReentrant {
        require(allowedTokens[token], "Token not permitted");
        require(amount > 0, "Amount must be greater than zero");
        uint256 fee = (amount * feeBps) / 10000;
        uint256 amountAfterFee = amount - fee;

        require(IERC20(token).transferFrom(msg.sender, recipient, amountAfterFee), "Transfer failed");
        require(IERC20(token).transferFrom(msg.sender, owner(), fee), "Fee transfer failed");
        emit TransferToken(msg.sender, recipient, token, amountAfterFee, fee);
    }

    /**
     * @dev Update the transfer fee.
     * @param newFeeBps The new fee in basis points.
     */
    function setFee(uint256 newFeeBps) external onlyOwner {
        require(newFeeBps <= MAX_FEE_BPS, "Fee exceeds maximum limit");
        feeBps = newFeeBps;
        emit FeeUpdated(newFeeBps);
    }

    // Emergency functions to pause and unpause the contract
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}

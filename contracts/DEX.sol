// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./IERC20.sol";
import "./ERC20Basic.sol";

contract DEX {
    event Transfer(uint256 amount, bool bought, address _id);

    address public _owner;
    IERC20 public token;

    constructor() {
        _owner = msg.sender;
        token = new ERC20Basic();
    }

    /**
     * buy funtion does accept an amount in ETH
     * and it mints the same amount of TKNs to the msg.sender
     **/

    function buy() public payable {
        // TKN tokens are mitned 1:1 with ETH. Will change it later
        uint256 amountTobuy = msg.value;

        require(amountTobuy > 0, "You need to send some Ether");

        token.mint(msg.sender, amountTobuy);
        emit Transfer(amountTobuy, true, msg.sender);
    }

    /**
     * sell funtion does accept an amount of TKNs
     * and then transfers the same amount of ETH to the msg.sender
     * After the successful trade it burns the TKNs
     **/

    function sell(uint256 amount) public {
        require(amount > 0, "You need to sell at least some tokens");
        uint256 allowance = token.allowance(msg.sender, address(this));
        require(allowance >= amount, "Check the token allowance");

        token.transferFrom(msg.sender, address(this), amount);
        payable(msg.sender).transfer(amount);

        token.burn(amount);
        emit Transfer(amount, false, msg.sender);
    }
}

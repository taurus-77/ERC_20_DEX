// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./IERC20.sol";
import "./ERC20Basic.sol";

    
contract DEX {
    using SafeMath for uint256;

    event Transfer(uint256 amount, bool bought, address _id);
    address public _owner;
    ERC20Basic public token;
    uint256 public tokenPrice = 1 ether;

    constructor () {
        _owner = msg.sender;
        token = new ERC20Basic();
    }
    
    /**
     * buy funtion does accept an amount in ETH
     * and it mints the number of TKNs to the msg.sender
     * according to the set price of TKNs'
     **/
    
    function buy() payable public {
        uint256 amountTobuy = msg.value; 
        
        // assumption: token always has fixed 18 decimals
		uint256 tokensToBuy = (amountTobuy * (10 ** 18)).div(tokenPrice);

        require(amountTobuy > 0, "You need to send some Ether");
    
        token.mint(msg.sender, tokensToBuy);
        emit Transfer(tokensToBuy, true, msg.sender);
    }
    
    /**
     * sell funtion does accept an amount of TKNs
     * and then transfers ETH to the msg.sender
     * according to the set price of TKNs' .
     * After the successful trade it burns the TKNs
     **/
    
    function sell(uint256 numberOfTokens) public {
        require(numberOfTokens > 0, "You need to sell at least some tokens");
        uint256 allowance = token.allowance(msg.sender, address(this));
        require(allowance >= numberOfTokens, "Check the token allowance");
        
        token.transferFrom(msg.sender, address(this), numberOfTokens);

        // assumption: token always has fixed 18 decimals
        uint256 totalAmount = tokenPrice.mul(numberOfTokens / (10 ** 18));
        
        // In case of failure it reverts the state of the txn
        payable(msg.sender).transfer(totalAmount); 

        token.burn(numberOfTokens);
        emit Transfer(numberOfTokens, false, msg.sender);
    }

    function getTokenAddress() public view returns (address) {
        return address(token);
    }
    
    function getTokenPrice() public view returns (uint256) {
        return tokenPrice;
    }

}

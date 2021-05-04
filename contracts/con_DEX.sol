// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IERC20_Extended {

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    
    function mint(address to, uint256 amount) external;
    function burn(uint256 amount) external;
}


contract ERC20Basic is IERC20_Extended {

    string public constant name = "ERC20_Extended";
    string public constant symbol = "TKN";
    uint8 public constant decimals = 18;
    
    
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Transfer(address indexed from, address indexed to, uint tokens);
    
    
    address private _owner;
    mapping(address => uint256) private _balances;
    
    mapping(address => mapping (address => uint256)) private _allowances;
    
    uint256 public _totalSupply = 0;
    
    using SafeMath for uint256;
    
    constructor() {
        _owner = msg.sender;
    }
    
    function totalSupply() public override view returns (uint256) {
        return _totalSupply;
    }
    
    function balanceOf(address tokenOwner) public override view returns (uint256) {
        return _balances[tokenOwner];
    }
    
    function transfer(address receiver, uint256 numTokens) public override returns (bool) {
        require(numTokens <= _balances[msg.sender]);
        _balances[msg.sender] = _balances[msg.sender].sub(numTokens);
        _balances[receiver] = _balances[receiver].add(numTokens);
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }
    
    function approve(address delegate, uint256 numTokens) public override returns (bool) {
        _allowances[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }
    
    function allowance(address owner, address delegate) public override view returns (uint) {
        return _allowances[owner][delegate];
    }
    
    function transferFrom(address owner, address buyer, uint256 numTokens) public override returns (bool) {
        require(numTokens <= _balances[owner]);
        require(numTokens <= _allowances[owner][msg.sender]);
    
        _balances[owner] = _balances[owner].sub(numTokens);
        _allowances[owner][msg.sender] = _allowances[owner][msg.sender].sub(numTokens);
        _balances[buyer] = _balances[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }
    
    function mint(address to, uint256 amount) public override {
        require(_owner == msg.sender, "Caller is not the owner");
        _mint(to, amount);
    }
    
    
    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: mint to the zero address");

        _totalSupply = _totalSupply.add(amount);
        _balances[account] = _balances[account].add(amount);
        emit Transfer(address(0), account, amount);
    }
    
    function burn(uint256 amount) public override {
        _burn(msg.sender, amount);
    }
    
    function _burn(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: burn from the zero address");
    
        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        _balances[account] = accountBalance.sub(amount);
        _totalSupply = _totalSupply.sub(amount);
    
        emit Transfer(account, address(0), amount);
    }    
    
}
    
library SafeMath {
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
      assert(b <= a);
      return a - b;
    }
    
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c;
    }
}
    
    
contract DEX {
    
    event Bought(uint256 amount);
    event Sold(uint256 amount);
    
    address public _owner;
    IERC20_Extended public token;
    
    
    constructor () {
        _owner = msg.sender;
        token = new ERC20Basic();
    }
    
    /**
     * buy funtion does accept an amount in ETH
     * and it mints the same amount of TKNs to the msg.sender
     **/
    
    function buy() payable public {
        // TKN tokens are mitned 1:1 with ETH. Will change it later
        uint256 amountTobuy = msg.value; 
    
        require(amountTobuy > 0, "You need to send some Ether");
    
        token.mint(msg.sender, amountTobuy);
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
    }

}


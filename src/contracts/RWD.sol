pragma solidity ^0.5.0;

contract RWD {

    string public name = "Reward Token"; 
    string public symbol = "RWD"; 
    uint256 public totalSupply = 1000000000000000000000000;
    uint8 public decimals = 18;

    //mapping
    mapping(address => uint256 ) public balanceOf; 
    mapping(address => mapping(address => uint256 )) public allowance; 
    constructor () public {
        balanceOf[msg.sender] = totalSupply; 
    }

    //Events 
    event Transfer(
        address indexed _from, 
        address indexed _to, 
        uint256 _amount
    ); 

    event Apporval(
        address indexed _owner, 
        address indexed _spender, 
        uint256 _amount
    ); 

    //functions

    function transfer(address _to, uint256 _amount) public returns(bool success){
        //require that the amount sent is avaialb
        require(balanceOf[msg.sender] >= _amount); 

        //Update Balaces 
        balanceOf[msg.sender] -= _amount; 
        balanceOf[_to] += _amount;

        //emit
        emit Transfer(msg.sender, _to, _amount);
        return true;
    }

    function approve(address _spender, uint256 _amount) public returns(bool success){
        allowance[msg.sender][_spender] = _amount; 
        emit Apporval(msg.sender, _spender, _amount);
        return true; 
    }

    //transfer from function
    function transferFrom(address _from,address _to,uint256 _amount) public returns(bool success){
        require(balanceOf[_from] >= _amount); 
        require(allowance[msg.sender][_from] >= _amount);

        balanceOf[_to] += _amount;
        allowance[msg.sender][_from] -= _amount; 

        emit Transfer(_from, _to, _amount);
        return true;

    }

}
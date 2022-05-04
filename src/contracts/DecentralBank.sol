pragma solidity ^0.5.0; 

import './Tether.sol';
import './RWD.sol';

contract DecentralBank {
    string public name = "Decentral Bank"; 
    address public owner;
    RWD public rwd; 
    Tether public tether;

    address[] public stakers;   
    //mapping for stakers balances 
    mapping(address => uint) public stakingBalance; 
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaked;

 

    constructor (RWD _rwd, Tether _tether) public {
        rwd = _rwd; 
        tether = _tether; 
        owner = msg.sender; 
    }


    //deposite tokens for staking
    function depositeTokens(uint _amount) public {
        require(_amount > 0, 'Amount Should Be Greater Than 0');
        tether.transferFrom(msg.sender, address(this), _amount); 
        stakingBalance[msg.sender] += _amount;  

        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }
        hasStaked[msg.sender] = true;
        isStaked[msg.sender] = true;
    }


    //issue tokens 

    function issueTokens() public {
        require(msg.sender == owner);

        for(uint i = 0; i < stakers.length; i++){
            address recipant = stakers[i]; 
            uint balance = stakingBalance[recipant] / 9; //for 11% ROI
           if(balance > 0){
               rwd.transfer(recipant, balance);
           }
        }

    }



    //unstaking tokens

    function unstake() public { 
        uint balance = stakingBalance[msg.sender]; 
        require(balance > 0); 
        tether.transfer(msg.sender, balance);
        stakingBalance[msg.sender] = 0;
        isStaked[msg.sender] = false; 
   
    }

}


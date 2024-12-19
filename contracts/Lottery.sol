//SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract Lottery{
    //entities-manager,player, winner
    address public manager;
    address payable[] public players;//allowed to receive ether with call.
    address payable public winner;//winner receives money, so payable address.

    constructor(){
        manager=msg.sender;
    }

    function participate() public payable{//ppl pay to enter lottery
        require(msg.value==1 ether, "Please pay 1 ether to enter!");//check if player has paid 1 ether.
        players.push(payable(msg.sender));//if paid, push him into players array, need that address added to be payable.
    }

    function getBalance() public view returns(uint){//function to see balance
        require(manager==msg.sender, "You are not the manager.");//check if manager is calling this function
        return address(this).balance;
    }

    function random() public view returns(uint){//function to random pick
        return uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, players.length)));
    }

    function pickWinner() public{
        require(manager==msg.sender, "Only manager can pick a winner, duh.");
        require(players.length >= 3, "Less than required number of players.");

        uint r = random();
        uint index = r%players.length;
        winner = players[index];
        winner.transfer(getBalance());
        players = new address payable[](0);//initialize players array back to 0
    } 
}
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Lock {
    uint public num;

    function setNum(uint _num)public{
        num = _num;
        console.log("Shalom");
    }
}

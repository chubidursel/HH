// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


contract Pool {
    
    struct Application {
        uint startAt;
        address who;
        bool completed;
        uint chance;
    }

    mapping (uint => Application) public applicationList;

    uint32 public activeApplication;


    function careateApplication (uint _hash, address _who) public {
    // require employer to create it OR create from apply SC?
        Application memory apl = Application(block.timestamp, _who, false, 50);
        applicationList[_hash] = apl;

        activeApplication++;
    }

    function checkApplication(uint _hash)public view returns(uint){
        return applicationList[_hash].chance;
    }


//----------------OBJECT----------
// struct? wht object is like how many people can apply what cahnces are needed etc.

// after Object appear candidate can automaticly get it according to they chances

// employer add obj and all users recive price


}

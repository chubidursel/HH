// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


contract Apply {
    
    struct Request {
        uint startAt;
        uint docId;
        bool completed;
    }

    mapping (address => Request) public requestList;

    uint32 public activeRequests;


    function doRequest (uint _docId) public {
    // check if this person already applied
        Request memory req = Request(block.timestamp, _docId, false);
        requestList[msg.sender] = req;
        activeRequests++;
    }

    function checkStatus()public view returns(bool){
        return requestList[msg.sender].completed;
    }

// employers who work with requests
 address [] public employers;

    function approveReq(address _applicantAddr) public {
        // check if this is an employer

        // Then he does some action and decide to approve candidate to move futher
        requestList[_applicantAddr].completed = true;
        activeRequests--;
    }

    function generateAppl(address _applicantAddr)public view returns(uint){
        require(requestList[_applicantAddr].completed, "The appl isnt done yet");
        
        //Generate applicantion number
        //send to next SC
        return(21);
    }

// ..... after applicant (candidate) has been approved then he move to next contranct where he gets into the pool with other ppl.
}

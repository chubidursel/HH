// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract ZkEasyWallet {

    event EtherReleased(address indexed user, uint256 amount);
    event UserAdded(address indexed user, uint256 share);
    event NewProposal(address who, uint256 when);
    event Voted(address who, uint256 when, bool votedYes);


    constructor(address[] memory payees, uint256[] memory shares_) payable {
        require(payees.length == shares_.length, "PaymentSplitter: payees and shares length mismatch");
        require(payees.length > 0, "PaymentSplitter: no payees");

        for (uint256 i = 0; i < payees.length; i++) {
            _addUser(payees[i], shares_[i]);
        }

        ProposalCounter = 1;
    }

    struct User {
        uint256 share;
        uint256 releasedAmount;
    }

    modifier onlyUser() {
        require(users[msg.sender].share > 0, "User does not exist");
        _;
    }


    mapping(address => User) public users;
    address[] public userAddresses;

    uint256 public totalShares;
    uint256 public totalReleased;

    function release() external onlyUser {
        
        uint256 unreleasedAmount = releasable(msg.sender);

        uint256 amountToRelease = unreleasedAmount - users[msg.sender].releasedAmount;

        require(amountToRelease != 0, "Account is not due payment");

        users[msg.sender].releasedAmount += amountToRelease;  // Increment the released amount

        totalReleased += amountToRelease;

        payable(msg.sender).transfer(amountToRelease);

        emit EtherReleased(msg.sender, amountToRelease);
    }

    function releasable(address user) public view returns (uint256) {
        uint256 additionalFunds = address(this).balance - totalReleased;
        uint256 updatedUnreleasedAmount = (users[user].share * additionalFunds) / totalShares;
        return updatedUnreleasedAmount + users[user].releasedAmount;
    }

    function getBalanceETH() public view returns(uint256){
        return address(this).balance;
    }

     receive() external payable {}

    //------------------- VOTE SYSTEM ---------------
    struct Proposal {
        address proposer;
        address userAddress;
        uint userShare;
        uint256 votingPower;
        bool isAdd; //add or delete
        bool executed;
        uint256 up;
        uint256 down;
        uint256 endTime;
        mapping(address => bool) voted;
    }

    bool public ACTIVE_VOTING; // <- cant create a new proposl if there is an active one
    
    uint32 public ProposalCounter;

    mapping(uint32 => Proposal) public proposals; // ID -> Proposal

    uint256 public quorumThreshold = 70;
    uint256 public minVotePeriod = 1 days;

    function createProposal(address _userAddress, bool _isAdd, uint256 endTimeDays, uint _userShare) external onlyUser {
        //require(users[_userAddress].share == 0, "User already exists");
        require(ACTIVE_VOTING, "Only one voting allowed");
        //require(proposals[ProposalCounter].endTime == 0, "A proposal for this user already exists");

        // uint256 votingPower = users[msg.sender].share; ?? 

        Proposal storage newProposal = proposals[ProposalCounter];
        newProposal.proposer =  msg.sender;
        newProposal.isAdd = _isAdd;
        if(_isAdd)  newProposal.userShare = _userShare;
        newProposal.userAddress = _userAddress;
        newProposal.endTime = block.timestamp + endTimeDays * 86400;
       
        ProposalCounter ++;

        emit NewProposal(msg.sender, block.timestamp);
     }

    function vote(uint32 _id, bool _approve) external onlyUser(){
        Proposal storage p = proposals[_id];
        require(p.endTime > 0, "No proposal exists for this user");
         require(!proposals[_id].voted[msg.sender], "You have already voted on this Proposal");

        p.voted[msg.sender] = true;

        if (_approve) {
           p.up++;
        } else {
           p.down++;
        }
    emit Voted(msg.sender, block.timestamp, _approve);
    }


    function executeProposal(uint32 _id) external onlyUser {
        Proposal storage p = proposals[_id];
        require(p.endTime > 0, "No proposal exists for this user");
        require(!p.executed, "Proposal has already been executed");
        require(block.timestamp >= p.endTime, "Proposal has not yet ended");

        uint256 totalVotes = p.up + p.down;
        uint256 minVotes = (totalShares * quorumThreshold) / 100;
        
        bool quorumReached = (totalVotes >= minVotes);
   
        if (quorumReached) {
            if (p.isAdd) {
                _addUser(p.userAddress, p.userShare);
            } else {
                _deleteUser(p.userAddress);
            }
        }

        p.executed = true;
    }

// ----------------------- ADD or DELETE -------------------------
        function _addUser(address _user, uint256 _share) private {
        require(_user != address(0), "Invalid user address");
        // require(_share > 0, "Invalid share value");
        // require(users[_user].share == 0, "User already exists");

        users[_user].share = _share;
        userAddresses.push(_user);
        totalShares += _share;

        emit UserAdded(_user, _share);
    }

    function _deleteUser(address _user) private {

        totalShares -= users[_user].share;
        totalReleased -= users[_user].releasedAmount;
        delete users[_user];

        for (uint256 i = 0; i < userAddresses.length; i++) {
            if (userAddresses[i] == _user) {
                userAddresses[i] = userAddresses[userAddresses.length - 1];
                userAddresses.pop();
                break;
            }
        }
    }
}
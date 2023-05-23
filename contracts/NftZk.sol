// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZkEasyNFT is ERC721Enumerable, Ownable {
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    using Strings for uint256;

    string private imageFolder = "QmY14K9L3pfZbbFwDghZX2j9fZVF9cRsz9rBuTEFxMYZbY/";
    
    mapping(uint256 => uint256) public _tokenLevels;
    uint8 public MAX_LEVEL = 5;
    uint public price = 1000000000000000; // 0.001ETH
    
    constructor() ERC721("ZkEasy", "ZKE") {}
    
    function mintNFT(uint256 level) public payable returns (uint256) {
        require(level > 0 && level <= MAX_LEVEL, "Invalid level");
        require(msg.value >= price, "Pay Up");
        require(getMyLevel() + 1 == level, "You cant skip the levels");
        require(balanceOf(msg.sender) <= MAX_LEVEL, "Maximum NFTs minted");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        _tokenLevels[newItemId] = level;
        return newItemId;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        uint256 level = _tokenLevels[tokenId];
        require(level > 0 && level <= 5, "Invalid level");
        string memory baseURI = "ipfs://";
        string memory levelStr = level.toString();
        string memory imageCID = string(abi.encodePacked(imageFolder, levelStr, ".json"));
        return string(abi.encodePacked(baseURI, imageCID));
    }

    function getMyLevel() public view returns (uint256) {
        uint256 myLevel = 0;
        uint256 balance = balanceOf(msg.sender);
        if (balance > 0) {
            uint256 lastTokenId = tokenOfOwnerByIndex(msg.sender, balance - 1);
            if (_exists(lastTokenId)) {
                myLevel = _tokenLevels[lastTokenId];
            }
        }
        return myLevel;
    }
    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(balanceETH());
    }
    function balanceETH() public view returns(uint256){
        return address(this).balance;
    }
}
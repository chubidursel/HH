// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@layerzerolabs/solidity-examples/contracts/interfaces/ILayerZeroEndpoint.sol";
import "@layerzerolabs/solidity-examples/contracts/interfaces/ILayerZeroReceiver.sol";

import "@layerzerolabs/solidity-examples/contracts/lzApp/NonblockingLzApp.sol";


error NotTokenOwner();
error InsufficientGas();
error SupplyExceeded();

error InvalidToken();

contract ZkEasyNFT is ERC721Enumerable, Ownable, NonblockingLzApp {

    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    

    string private imageFolder = "QmY14K9L3pfZbbFwDghZX2j9fZVF9cRsz9rBuTEFxMYZbY/";
    
    mapping(uint256 => uint256) public _tokenLevels;
    uint8 public MAX_LEVEL = 5;

    // constructor() ERC721("ZkEasy", "ZKE") {}
    constructor(address _endpoint) ERC721("ZkEasy", "ZKE") NonblockingLzApp(_endpoint) payable {}
   
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (_exists(tokenId)) revert InvalidToken();
    
        uint256 level = _tokenLevels[tokenId];
        if (level > 0 && level <= 5) revert InvalidToken();
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

    // ------- CROSS-CHAIN FUNCTION ------------
    uint256 public counterLZ;

    event ReceivedNFT(
        uint16 _srcChainId,
        address _from,
        uint256 _tokenId,
        uint256 counterLZ
    );

    function crossChain(uint16 dstChainId, uint256 tokenId) public payable {
        if (msg.sender != ownerOf(tokenId)) revert NotTokenOwner();

        // Remove NFT on current chain
        unchecked {
            --counterLZ;
        }
        _burn(tokenId);

        bytes memory payload = abi.encode(msg.sender, tokenId);
        uint16 version = 1;
        uint256 gasForLzReceive = 350000;
        bytes memory adapterParams = abi.encodePacked(version, gasForLzReceive);

        (uint256 messageFee, ) = lzEndpoint.estimateFees(
            dstChainId,
            address(this),
            payload,
            false,
            adapterParams
        );
        if (msg.value <= messageFee) revert InsufficientGas();

        _lzSend(
            dstChainId,
            payload,
            payable(msg.sender),
            address(0x0),
            adapterParams,
            msg.value
        );
    }


function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64 /*_nonce*/,
        bytes memory _payload
    ) internal override {
        address from;
        assembly {
            from := mload(add(_srcAddress, 20))
        }
        (address toAddress, uint256 tokenId) = abi.decode(
            _payload,
            (address, uint256)
        );

        _mint(toAddress, tokenId);
        unchecked {
            ++counterLZ;
        }
        emit ReceivedNFT(_srcChainId, from, tokenId, counterLZ);
    }

    // Endpoint.sol estimateFees() returns the fees for the message
    function estimateFees(
        uint16 dstChainId,
        uint256 tokenId
    ) external view returns (uint256) {
        bytes memory payload = abi.encode(msg.sender, tokenId);
        uint16 version = 1;
        uint256 gasForLzReceive = 350000;
        bytes memory adapterParams = abi.encodePacked(version, gasForLzReceive);

        (uint256 messageFee, ) = lzEndpoint.estimateFees(
            dstChainId,
            address(this),
            payload,
            false,
            adapterParams
        );
        return messageFee;
    }

    // CUSTOM FUNC 
  function trustAddr(address _otherContract, uint16 _dst) public onlyOwner{
       trustedRemoteLookup[_dst] = abi.encode(_otherContract, address(this));
   }
}
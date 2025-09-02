// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title RepuCastSBT
 * @dev Soulbound Token (Non-transferable NFT) for RepuCast reputation attestations
 * This contract mints reputation badges that prove a user's on-chain credibility
 */
contract RepuCastSBT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Mapping from address to token ID (one SBT per address)
    mapping(address => uint256) public userTokenId;
    
    // Mapping to track if address has minted
    mapping(address => bool) public hasMinted;
    
    // Minimum reputation score required to mint
    uint256 public constant MIN_REPUTATION_SCORE = 35;
    
    // Reputation scores for minted tokens
    mapping(uint256 => uint256) public tokenReputationScore;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    // Events
    event ReputationBadgeMinted(address indexed to, uint256 tokenId, uint256 reputationScore);
    
    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) ERC721(name, symbol) {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Mint a reputation badge to the caller
     * @param reputationScore The user's calculated reputation score
     */
    function mintReputationBadge(uint256 reputationScore) external {
        require(reputationScore >= MIN_REPUTATION_SCORE, "Insufficient reputation score");
        require(!hasMinted[msg.sender], "Already minted a reputation badge");
        require(balanceOf(msg.sender) == 0, "Address already owns a badge");
        
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        _safeMint(msg.sender, tokenId);
        
        userTokenId[msg.sender] = tokenId;
        hasMinted[msg.sender] = true;
        tokenReputationScore[tokenId] = reputationScore;
        
        emit ReputationBadgeMinted(msg.sender, tokenId, reputationScore);
    }
    
    /**
     * @dev Owner can mint badges for specific users (for manual attestations)
     */
    function ownerMintBadge(address to, uint256 reputationScore) external onlyOwner {
        require(!hasMinted[to], "Address already has a badge");
        require(balanceOf(to) == 0, "Address already owns a badge");
        
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        _safeMint(to, tokenId);
        
        userTokenId[to] = tokenId;
        hasMinted[to] = true;
        tokenReputationScore[tokenId] = reputationScore;
        
        emit ReputationBadgeMinted(to, tokenId, reputationScore);
    }
    
    /**
     * @dev Get reputation score for a token
     */
    function getTokenReputationScore(uint256 tokenId) external view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        return tokenReputationScore[tokenId];
    }
    
    /**
     * @dev Get user's reputation score by address
     */
    function getUserReputationScore(address user) external view returns (uint256) {
        require(hasMinted[user], "User has not minted a badge");
        uint256 tokenId = userTokenId[user];
        return tokenReputationScore[tokenId];
    }
    
    /**
     * @dev Check if user has a reputation badge
     */
    function hasReputationBadge(address user) external view returns (bool) {
        return hasMinted[user];
    }
    
    /**
     * @dev Override transfer functions to make tokens soulbound (non-transferable)
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        require(from == address(0) || to == address(0), 
                "Soulbound tokens cannot be transferred");
        super._beforeTokenTransfer(from, to, tokenId);
    }
    
    /**
     * @dev Override approve to prevent approvals (since tokens can't be transferred)
     */
    function approve(address, uint256) public pure override {
        revert("Soulbound tokens cannot be approved for transfer");
    }
    
    /**
     * @dev Override setApprovalForAll to prevent approvals
     */
    function setApprovalForAll(address, bool) public pure override {
        revert("Soulbound tokens cannot be approved for transfer");
    }
    
    /**
     * @dev Update base URI (only owner)
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Return base URI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev Get total number of minted badges
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    /**
     * @dev Emergency function to upgrade a user's reputation score
     * (only owner, for manual attestations or corrections)
     */
    function updateReputationScore(uint256 tokenId, uint256 newScore) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        require(newScore >= MIN_REPUTATION_SCORE, "Score below minimum threshold");
        
        tokenReputationScore[tokenId] = newScore;
    }
}

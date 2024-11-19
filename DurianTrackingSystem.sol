// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DurianTracking {
    address public owner;
    mapping(address => bool) public authorizedRetailers;

    struct Durian {
        uint256 id;
        string variety;
        uint256 price; // in wei
        uint256 weight;
        uint256 harvestTime;
        uint256 ripenTime;
        string status;
        address owner;
        bool active;
    }

    mapping(uint256 => Durian) public durians;
    uint256[] public durianIds; // Array to keep track of all Durian IDs

    mapping(uint256 => address) public durianRetailers;

    // Events
    event DurianAdded(
        uint256 id,
        string variety,
        uint256 price,
        uint256 weight,
        uint256 harvestTime,
        uint256 ripenTime
    );
    event DurianPurchased(uint256 id, address buyer, uint256 price);
    event TimeLockCanceled(uint256 id);
    event TimeLockModified(uint256 id, uint256 newRipenTime);

    // Modifiers
    modifier onlyAuthorizedRetailer() {
        require(
            authorizedRetailers[msg.sender],
            "Not authorized to add durians"
        );
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only admin can authorize retailers");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function authorizeRetailer(address _retailer) public onlyOwner {
        authorizedRetailers[_retailer] = true;
    }

    function checkAuthorization(address _retailer) public view returns (bool) {
        return authorizedRetailers[_retailer];
    }

    function revokeRetailer(address _retailer) public onlyOwner {
        require(msg.sender == owner, "Only the owner can revoke retailers");
        authorizedRetailers[_retailer] = false;
    }

    function addDurian(
        uint256 _id,
        string memory _variety,
        uint256 _price,
        uint256 _weight,
        uint256 _harvestTime,
        uint256 _ripenTime
    ) public onlyAuthorizedRetailer {
        require(
            _harvestTime < _ripenTime,
            "Harvest time must be before ripen time"
        );
        require(
            durians[_id].id == 0 || durians[_id].id == _id,
            "Durian with this ID already exists"
        );

        string memory initialStatus = block.timestamp >= _ripenTime
            ? "available"
            : "locked";

        durians[_id] = Durian({
            id: _id,
            variety: _variety,
            price: _price,
            weight: _weight,
            harvestTime: _harvestTime,
            ripenTime: _ripenTime,
            status: initialStatus,
            owner: address(0),
            active: true
        });

        durianRetailers[_id] = msg.sender;
        durianIds.push(_id); // Add the new Durian ID to the array

        emit DurianAdded(
            _id,
            _variety,
            _price,
            _weight,
            _harvestTime,
            _ripenTime
        );
    }

    function releaseDurian(uint256 _id) public {
        Durian storage durian = durians[_id];
        require(durian.active, "Durian is not active or already released");
        require(
            block.timestamp >= durian.ripenTime,
            "Ripen time has not been reached"
        );

        durian.status = "available";
        durian.active = false;
    }

    function cancelTimeLock(uint256 _id) public onlyOwner {
        Durian storage durian = durians[_id];
        require(durian.active, "Durian is not active or already released");
        require(
            block.timestamp < durian.ripenTime,
            "Cannot cancel after ripen time"
        );

        durian.status = "cancelled";
        durian.active = false; // Deactivate the lock

        emit TimeLockCanceled(_id);
    }

    function modifyTimeLock(uint256 _id, uint256 _newRipenTime)
        public
        onlyOwner
    {
        require(durians[_id].id != 0, "Durian not found");
        Durian storage durian = durians[_id];
        require(durian.active, "Durian is not active or already released");
        require(
            _newRipenTime > block.timestamp,
            "New ripen time must be in the future"
        );

        durian.ripenTime = _newRipenTime;

        emit TimeLockModified(_id, _newRipenTime);
    }

    function getDurian(uint256 _id) public view returns (Durian memory) {
        require(durians[_id].id != 0, "Durian not found");
        return durians[_id];
    }

    function getDurianIds() public view returns (uint256[] memory) {
        return durianIds;
    }

    function purchaseDurian(uint256 _id) public payable {
        Durian storage durian = durians[_id];

        require(
            keccak256(abi.encodePacked(durian.status)) ==
                keccak256(abi.encodePacked("available")),
            "Durian is not available for purchase"
        );
        require(msg.value == durian.price, "Incorrect payment amount");
        require(block.timestamp >= durian.ripenTime, "Durian is not ripe yet");

        durian.status = "sold";
        durian.owner = msg.sender;

        address retailer = durianRetailers[_id];
        require(retailer != address(0), "Retailer address not set");

        payable(retailer).transfer(msg.value);

        emit DurianPurchased(_id, msg.sender, durian.price);
    }

    receive() external payable {}

    fallback() external payable {}
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract backup {

    mapping(address => string) private userBackupMap;

    function setBackupData(address key, string memory backup) public {
        userBackupMap[key]=backup;
        
    }

    function getBackupData(address key) public view returns (string memory){
        return userBackupMap[key];

    }

}
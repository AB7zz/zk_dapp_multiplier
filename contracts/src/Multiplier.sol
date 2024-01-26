// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

// Interface to PlonkVerifier.sol
interface IPlonkVerifier {
    function verifyProof(uint256[24] calldata _proof, uint256[1] calldata _pubSignals) external view returns (bool);
}

contract SimpleMultiplier {
    address public s_plonkVerifierAddress;

    event ProofResult(bool result);

    constructor(address plonkVerifierAddress) {
        s_plonkVerifierAddress = plonkVerifierAddress;
    }

    // ZK proof is generated in the browser and submitted as a transaction w/ the proof as bytes.
    function submitProof(uint256[24] calldata proof, uint256[1] calldata pubSignals) public returns (bool) {
        bool result = IPlonkVerifier(s_plonkVerifierAddress).verifyProof(proof, pubSignals);
        emit ProofResult(result);
        return result;
    }
}
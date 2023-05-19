import { Wallet } from "zksync-web3";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

import dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
console.log('private key:', PRIVATE_KEY)
export default async function (hre: HardhatRuntimeEnvironment) {
    const wallet = new Wallet(PRIVATE_KEY);
    const deployer = new Deployer(hre, wallet);

    // //Entry Point
    // console.log(`Deploying EntryPoint`);
    // const entryPoint = await deployer.loadArtifact("EntryPoint");
    // const entryPointContract = await deployer.deploy(entryPoint, []);
    // console.log(
    //     "constructor args:" + entryPointContract.interface.encodeDeploy([])
    // );
    // console.log(`${entryPoint.contractName} : ${entryPointContract.address}`);
    const entryPoint = '0x79bB68F405b3960f21EE21762aDE78c80eDfF933'

    //SmartAccount
    console.log(`Deploying SmartAccount for basicImplementation`);
    const smartAccount = await deployer.loadArtifact("SmartAccount");
    const smartAccountContract = await deployer.deploy(smartAccount, [entryPoint]);
    console.log(
        "constructor args:" + smartAccountContract.interface.encodeDeploy([entryPoint])
    );
    console.log(`${smartAccount.contractName} : ${smartAccountContract.address}`);

    //Factory
    console.log(`Deploying Factory`);
    const fatory = await deployer.loadArtifact("SmartAccountFactory");
    const fatoryContract = await deployer.deploy(fatory, [smartAccountContract.address]);
    console.log(
        "constructor args:" + fatoryContract.interface.encodeDeploy([smartAccountContract.address])
    );
    console.log(`${fatory.contractName} : ${fatoryContract.address}`);

    // Save deployed contract addresses to a file
    const fs = require("fs");
    const deployedAddresses = {
        entryPoint,
        smartAccount: smartAccountContract.address,
        factory: fatoryContract.address,
    };
    fs.writeFileSync("deployed_addresses.json", JSON.stringify(deployedAddresses, null, 2));

    //verify
    console.log('verifying...')
    const verifySmarAccountId = await hre.run("verify:verify", {
        address: smartAccountContract.address,
        contract: 'contracts/smart-contract-wallet/SmartAccount.sol:SmartAccount',
        constructorArguments: [entryPoint]
    });

    const verifyFactoryId = await hre.run("verify:verify", {
        address: fatoryContract.address,
        contract: 'contracts/smart-contract-wallet/SmartAccountFactory.sol:SmartAccountFactory',
        constructorArguments: [smartAccountContract.address]
    });
    console.log('verifySmarAccountId', verifySmarAccountId)
    console.log('verifyFactoryId', verifyFactoryId)
}

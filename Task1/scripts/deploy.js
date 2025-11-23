const hre = require("hardhat")

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    const initialSupply = 10000;

    console.log(
        "Deploying contract with the account: ",
        deployer.address,
    );

    const TokenFactory = await hre.ethers.getContractFactory("AwwToken");

    const awwToken = await TokenFactory.deploy(
        deployer.address,
        deployer.address,
        initialSupply
    );

    await awwToken.waitForDeployment();

    const deployedAddress = await awwToken.getAddress();

    console.log(
        `AwwToken with supply = $initialSupply deployed to: `,
        deployedAddress
    );

}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
})
const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = function(amount) {
    return ethers.parseEther(amount.toString());
}

describe("AwwToken", function () {
    let AwwToken, awwToken, sender, receiver1, receiver2;
    const initialSupply = 10000;

    const checkAddressBalance = async function (address, expectedBalance) {
        const addressBalance = await awwToken.balanceOf(address);
        expect(addressBalance).to.equal(expectedBalance);
    }

    const checkTransaction = async function (sender, receiver, amountToSend) {
        const amountInWei = toWei(amountToSend);
        await awwToken.connect(sender).transfer(receiver.address, amountInWei);

        checkAddressBalance(receiver.address, amountInWei);

        const expectedSenderBalance = toWei((initialSupply - amountToSend).toString());
        checkAddressBalance(sender.address, expectedSenderBalance);
    }

    /////////////////////////////////////////////////////////////////////////////////////

    this.beforeEach(async function () {
        [sender, receiver1, receiver2] = await ethers.getSigners();

        AwwToken = await ethers.getContractFactory("AwwToken");
        awwToken = await AwwToken.deploy(sender.address, sender.address, initialSupply);

        await awwToken.waitForDeployment();
    });

    it("Should deploy and give initialSupply to sender", async function () {
        checkAddressBalance(sender.address, toWei(initialSupply));
    });

    it ("Should transfer tokens to receiver1 correctly", () => checkTransaction(sender, receiver1, 20));

    it ("Should transfer tokens to receiver2 correctly", () => checkTransaction(sender, receiver2, 50));
});
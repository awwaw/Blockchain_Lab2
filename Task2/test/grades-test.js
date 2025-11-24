const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GradesCalculator", function () {
  let gradesCalculator, professor, student1, student2, nonProfessor;

  beforeEach(async function () {
    [professor, student1, student2, nonProfessor] = await ethers.getSigners();
    
    const GradesCalculator = await ethers.getContractFactory("GradesCalculator");

    gradesCalculator = await GradesCalculator.connect(professor).deploy();
    await gradesCalculator.waitForDeployment();
  });

  it("Test Case 1: Standard passing student with a final exam", async function () {
    const grades = [8, 8, 8, 8, 8, 8, 7, 9];
    await gradesCalculator.connect(professor).setGrades(student1.address, grades);
    await gradesCalculator.connect(professor).computeFinalGrade(student1.address);

    expect(await gradesCalculator.getFinalGrades(student1.address)).to.equal(9);
  });

  it("Test Case 2: Student passes based on intermediate grade, no final exam", async function () {
    const grades = [7, 7, 7, 7, 7, 7, 6, 0];
    await gradesCalculator.setGrades(student1.address, grades);
    await gradesCalculator.connect(professor).computeFinalGrade(student1.address);

    expect(await gradesCalculator.getFinalGrades(student1.address)).to.equal(7);
  });

  it("Test Case 3: Student fails based on intermediate grade, no final exam", async function () {
    const grades = [5, 5, 5, 5, 5, 5, 4, 0];
    await gradesCalculator.setGrades(student1.address, grades);
    await gradesCalculator.connect(professor).computeFinalGrade(student1.address);

    expect(await gradesCalculator.getFinalGrades(student1.address)).to.equal(0);
  });

  it("Test Case 4: Grade calculation is capped at 10", async function () {
    const grades = [10, 10, 10, 10, 10, 10, 10, 10];
    await gradesCalculator.setGrades(student1.address, grades);
    await gradesCalculator.connect(professor).computeFinalGrade(student1.address);
    expect(await gradesCalculator.getFinalGrades(student1.address)).to.equal(10);
  });

  it("Test Case 5: A non-professor cannot set grades", async function () {
    const grades = [5, 5, 5, 5, 5, 5, 5, 5];
    await expect(
      gradesCalculator.connect(nonProfessor).setGrades(student1.address, grades)
    ).to.be.revertedWith("Only professor can do this");
  });
});
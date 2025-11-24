// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/utils/math/Math.sol";

contract GradesCalculator {
    address public professor;

    mapping(address => uint8[8]) private studentGrades;

    mapping(address => uint) private finalGrades;

    modifier onlyProfessor() {
        require(msg.sender == professor, "Only professor can do this");
        _;
    }

    constructor() {
        professor = msg.sender;
    }

    function getStudentGrades(address student) public view returns (uint8[8] memory) {
        return studentGrades[student];
    }

    function getFinalGrades(address student) public view returns (uint) {
        return finalGrades[student];
    }

    function setGrades(address student, uint8[8] memory grades) public onlyProfessor {
        for (uint i = 0; i < grades.length; i++) {
            require(grades[i] <= 10, "Student grade can't be higher than 10"); // I suppose so, given that intermediate <= 10
        }

        studentGrades[student] = grades;
    }

    function computeFinalGrade(address student) public onlyProfessor {
        uint8[8] memory grades = studentGrades[student];

        uint a = Math.max(grades[0] + grades[1], 2 * grades[6]);
        uint b = a + grades[2] + grades[3] + grades[4] + grades[5];
        uint c = 6;

        uint rounded = (b + (c / 2)) / c;
        uint intermediate = Math.min(rounded, 10);

        uint finalGrade;
        uint exam = grades[7];

        if (exam > 0) {
            uint a = (4 * intermediate) + (6 * exam);
            uint roundedFinal = (a + 5) / 10;
            finalGrade = Math.min(10, roundedFinal);
        } else {
            if (intermediate >= 6) {
                finalGrade = intermediate;
            } else {
                finalGrade = 0;
            }
        }

        
        finalGrades[student] = finalGrade;
    }
}
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  
  ga('create', 'UA-59096110-1', 'auto');
  ga('send', 'pageview');
  describe("SudokuSolver", function() {
    var INVALID_PUZZLE,
        COLUMN_INVALID_PUZZLE,
        BOX_INVALID_PUZZLE,
        EMPTY_PUZZLE,
        SOLVED_PUZZLE,
        EASY_PUZZLE,
        MEDIUM_PUZZLE,
        HARD_PUZZLE;
  
    beforeEach(function() {
      INVALID_PUZZLE = "1-5812----9--764-52--4--819-19--73-6762-83-9-----61-5---76---3-43--2-5-16--3-89--";
      COLUMN_INVALID_PUZZLE = "1958-2----9--764-52--4--819-19--73-6762-83-9-----61-5---76---3-43--2-5-16--3-89--";
      BOX_INVALID_PUZZLE = "1-58-2----9--764-52--4--819-19--73-6762-83-9-----61-5---76---3-43--2-5-167-3-89--";
      EMPTY_PUZZLE = "---------------------------------------------------------------------------------";
      SOLVED_PUZZLE = "12345678945678912378912345621436589736589721489721436553164297864297853197853164";
      EASY_PUZZLE = "1-58-2----9--764-52--4--819-19--73-6762-83-9-----61-5---76---3-43--2-5-16--3-89--";
      MEDIUM_PUZZLE = "-3-5--8-45-42---1---8--9---79-8-61-3-----54---5------78-----7-2---7-46--61-3--5--";
      HARD_PUZZLE = "8----------36------7--9-2---5---7-------457-----1---3---1----68--85---1--9----4--";
    });
  
    describe("solve", function() {
      describe("for an invalid board", function() {
        it("returns false", function() {
          expect(SudokuSolver.solve(INVALID_PUZZLE)).toEqual(false);
        });
      });
  
      describe("for a valid board", function() {
        it("returns an 81 charcter string with only numbers", function() {
          expect(SudokuSolver.solve(EASY_PUZZLE)).toMatch(/[1-9]{81}/)
        });
      });
    });
  
    describe("solveAndPrint", function() {
      it("prints the solved board to the console", function () {
          spyOn(console, 'log');
          SudokuSolver.solveAndPrint(EASY_PUZZLE);
          expect(console.log.calls.first().args[0]).toMatch(/((([1-9] )+[1-9])\n){8}([1-9] )+[1-9]/);
      });
  
      it("returns an 81 charcter string with only numbers", function() {
        expect(SudokuSolver.solveAndPrint(EASY_PUZZLE)).toMatch(/[1-9]{81}/);
      });
    });
  
    describe("recursiveSolve", function() {
      it("returns an 81 charcter string with only numbers given a valid board", function() {
        expect(SudokuSolver.recursiveSolve(EASY_PUZZLE)).toMatch(/[1-9]{81}/);
      });
    });
  
    describe("boardIsInvalid", function() {
      it("returns true when the board has duplicates in row, column or box", function() {
        var boardArray = INVALID_PUZZLE.split("");
        expect(SudokuSolver.boardIsInvalid(boardArray)).toEqual(true);
      });
  
      it("returns false when the board has no duplicates in row, column or box", function() {
        var boardArray = EASY_PUZZLE.split("");
        expect(SudokuSolver.boardIsInvalid(boardArray)).toEqual(false);
      });
    });
  
    describe("boardIsValid", function() {
      it("returns true when the board has no duplicates in row, column or box", function() {
        var boardArray = EASY_PUZZLE.split("");
        expect(SudokuSolver.boardIsValid(boardArray)).toEqual(true);
      });
  
      it("returns false when the board has no duplicates in row, column or box", function() {
        var boardArray = INVALID_PUZZLE.split("");
        expect(SudokuSolver.boardIsValid(boardArray)).toEqual(false);
      });
    });
  
    describe("boardIsSolved", function() {
      it("returns true when the board contains only numbers", function() {
        var boardArray = SOLVED_PUZZLE.split("");
        expect(SudokuSolver.boardIsSolved(boardArray)).toEqual(true);
      });
  
      it("returns false when the board contains only numbers", function() {
        var boardArray = EASY_PUZZLE.split("");
        expect(SudokuSolver.boardIsSolved(boardArray)).toEqual(false);
      });
    });
  
    describe("getNextCellAndPossibilities", function() {
      it("returns an object with an integer and subarray", function() {
        var boardArray = EMPTY_PUZZLE.split("");
        expect(SudokuSolver.getNextCellAndPossibilities(boardArray)).toEqual({index: 0, choices: ['1', '2', '3', '4', '5', '6', '7', '8', '9']});
      });
  
      it("returns the index of the next empty cell with the remaining possibilities for that cell", function() {
        var boardArray = EASY_PUZZLE.split("");
        expect(SudokuSolver.getNextCellAndPossibilities(boardArray)).toEqual({index: 1, choices: ['4', '7']});
      });
    });
  
    describe("getAllIntersections", function() {
      beforeEach(function(){
        jasmine.addMatchers({
          toContainNumbers: function() {
            return {
              compare: function(actualCollection, expectedNumbers) {
                var set = actualCollection.reduce(function(obj, el) {
                  obj[el] = true;
                  return obj;
                }, {});
                var allExpectedNumsInSet = expectedNumbers.reduce(function(numbersExist, num) {
                  return !!(numbersExist && set[num]);
                }, true);
                return {pass: allExpectedNumsInSet};
              }
            }
          }
        });
      });
  
      it("returns the values already in an index's row, column and box", function() {
        var boardArray = EASY_PUZZLE.split("");
        expect(SudokuSolver.getAllIntersections(boardArray, 1)).toContainNumbers(["1", "5", "8", "2", "9", "6", "3"]);
      });
    });
  
    describe("allRowsValid", function() {
      it("returns true when every digit in each row is unique", function() {
        var boardArray = EASY_PUZZLE.split("");
        expect(SudokuSolver.allRowsValid(boardArray)).toEqual(true);
      });
  
      it("returns false when there are any duplicate values on any row", function() {
        var boardArray = INVALID_PUZZLE.split("");
        expect(SudokuSolver.allRowsValid(boardArray)).toEqual(false);
      });
    });
  
    describe("getRow", function() {
      it("returns the row for the given index", function() {
        var boardArray = EASY_PUZZLE.split("");
        expect(SudokuSolver.getRow(boardArray, 0)).toEqual(["1", "-", "5", "8", "-", "2", "-", "-", "-"]);
        expect(SudokuSolver.getRow(boardArray, 8)).toEqual(["1", "-", "5", "8", "-", "2", "-", "-", "-"]);
        expect(SudokuSolver.getRow(boardArray, 9)).toEqual(["-", "9", "-", "-", "7", "6", "4", "-", "5"]);
        expect(SudokuSolver.getRow(boardArray, 80)).toEqual(["6", "-", "-", "3", "-", "8", "9", "-", "-"]);
      });
    });
  
    describe("allColumnsValid", function() {
      it("returns true when every digit in each column is unique", function() {
        var boardArray = EASY_PUZZLE.split("");
        expect(SudokuSolver.allColumnsValid(boardArray)).toEqual(true);
      });
  
      it("returns false when there are any duplicate values on any column", function() {
        var boardArray = COLUMN_INVALID_PUZZLE.split("");
        expect(SudokuSolver.allColumnsValid(boardArray)).toEqual(false);
      });
    });
  
    describe("getColumn", function() {
      it("returns the column for the given index", function() {
        var boardArray = EASY_PUZZLE.split("");
        expect(SudokuSolver.getColumn(boardArray, 0)).toEqual(["1", "-", "2", "-", "7", "-", "-", "4", "6"]);
        expect(SudokuSolver.getColumn(boardArray, 9)).toEqual(["1", "-", "2", "-", "7", "-", "-", "4", "6"]);
        expect(SudokuSolver.getColumn(boardArray, 1)).toEqual(["-", "9", "-", "1", "6", "-", "-", "3", "-"]);
        expect(SudokuSolver.getColumn(boardArray, 80)).toEqual(["-", "5", "9", "6", "-", "-", "-", "1", "-"]);
      });
    });
  
    describe("allBoxesValid", function() {
      it("returns true when every digit in each box is unique", function() {
        var boardArray = EASY_PUZZLE.split("");
        expect(SudokuSolver.allBoxesValid(boardArray)).toEqual(true);
      });
  
      it("returns false when there are any duplicate values on any box", function() {
        var boardArray = BOX_INVALID_PUZZLE.split("");
        expect(SudokuSolver.allBoxesValid(boardArray)).toEqual(false);
      });
    });
  
    describe("getBox", function() {
      it("returns the box for the given index", function() {
        var boardArray = EASY_PUZZLE.split("");
        expect(SudokuSolver.getBox(boardArray, 0)).toEqual(["1", "-", "5", "-", "9", "-", "2", "-", "-"]);
        expect(SudokuSolver.getBox(boardArray, 10)).toEqual(["1", "-", "5", "-", "9", "-", "2", "-", "-"]);
        expect(SudokuSolver.getBox(boardArray, 40)).toEqual(["-", "-", "7", "-", "8", "3", "-", "6", "1"]);
        expect(SudokuSolver.getBox(boardArray, 80)).toEqual(["-", "3", "-", "5", "-", "1", "9", "-", "-"]);
      });
    });
  
    describe("collectionIsValid", function() {
      it("returns true when no duplicates exist in the given collection", function() {
        expect(SudokuSolver.collectionIsValid(["1","2","3"])).toEqual(true);
      });
  
      it("ignores dashes in the calculation", function() {
        expect(SudokuSolver.collectionIsValid(["1","-","2","3","-","-"])).toEqual(true);
      });
  
      it("returns false when collection contains a duplicate digit", function() {
        expect(SudokuSolver.collectionIsValid(["1","2","3","1","-","-"])).toEqual(false);
        expect(SudokuSolver.collectionIsValid(["1","2","3","1"])).toEqual(false);
      });
    });
  
    describe("toString", function() {
      it("it returns a string of 81 digits separated by spaces and new lines", function() {
        var boardArray = SOLVED_PUZZLE.split("");
        expect(SudokuSolver.toString(boardArray)).toMatch(/((([1-9] )+[1-9])\n){8}([1-9] )+[1-9]/);
      });
    });
  });
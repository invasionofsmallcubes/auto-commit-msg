/**
 * Parse Git output test module.
 *
 * Check the ability to convert text output from Git subcommands into JS
 * objects.
 */
import * as assert from "assert";
import { parseDiffIndex, parseStatus } from "../../git/parseOutput";
import { FileChange } from "../../git/parseOutput.d";

describe("Split `git diff-index` output into components", function () {
  describe("#parseDiffIndex", function () {
    describe("states with a single path", function () {
      it("should return the appropriate commit message for a new file", function () {
        const expected: FileChange = {
          x: "A",
          y: " ",
          from: "foo.txt",
          to: "",
        };

        assert.deepStrictEqual(parseDiffIndex("A\tfoo.txt"), expected);
      });

      it("should return the appropriate commit message for a modified file", function () {
        const expected: FileChange = {
          x: "M",
          y: " ",
          from: "foo.txt",
          to: "",
        };

        assert.deepStrictEqual(parseDiffIndex("M\tfoo.txt"), expected);
      });

      it("should return the appropriate commit message for a deleted file", function () {
        const expected: FileChange = {
          x: "D",
          y: " ",
          from: "foo.txt",
          to: "",
        };

        assert.deepStrictEqual(parseDiffIndex("D\tfoo.txt"), expected);
      });
    });

    describe("states with two paths", function () {
      it("should return the appropriate commit message for a renamed unchanged file", function () {
        const expected: FileChange = {
          x: "R",
          y: " ",
          from: "bar.txt",
          to: "foo.txt",
        };

        assert.deepStrictEqual(
          parseDiffIndex("R100\tbar.txt\tfoo.txt"),
          expected
        );

        it("should return the appropriate commit message for a moved file", function () {
          const expected: FileChange = {
            x: "R",
            y: " ",
            from: "bar.txt",
            to: "fizz/foo.txt",
          };

          assert.deepStrictEqual(
            parseDiffIndex("R100\tbar.txt\tfizz/foo.txt"),
            expected
          );
        });
      });

      it("returns a correct commit message for a renamed modified file", function () {
        const expected: FileChange = {
          x: "R",
          y: " ",
          from: "bar.txt",
          to: "foo.txt",
        };
        assert.deepStrictEqual(
          parseDiffIndex("R096\tbar.txt\tfoo.txt"),
          expected
        );

        it("should return the appropriate commit message for a moved file", function () {
          const expected: FileChange = {
            x: "R",
            y: " ",
            to: "bar.txt",
            from: "fizz/foo.txt",
          };

          assert.deepStrictEqual(
            parseDiffIndex("R096\tbar.txt\tfizz/foo.txt"),
            expected
          );
        });
      });
    });

    it("throws an error on input that is too short", function () {
      assert.throws(() => parseDiffIndex("abc"));
    });
  });
});

// Not a core part of this extension anymore, but the code and tests are kept
// anyway.
describe("Split `git status` output into components", function () {
  describe("#parseStatus", function () {
    it("should return the appropriate commit message for a new file", function () {
      const expected: FileChange = {
        x: "A",
        y: " ",
        from: "foo.txt",
        to: "",
      };

      assert.deepStrictEqual(parseStatus("A \tfoo.txt"), expected);
    });

    it("should return the appropriate commit message for a modified file", function () {
      const expected: FileChange = {
        x: " ",
        y: "M",
        from: "foo.txt",
        to: "",
      };

      assert.deepStrictEqual(parseStatus(" M\tfoo.txt"), expected);
    });

    it("should return the appropriate commit message for a deleted file", function () {
      const expected: FileChange = {
        x: "D",
        y: " ",
        from: "foo.txt",
        to: "",
      };

      assert.deepStrictEqual(parseStatus("D  foo.txt"), expected);
    });

    it("should return the appropriate commit message for a renamed file", function () {
      const expected: FileChange = {
        x: "R",
        y: " ",
        from: "foo.txt",
        to: "bar.txt",
      };

      assert.deepStrictEqual(parseStatus("R  foo.txt -> bar.txt"), expected);

      it("should return the appropriate commit message for a moved file", function () {
        const expected: FileChange = {
          x: "R",
          y: " ",
          from: "foo.txt",
          to: "fizz/foo.txt",
        };

        assert.deepStrictEqual(
          parseStatus("R  foo.txt -> fizz/foo.txt"),
          expected
        );
      });
    });

    it("throws an error on input that is too short", function () {
      assert.throws(() => parseStatus("abc"));
    });
  });
});

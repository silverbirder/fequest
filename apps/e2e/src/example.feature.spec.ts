import { describeFeature, loadFeature } from "@amiceli/vitest-cucumber";
import { expect } from "vitest";

const feature = await loadFeature("./example.feature", { language: "ja" });

describeFeature(feature, ({ Scenario }) => {
  Scenario("ユニットテストを実行する", ({ And, Given, Then, When }) => {
    Given("vitest-cucumber をインストールしている", () => {
      expect(true).toBe(true);
    });
    And('"example.feature" のようなフィーチャーファイルを用意している', () => {
      expect(true).toBe(true);
    });
    When("vitest-cucumber を実行したとき", () => {
      expect(true).toBe(true);
    });
    Then("フィーチャーファイルが正しく解析される", () => {
      expect(true).toBe(true);
    });
    And("シナリオをテストできる", () => {
      expect(true).toBe(true);
    });
  });
});

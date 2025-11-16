import { describeFeature, loadFeature } from "@amiceli/vitest-cucumber";
import { expect } from "vitest";

const feature = await loadFeature("./example.feature");

describeFeature(feature, ({ Scenario }) => {
  Scenario("Run unit tests", ({ And, Given, Then, When }) => {
    Given("I have installed vitest-cucumber", () => {
      expect(true).toBe(true);
    });
    And('I have a feature like "example.feature"', () => {
      expect(true).toBe(true);
    });
    When("I run vitest-cucumber", () => {
      expect(true).toBe(true);
    });
    Then("My feature file is parsed", () => {
      expect(true).toBe(true);
    });
    And("I can test my scenarios", () => {
      expect(true).toBe(true);
    });
  });
});

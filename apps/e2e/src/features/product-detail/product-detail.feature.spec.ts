import { describeFeature, loadFeature } from "@amiceli/vitest-cucumber";
import { migrateDatabase } from "@repo/db";
import { stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Network, StartedNetwork, StartedTestContainer } from "testcontainers";
import { expect } from "vitest";

import { ProductPage } from "@/pages/product.page";
import { createBrowserSession } from "@/playwright/session";
import { startDatabase, stopDatabase } from "@/setup/database";
import { type SeededProductData, seedProductData } from "@/setup/seed";
import { startUser, stopUser } from "@/setup/user";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const screenshotPath = resolve(__dirname, "product-detail-screenshot.png");

const feature = await loadFeature("./product-detail.feature", {
  language: "ja",
});

describeFeature(
  feature,
  ({ AfterAllScenarios, BeforeAllScenarios, Scenario }) => {
    let userStartedContainer: StartedTestContainer | undefined;
    let dbStartedContainer: StartedTestContainer | undefined;
    let network: StartedNetwork | undefined;
    let userUrl: string;
    let seededProduct: SeededProductData | undefined;
    BeforeAllScenarios(async () => {
      const startedNetwork = await new Network().start();
      network = startedNetwork;

      const {
        connectionString,
        container: startedDbContainer,
        hostConnectionString,
      } = await startDatabase(startedNetwork);
      dbStartedContainer = startedDbContainer;

      await migrateDatabase(hostConnectionString);

      seededProduct = await seedProductData(hostConnectionString);

      const { container: startedUserContainer, url } = await startUser(
        startedNetwork,
        connectionString,
      );
      userStartedContainer = startedUserContainer;
      userUrl = url;
    });
    AfterAllScenarios(async () => {
      await stopUser(userStartedContainer);
      await stopDatabase(dbStartedContainer);
      if (network) {
        await network.stop();
      }
    });
    Scenario(
      "シード済みのプロダクト詳細を表示する",
      ({ And, Given, Then, When }) => {
        Given("データベースにサンプルのプロダクトが存在する", () => {
          expect(seededProduct).toBeDefined();
        });
        And("user アプリケーションのコンテナを起動している", () => {
          expect(userStartedContainer).toBeDefined();
        });
        When("/[id] ページにアクセスしたとき", () => {
          expect(userUrl).toBeTruthy();
        });
        Then("シードされたフィーチャーを確認できる", () => {
          expect(seededProduct?.openFeatureTitle).toBeTruthy();
        });
        And(
          "Playwright で /[id] ページにアクセスしてスクリーンショットを保存できる",
          async () => {
            if (!seededProduct) {
              throw new Error(
                "Seed data must be prepared before running this step",
              );
            }

            const session = await createBrowserSession();
            try {
              const productPage = new ProductPage(session.page, userUrl);
              await productPage.goto(seededProduct.productId);
              await productPage.waitForFeatureRequest(
                seededProduct.openFeatureTitle,
              );
              const savedPath =
                await productPage.captureFullPageScreenshot(screenshotPath);
              const fileStats = await stat(savedPath);
              expect(fileStats.size).toBeGreaterThan(0);
            } finally {
              await session.close();
            }
          },
        );
      },
    );
  },
);

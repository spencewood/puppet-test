"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const chrome_aws_lambda_1 = __importDefault(require("chrome-aws-lambda"));
exports.handler = async (event) => {
  let screenshot = null;
  let browser = null;
  try {
    browser = await chrome_aws_lambda_1.default.puppeteer.launch({
      args: chrome_aws_lambda_1.default.args,
      defaultViewport: chrome_aws_lambda_1.default.defaultViewport,
      executablePath: await chrome_aws_lambda_1.default.executablePath,
      headless: chrome_aws_lambda_1.default.headless,
      ignoreHTTPSErrors: true,
    });
    // eslint-disable-next-line no-console
    console.log("new page");
    const page = await browser.newPage();
    await page.goto(event.url || "https://example.com");
    screenshot = await page.screenshot({
      encoding: "base64",
      type: "png",
    });
    // eslint-disable-next-line no-console
    console.log("screenshot", screenshot);
  } catch (error) {
    console.error("error", error);
    return {
      body: error,
      statusCode: 500,
    };
  } finally {
    if (browser !== null) {
      // eslint-disable-next-line no-console
      console.log("close");
      await browser.close();
    }
  }
  return {
    body: screenshot,
    headers: {
      "Content-Type": `image/png`,
    },
    isBase64Encoded: true,
    statusCode: 200,
  };
};

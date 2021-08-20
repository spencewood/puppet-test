const chromium = require("chrome-aws-lambda");

exports.handler = async (event) => {
  let screenshot = null;
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    let page = await browser.newPage();

    await page.goto(event.url || "https://example.com");

    screenshot = await page.screenshot({
      encoding: "base64",
      type: "png",
    });
  } catch (error) {
    return {
      body: error,
      statusCode: 500,
    };
  } finally {
    if (browser !== null) {
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

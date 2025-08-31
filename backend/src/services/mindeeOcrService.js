import * as mindee from "mindee";

// console.log("Mindee Key:", process.env.MINDEE_API_KEY);

class MindeeOcrService {
  constructor() {
    this.mindeeClient = new mindee.ClientV2({
      apiKey: process.env.MINDEE_API_KEY,
    });
  }

  async processReceipt(imageBuffer, filename) {
    try {
      const inputSource = new mindee.BufferInput({
        buffer: imageBuffer,
        filename: filename,
      });

      const inferenceParams = {
        modelId: "2540b6d0-dcb8-48b5-8e99-bcddf59d3353",
        rag: false,
      };

      const apiResponse = await this.mindeeClient.enqueueAndGetInference(
        inputSource,
        inferenceParams
      );

      const rawData = apiResponse.rawHttp?.inference?.result?.fields;
      const extractedData = this.extractReceiptData(rawData);

      return {
        success: true,
        data: extractedData,
      };
    } catch (error) {
      throw new Error("Failed to process receipt");
    }
  }

  extractReceiptData(fields) {
    const totalAmount = fields.total_amount?.value || 0;
    const receiptDate = fields.date?.value
      ? new Date(fields.date.value)
      : new Date();
    const merchantName = fields.supplier_name?.value || "Unknown Merchant";
    const category = this.categorizeTransaction(
      merchantName,
      fields.line_items?.items || []
    );

    const lineItems =
      fields.line_items?.items?.map((item) => ({
        description: item.fields?.description?.value || "",
        quantity: item.fields?.quantity?.value || 1,
        unitPrice: item.fields?.unit_price?.value || 0,
        totalAmount: item.fields?.total_price?.value || 0,
      })) || [];

    const description = this.generateDescription(merchantName, lineItems);

    return {
      amount: Math.abs(totalAmount),
      type: "EXPENSE",
      category: category,
      description: description,
      date: receiptDate.toISOString(),
      merchantName: merchantName,
      lineItems: lineItems,
      currency: fields.locale?.fields?.currency?.value || "USD",
    };
  }

  categorizeTransaction(merchantName, lineItems = []) {
    const merchant = merchantName.toLowerCase();

    if (
      merchant.includes("restaurant") ||
      merchant.includes("cafe") ||
      merchant.includes("food")
    ) {
      return "FOOD";
    }
    if (merchant.includes("grocery") || merchant.includes("supermarket")) {
      return "GROCERIES";
    }
    if (merchant.includes("pharmacy") || merchant.includes("medical")) {
      return "HEALTH";
    }
    if (merchant.includes("gas") || merchant.includes("fuel")) {
      return "TRAVEL";
    }
    if (merchant.includes("shop") || merchant.includes("store")) {
      return "SHOPPING";
    }
    return "MISC";
  }

  generateDescription(merchantName, lineItems) {
    if (lineItems.length === 0) {
      return `Purchase from ${merchantName}`;
    }
    if (lineItems.length === 1) {
      return `${lineItems[0].description} from ${merchantName}`;
    }
    return `${lineItems.length} items from ${merchantName}`;
  }
}

export default new MindeeOcrService();

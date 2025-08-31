import mindeeOcrService from "../services/mindeeOcrService.js";

export const processReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No receipt image provided",
      });
    }

    const ocrResult = await mindeeOcrService.processReceipt(
      req.file.buffer,
      req.file.originalname
    );

    res.status(200).json(ocrResult);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to process receipt",
    });
  }
};


import { pipeline } from "@xenova/transformers";

class EmbeddingService {
  private extractor: any;

  async init() {
    if (!this.extractor) {
      this.extractor = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
      );
    }
  }

  async embedText(text: string): Promise<number[]> {
    await this.init();
    const out = await this.extractor(text, {
      pooling: "mean",
      normalize: true,
    });
    return Array.from(out.data);
  }
}

export default new EmbeddingService();

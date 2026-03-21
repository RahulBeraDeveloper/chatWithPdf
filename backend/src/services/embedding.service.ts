import https from "https";

// Tries Cohere first (works on Render), falls back gracefully
async function embedViaCohere(text: string, apiKey: string, inputType: string): Promise<number[]> {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      texts: [text],
      model: "embed-english-light-v3.0",
      input_type: inputType,
    });

    const options = {
      hostname: "api.cohere.com",
      path: "/v1/embed",
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.embeddings?.[0]) {
            resolve(parsed.embeddings[0]);
          } else {
            reject(new Error(`Cohere error: ${data}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

class EmbeddingService {
  private extractor: any;
  private usedXenova = false;

  // Try Xenova first (local, fast), fall back to Cohere (works on Render)
  async embedText(text: string, isQuery = false): Promise<number[]> {
    const cohereKey = process.env.COHERE_API_KEY;

    // Use Cohere if key is set (production/Render)
    if (cohereKey) {
      const inputType = isQuery ? "search_query" : "search_document";
      return embedViaCohere(text.trim(), cohereKey, inputType);
    }

    // Fall back to Xenova (local dev only)
    try {
      if (!this.extractor) {
        const { pipeline } = await import("@xenova/transformers");
        this.extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
        this.usedXenova = true;
      }
      const out = await this.extractor(text, { pooling: "mean", normalize: true });
      return Array.from(out.data) as number[];
    } catch (err) {
      throw new Error(`Embedding failed: no COHERE_API_KEY set and Xenova failed: ${err}`);
    }
  }
}

export default new EmbeddingService();
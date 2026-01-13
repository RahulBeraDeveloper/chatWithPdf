
export interface Chunk {
  text: string;
  chunkIndex: number;
}

export function splitTextToChunks(
  text: string,
  chunkSize = 700,
  overlap = 100
): Chunk[] {
  const chunks: Chunk[] = [];
  let index = 0;

  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    chunks.push({
      text: text.slice(i, i + chunkSize),
      chunkIndex: index++,
    });
  }

  return chunks;
}

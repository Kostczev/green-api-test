const MAX_MESSAGE_LENGTH = 4096;

export function splitMessage(message: string): string[] {
  const chunks: string[] = [];
  let remaining = message;

  while (remaining.length > MAX_MESSAGE_LENGTH) {
    let splitIndex = remaining.lastIndexOf(
      '\n',
      MAX_MESSAGE_LENGTH
    );

    if (splitIndex <= 0) {
      splitIndex = remaining.lastIndexOf(
        ' ',
        MAX_MESSAGE_LENGTH
      );
    }

    if (splitIndex <= 0) {
      splitIndex = MAX_MESSAGE_LENGTH;
    }

    chunks.push(remaining.slice(0, splitIndex));
    remaining = remaining.slice(splitIndex).trimStart();
  }

  if (remaining) {
    chunks.push(remaining);
  }

  return chunks;
}
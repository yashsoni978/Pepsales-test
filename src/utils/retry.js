export async function retry(
  fn,
  { retries = 3, delay = 1000, exponentialBackoff = true } = {}
) {
  let attempts = 0;
  let currentDelay = delay;

  while (attempts < retries) {
    try {
      return await fn();
    } catch (error) {
      attempts++;
      if (attempts === retries) {
        throw error;
      }
      await new Promise((res) => setTimeout(res, currentDelay));
      if (exponentialBackoff) {
        currentDelay *= 2;
      }
    }
  }
}

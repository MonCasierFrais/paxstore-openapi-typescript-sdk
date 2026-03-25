function nextRetrySleepMillis(nTry: number): number {
  const baseSleepMillis = 1000;
  const maxSleepMillis = 60000;
  const gaussian = (() => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  })();
  const fuzzyMultiplier = Math.min(Math.max(1 + 0.2 * gaussian, 0), 2);
  return Math.floor(
    Math.min(maxSleepMillis, baseSleepMillis * Math.pow(2, nTry - 1)) * fuzzyMultiplier
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry<T>(
  fn: () => Promise<T>,
  shouldRetry: (error: unknown) => boolean,
  maxTries: number
): Promise<T> {
  if (maxTries < 1) throw new Error('maxTries must be > 0');
  let nTry = 0;
  while (true) {
    try {
      nTry++;
      return await fn();
    } catch (e) {
      if (nTry < maxTries && shouldRetry(e)) {
        const sleepMs = nextRetrySleepMillis(nTry);
        console.warn(`Failed on try ${nTry}, retrying in ${sleepMs}ms.`, e);
        await sleep(sleepMs);
      } else {
        throw e;
      }
    }
  }
}

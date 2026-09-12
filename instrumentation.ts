/**
 * Next.js calls register() once when the server boots.
 * We use it to launch the headless browser ahead of any traffic, so the very
 * first PDF request doesn't pay Chromium's ~2s startup cost.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { warmUpBrowser } = await import("@/lib/server/pdf-renderer");
    warmUpBrowser();
  }
}

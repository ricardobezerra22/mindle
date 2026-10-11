import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      include: [
        "server/middleware/rateLimitAgent.ts",
        "server/services/agentService.ts",
        "server/api/agent/voice-tasks/confirm.post.ts",
        "server/api/agent/voice-tasks/preview.post.ts",
      ],
      thresholds: { lines: 65 },
    },
  },
});

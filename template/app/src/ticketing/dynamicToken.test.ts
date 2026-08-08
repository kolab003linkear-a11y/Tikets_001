import { describe, it, expect } from "vitest";
import {
  computeTokenSignature,
  getCurrentWindowEpoch,
  generateDynamicToken,
  verifyDynamicToken,
} from "./dynamicToken";

describe("TicketSafe Dynamic Token & HMAC-SHA256 Cryptographic Engine", () => {
  const secretKey = "SEC_MONUMENTAL_STADIUM_TKT_99218";

  it("should generate deterministic signature for identical window epochs", () => {
    const epoch = 500000;
    const tokenA = computeTokenSignature(secretKey, epoch);
    const tokenB = computeTokenSignature(secretKey, epoch);

    expect(tokenA).toBeDefined();
    expect(tokenA).toBe(tokenB);
    expect(typeof tokenA).toBe("string");
  });

  it("should generate distinct signatures for consecutive 30-second windows", () => {
    const epoch1 = 500000;
    const epoch2 = 500001;

    const token1 = computeTokenSignature(secretKey, epoch1);
    const token2 = computeTokenSignature(secretKey, epoch2);

    expect(token1).not.toBe(token2);
  });

  it("should calculate correct seconds remaining in 30-second rotation window", () => {
    const result = generateDynamicToken(secretKey, 30);

    expect(result.token).toBeDefined();
    expect(result.windowEpoch).toBeGreaterThan(0);
    expect(result.secondsRemaining).toBeGreaterThanOrEqual(1);
    expect(result.secondsRemaining).toBeLessThanOrEqual(30);
  });

  it("should verify valid dynamic token within current window", () => {
    const epoch = getCurrentWindowEpoch(30);
    const validToken = computeTokenSignature(secretKey, epoch);

    const isValid = verifyDynamicToken(secretKey, validToken, 30, 1);
    expect(isValid).toBe(true);
  });

  it("should accept token with allowable clock skew (+/- 1 window tolerance)", () => {
    const epoch = getCurrentWindowEpoch(30);
    // Token generated in previous window (30s ago)
    const prevWindowToken = computeTokenSignature(secretKey, epoch - 1);
    // Token generated in next window (30s ahead)
    const nextWindowToken = computeTokenSignature(secretKey, epoch + 1);

    expect(verifyDynamicToken(secretKey, prevWindowToken, 30, 1)).toBe(true);
    expect(verifyDynamicToken(secretKey, nextWindowToken, 30, 1)).toBe(true);
  });

  it("should reject expired screenshots from 5 minutes ago (10 windows stale)", () => {
    const epoch = getCurrentWindowEpoch(30);
    const staleScreenshotToken = computeTokenSignature(secretKey, epoch - 10);

    const isValid = verifyDynamicToken(secretKey, staleScreenshotToken, 30, 1);
    expect(isValid).toBe(false);
  });

  it("should reject tampered or counterfeit secret signatures", () => {
    const epoch = getCurrentWindowEpoch(30);
    const fakeToken = computeTokenSignature("SEC_FAKE_UNAUTHORIZED_KEY", epoch);

    const isValid = verifyDynamicToken(secretKey, fakeToken, 30, 1);
    expect(isValid).toBe(false);
  });
});

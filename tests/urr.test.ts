import { expect, test } from "bun:test";

// Mocking the URR calculation logic
function calculateURR(serviceLife: number, renewalTime: number): number {
    return serviceLife / renewalTime;
}

test("URR calculation for 35-year use period", () => {
    const serviceLife = 35;
    const renewalMin = 25;
    const renewalMax = 40;
    
    const urrMax = calculateURR(serviceLife, renewalMin); // Max URR is when renewal is fast
    const urrMin = calculateURR(serviceLife, renewalMax); // Min URR is when renewal is slow
    
    expect(urrMax).toBeCloseTo(1.4, 1);
    expect(urrMin).toBeCloseTo(0.875, 2);
});

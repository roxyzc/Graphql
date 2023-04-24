import { mailOptions, sendEmail, closeTcpConnection } from "../utils/sendEmail.util";
import { generateNumber } from "../utils/generateNumbers.util";
import { encode, decode } from "../utils/hash.util";
import onExit from "async-exit-hook";

describe("it-utils", () => {
  it("sendEmail", async () => {
    const content = await mailOptions("Verify your email", "roxyzc12@gmail.com", "OTP", `<h3>1231231</h3>`);
    const valid = await sendEmail(content);
    expect(valid).toBe(true);
  });

  it("generateOtp", async () => {
    const len = 5;
    const otp = generateNumber(len);
    expect(typeof otp === "string" && otp.length === len).toBe(true);
  });

  it("test encode and decode", () => {
    const data = encode("8120312");
    const result = decode(data);
    expect(result).toEqual("8120312");
  });

  onExit(() => {
    closeTcpConnection();
  });
});

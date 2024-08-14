// pages/api/create-payment-url.ts
import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

interface VnpParams {
  vnp_Version: string;
  vnp_Command: string;
  vnp_TmnCode: string;
  vnp_Locale: string;
  vnp_CurrCode: string;
  vnp_TxnRef: string;
  vnp_OrderInfo: string;
  vnp_OrderType: string;
  vnp_Amount: number;
  vnp_ReturnUrl: string;
  vnp_IpAddr: string;
  vnp_CreateDate: string;
  vnp_BankCode?: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    console.log({ ewdfqw: process.env.NEXT_PUBLIC_DOMAIN });
    const { amount, bankCode, orderDescription, orderType, language, voucher } =
      req.body;
    const config = {
      vnp_TmnCode: "0NXKCVF7",
      vnp_HashSecret: "QOCBHRD17NCZQCNJZ0L6NEEPC48FWW4F",
      vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
      vnp_ReturnUrl: `${
        process.env.NEXT_PUBLIC_DOMAIN
      }/checkout?tab=3&voucher=${JSON.stringify(voucher)}`,
    };
    console.log({ voucherReq: voucher });
    const ipAddr =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";

    const date = new Date();
    const createDate = formatDate(date, "yyyymmddHHmmss");
    const orderId = formatDate(date, "HHmmss");

    const orderInfo = orderDescription;
    const locale = language || "vn";
    const currCode = "VND";

    const vnp_Params: VnpParams = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: config.vnp_TmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: orderType,
      vnp_Amount: amount * 100, // Convert to cents
      vnp_ReturnUrl: config.vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
      ...(bankCode && { vnp_BankCode: bankCode }),
    };

    const sortedVnpParams = sortObject(vnp_Params);
    const searchParams = new URLSearchParams();

    // Add sorted parameters to the URLSearchParams object
    for (const [key, value] of Object.entries(sortedVnpParams)) {
      searchParams.append(key, value.toString());
    }

    const signData = searchParams.toString();
    const hmac = crypto.createHmac("sha512", config.vnp_HashSecret);
    const signed = hmac.update(signData, "utf-8").digest("hex");

    searchParams.append("vnp_SecureHash", signed);

    const paymentUrl = `${config.vnp_Url}?${searchParams.toString()}`;

    console.log({ paymentUrl });

    res.status(200).json({ paymentUrl });
  } else {
    res.status(404).json({ message: "Not Found" });
  }
}

function formatDate(date: Date, format: string): string {
  const map = {
    mm: date.getMonth() + 1,
    dd: date.getDate(),
    yy: date.getFullYear().toString().slice(-2),
    yyyy: date.getFullYear(),
    HH: date.getHours(),
    MM: date.getMinutes(),
    ss: date.getSeconds(),
  };

  return format.replace(/mm|dd|yy|yyy|HH|MM|ss/gi, (matched) =>
    map[matched as keyof typeof map].toString().padStart(2, "0")
  );
}

function sortObject(obj: { [key: string]: any }): { [key: string]: any } {
  return Object.keys(obj)
    .sort()
    .reduce(
      (result, key) => ({
        ...result,
        [key]: obj[key],
      }),
      {}
    );
}

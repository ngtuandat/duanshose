import axios from "axios";
import { useState } from "react";
import Button from "./Button";
import { DataVoucherProps } from "../interfaces/voucher";
import Cookies from "js-cookie";

export default function PaymentForm({
  price,
  voucher,
}: {
  voucher?: DataVoucherProps;
  price: number;
}) {
  console.log(price, "lôdfjdf");
  const [amount, setAmount] = useState(price.toString());
  const [bankCode, setBankCode] = useState("NCB");
  const [orderDescription, setOrderDescription] = useState("");
  const [orderType, setOrderType] = useState("Mua hàng");
  const [language, setLanguage] = useState("vn");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      const response = await axios.post<{ paymentUrl: string }>(
        "/api/payment",
        {
          amount,
          bankCode,
          orderDescription,
          orderType,
          language,
          voucher,
        }
      );

      // Redirect to payment URL
      window.location.href = response.data.paymentUrl;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center w-[350px]">
      <div className="w-full max-w-md space-y-8 shadow">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-white"
            >
              Số tiền
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              value={amount}
              className="block w-full px-3 py-2 bg-transparent text-white mt-1 border border-white/30 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="bankCode"
              className="block text-sm font-medium text-white"
            >
              Mã ngân hàng
            </label>
            <input
              id="bankCode"
              name="bankCode"
              type="text"
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value)}
              className="block w-full px-3 py-2 bg-transparent text-white mt-1 border border-white/30 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="orderDescription"
              className="block text-sm font-medium text-white"
            >
              Mô tả đơn hàng
            </label>
            <textarea
              id="orderDescription"
              name="orderDescription"
              value={orderDescription}
              onChange={(e) => setOrderDescription(e.target.value)}
              className="block w-full px-3 py-2 bg-transparent text-white mt-1 border border-white/30 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="orderType"
              className="block text-sm font-medium text-white"
            >
              Loại đơn hàng
            </label>
            <input
              id="orderType"
              name="orderType"
              type="text"
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="block w-full px-3 py-2 bg-transparent text-white mt-1 border border-white/30 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium text-white"
            >
              Ngôn ngữ
            </label>
            <select
              id="language"
              name="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="block w-full px-3 py-2 bg-transparent text-white mt-1 border border-white/30 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="vn">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <Button
              loading={isLoading}
              label="Thanh toán"
              submit
              className="w-full"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

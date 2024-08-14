import React, { ReactElement } from "react";
import MainClient from "../components/Layouts/MainClient";
import { CustomHeader } from "../components/Header/CustomHeader";

const Contact = () => {
  return (
    <div>
      <CustomHeader>
        <title>Liên Hệ | Cuc Shoes</title>
      </CustomHeader>
      <div className="bg-dark w-full z-[1200] relative pb-16">
        <h1>Trang Liên Hệ</h1>
        <div className="grid grid-cols-2 gap-8">
          <div className="text-white">
            <img src="./images/imgcontact.jpg" alt="" />
            <div className="mt-5">
              FitFusionZone <br />
              Được thành lập từ năm 2015, là chuỗi bán lẻ Sneaker, Streetwear và
              phụ kiện thời trang chính hãng có thị phần số 1 Việt Nam với số
              lượt truy cập mua hàng tại website FitFusionZone.com lên tới trên
              10.000 lượt mỗi ngày từ khắp 63 tỉnh thành trên cả nước.
            </div>
            <div className="border-b-[1px] pb-4 border-[#7e7878]">
              <div className="font-bold py-6">TỪ MỘT NHÀ SƯU TẦM SNEAKER</div>
              <div className="space-y-3 px-4">
                <p>
                  - Biết được nhu cầu của người tiêu dùng Việt Nam luôn tìm kiếm
                  những đôi giày chất lượng, nhiều kiểu dáng, màu sắc mang màu
                  sắc riêng và quan trọng nhất là chúng phải 100% chính hãng.
                  <span className="text-red-500">FitFusionZone</span> đã ra đời.
                </p>
                <p>
                  - Xuất thân là một cửa hàng Online chuyên Order Sneaker của
                  các thương hiệu lớn như{" "}
                  <span className="text-red-500">Nike, Adidas</span> hay{" "}
                  <span className="text-red-500">Puma, MLB….</span>
                  trên thế giới từ Mỹ, Anh Quốc, Pháp, Nhật,… Trải qua 4 năm
                  hình thành và phát triển, FitFusionZone đã giải quyết được
                  phần nào mong muốn của người tiêu dùng. Nhưng đương nhiên họ
                  không dừng lại ở đó, Sneaker thôi là chưa đủ.
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="space-y-3">
              <div className="font-bold text-white">
                ĐỊA CHỈ TRỤ SỞ :{" "}
                <span className="font-normal ">Trịnh Văn Bô</span>
              </div>
              <div className="font-bold text-white">
                SỐ ĐIỆN THOẠI :{" "}
                <span className="font-normal text-red-500 ">0123456789</span>
              </div>
              <div className="font-bold text-white">
                EMAIL :{" "}
                <span className="font-normal text-red-500 ">
                  FitFusionZone@gmail.com
                </span>
              </div>
            </div>
            <div>
              <img src="./images/map.jpg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Contact.getLayout = function getLayout(page: ReactElement) {
  return <MainClient>{page}</MainClient>;
};

export default Contact;

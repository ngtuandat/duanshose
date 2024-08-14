import React from "react";
import { FaFacebook, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { MdLocalPhone } from "react-icons/md";
import { TbBrandTwitter } from "react-icons/tb";

const Footer = () => {
  return (
    <div className="flex justify-between py-10">
      <div className="text-white space-y-4 max-w-[450px]">
        <div>
          FitFusionZone - nhà sưu tầm và phân phối chính hãng các thương hiệu
          thời trang hàng đầu Việt Nam
        </div>
        <div className="font-bold text-2xl">HỆ THỐNG CỬA HÀNG</div>
        <div className="flex space-x-2 items-center">
          <FaMapMarkerAlt />
          <div>Địa Chỉ: Trịnh Văn Bô - Nam Từ Liêm - Hà Nội</div>
        </div>
        <div className="flex space-x-2 items-center">
          <MdLocalPhone />
          <div>Hotline: 0123456789</div>
        </div>
        <div className="flex space-x-2 items-center">
          <IoIosMail />
          <div> Email: FitFusionZone@gmail.com</div>
        </div>
      </div>
      <div className="text-white text-lg space-y-5">
        <div className="underline">về chúng tôi</div>
        <div className="space-y-4">
          <div>Giới Thiệu</div>
          <div>Tuyển Dụng</div>
          <div>Dịch vụ spa,Sửa giày</div>
          <div>Tin tức sự kiện</div>
        </div>
        <div>Kết nối với chúng tôi</div>
        <div className="flex space-x-4">
          <FaFacebook size={28} />
          <FaInstagram size={28} />
          <TbBrandTwitter size={28} />
        </div>
      </div>
      <div className="text-white text-lg space-y-5">
        <div className="underline">Hỗ trợ khách hàng</div>
        <div className="space-y-4 max-w-[300px]">
          <div>Hướng dẫn mua hàng</div>
          <div>Chính sách đổi trả và bảo hành</div>
          <div>Chính sách thanh toán</div>
          <div>Điều khoản trang web</div>
          <div>Chính sách bảo vệ thông tin cá nhân của người tiêu dùng</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

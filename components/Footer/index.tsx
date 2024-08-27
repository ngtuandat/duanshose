import React from "react";
import { FaFacebook, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { MdLocalPhone } from "react-icons/md";
import { TbBrandTwitter } from "react-icons/tb";

const Footer = () => {
  return (
    <div className=" text-white py-10 border-t border-[#7E7878] mt-2">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Phần Giới thiệu */}
        <div className="space-y-4">
          <div>
            FitFusionZone - nhà sưu tầm và phân phối chính hãng các thương hiệu
            thời trang hàng đầu Việt Nam
          </div>
          <div className="font-bold text-2xl">HỆ THỐNG CỬA HÀNG</div>
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt />
            <span>Địa Chỉ: Trịnh Văn Bô - Nam Từ Liêm - Hà Nội</span>
          </div>
          <div className="flex items-center space-x-2">
            <MdLocalPhone />
            <span>Hotline: 0123456789</span>
          </div>
          <div className="flex items-center space-x-2">
            <IoIosMail />
            <span>Email: FitFusionZone@gmail.com</span>
          </div>
        </div>

        {/* Phần về chúng tôi */}
        <div className="space-y-5">
          <div className="underline">Về chúng tôi</div>
          <div className="space-y-4">
            <div>Giới Thiệu</div>
            <div>Tuyển Dụng</div>
            <div>Dịch vụ spa, Sửa giày</div>
            <div>Tin tức sự kiện</div>
          </div>
          <div>Kết nối với chúng tôi</div>
          <div className="flex space-x-4">
            <FaFacebook size={28} />
            <FaInstagram size={28} />
            <TbBrandTwitter size={28} />
          </div>
        </div>

        <div className="space-y-5">
          <div className="underline">Hỗ trợ khách hàng</div>
          <div className="space-y-4">
            <div>Hướng dẫn mua hàng</div>
            <div>Chính sách đổi trả và bảo hành</div>
            <div>Chính sách thanh toán</div>
            <div>Điều khoản trang web</div>
            <div>Chính sách bảo vệ thông tin cá nhân của người tiêu dùng</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

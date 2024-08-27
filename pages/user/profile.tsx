import Cookies from "js-cookie";
import React, { ReactElement, useEffect, useState } from "react";
import MainClient from "../../components/Layouts/MainClient";
import { getProfile, updateProfile } from "../../services/user";
import jwt_decode from "jwt-decode";
import { CustomHeader } from "../../components/Header/CustomHeader";
import { TbCameraPlus } from "react-icons/tb";
import Radio from "../../components/Radio";
import { ProfileProps } from "../../interfaces/user";
import Button from "../../components/Button";
import DropMenu from "../../components/DropMenu";
import { useRouter } from "next/router";
import LoadingPage from "../../components/Loading/LoadingPage";
import { useProfile } from "../../hooks/useProfile";
import LoadingBtn from "../../components/Loading/LoadingBtn";

const sex = [
  {
    id: "sex",
    options: [
      { value: "nam", label: "Nam" },
      { value: "nữ", label: "Nữ" },
      { value: "khác", label: "Khác" },
    ],
  },
];

const listCity = [
  "Hà Nội",
  "TP.Hồ Chí Minh",
  "Nghệ An",
  "Đà Nẵng",
  "An Giang",
  "Bà rịa – Vũng tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bình Dương",
  "Hà Nam",
  "Hải Phòng",
  "Nam Định",
  "Quảng Ninh",
];
const Profile = ({ loading }: { loading: Boolean }) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<number>();
  const [checkSex, setCheckSex] = useState("");
  const [birthDay, setBirthDay] = useState<Date>();
  const [imageSrc, setImageSrc] = useState();
  const [loadingUploadFiles, setLoadingUploadFiles] = useState(false);
  const [sizeImage, setSizeImage] = useState<string>();
  const [urlAvatar, setUrlAvatar] = useState<string>();
  const [loadingUpdateProfile, setLoadingUpdateProfile] = useState(false);

  const token = Cookies.get("token");
  const router = useRouter();

  const { fetchProfile, profile } = useProfile();

  const handleOnChangeImage = (changeEvent: any) => {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent: any) {
      setImageSrc(onLoadEvent.target.result);
    };
    setSizeImage((changeEvent.target.files[0].size / (1024 * 1024)).toFixed(2));

    reader.readAsDataURL(changeEvent.target.files[0]);
  };

  const handleOnSubmit = async (event: any) => {
    event.preventDefault();
    try {
      setLoadingUploadFiles(true);
      const form = event.currentTarget;
      const fileInput: any = Array.from(form.elements).find(
        ({ name }: any) => name === "change-avt"
      );
      const formData = new FormData();

      for (const file of fileInput.files) {
        formData.append("file", file);
      }
      formData.append("upload_preset", "e-commerce");

      const data = await fetch(
        "https://api.cloudinary.com/v1_1/dd4way43x/image/upload",
        {
          method: "POST",
          body: formData,
        }
      ).then((r) => r.json());
      setUrlAvatar(data.url);
      setLoadingUploadFiles(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateProfile = async () => {
    setLoadingUpdateProfile(true);
    try {
      const profileUpdate = {
        firstName: firstName,
        lastName: lastName,
        phone: phoneNumber,
        address: address,
        city: city,
        sex: checkSex,
        birthDay: birthDay,
        avatar: urlAvatar,
        email: email,
      };
      const res = await updateProfile(profileUpdate);
      if (token && res.status === 200) {
        const decoded: any = jwt_decode(token);
        await fetchProfile(decoded.email);
        Cookies.set("updateProfile", Math.random().toString());
        router.back();
      }
    } catch (error) {
      console.log(error);
    }
    setLoadingUpdateProfile(false);
  };

  useEffect(() => {
    if (token) {
      const decoded: any = jwt_decode(token);
      fetchProfile(decoded.email);
    }
  }, [token]);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setEmail(profile.email);
      setAddress(profile.profile.address);
      setCity(profile.profile.city);
      setPhoneNumber(profile.profile.phoneNumber);
      setCheckSex(profile.profile.sex);
      setBirthDay(profile.profile.birthDay);
      setUrlAvatar(profile.profile.avatar);
    }
  }, [profile]);

  return (
    <>
      {loading && <LoadingPage />}
      <CustomHeader title="Profile">
        <title>Profile | FitFusionZone</title>
      </CustomHeader>
      <div className="grid grid-cols-12 gap-6">
        <div className="bg-[rgb(33,43,54)] flex flex-col justify-center items-center shadow-lg col-span-12 lg:col-span-4 px-6 py-16 rounded-lg">
          <form
            className="flex flex-col justify-center items-center"
            onSubmit={(e) => handleOnSubmit(e)}
          >
            <label htmlFor="change-avt">
              <div className="group/item w-36 h-36 cursor-pointer flex items-center justify-center relative overflow-hidden rounded-full border border-dashed border-[rgba(145,158,171,0.32)]">
                <input
                  onChange={handleOnChangeImage}
                  id="change-avt"
                  name="change-avt"
                  accept="image/*"
                  type="file"
                  className="hidden"
                />
                <span className="block overflow-hidden absolute w-[calc(100%_-_16px)] h-[calc(100%_-_16px)]">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      className="w-full h-full rounded-full object-cover"
                      alt=""
                    />
                  ) : (
                    <img
                      src={urlAvatar ? urlAvatar : "/images/avt.jpg"}
                      className="w-full h-full rounded-full object-cover"
                      alt=""
                    />
                  )}
                </span>
                <div className="hidden group/edit group-hover/item:flex flex-col space-y-1 text-white rounded-full absolute items-center justify-center bg-[rgba(22,28,36,0.64)] w-[calc(100%_-_16px)] h-[calc(100%_-_16px)]">
                  <TbCameraPlus className="text-xl" />
                  <span className="text-sm font-medium">Đổi ảnh</span>
                </div>
              </div>
            </label>
            {imageSrc && Number(sizeImage) < 3.1 && (
              <Button
                loading={loadingUploadFiles}
                submit
                label="Đồng ý"
                className="border mt-3 hover:bg-[rgba(145,158,171,0.1)] py-0.5 border-color-primary rounded-md px-2.5 min-w-[64px] text-[13px] flex items-center justify-center font-semibold text-white"
              />
            )}
          </form>
          {Number(sizeImage) > 3.1 && (
            <i className="text-xs text-red-500 mt-2">
              Ảnh vượt quá mức cho phép
            </i>
          )}
          <span className="text-[rgb(145,158,171)] text-xs text-center mt-5">
            Cho phép *.jpeg, *.jpg, *.png, *.gif <br /> max size of 3.1 MB
          </span>
        </div>
        <div className="bg-[rgb(33,43,54)] shadow-lg rounded-lg col-span-12 lg:col-span-8 space-y-5 p-6 pt-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex space-x-2 col-span-2 lg:col-span-1">
              <div className="relative">
                <input
                  defaultValue={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  id="first-name"
                  type="text"
                  className={`peer text-white bg-transparent border w-full px-2.5 py-3 rounded-lg focus:border-white hover:border-white border-color-primary `}
                />
                <label
                  className={`absolute text-base px-1 text-white peer-focus:-top-3 peer-focus:left-3 peer-focus:text-sm peer-focus:text-[rgb(99,115,129)] transition-all duration-300 bg-[rgb(33,43,54)] ${
                    firstName.length
                      ? "bg-[rgb(33,43,54)] text-[rgb(99,115,129)] left-3 text-sm -top-3"
                      : "top-3 left-4"
                  } cursor-text `}
                  htmlFor="first-name"
                >
                  Họ
                </label>
              </div>
              <div className="relative">
                <input
                  defaultValue={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  id="last-name"
                  type="text"
                  className={`peer text-white bg-transparent border w-full px-2.5 py-3 rounded-lg focus:border-white hover:border-white border-color-primary `}
                />
                <label
                  className={`absolute text-base px-1 text-white peer-focus:-top-3 peer-focus:left-3 peer-focus:text-sm peer-focus:text-[rgb(99,115,129)] transition-all duration-300 bg-[rgb(33,43,54)] ${
                    lastName.length
                      ? "bg-[rgb(33,43,54)] text-[rgb(99,115,129)] left-3 text-sm -top-3"
                      : "top-3 left-4"
                  } cursor-text `}
                  htmlFor="last-name"
                >
                  Tên
                </label>
              </div>
            </div>
            <div className="relative h-full flex items-center space-x-2 text-white">
              <span>Email:</span>
              <span className="text-sm font-semibold">{email}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative col-span-2 lg:col-span-1">
              <input
                defaultValue={phoneNumber && phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.valueAsNumber)}
                id="phone"
                type="number"
                className={`peer text-white bg-transparent border w-full px-2.5 py-3 rounded-lg focus:border-white hover:border-white border-color-primary `}
              />
              <label
                className={`absolute text-base px-1 text-white peer-focus:-top-3 peer-focus:left-3 peer-focus:text-sm peer-focus:text-[rgb(99,115,129)] transition-all duration-300 bg-[rgb(33,43,54)] ${
                  phoneNumber
                    ? "bg-[rgb(33,43,54)] text-[rgb(99,115,129)] left-3 text-sm -top-3"
                    : "top-3 left-4"
                } cursor-text `}
                htmlFor="phone"
              >
                Số điện thoại
              </label>
            </div>
            <div className="relative col-span-2 lg:col-span-1">
              <input
                defaultValue={address && address}
                onChange={(e) => setAddress(e.target.value)}
                id="address"
                type="text"
                className={`peer text-white bg-transparent border w-full px-2.5 py-3 rounded-lg focus:border-white hover:border-white border-color-primary `}
              />
              <label
                className={`absolute text-base px-1 text-white peer-focus:-top-3 peer-focus:left-3 peer-focus:text-sm peer-focus:text-[rgb(99,115,129)] transition-all duration-300 bg-[rgb(33,43,54)] ${
                  address && address.length
                    ? "bg-[rgb(33,43,54)] text-[rgb(99,115,129)] left-3 text-sm -top-3"
                    : "top-3 left-4"
                } cursor-text `}
                htmlFor="address"
              >
                Địa chỉ
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 lg:col-span-1">
              <DropMenu
                listMenu={listCity}
                selectValue={city ? city : "Chọn thành phố"}
                setSelectValue={setCity}
                classNameTitle="text-sm"
                classNameMenu="py-3.5"
                classDrop="h-[200px]"
                title="Thành phố"
              />
            </div>
            <div className="flex items-center space-x-4 mx-1 col-span-2 lg:col-span-1">
              <span className="text-white">Giới tính:</span>
              <Radio
                dfCheck={checkSex ? checkSex : "khác"}
                setDfCheck={setCheckSex}
                listRadio={sex}
                classNameList="flex items-center space-x-5 "
              />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="space-x-2 flex items-center lg:mb-0 mb-5">
              <span className="text-white ml-1">Ngày sinh:</span>
              <input
                id="birth-day"
                defaultValue={
                  birthDay && new Date(birthDay).toISOString().substr(0, 10)
                }
                onChange={(date: any) => date && setBirthDay(date.target.value)}
                className="bg-transparent border border-color-primary py-2 px-3 rounded-md select-none cursor-text text-white"
                type="date"
              />
            </div>
            <button
              onClick={handleUpdateProfile}
              className="text-white border flex items-center gap-1 border-color-primary rounded-md text-sm font-semibold px-4 py-2 hover:bg-green-500 hover:bg-opacity-10 cursor-pointer mr-2"
            >
              {loadingUpdateProfile && <LoadingBtn />}
              Lưu thay đổi
            </button>
          </div>
          <i className="block mt-5 text-red-500 opacity-70 text-[13px]">
            Thông tin sẽ được cập nhật lại khi đăng nhập lại!!
          </i>
        </div>
      </div>
    </>
  );
};
Profile.getLayout = function getLayout(page: ReactElement) {
  return <MainClient>{page}</MainClient>;
};
export default Profile;

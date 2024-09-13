import Cookies from "js-cookie";
import Link from "next/dist/client/link";
import { useRouter } from "next/dist/client/router";
import { SyntheticEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import validator from "validator";
import { MessValidatorRegis } from "../interfaces/main";
import { registerUser } from "../redux/apiReq";
import { registerFailed } from "../redux/authSlice";

const Register = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [hiddenPassword, setHiddenPassword] = useState("password");
  const [validatorMess, setValidatorMess] = useState<MessValidatorRegis>();

  const router = useRouter();
  const dispatch = useDispatch();
  const token = Cookies.get("token");

  const errMail = useSelector(
    (state: any) => state.auth.register.error?.response.data
  );

  const validatorForm = () => {
    const mess: any = {};

    if (validator.isEmpty(email)) {
      mess.email = "Không được bỏ trống Email";
    }
    if (validator.isEmpty(firstName)) {
      mess.firstName = "Không được bỏ trống Họ";
    }
    if (validator.isEmpty(lastName)) {
      mess.lastName = "Không được bỏ trống Tên";
    }
    if (validator.isEmpty(password)) {
      mess.password = "Không được bỏ trống mật khẩu";
    }

    if (!validator.isEmail(email)) {
      mess.email = "Email không hợp lệ";
    }

    if (errMail) {
      mess.email = "Email đã được sử dụng";
    }
    if (!validator.isLength(password, { min: 6 })) {
      mess.password = "Mật khẩu cần tối thiểu 6 ký tự";
    }
    if (!validator.matches(password, password2)) {
      mess.password2 = "Mật khẩu không khớp";
    }

    setValidatorMess(mess);
    if (Object.keys(mess).length > 0) return true;
    return false;
  };

  // const handleRegister = async (e: SyntheticEvent) => {
  //   setLoading(true);
  //   e.preventDefault();
  //   try {
  //     const valid = validatorForm();

  //     if (!valid) {
  //       try {
  //         const newAcc = {
  //           firstName: firstName,
  //           lastName: lastName,
  //           email: email,
  //           password: password,
  //         };
  //         await registerUser(newAcc, dispatch, router);
  //         toast.success("Đăng ký tài khoản thành công");
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleRegister = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const valid = validatorForm();

      if (!valid) {
        const newAcc = {
          firstName,
          lastName,
          email,
          password,
        };

        try {
          await registerUser(newAcc, dispatch, router);
          toast.success("Đăng ký tài khoản thành công");
        } catch (error) {
          console.error("Đăng ký thất bại:", error);
          toast.error("Đăng ký tài khoản thất bại. Vui lòng thử lại.");
        }
      }
    } catch (error) {
      console.error("Lỗi kiểm tra dữ liệu:", error);
      toast.error("Lỗi kiểm tra dữ liệu. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setValidatorMess(undefined);
    dispatch(registerFailed(undefined));
  }, [firstName, lastName, email, password, password2]);

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, []);

  return (
    <>
      <div className="bg-[rgb(22,28,36)] w-[90%] lg:w-2/4 xl:w-2/5 shadow-2xl rounded-xl py-8 md:py-12 text-xl mt-8 px-5 md:px-12 flex flex-col justify-center z-50">
        <div className="space-y-2">
          <h1 className=" text-white text-2xl sm:font-medium sm:text-3xl text-center">
            Chào mừng đến với FitFusionZone
          </h1>
        </div>
        <form
          onSubmit={(e) => handleRegister(e)}
          className="flex flex-col mt-2 md:mt-5"
        >
          <div className="relative my-7">
            <input
              type="text"
              id="first-name"
              autoComplete="off"
              className={`bg-transparent border-b-gray-400 border-b-2 w-full outline-none transition-colors peer focus:border-b-green-500 focus:text-green-500 ${
                firstName ? "text-gray-400" : "text-green-500"
              }`}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label
              htmlFor="first-name"
              className={`absolute mb-1 cursor-text peer-focus:text-sm peer-focus:bottom-8 text-gray-400 peer-focus:text-green-500 peer-focus:left-0 transition-all duration-300 ${
                firstName
                  ? "left-0 bottom-8 text-gray-500 text-sm"
                  : "left-1 bottom-1"
              }`}
            >
              Họ
            </label>
          </div>
          <p className="text-red-400 -mt-4 text-xs italic">
            {validatorMess?.firstName}
          </p>
          <div className="relative my-7">
            <input
              type="text"
              id="last-name"
              autoComplete="off"
              className={`bg-transparent  border-b-gray-400 border-b-2 w-full outline-none transition-colors peer focus:border-b-green-500 focus:text-green-500 ${
                lastName ? "text-gray-400" : "text-green-500"
              }`}
              onChange={(e) => setLastName(e.target.value)}
            />
            <label
              htmlFor="last-name"
              className={`absolute cursor-text mb-1 peer-focus:text-sm peer-focus:bottom-8 text-gray-400 peer-focus:text-green-500 peer-focus:left-0 transition-all duration-300 ${
                lastName
                  ? "left-0 bottom-8 text-gray-500 text-sm"
                  : "left-1 bottom-1"
              }`}
            >
              Tên
            </label>
          </div>
          <p className="text-red-400 -mt-4 text-xs italic">
            {validatorMess?.lastName}
          </p>
          <div className="relative my-7">
            <input
              type="email"
              id="email"
              autoComplete="off"
              className={`bg-transparent border-b-gray-400 border-b-2 w-full outline-none transition-colors peer focus:border-b-green-500 focus:text-green-500 ${
                email ? "text-gray-400" : "text-green-500"
              }`}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              htmlFor="email"
              className={`absolute cursor-text mb-1 peer-focus:text-sm peer-focus:bottom-8 text-gray-400 peer-focus:text-green-500 peer-focus:left-0 transition-all duration-300 ${
                email
                  ? "left-0 bottom-8 text-gray-500 text-sm"
                  : "left-1 bottom-1"
              }`}
            >
              Email
            </label>
          </div>
          <p className="text-red-400 -mt-4 text-xs italic">
            {validatorMess?.email}
          </p>
          <div className="relative my-7">
            <input
              type={hiddenPassword}
              id="password"
              autoComplete="off"
              className={`bg-transparent  border-b-gray-400 border-b-2 w-full outline-none transition-colors peer focus:border-b-green-500 focus:text-green-500 ${
                password ? "text-gray-400" : "text-green-500"
              }`}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label
              htmlFor="password"
              className={`absolute cursor-text mb-1 peer-focus:text-sm peer-focus:bottom-8 text-gray-400 peer-focus:text-green-500 peer-focus:left-0 transition-all duration-300 ${
                password
                  ? "left-0 bottom-8 text-gray-500 text-sm"
                  : "left-1 bottom-1"
              }`}
            >
              Mật khẩu
            </label>
            {hiddenPassword === "password" ? (
              <AiOutlineEyeInvisible
                className="absolute text-gray-400 right-10 cursor-pointer bottom-4 select-none"
                onClick={() => setHiddenPassword("text")}
              />
            ) : (
              <AiOutlineEye
                className="absolute right-10 cursor-pointer bottom-4 text-green-500 select-none"
                onClick={() => setHiddenPassword("password")}
              />
            )}
          </div>
          <p className="text-red-400 -mt-4 text-xs italic">
            {validatorMess?.password}
          </p>
          <div className="relative my-7">
            <input
              type={hiddenPassword}
              id="password2"
              autoComplete="off"
              className={`bg-transparent  border-b-gray-400 border-b-2 w-full outline-none transition-colors peer focus:border-b-green-500 focus:text-green-500 ${
                password2 ? "text-gray-400" : "text-green-500"
              }`}
              onChange={(e) => setPassword2(e.target.value)}
            />
            <label
              htmlFor="password2"
              className={`absolute cursor-text mb-1 peer-focus:text-sm peer-focus:bottom-8 text-gray-400 peer-focus:text-green-500 peer-focus:left-0 transition-all duration-300 ${
                password2
                  ? "left-0 bottom-8 text-gray-500 text-sm"
                  : "left-1 bottom-1"
              }`}
            >
              Xác nhận mật khẩu
            </label>
          </div>
          <p className="text-red-400 -mt-4 text-xs italic">
            {validatorMess?.password2}
          </p>
          <div className="mt-10 flex justify-evenly ">
            <Link href="/">
              <button
                type="button"
                className="bg-gray-400 flex text-white md:px-14 px-3 w-fit text-lg rounded-full py-2 hover:bg-gray-500 font-semibold"
              >
                <p>Trở về</p>
              </button>
            </Link>
            <button
              disabled={loading}
              type="submit"
              className="bg-[rgb(0,171,85)] px-3 text-white md:px-14 text-lg rounded-full py-2 hover:bg-opacity-75 font-semibold"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0z"
                    ></path>
                  </svg>
                  Đăng ký..
                </span>
              ) : (
                " Đăng ký"
              )}
            </button>
          </div>
        </form>

        <div className="text-gray-400 items-center justify-center mt-5 text-base flex ">
          Bạn đã có tài khoản?{" "}
          <Link href="/sign-in">
            <p className="hover:underline ml-1 cursor-pointer text-primary hover:text-opacity-80">
              Đăng nhập
            </p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Register;

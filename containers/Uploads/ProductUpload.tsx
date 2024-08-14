import React, {
  ReactElement,
  SyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IoIosClose } from "react-icons/io";
import { toast } from "react-toastify";
import { AiOutlineClear } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { useRouter } from "next/dist/client/router";
import { CreateProduct, UpdateProduct } from "../../services/product";
import TipTap from "../../components/Tiptap";
import Button from "../../components/Button";
import Radio from "../../components/Radio";
import DropMenu from "../../components/DropMenu";
import { ListProduct, ProductValidator } from "./../../interfaces/product.d";
import { getFullCategory } from "../../services/category";

const gender = [
  {
    id: "gender",
    name: "Gender",
    options: [
      { value: "men", label: "Men" },
      { value: "women", label: "Women" },
      { value: "kids", label: "Kids" },
    ],
  },
];

const color = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Lime",
  "Black",
  "White",
  "Pink",
  "Violet",
];

interface ProductUploadProps {
  productEdit?: ListProduct;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}
const ProductUpload = ({ productEdit, setOpen }: ProductUploadProps) => {
  const [dfCheck, setDfCheck] = useState("kids");
  const [categoryList, setCategoryList] = useState<any[]>();
  const [categoryValue, setCategoryValue] = useState<string>("");
  const [colorValue, setColorValue] = useState<string>("Black");
  const [colorSelected, setColorSelected] = useState<string[]>([]);
  const [sizeSelected, setSizeSelected] = useState<number[]>([]);
  const [sizeProduct, setSizeProduct] = useState<number>();
  const [preview, setPreview] = useState<string[]>([]);
  const [listImage, setListImage] = useState<string[]>([]);
  const [loadingUploadFiles, setLoadingUploadFiles] = useState(false);
  const [nameProduct, setNameProduct] = useState<string>("");
  const [descProduct, setDescProduct] = useState<string>("");
  const [quantityProduct, setQuantityProduct] = useState<number>();

  const [descProductEdit, setDescProductEdit] = useState<string>("");

  console.log(descProductEdit.length, "descProductEdit");

  const [idProductEdit, setIdProductEdit] = useState<string>("");
  const [priceProduct, setPriceProduct] = useState<number>(0);
  const [validatorMess, setValidatorMess] = useState<ProductValidator>();

  const router = useRouter();

  const sizeRef = useRef<any>();

  const validatorForm = () => {
    const mess: any = {};

    if (!nameProduct) {
      mess.name = "Hãy nhập tên sản phẩm";
    }

    if (!descProduct && !descProductEdit) {
      mess.desc = "Hãy tạo thêm mô tả cho sản phẩm của bạn";
    }

    if (loadingUploadFiles) {
      mess.img = "vui lòng đợi upload ảnh";
    } else if (listImage.length === 0) {
      mess.img = "Mỗi sản phẩm phải có ít nhất 1 - 2 bức ảnh";
    }

    if (sizeSelected.length === 0) {
      mess.size = "Hãy thêm size cho sản phẩm";
    }

    if (priceProduct === 0) {
      mess.price = "Giá không thể là 0";
    }
    if (quantityProduct === 0) {
      mess.quantity = "Số lượng sản phẩm tối thiếu là 1";
    }

    setValidatorMess(mess);
    if (Object.keys(mess).length > 0) return true;
    return false;
  };

  const handleMultipleImage = (e: any) => {
    const files = e.target.files;
    let previewArr: string[] = [];
    for (var i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onload = function (onLoadEvent: any) {
        previewArr.push(onLoadEvent.target.result);
        setPreview(preview.concat(previewArr));
      };
    }
  };
  const handleOnSubmitMultiple = async (event: any) => {
    event.preventDefault();
    try {
      setLoadingUploadFiles(true);
      const form = event.currentTarget;
      const fileInput: any = Array.from(form.elements).find(
        ({ name }: any) => name === "multiple-file"
      );
      const formData = new FormData();
      let dataUrl: string[] = [];

      for (const file of fileInput.files) {
        formData.append("file", file);
        formData.append("upload_preset", "e-commerce");
        const data = await fetch(
          "https://api.cloudinary.com/v1_1/dd4way43x/image/upload",
          {
            method: "POST",
            body: formData,
          }
        ).then((r) => r.json());
        dataUrl.push(data.url);
      }
      setListImage(dataUrl);
      if (dataUrl) {
        toast.success("Đã tải ảnh lên!");
      }
      setLoadingUploadFiles(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteImage = (item: string) => {
    const res = preview.filter((data) => item !== data);
    setPreview(res);
  };

  useEffect(() => {
    if (!colorSelected.includes(colorValue)) {
      setColorSelected([...colorSelected, colorValue]);
    }
  }, [colorValue]);

  const handleDeleteColor = (item: string) => {
    const res = colorSelected.filter((color) => item !== color);
    setColorSelected(res);
  };

  const handleDeleteSize = (item: number) => {
    const res = sizeSelected.filter((size) => item !== size);
    setSizeSelected(res);
  };

  const handleSelectSize = (e: SyntheticEvent) => {
    e.preventDefault();
    if (sizeProduct && !sizeSelected.includes(sizeProduct)) {
      setSizeSelected([...sizeSelected, sizeProduct]);
      setSizeProduct(0);
      sizeRef.current.focus();
    }
  };

  const handleGetCategory = async () => {
    const res = await getFullCategory();
    setCategoryList(res.data);
  };

  console.log({ descProductEdit });
  const handleProduct = async () => {
    try {
      validatorForm();
      if (
        (nameProduct.length > 0,
        descProduct,
        listImage.length > 0,
        dfCheck,
        categoryValue,
        colorSelected.length > 0,
        priceProduct,
        sizeSelected.length > 0,
        quantityProduct)
      ) {
        const colorLower = colorSelected.map((element) => {
          return element.toLowerCase();
        });
        const product = {
          id: idProductEdit,
          name: nameProduct,
          desc:
            descProductEdit.length === 0
              ? descProduct
              : descProductEdit.includes("important")
              ? descProductEdit
              : descProduct,
          image: listImage,
          gender: dfCheck,
          category: categoryValue,
          color: colorLower,
          price: priceProduct,
          size: sizeSelected,
          quantity: quantityProduct,
        };
        console.log(product, "productxxx");
        if (productEdit) {
          const res = await UpdateProduct(product);
          if (res.status === 200) {
            toast.success("Cập nhật thành công!");
            if (setOpen) setOpen(false);
          }
        } else {
          const res = await CreateProduct(product);
          if (res.status === 200) {
            router.push("/dashboard/product/manage-product");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (productEdit) {
      console.log({ productEdit });
      setDfCheck(String(productEdit.gender).toLocaleLowerCase());
      setCategoryValue(productEdit.category.name);
      setColorSelected(productEdit.color);
      setSizeSelected(productEdit.size);
      setPreview(productEdit.listImage);
      setListImage(productEdit.listImage);
      setNameProduct(productEdit.name);
      setDescProductEdit(productEdit.description);
      setPriceProduct(productEdit.price);
      setIdProductEdit(productEdit.id);
      setQuantityProduct(productEdit.quantity);
    }
  }, [productEdit]);

  console.log({ productEdit });

  useEffect(() => {
    handleGetCategory();
  }, []);

  const category = useMemo(() => {
    if (categoryList) {
      setCategoryValue(categoryList[0]?.name);
      return categoryList.map((item) => item.name);
    } else {
      return [];
    }
  }, [categoryList]);

  return (
    <>
      <div className="grid grid-cols-12 max-[1200px]:gap-y-4 gap-x-6">
        <div className="col-span-12 min-[1200px]:col-span-8 bg-[rgb(33,43,54)] p-6 rounded-2xl">
          <div className="relative">
            <input
              value={nameProduct}
              onChange={(e) => setNameProduct(e.target.value)}
              id="name-product"
              type="text"
              className={`peer text-white bg-transparent border w-full px-2.5 py-3 rounded-lg focus:border-white hover:border-white border-color-primary ${
                validatorMess?.name && "border-red-500"
              }`}
            />
            <label
              className={`absolute text-base px-1 text-[rgb(99,115,129)] peer-focus:-top-3 peer-focus:left-3 peer-focus:text-sm peer-focus:text-white transition-all duration-300 bg-[rgb(33,43,54)] ${
                nameProduct.length
                  ? "bg-[rgb(33,43,54)] text-white left-3 text-sm -top-3"
                  : "top-3 left-4"
              } ${validatorMess?.name && "text-red-500"} cursor-text `}
              htmlFor="name-product"
            >
              Tên sản phẩm
            </label>
          </div>
          {validatorMess?.name && (
            <i className="text-red-500 text-xs pl-1">{validatorMess.name}</i>
          )}
          <div className="mt-6">
            <span className="text-sm font-semibold text-[rgb(145,158,171)]">
              Description
            </span>

            <TipTap
              validator={validatorMess?.desc}
              descValue={descProductEdit}
              setDesc={setDescProduct}
            />
          </div>
          {validatorMess?.desc && (
            <i className="text-red-500 text-xs pl-1">{validatorMess.desc}</i>
          )}

          <form
            onChange={(e) => handleMultipleImage(e)}
            onSubmit={(e) => handleOnSubmitMultiple(e)}
          >
            <div className="mt-6">
              <span className="text-sm font-semibold text-[rgb(145,158,171)]">
                Image
              </span>
              <label htmlFor="dropzone-file" className="cursor-pointer">
                <div
                  className={`select-none cursor-pointer border border-color-primary border-dashed p-10 rounded-2xl mt-2 bg-[rgba(145,158,171,0.16)] ${
                    validatorMess?.img &&
                    "bg-[rgb(255,233,213)] border-[rgb(255,172,130)]"
                  }`}
                >
                  <input
                    name="multiple-file"
                    accept="image/*"
                    id="dropzone-file"
                    multiple
                    type="file"
                    className="hidden"
                  />
                  <div className="flex items-center space-x-4">
                    <img
                      className="w-1/3"
                      src="/images/svg/upload-image.svg"
                      alt="Upload Image Cuc Shoes"
                    />
                    <div>
                      <h5
                        className={`text-xl text-white m-0 ${
                          validatorMess?.img && "text-red-500"
                        }`}
                      >
                        Drop or Select file
                      </h5>
                      <p className="text-sm text-[rgb(145,158,171)]">
                        Drop files here or click{" "}
                        <span className="underline text-green-500">browse</span>{" "}
                        thorough your machine
                      </p>
                    </div>
                  </div>
                </div>
              </label>
            </div>
            <div className="mt-6">
              {preview.length > 0 && (
                <span className="text-sm font-semibold text-[rgb(145,158,171)]">
                  Preview
                </span>
              )}
              <div className="flex items-center pl-4 space-x-2 mt-2">
                {preview.length > 0 &&
                  preview.map((item, index) => (
                    <div key={index} className="relative w-20 h-20">
                      <img
                        className="w-full h-full rounded-md object-cover"
                        src={item}
                        alt=""
                      />
                      <div
                        onClick={() => handleDeleteImage(item)}
                        className="absolute bg-[rgba(22,28,36,0.48)] text-white text-opacity-70 hover:text-opacity-100 cursor-pointer hover:bg-[rgba(22,28,36,0.7)] rounded-full top-1 right-1"
                      >
                        <IoIosClose />
                      </div>
                    </div>
                  ))}
              </div>
              {preview.length > 0 && (
                <div className="flex justify-end mt-6 space-x-3">
                  <button
                    onClick={() => setPreview([])}
                    className="border border-color-primary h-7 hover:border-white rounded-lg px-2.5 py-0.5 min-w-[64px] text-[13px] flex items-center justify-center font-bold text-white"
                  >
                    <p>Remove All</p>
                  </button>
                  <Button
                    loading={loadingUploadFiles}
                    submit
                    label="Upload Files"
                    className="h-7 bg-green-500 hover:bg-green-600 rounded-lg px-2.5 py-0.5 min-w-[64px] text-[13px] flex items-center justify-center font-bold text-white"
                  />
                </div>
              )}
            </div>
          </form>
          {validatorMess?.img && (
            <i className="text-red-500 text-xs pl-1">{validatorMess.img}</i>
          )}
        </div>
        <div className="col-span-12 min-[1200px]:col-span-4">
          <div className="bg-[rgb(33,43,54)] rounded-2xl p-6 space-y-8">
            <Radio
              dfCheck={dfCheck}
              setDfCheck={setDfCheck}
              listRadio={gender}
              classNameList="flex items-center space-x-5 "
            />
            <DropMenu
              listMenu={category}
              selectValue={categoryValue}
              setSelectValue={setCategoryValue}
              classNameMenu="py-3"
              classNameTitle="text-xs"
              title="Category"
            />
            <div>
              {sizeSelected.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-[rgb(145,158,171)]">
                    Color Selected
                  </p>
                  <div className="flex items-center flex-wrap">
                    {sizeSelected.map((item, idx) => (
                      <div
                        className="relative group mt-2 mr-2 text-white text-xs bg-[rgba(145,158,171,0.16)] p-1 rounded-md"
                        key={idx}
                      >
                        {item}
                        <div
                          onClick={() => handleDeleteSize(item)}
                          className="absolute hidden group-hover:block bg-[rgba(22,28,36,0.48)] text-white text-opacity-70 hover:text-opacity-100 cursor-pointer hover:bg-red-500 hover:bg-opacity-70 rounded-full -top-1 -right-1"
                        >
                          <IoIosClose />
                        </div>
                      </div>
                    ))}
                    <div
                      onClick={() => setSizeSelected([])}
                      className="bg-[rgba(22,28,36,0.48)] cursor-pointer flex items-center justify-center h-full text-white p-1 mt-2 rounded-full hover:text-red-500"
                    >
                      <AiOutlineClear />
                    </div>
                  </div>
                </div>
              )}
              <form onSubmit={(e) => handleSelectSize(e)} className="relative">
                <input
                  ref={sizeRef}
                  type="number"
                  value={sizeProduct}
                  onChange={(e) => setSizeProduct(e.target.valueAsNumber)}
                  placeholder="38"
                  className={`text-white text-sm bg-transparent border w-full px-2.5 py-3 rounded-lg placeholder:text-[rgb(99,115,129)] focus:border-white hover:border-white border-color-primary ${
                    validatorMess?.size && "border-red-500"
                  }`}
                />
                <label
                  className={`absolute px-1 text-[rgb(99,115,129)] -top-2 left-3 text-xs bg-[rgb(33,43,54)] ${
                    validatorMess?.size && "text-red-500"
                  }`}
                >
                  Size
                </label>
                {sizeProduct && String(sizeProduct).length > 0 ? (
                  <button
                    type="submit"
                    className="absolute right-2 rounded-md top-3 bg-[rgba(145,158,171,0.16)] text-white hover:text-green-500 p-1"
                  >
                    <BsCheckLg className="text-xs " />
                  </button>
                ) : (
                  <></>
                )}
              </form>
              {validatorMess?.size && (
                <i className="text-red-500 text-xs pl-1">
                  {validatorMess.size}
                </i>
              )}
            </div>
            <div className="relative">
              <input
                type="number"
                value={quantityProduct}
                onChange={(e) => setQuantityProduct(e.target.valueAsNumber)}
                placeholder="1"
                className={`text-white text-sm bg-transparent border w-full px-2.5 py-3 rounded-lg placeholder:text-[rgb(99,115,129)] focus:border-white hover:border-white border-color-primary ${
                  validatorMess?.quantity && "border-red-500"
                }`}
              />
              <label
                className={`absolute px-1 text-[rgb(99,115,129)] -top-2 left-3 text-xs bg-[rgb(33,43,54)] ${
                  validatorMess?.quantity && "text-red-500"
                }`}
              >
                Sô lượng
              </label>
            </div>
            {validatorMess?.quantity && (
              <i className="text-red-500 text-xs pl-1">{validatorMess.name}</i>
            )}
            <div>
              {colorSelected.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-[rgb(145,158,171)]">
                    Color Selected
                  </p>
                  <div className="flex items-center flex-wrap">
                    {colorSelected.map((item, idx) => (
                      <div
                        className="relative group mt-2 mr-2 text-white text-xs bg-[rgba(145,158,171,0.16)] p-1 rounded-md"
                        key={idx}
                      >
                        {item}
                        <div
                          onClick={() => handleDeleteColor(item)}
                          className="absolute hidden group-hover:block bg-[rgba(22,28,36,0.48)] text-white text-opacity-70 hover:text-opacity-100 cursor-pointer hover:bg-red-500 hover:bg-opacity-70 rounded-full -top-1 -right-1"
                        >
                          <IoIosClose />
                        </div>
                      </div>
                    ))}
                    <div
                      onClick={() => setColorSelected([])}
                      className="bg-[rgba(22,28,36,0.48)] cursor-pointer flex items-center justify-center h-full text-white p-1 mt-2 rounded-full hover:text-red-500"
                    >
                      <AiOutlineClear />
                    </div>
                  </div>
                </div>
              )}
              <DropMenu
                listMenu={color}
                selectValue={colorValue}
                setSelectValue={setColorValue}
                classNameMenu="py-3"
                title="Color"
              />
            </div>
            <div className="relative">
              <input
                value={priceProduct}
                onChange={(e) => setPriceProduct(e.target.valueAsNumber)}
                type="number"
                placeholder="10.000"
                className={`text-white text-sm bg-transparent border pl-5 w-full px-2.5 py-3 rounded-lg placeholder:text-[rgb(99,115,129)] focus:border-white hover:border-white border-color-primary ${
                  validatorMess?.price && "border-red-500"
                }`}
              />
              <span className="absolute top-[12.8px] text-sm font-semibold left-2 text-[rgb(99,115,129)]">
                đ
              </span>
              <label
                className={`absolute px-1 text-[rgb(99,115,129)] -top-2 left-3 text-xs bg-[rgb(33,43,54)] ${
                  validatorMess?.price && "text-red-500"
                }`}
              >
                Giá sản phẩm
              </label>
            </div>
            {validatorMess?.price && (
              <i className="text-red-500 text-xs pl-1">{validatorMess.price}</i>
            )}
          </div>

          {productEdit ? (
            <button
              onClick={handleProduct}
              className={`mt-4 bg-green-500 hover:bg-green-600 w-full px-5 py-3 rounded-lg select-none text-white text-base font-bold`}
            >
              Update Product
            </button>
          ) : (
            <button
              onClick={handleProduct}
              className={`mt-4 bg-green-500 hover:bg-green-600 w-full px-5 py-3 rounded-lg select-none text-white text-base font-bold`}
            >
              Create Product
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default ProductUpload;

import * as React from "react";
import * as yup from "yup";
import Axios from "axios";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { Select, MenuItem } from "@mui/material";
import { InputLabel } from "@mui/material";
import { FormControl } from "@mui/material";
import { display, margin } from "@mui/system";
import { Box, Button, TextField, Fab, Modal } from "@mui/material";
import { useParams, useNavigate } from 'react-router-dom';
import { Formik } from "formik";
import axios from "axios";
import DeleteOutlineSharpIcon from "@mui/icons-material/DeleteOutlineSharp";
import EditIcon from '@mui/icons-material/Edit';

const Form = ({ mode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [openModal, setOpenModal] = React.useState(false);
  const [currentSize, setCurrentSize] = React.useState({
    sizeId: "",
    sizeName: "",
    quantity: "",
    quantitySold: 0,
    remainQuantity: 0,
  });
  const [currentImageUrl, setCurrentImageUrl] = React.useState({imageId: "", imageUrl: ""});
  const [initialValues, setInitialValues] = React.useState({
    product_name:"",
    category: "SHOE",
    description: "",
    price: 0,
    saleprice: 0,
    sizes: [],
    imageUrls: [],
  });
  React.useEffect(() => {
    if (mode === 'edit' && id) {
      axios.get(`http://localhost:8004/product/${id}`)
        .then(async response => {
          const productData = response.data;
          setInitialValues(prevValues => ({
            ...prevValues,
            product_name: productData.name,
            category: productData.category,
            description: productData.description,
            price: productData.price,
            saleprice:productData.saleprice
          }));
          const sizesResponse = await axios.get(`http://localhost:8004/product/size/${productData.product_id}`);
          const sizesData = sizesResponse.data;
          setInitialValues(prevValues => ({
            ...prevValues,
            sizes: sizesData.map(size => ({sizeId:size.sizeId, sizeName: size.sizeName, quantity: size.quantity, remainQuantity: size.remainQuantity, quantitySold: size.quantitySold }))
          }));
          sessionStorage.setItem('listCurrentSizes', JSON.stringify(sizesData));
          const imageUrlsResponse = await axios.get(`http://localhost:8004/product/image/${productData.product_id}`);
          const imageUrlsData = imageUrlsResponse.data;
          setInitialValues(prevValues => ({
            ...prevValues,
            imageUrls: imageUrlsData.map(image => ({imageId:image.imageId, imageUrl: image.imageUrl}))
          }));
          console.log('SIIIZIID',productData);
          sessionStorage.setItem('listCurrentImages', JSON.stringify(imageUrlsData))
        })
        .catch(error => {
          console.error('Error fetching product data:', error);
        });
    }
  }, [id, mode]);

  const { v4: uuidv4 } = require("uuid");

  const handleOpenModal = (size) => {
    setCurrentSize({
      sizeId: size.sizeId,
      sizeName: size.sizeName,
      quantity: size.quantity,
      quantitySold: size.quantitySold,
      remainQuantity: size.remainQuantity,
    });
    setOpenModal(true);
  };
  

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAddSize = (values, setValues) => {
    const updatedValues = { ...values };
    if (!updatedValues.sizes) {
      updatedValues.sizes = [];
    }
    updatedValues.sizes.push({sizeId: uuidv4(), sizeName: currentSize.sizeName, quantity: currentSize.quantity, remainQuantity: currentSize.quantity});
    setValues(updatedValues);
    setCurrentSize({sizeId:"", sizeName: "", quantity: "",quantitySold: 0, remainQuantity: 0, });
    handleCloseModal();
  };

  const handleEditSize = (values, setValues) => {
    const updatedValues = { ...values };
    const updatedSizes = updatedValues.sizes.map((size) =>
      size.sizeId === currentSize.sizeId
        ? { ...size, sizeName: currentSize.sizeName, quantity: currentSize.quantity,
          quantitySold: currentSize.quantitySold, remainQuantity: (currentSize.quantity - currentSize.quantitySold) }
        : size
    );
    setValues({ ...updatedValues, sizes: updatedSizes });
    setCurrentSize({ sizeId: "", sizeName: "", quantity: "", quantitySold: 0, remainQuantity: 0, });
  };
  

  const handleAddImageUrl = (values, setValues) => {
    const updatedValues = { ...values };
    if (!updatedValues.imageUrls) {
      updatedValues.imageUrls = [];
    }
    updatedValues.imageUrls.push({imageId: uuidv4(), imageUrl: currentImageUrl.imageUrl.trim()});
    setValues(updatedValues);
    setCurrentImageUrl({imageId: "", imageUrl: ""});
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    const addedSizes = [];
    const deletedSizes = [];
    const updatedSizes = [];
    const addedImages = [];
    const deletedImages = [];

    try {
        let productData;
        if (mode === 'edit' && id) {
            productData = {
                product_id: id,
                name: values.product_name,
                category: values.category,
                description: values.description,
                price: values.price,
                saleprice: values.saleprice,
            };

            const sizesValuesCopy = [...values.sizes];
            const imageUrlsValuesCopy = [...values.imageUrls];
            const listCurrentImages = [...JSON.parse(sessionStorage.getItem('listCurrentImages'))];
            const listCurrentSizes = [...JSON.parse(sessionStorage.getItem('listCurrentSizes'))];

            sizesValuesCopy.forEach(size => {
                const existingSize = listCurrentSizes.find(initialSize => initialSize.sizeId === size.sizeId);
                if (existingSize) {
                    if (existingSize.sizeName !== size.sizeName || existingSize.quantity !== size.quantity || existingSize.remainQuantity !== size.remainQuantity || existingSize.quantitySold !== size.quantitySold) {
                        updatedSizes.push(size);
                    }
                } else {
                    addedSizes.push(size);
                }
            });

            listCurrentSizes.forEach(initialSize => {
              const isDeletedSize = !sizesValuesCopy.some(size => size.sizeId === initialSize.sizeId);
              if (isDeletedSize) {
                deletedSizes.push(initialSize.sizeId);
              }
            });

            imageUrlsValuesCopy.forEach(image => {
                const isNewImage = !listCurrentImages.some(initialImage => initialImage.imageId === image.imageId);
                if (isNewImage) {
                    addedImages.push(image);
                }
            });

            listCurrentImages.forEach(initialImage => {
                const isDeletedImage = !imageUrlsValuesCopy.some(image => image.imageId === initialImage.imageId);
                if (isDeletedImage) {
                    deletedImages.push(initialImage.imageId);
                }
            });

            const performChanges = async () => {
                const productResponse = await Axios.put('http://localhost:8004/products', productData);

                if (deletedSizes.length) {
                    await Promise.all(
                        deletedSizes.map(async (sizeId) => {
                            await axios.delete(`http://localhost:8004/product/size/${sizeId}`);
                        })
                    );
                }

                if (deletedImages.length) {
                    await Promise.all(
                        deletedImages.map(async (imageId) => {
                            await axios.delete(`http://localhost:8004/product/image/${imageId}`);
                        })
                    );
                }

                if (updatedSizes.length) {
                    await Promise.all(
                        updatedSizes.map(async (size) => {
                            await axios.put(`http://localhost:8004/product/size`, {
                                productId: id,
                                ...size
                            });
                        })
                    );
                }

                if (addedSizes) {
                  await Promise.all(
                    addedSizes.map(async (size) => {
                        await axios.post(`http://localhost:8004/product/size`, {
                            productId: id,
                            ...size
                        });
                    })
                );
                }

                if (addedImages.length) {
                  await Promise.all(
                    addedImages.map(async (image) => {
                      await axios.post(`http://localhost:8004/product/image`, {
                        productId: id,
                        ...image,
                      });
                    })
                  );
                }
            };

            performChanges()
                .then(() => {
                    console.log("Thay đổi đã được thực hiện thành công!");
                })
                .catch(error => {
                    console.error("Đã xảy ra lỗi khi thực hiện thay đổi:", error);
                });
            navigate(`/admin/form`);
        } else {
            const productId = uuidv4();
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString();
            productData = {
                product_id: productId,
                name: values.product_name,
                category: values.category,
                description: values.description,
                price: values.price,
                saleprice: values.saleprice,
                createdDate: formattedDate
            };
            const productResponse = await Axios.post('http://localhost:8004/products', productData);
            for (const size of values.sizes) {
                await Axios.post('http://localhost:8004/product/size', {
                    productId: productId,
                    sizeName: size.sizeName,
                    quantity: size.quantity,
                    sizeId: size.sizeId,
                    remainQuantity: size.quantity
                });
            }
            for (const image of values.imageUrls) {
                await Axios.post('http://localhost:8004/product/image', {
                    imageId: image.imageId,
                    productId: productId,
                    imageUrl: image.imageUrl,
                });
            }
            console.log('Product details (including sizes and images) successfully saved.');
        }
        resetForm({
            values: {
                product_name: "",
                category: "SHOE",
                description: "",
                price: 0,
                saleprice: 0,
                sizes: [],
                imageUrls: [],
            }
        });
    } catch (error) {
        console.error('Error while calling API:', error);
    }
};


  const handleRemoveSize = (index, values, setValues) => {
    const updatedSizes = [...values.sizes];
    updatedSizes.splice(index, 1);
    setValues({
      ...values,
      sizes: updatedSizes,
    });
  };
  

  const options = [
    { label: "Giày dép", value: "SHOE" },
    { label: "Quần áo", value: "CLOTHES" },
    { label: "Túi xách", value: "HANDBAG" },
    { label: "Phụ kiện", value: "ACCESSORY" },
  ];

  return (
    <Box m="20px">
      <Header
        title={mode === "edit" ? "CHỈNH SỬA SẢN PHẨM" : "THÊM SẢN PHẨM MỚI"}
        subtitle={
          mode === "edit"
            ? "Chỉnh sửa thông tin chi tiết của sản phẩm"
            : "Tạo sản phẩm mới"
        }
      />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        enableReinitialize={true}
        //  validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setValues,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Tên sản phẩm"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.product_name}
                name="product_name"
                sx={{ gridColumn: "span 2" }}
              />
              <FormControl
                variant="filled"
                fullWidth
                sx={{ gridColumn: "span 2" }}
              >
                <InputLabel id="category-label">Danh mục</InputLabel>
                <Select
                  id="category"
                  name="category"
                  label="Colors"
                  value={values.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {options.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Giá gốc"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.price}
                name="price"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Giá bán"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.saleprice}
                name="saleprice"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Mô tả"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                sx={{
                  gridColumn: "span 2",
                  marginBottom: "20px",
                  gridRow: "span 2",
                }}
              />
            </Box>

            {Array.isArray(values.sizes) &&
              values.sizes.map((size, index) => (
                <Box
                  key={index}
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(7, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 5",
                    },
                  }}
                >
                  <React.Fragment key={index}>
                    <Typography
                      variant="filled"
                      sx={{
                        gridColumn: "span 1",
                        //  ml: "20px",
                        fontSize: "15px",
                      }}
                    >
                      Size {index + 1}:
                    </Typography>
                    <Typography
                      variant="filled"
                      sx={{ gridColumn: "span 1", fontSize: "15px" }}
                    >
                      Tên size: {size.sizeName}
                    </Typography>
                    <Typography
                      variant="filled"
                      sx={{ gridColumn: "span 1", fontSize: "15px" }}
                    >
                      Số lượng: {size.quantity}
                    </Typography>
                    <Typography
                      variant="filled"
                      sx={{ gridColumn: "span 1", fontSize: "15px" }}
                    >
                      Còn lại: {size.remainQuantity}
                    </Typography>
                    <Typography
                      variant="filled"
                      sx={{ gridColumn: "span 1", fontSize: "15px" }}
                    >
                      Đã bán: {size.quantitySold}
                    </Typography>
                    <Button
                      type="button"
                      color="secondary"
                      variant="contained"
                      sx={{ gridColumn: "span 1", maxWidth: "30%" }}
                      onClick={() => handleRemoveSize(index, values, setValues)}
                    >
                      <DeleteOutlineSharpIcon />
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      variant="contained"
                      sx={{ gridColumn: "span 1", maxWidth: "30%" }}
                      onClick={() => handleOpenModal(size)}
                    >
                      <EditIcon />
                    </Button>
                  </React.Fragment>
                </Box>
              ))}
            {Array.isArray(values.imageUrls) &&
              values.imageUrls.map((img, index) => (
                <Box
                  key={index}
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                  }}
                >
                  <img
                    src={img.imageUrl}
                    alt={`Image ${index + 1}`}
                    // sx={{ gridColumn: "span 1" }}
                    style={{
                      maxWidth: "150px",
                      maxHeight: "150px",
                      marginTop: "20px",
                      border: "1px solid #ffffff",
                    }}
                  />
                  <Button
                    type="button"
                    color="secondary"
                    variant="contained"
                    style={{
                      maxWidth: "10px",
                      maxHeight: "20px",
                      margin: "auto",
                      border: "1px solid #ffffff",
                    }}
                    onClick={() => {
                      const updatedUrls = [...values.imageUrls];
                      updatedUrls.splice(index, 1);
                      setValues({
                        ...values,
                        imageUrls: updatedUrls,
                      });
                    }}
                  >
                    <DeleteOutlineSharpIcon />
                  </Button>
                </Box>
              ))}
            <Box
              style={{ marginTop: "10px" }}
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Link ảnh"
                onBlur={handleBlur}
                onChange={(e) =>
                  setCurrentImageUrl({
                    ...currentImageUrl,
                    imageUrl: e.target.value,
                  })
                }
                value={currentImageUrl.imageUrl}
                name="newImageUrl"
                sx={{ gridColumn: "span 2" }}
              />
              <Button
                type="button"
                color="secondary"
                variant="contained"
                onClick={() => handleAddImageUrl(values, setValues)}
                sx={{ gridColumn: "span 1", ml: 2, mt: 2 }}
              >
                Thêm ảnh
              </Button>
            </Box>

            <Button
              type="button"
              color="secondary"
              variant="contained"
              onClick={handleOpenModal}
              sx={{ gridColumn: "span 1", ml: 2, mt: 2 }}
            >
              Thêm size mới
            </Button>
            <Modal
              open={openModal}
              onClose={handleCloseModal}
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <Typography variant="h6">
                  {currentSize.sizeId ? "Chỉnh sửa size" : "Thêm size mới"}
                </Typography>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Tên size"
                  onBlur={handleBlur}
                  onChange={(e) =>
                    setCurrentSize({ ...currentSize, sizeName: e.target.value })
                  }
                  value={currentSize.sizeName}
                  name="newSize.sizeName"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label="Số lượng"
                  onBlur={handleBlur}
                  onChange={(e) =>
                    setCurrentSize({ ...currentSize, quantity: e.target.value })
                  }
                  value={currentSize.quantity}
                  name="newSize.quantity"
                  sx={{ mb: 2 }}
                />
                <Button
                  type="button"
                  color="secondary"
                  variant="contained"
                  onClick={() => (
                    currentSize.sizeId
                      ? handleEditSize(values, setValues)
                      : handleAddSize(values, setValues),
                    handleCloseModal()
                  )}
                >
                  {currentSize.sizeId ? "Lưu chỉnh sửa" : "Thêm size"}
                </Button>
              </Box>
            </Modal>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                {mode === "edit" ? "Lưu thay đổi" : "Tạo mới"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  sizes: yup.array().of(
    yup.object().shape({
      name: yup.string().required("required"),
      quantity: yup.number().required("required"),
    })
  ),
  newSize: yup.object().shape({
    name: yup.string().required("required"),
    quantity: yup.number().required("required"),
  }),
  name: yup.string().required("required"),
  category: yup.string().required("required"),
  description: yup.string().required("required"),
  price: yup.number().required("required"),
});

export default Form;

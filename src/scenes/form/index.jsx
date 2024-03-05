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
import { Formik } from "formik";
import axios from "axios";
import DeleteOutlineSharpIcon from "@mui/icons-material/DeleteOutlineSharp";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [openModal, setOpenModal] = React.useState(false);
  const [currentSize, setCurrentSize] = React.useState({
    name: "",
    quantity: "",
  });
  const [currentImageUrl, setCurrentImageUrl] = React.useState("");

  const { v4: uuidv4 } = require("uuid");

  // Tạo product_id ngẫu nhiên
  const productId = uuidv4();
  const sizeId = uuidv4();
  const imageId = uuidv4();

  const handleOpenModal = () => {
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
    updatedValues.sizes.push({ name: currentSize.name, quantity: currentSize.quantity });
    setValues(updatedValues);
    setCurrentSize({ name: "", quantity: "" });
    handleCloseModal();
  };
  

  const handleAddImageUrl = (values, setValues) => {
    if (currentImageUrl.trim() !== "") {
      setValues({
        ...values,
        imageUrls: [...values.imageUrls, currentImageUrl.trim()]
      });
      setCurrentImageUrl("");
    }
  };
  // const handleFormSubmit = async(values) => {
  //   console.log('submit');
  // }
  const handleFormSubmit = async(values) => {
    console.log("1111", values);
    try {
    console.log(22222);
      const productResponse = await Axios.post('http://localhost:8004/products', {
        product_id: 'hghhfhghfd',
        name: values.product_name,
        category: values.category,
        description: values.description,
        price: values.price,
      });
      for (const size of values.sizes) {
        await Axios.post('http://localhost:8004/product/size', {
          productId: productId,
          sizeName: size.name,
          quantity: size.quantity,
          sizeId: sizeId
        });
      }
      for (const imageUrl of values.imageUrls) {
        await Axios.post('http://localhost:8004/product/image', {
          imageId: imageId,
          productId: productId,
          imageUrl: imageUrl,
        });
      }
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
    { label: "SHOE", value: "shoe" },
    { label: "CLOTHES", value: "clothes" },
    { label: "HANDBAG", value: "handbag" },
    { label: "ACCESSORY", value: "accessory" },
  ];

  return (
    <Box m="20px">
      <Header
        title="ADD PRODUCT"
        subtitle="Create a new product with size and image"
      />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setValues,
        }) => (
         // <form >
         <form onSubmit={handleFormSubmit}>
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
                label = "Product name"
                onBlur = {handleBlur}
                onChange = {handleChange}
                value = {values.product_name}
                name="product_name"
                sx={{ gridColumn: "span 2" }}
              />
              <FormControl
                variant="filled"
                fullWidth
                sx={{ gridColumn: "span 2" }}
              >
                <InputLabel id="category-label">Category</InputLabel>
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
                label="Price"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.price}
                name="price"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                sx={{ gridColumn: "span 2", marginBottom:'20px' }}
              />
            </Box>
            
            {values.sizes && values.sizes.map((size, index) => (
              <Box
              key={index}
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
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
                  Name: {size.name}
                </Typography>
                <Typography
                  variant="filled"
                  sx={{ gridColumn: "span 1", fontSize: "15px" }}
                >
                  Quantity: {size.quantity}
                </Typography>
                <Button
                  type="button"
                  color="secondary"
                  variant="contained"
                  sx={{ gridColumn: "span 1", maxWidth:'30%' }}
                  onClick={() => handleRemoveSize(index, values, setValues)}
                >
                  <DeleteOutlineSharpIcon />
                </Button>
                
              </React.Fragment>

            </Box>
              
            ))}
            {values.imageUrls.map((url, index) => (
              <Box
                key={index}
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <img
                  src={url}
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
                    margin: 'auto',
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
                label="Image URL"
                onBlur={handleBlur}
                onChange={(e) => setCurrentImageUrl(e.target.value)}
                value={currentImageUrl}
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
                Add Image URL
              </Button>
            </Box>

            <Button
              type="button"
              color="secondary"
              variant="contained"
              onClick={handleOpenModal}
              sx={{ gridColumn: "span 1", ml: 2, mt: 2 }}
            >
              Add Size
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
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Size name"
                  onBlur={handleBlur}
                  onChange={(e) =>
                    setCurrentSize({ ...currentSize, name: e.target.value })
                  }
                  value={currentSize.name}
                  name="newSize.name"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label="Quantity"
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
                    handleAddSize(values, setValues),
                    handleCloseModal()
                    )}
                >
                  Add Size
                </Button>
              </Box>
            </Modal>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
              // type="button"
              // onClick={() => handleFormSubmit(values)}
                type="submit"
                color="secondary"
                variant="contained"
              >
                Create New Product
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

const initialValues = {
  product_name:"",
  category: "shoe",
  description: "",
  price: 0,
  sizes: [],
  imageUrls: [],
};

export default Form;

import ProductForm from "../product-form";

import { TProductResponse } from "@/types/product";

interface PropTypes {
  data: TProductResponse;
}
const ProductEdit = ({ data }: PropTypes) => {
  return <ProductForm data={data} type="edit" />;
};

export default ProductEdit;

export type TProductInput = {
  id?: string;
  name: string;
  price: number;
  stock: number;
  unitId: string;
  categoryId: string;
  description: string;
  imageUrl: string;
  isFeatured?: boolean;
};

export type TProduct = Omit<TProductInput, "imageUrl"> & {
  id: string;
  imageUrl: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  seller: {
    sellerId: string;
    storeLocation: string;
    storeName: string;
    userId: string;
    store_location?: string;
    store_name?: string;
  };
  Unit: {
    id: string;
    name: string;
    symbol: string;
  };
};

export type TProductResponse = TProduct;

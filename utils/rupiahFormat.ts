export const rupiahFormat = (price: number) => {
  if (isNaN(price) || price === undefined || price === null) return "Rp0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

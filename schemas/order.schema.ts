import { z } from "zod";

export const orderSchema = z.object({
  address: z.string().nonempty("Alamat tidak boleh kosong"),
  paymentMethod: z.string().nonempty("Pilih metode pembayaran"),
});

import { z } from "zod";

export const categorySchema = z.object({
  imageUrl: z.string().optional().or(z.literal("")),
  name: z
    .string()
    .nonempty("Nama tidak boleh kosong")
    .min(3, "Nama minimal 3 karakter")
    .max(255, "Nama maksimal 255 karakter"),
});

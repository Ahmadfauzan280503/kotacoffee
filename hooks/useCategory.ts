import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { addToast } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";

import useMedia from "./useMedia";
import useChangeUrl from "./useChangeUrl";

import { TCategory } from "@/types/category";
import categoryService from "@/services/category.service";
import { categorySchema } from "@/schemas/category.schema";

const useCategory = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const params = useParams();
  const { id } = params;

  const { page, limit, search } = useChangeUrl();

  const {
    handleUploadFile,
    isPendingUploadFile,
    handleDeleteFile,
    isPendingDeleteFile,
  } = useMedia();

  // create category
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });
  const preview = watch("imageUrl");
  const imageUrl = getValues("imageUrl");

  // upload image
  const handleUploadImage = (
    files: FileList,
    onChange: (files: FileList | undefined) => void,
  ) => {
    handleUploadFile(files, onChange, (fileUrl) => {
      if (fileUrl) {
        setValue("imageUrl", fileUrl);
      }
    });
  };

  // delete image
  const handleDeleteImage = (
    onChnage: (files: FileList | undefined) => void,
  ) => {
    handleDeleteFile(imageUrl, () => onChnage(undefined));
    setValue("imageUrl", "");
  };

  // create category
  const createCategoryService = async (payload: TCategory) => {
    const res = await categoryService.create(
      payload,
      session?.user.token as string,
    );

    return res.data;
  };

  const { mutate: mutateCreateCategory, isPending: isPendingCreateCategory } =
    useMutation({
      mutationFn: createCategoryService,
      onSuccess: () => {
        addToast({
          title: "Berhasil",
          description: "Kategori berhasil dibuat",
          color: "success",
        });
        reset();
        router.push("/admin/dashboard/category");
      },
      onError: (error) => {
        console.log(error);
        addToast({
          title: "Gagal",
          description: "Kategori gagal dibuat",
          color: "danger",
        });
      },
    });

  // update categroy
  const updateCategoryService = async (id: string, payload: TCategory) => {
    const res = await categoryService.update(
      id,
      payload,
      session?.user.token as string,
    );

    return res.data;
  };

  const { mutate: mutateUpdateCategory, isPending: isPendingUpdateCategory } =
    useMutation({
      mutationFn: (variables: { id: string; payload: TCategory }) =>
        updateCategoryService(variables.id, variables.payload),
      onSuccess: () => {
        addToast({
          title: "Berhasil",
          description: "Kategori berhasil diubah",
          color: "success",
        });
        reset();
        router.push("/admin/dashboard/category");
      },
      onError: (error) => {
        console.log(error);
        addToast({
          title: "Gagal",
          description: "Kategori gagal diubah",
          color: "danger",
        });
      },
    });

  const handleCreateCategory = (data: any) =>
    mutateCreateCategory(data as TCategory);

  const handleUpdateCategory = (data: any) =>
    mutateUpdateCategory({
      id: id as string,
      payload: data as TCategory,
    });

  // delete category
  const deleteCategoryService = async (id: string) => {
    const res = await categoryService.destroy(
      id,
      session?.user.token as string,
    );

    return res.data;
  };

  const queryClient = useQueryClient();

  const {
    mutate: mutateDeleteCategory,
    isPending: isPendingDeleteCategory,
    isSuccess: isSuccessDeleteCategory,
  } = useMutation({
    mutationFn: deleteCategoryService,
    onSuccess: (data) => {
      handleDeleteFile(data.data.imageUrl, () => {
        addToast({
          title: "Berhasil",
          description: "Kategori berhasil dihapus",
          color: "success",
        });
      });

      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.log(error);
      addToast({
        title: "Gagal",
        description: "Kategori gagal dihapus",
        color: "danger",
      });
    },
  });

  const handleDeleteCategory = (id: string) => mutateDeleteCategory(id);

  // get categories admin
  const getCategoriesAdminService = async () => {
    let params = `search=${search}&page=${page}&limit=${limit}`;

    if (!search && !page && !limit) {
      params = "";
    }
    const res = await categoryService.getCategoriesAdmin(params);

    return res.data.data;
  };

  const { data: dataCategoriesAdmin, isLoading: isLoadingCategoriesAdmin } =
    useQuery({
      queryKey: ["categories-admin", page, limit, search],
      queryFn: getCategoriesAdminService,
    });

  // get categories landing
  const getCategoriesService = async () => {
    const res = await categoryService.getCategoriesLanding();

    return res.data.data;
  };

  const { data: dataCategories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesService,
    staleTime: 5 * 60 * 1000, // 5 minutes — categories rarely change
  });

  return {
    // form
    control,
    handleSubmit,
    errors,
    reset,
    setValue,
    // query
    dataCategoriesAdmin,
    isLoadingCategoriesAdmin,
    dataCategories,
    isLoadingCategories,
    // mutation
    handleCreateCategory,
    isPendingCreateCategory,
    handleUpdateCategory,
    isPendingUpdateCategory,
    // delete
    handleDeleteCategory,
    isPendingDeleteCategory,
    isSuccessDeleteCategory,
    // handle image
    handleUploadImage,
    isPendingUploadFile,
    handleDeleteImage,
    isPendingDeleteFile,
    preview,
  };
};

export default useCategory;

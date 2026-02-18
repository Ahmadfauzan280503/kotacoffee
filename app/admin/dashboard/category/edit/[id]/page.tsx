import React from "react";

import CategoryForm from "@/components/page/admin/dashboard/category/category-form";
import categoryService from "@/services/category.service";

const EditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { data } = await categoryService.getCategoryById(id);

  return <CategoryForm data={data?.data || {}} type="edit" />;
};

export default EditPage;

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import React, { useEffect } from "react";

import useProduct from "@/hooks/useProduct";

interface PropTypes {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  selectedProduct: string;
  setSelectedProduct: (id: string) => void;
}

const ModalDelete = ({
  isOpen,
  onClose,
  onOpenChange,
  selectedProduct,
  setSelectedProduct,
}: PropTypes) => {
  const {
    handleDeleteProduct,
    isPendingDeleteProduct,
    isSuccessDeleteProduct,
  } = useProduct();

  useEffect(() => {
    if (isSuccessDeleteProduct) {
      onClose();
      setSelectedProduct("");
    }
  }, [isSuccessDeleteProduct]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Hapus Produk
            </ModalHeader>
            <ModalBody>
              <p>Apakah Anda yakin ingin menghapus produk ini?</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Batal
              </Button>
              <Button
                className="text-white"
                color="success"
                disabled={isPendingDeleteProduct}
                isLoading={isPendingDeleteProduct}
                onPress={() => handleDeleteProduct(selectedProduct)}
              >
                Hapus
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalDelete;

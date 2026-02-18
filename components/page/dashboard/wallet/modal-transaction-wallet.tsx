"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useEffect } from "react";
import { Controller } from "react-hook-form";

import useWalletTransaction from "@/hooks/useWalletTransaction";

const ModalTransactionWallet = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const {
    control,
    errors,
    handleSubmit,
    handleCreateWalletTransaction,
    isCreating,
    isSuccessCreate,
  } = useWalletTransaction();

  useEffect(() => {
    if (isSuccessCreate) {
      onClose();
    }
  }, [isSuccessCreate, onClose]);

  return (
    <Modal isOpen={isOpen} size="md" onClose={onClose}>
      <form onSubmit={handleSubmit(handleCreateWalletTransaction)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Tarik Dana
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <Controller
                      control={control}
                      name="amount"
                      render={({ field }) => (
                        <Input
                          {...field}
                          errorMessage={errors.amount?.message}
                          isInvalid={!!errors.amount}
                          label="Jumlah Penarikan"
                          type="number"
                          variant="bordered"
                        />
                      )}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  className="text-white"
                  color="success"
                  isLoading={isCreating}
                  type="submit"
                >
                  Tarik Dana
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </form>
    </Modal>
  );
};

export default ModalTransactionWallet;

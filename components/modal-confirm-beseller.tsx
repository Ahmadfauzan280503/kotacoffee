import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@heroui/react";
import Link from "next/link";
import React from "react";

const ModalConfirmBeseller = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody>
              <div className="space-y-4">
                <div className="py-4">
                  <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 text-center">
                    Mulai Jual Sekarang!
                  </h2>
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Nikmati keuntungan sebagai Admin
                  </p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 dark:bg-emerald-800 dark:border-emerald-700">
                  <h4 className="font-semibold text-emerald-800 mb-2 dark:text-emerald-100">
                    Keuntungan menjadi Admin:
                  </h4>
                  <ul className="text-sm text-emerald-700 space-y-1 dark:text-emerald-100">
                    <li>• Dapat menjual Berbagai Minuman Coffee</li>
                    <li>• Akses ke dashboard Admin</li>
                    <li>• Kelola pesanan dan inventori</li>
                    <li>• Dapatkan penghasilan tambahan</li>
                  </ul>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 dark:bg-amber-800 dark:border-amber-700">
                  <p className="text-sm text-amber-700 dark:text-amber-100">
                    <strong>Catatan:</strong> Setelah menjadi penjual, Anda
                    perlu melengkapi informasi toko dan data akan diverifikasi
                    dalam 1-3 hari kerja.
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Tidak
              </Button>
              <Button
                as={Link}
                className="text-white dark:text-white"
                color="success"
                href="/seller"
                onPress={onClose}
              >
                Ya, Menjadi Penjual
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalConfirmBeseller;

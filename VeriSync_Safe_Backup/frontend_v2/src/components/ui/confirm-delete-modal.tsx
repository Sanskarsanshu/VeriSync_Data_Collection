import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  itemType?: string;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemName = 'this item',
  itemType = 'Item',
}: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Delete ${itemType}`}>
      <div className="flex flex-col items-center text-center space-y-4 p-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-xl font-bold text-foreground">Are you absolutely sure?</h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          This action cannot be undone. This will permanently delete 
          <span className="font-semibold text-foreground mx-1">{itemName}</span> 
          and remove its data from our servers.
        </p>
        <div className="flex w-full gap-3 mt-6 pt-4">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-red-500 hover:bg-red-600 text-white" 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Yes, Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}

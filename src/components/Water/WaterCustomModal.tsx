import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../UI/Button';

interface WaterCustomModalProps {
  onClose: () => void;
  onAdd: (amount: number) => void;
}

export function WaterCustomModal({ onClose, onAdd }: WaterCustomModalProps) {
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    const value = parseInt(amount);
    if (value > 0) {
      onAdd(value);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-blue-900/95 rounded-lg p-4 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
            Add Custom Amount
          </h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="!p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
              Amount (ml)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-700 
                       bg-white dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              onClick={handleSubmit}
              disabled={!amount || parseInt(amount) <= 0}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
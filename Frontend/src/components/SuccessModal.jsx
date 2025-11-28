import { Check } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';

export const SuccessModal = ({ isOpen, onClose, title, message, actionLabel = "Continue" }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md text-center p-8">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6 animate-bounce">
                    <Check className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
                <p className="text-gray-600 mb-8 text-lg">{message}</p>
                <Button
                    onClick={onClose}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-lg h-12 rounded-xl shadow-lg hover:shadow-green-500/30 transition-all"
                >
                    {actionLabel}
                </Button>
            </DialogContent>
        </Dialog>
    );
};

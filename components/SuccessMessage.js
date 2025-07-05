// File: components/SuccessMessage.js
// Description: The success page, now with internationalization.

import { CheckCircleIcon } from '@heroicons/react/24/solid';

const SuccessMessage = ({ content }) => {
    return (
        <div className="bg-gray-900/50 backdrop-blur-md p-8 rounded-2xl border border-green-500/50 shadow-2xl shadow-green-500/10 text-center animate-fade-in">
            <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto" />
            <h2 className="mt-4 text-2xl font-bold text-white">{content.successTitle}</h2>
            <p className="mt-2 text-gray-300">{content.successSubtitle}</p>

            <div className="mt-8 pt-6 border-t border-gray-700 text-left">
                <h3 className="text-lg font-semibold text-white mb-4 text-center">{content.paymentTitle}</h3>
                <p className="text-sm text-gray-400 mb-6 text-center">
                    {content.paymentSubtitle} <strong className="text-white">{content.paymentAmount}</strong> {content.paymentStart}
                </p>
                
                <div className="space-y-4 max-w-sm mx-auto">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="font-bold text-[#06b6d4]">{content.bankTransfer}</p>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="font-bold text-[#e879f9]">QRIS</p>
                        <div className="mt-2 flex justify-center">
                            <img src="qrevop.jpg" alt="QRIS Payment Code" className="rounded-md" />
                        </div>
                         <p className="text-xs text-gray-400 text-center mt-2">{content.qrisSupport}</p>
                    </div>
                </div>

                <p className="mt-6 text-xs text-gray-500 text-center">
                    {content.paymentConfirmation} <strong>0812-4911-1169</strong>.
                </p>
            </div>
        </div>
    );
};

export default SuccessMessage;

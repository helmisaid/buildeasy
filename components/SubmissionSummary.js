// File: components/SubmissionSummary.js
// Description: Displays a summary of the user's submission and payment info.

import { CheckCircleIcon, PhotoIcon } from '@heroicons/react/24/solid';

const SummaryItem = ({ label, value }) => {
    if (!value) return null;
    return (
        <div>
            <p className="text-sm font-semibold text-gray-400">{label}</p>
            <p className="text-white whitespace-pre-wrap">{value}</p>
        </div>
    );
};

const ImageItem = ({ label, previewSrc }) => {
    return (
        <div>
             <p className="text-sm font-semibold text-gray-400">{label}</p>
             <div className="mt-2 h-20 w-20 rounded-md bg-gray-800 flex items-center justify-center">
                {previewSrc ? <img src={previewSrc} alt="Preview" className="h-full w-full object-contain rounded-md" /> : <PhotoIcon className="h-10 w-10 text-gray-500"/>}
            </div>
        </div>
    );
}

const SubmissionSummary = ({ data, content }) => {
    return (
        <div className="bg-gray-900/50 backdrop-blur-md p-8 rounded-2xl border border-green-500/50 shadow-2xl shadow-green-500/10 animate-fade-in">
            <div className="text-center">
                <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto" />
                <h2 className="mt-4 text-2xl font-bold text-white">{content.successTitle}</h2>
                <p className="mt-2 text-gray-300 max-w-2xl mx-auto">{content.successSubtitle}</p>
            </div>
            
            {/* Submission Details */}
            <div className="mt-8 pt-6 border-t border-gray-700 space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4 text-center">{content.summaryTitle}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800/50 p-4 rounded-lg">
                    <SummaryItem label="Nama Brand" value={data.companyName} />
                    <SummaryItem label="Tipe Website" value={data.websiteType} />
                    <SummaryItem label="Email Kontak" value={data.contactEmail} />
                    <SummaryItem label="Deskripsi" value={data.aboutText} />
                    {data.logoPreview && <ImageItem label="Logo Anda" previewSrc={data.logoPreview} />}
                    <div>
                         <p className="text-sm font-semibold text-gray-400">Palet Warna</p>
                         <div className="flex space-x-2 mt-2">
                            {data.colors.map((color, i) => <div key={i} className="h-8 w-8 rounded-full border-2 border-gray-600" style={{ backgroundColor: color }}></div>)}
                         </div>
                    </div>
                </div>
                 {data.portfolioProjects.length > 0 && (
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                        <h4 className="text-base font-semibold text-white mb-2">Proyek Portfolio</h4>
                        {data.portfolioProjects.map(p => (
                            <div key={p.id} className="mt-2 p-2 border-l-2 border-gray-600">
                                <SummaryItem label="Nama Proyek" value={p.name} />
                                <SummaryItem label="Deskripsi" value={p.description} />
                                {p.previewUrl && <ImageItem label="Gambar Proyek" previewSrc={p.previewUrl} />}
                            </div>
                        ))}
                    </div>
                 )}
            </div>

            {/* Payment Information */}
            <div className="mt-8 pt-6 border-t border-gray-700 text-left">
                <h3 className="text-lg font-semibold text-white mb-4 text-center">{content.paymentTitle}</h3>
                <p className="text-sm text-gray-400 mb-6 text-center">
                    {content.paymentSubtitle} <strong className="text-white">{content.paymentAmount}</strong> {content.paymentStart}
                </p>
                <div className="space-y-4 max-w-sm mx-auto">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="font-bold text-[#06b6d4]">{content.bankTransfer}</p>
                        <p className="mt-1 text-gray-300">Bank BCA: <strong className="text-white">1234567890</strong> a/n BuildEasy Tech</p>
                        <p className="mt-1 text-gray-300">Bank Mandiri: <strong className="text-white">0987654321</strong> a/n BuildEasy Tech</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="font-bold text-[#e879f9]">QRIS</p>
                        <div className="mt-2 flex justify-center">
                            <img src="https://placehold.co/160x160/ffffff/000000?text=QRIS+Code" alt="QRIS Payment Code" className="rounded-md" />
                        </div>
                         <p className="text-xs text-gray-400 text-center mt-2">{content.qrisSupport}</p>
                    </div>
                </div>
                <p className="mt-6 text-xs text-gray-500 text-center">
                    {content.paymentConfirmation} <strong>0812-3456-7890</strong>.
                </p>
            </div>
        </div>
    );
};

export default SubmissionSummary;

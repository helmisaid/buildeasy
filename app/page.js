// File: app/page.js
// Description: The main page, updated to handle file uploads with FormData and an intelligent prompt generator.

"use client";

import { ChatBubbleBottomCenterTextIcon, ClockIcon, Cog8ToothIcon, EnvelopeIcon, FolderIcon, QuestionMarkCircleIcon, ShoppingCartIcon, Squares2X2Icon, StarIcon, UserCircleIcon, UsersIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import GeneratorForm from '../components/GeneratorForm';
import Header from '../components/Header';
import SubmissionSummary from '../components/SubmissionSummary';


// Content for internationalization with full English translations
const content = {
    id: {
        tagline: 'Jelaskan website impianmu. Kami yang akan mewujudkannya menjadi kenyataan.',
        companyNameLabel: 'Nama Perusahaan / Personal Brand',
        companyNamePlaceholder: 'Contoh: Kopi Kenangan, Raditya Dika',
        logoLabel: 'Logo',
        logoUrlLabel: 'Atau URL Logo',
        logoUrlPlaceholder: 'https://contoh.com/logo.png',
        websiteTypeLabel: 'Jenis Website',
        websiteTypeOptions: ['Toko Online', 'Portfolio Kreatif', 'Blog Pribadi', 'Profil Perusahaan'],
        aboutTextLabel: 'Deskripsi Singkat',
        aboutTextPlaceholder: 'Jelaskan secara singkat tentang brand atau diri Anda...',
        contactEmailLabel: 'Email Kontak',
        contactEmailPlaceholder: 'email@bisniskamu.com',
        colorPaletteLabel: 'Palet Warna',
        addColor: 'Tambah Warna',
        featuresLabel: 'Pilih Fitur',
        featureMapping: {
            'Toko Online': { productList: { name: "Katalog Produk", icon: <ShoppingCartIcon className="w-6 h-6" /> }, featuredProduct: { name: "Produk Unggulan", icon: <StarIcon className="w-6 h-6" /> }, testimonials: { name: "Testimonial Pelanggan", icon: <ChatBubbleBottomCenterTextIcon className="w-6 h-6" /> } },
            'Portfolio Kreatif': { projectGallery: { name: "Galeri Proyek", icon: <Squares2X2Icon className="w-6 h-6" /> }, aboutMe: { name: "Profil Detail", icon: <UserCircleIcon className="w-6 h-6" /> }, process: { name: "Proses Kerja", icon: <Cog8ToothIcon className="w-6 h-6" /> } },
            'Blog Pribadi': { postCategories: { name: "Kategori Tulisan", icon: <FolderIcon className="w-6 h-6" /> }, newsletter: { name: "Form Newsletter", icon: <EnvelopeIcon className="w-6 h-6" /> }, recentPosts: { name: "Postingan Terbaru", icon: <ClockIcon className="w-6 h-6" /> } },
            'Profil Perusahaan': { ourTeam: { name: "Profil Tim", icon: <UsersIcon className="w-6 h-6" /> }, services: { name: "Daftar Layanan", icon: <WrenchScrewdriverIcon className="w-6 h-6" /> }, faq: { name: "Tanya Jawab (FAQ)", icon: <QuestionMarkCircleIcon className="w-6 h-6" /> } }
        },
        productListLabel: 'Detail Produk',
        productNameLabel: "Nama Produk",
        priceLabel: "Harga",
        oldPriceLabel: "Harga Lama (Opsional)",
        imageUrlLabel: "Gambar Produk",
        addProduct: "Tambah Produk",
        projectGalleryLabel: 'Detail Proyek Portfolio',
        projectNameLabel: "Nama Proyek",
        projectDescLabel: "Deskripsi Singkat Proyek",
        projectImageUrlLabel: "Gambar Proyek",
        projectUrlLabel: "URL Proyek (Live)",
        addProject: 'Tambah Proyek',
        testimonialsLabel: 'Testimonial Pelanggan',
        customerNameLabel: 'Nama Pelanggan',
        testimonialTextLabel: 'Isi Testimoni',
        customerPhotoLabel: 'Foto Pelanggan',
        addTestimonial: 'Tambah Testimoni',
        ourTeamLabel: 'Anggota Tim',
        memberNameLabel: 'Nama Anggota Tim',
        memberRoleLabel: 'Posisi / Jabatan',
        memberPhotoLabel: 'Foto Anggota Tim',
        addMember: 'Tambah Anggota Tim',
        servicesLabel: 'Layanan yang Ditawarkan',
        serviceNameLabel: 'Nama Layanan',
        serviceDescLabel: 'Deskripsi Layanan',
        addService: 'Tambah Layanan',
        faqLabel: 'Tanya Jawab (FAQ)',
        questionLabel: 'Pertanyaan',
        answerLabel: 'Jawaban',
        addFaq: 'Tambah FAQ',
        postCategoriesLabel: 'Kategori Tulisan (pisahkan dengan koma)',
        processLabel: 'Proses Kerja',
        detailedAboutMeLabel: 'Tentang Saya (Detail)',
        customParamsLabel: 'Parameter Tambahan',
        customParamsPlaceholderKey: 'Nama Parameter',
        customParamsPlaceholderValue: 'Nilai Parameter',
        customParamsExample: 'Contoh: `Target Audiens` = `Anak Muda`',
        addParam: 'Tambah Parameter',
        submitButton: 'Buatkan Saya Website!',
        loadingButton: 'Mengirim...',
        errorMsg: 'Gagal submit. Mohon coba lagi.',
        successTitle: 'Berhasil Submit!',
        successSubtitle: 'Data Anda telah kami terima. Kami akan segera membuatkan website impianmu! Perkiraan waktu pengerjaan 30-60 menit setelah pembayaran.',
        paymentTitle: 'Informasi Pembayaran',
        paymentSubtitle: 'Silakan lakukan pembayaran sebesar',
        paymentAmount: 'Rp 150.000',
        paymentStart: 'untuk memulai proses pembuatan website.',
        bankTransfer: 'Bank Transfer',
        qrisSupport: 'Mendukung semua E-Wallet & M-Banking',
        paymentConfirmation: 'Setelah pembayaran, mohon konfirmasi melalui WhatsApp ke nomor',
        summaryTitle: 'Ringkasan Permintaan Anda',
    },
    en: {
        tagline: 'Describe your dream website. We will make it a reality.',
        companyNameLabel: 'Company Name / Personal Brand',
        companyNamePlaceholder: 'Example: The Coffee Bean, John Doe',
        logoLabel: 'Logo',
        logoUrlLabel: 'Or Logo URL',
        logoUrlPlaceholder: 'https://example.com/logo.png',
        websiteTypeLabel: 'Website Type',
        websiteTypeOptions: ['E-commerce Store', 'Creative Portfolio', 'Personal Blog', 'Company Profile'],
        aboutTextLabel: 'Brief Description',
        aboutTextPlaceholder: 'Briefly describe your brand or yourself...',
        contactEmailLabel: 'Contact Email',
        contactEmailPlaceholder: 'your@email.com',
        colorPaletteLabel: 'Color Palette',
        addColor: 'Add Color',
        featuresLabel: 'Choose Features',
        featureMapping: {
            'E-commerce Store': { productList: { name: "Product Catalog", icon: <ShoppingCartIcon className="w-6 h-6" /> }, featuredProduct: { name: "Featured Products", icon: <StarIcon className="w-6 h-6" /> }, testimonials: { name: "Customer Testimonials", icon: <ChatBubbleBottomCenterTextIcon className="w-6 h-6" /> } },
            'Creative Portfolio': { projectGallery: { name: "Project Gallery", icon: <Squares2X2Icon className="w-6 h-6" /> }, aboutMe: { name: "Detailed Profile", icon: <UserCircleIcon className="w-6 h-6" /> }, process: { name: "Work Process", icon: <Cog8ToothIcon className="w-6 h-6" /> } },
            'Personal Blog': { postCategories: { name: "Post Categories", icon: <FolderIcon className="w-6 h-6" /> }, newsletter: { name: "Newsletter Form", icon: <EnvelopeIcon className="w-6 h-6" /> }, recentPosts: { name: "Recent Posts", icon: <ClockIcon className="w-6 h-6" /> } },
            'Company Profile': { ourTeam: { name: "Team Profiles", icon: <UsersIcon className="w-6 h-6" /> }, services: { name: "Service List", icon: <WrenchScrewdriverIcon className="w-6 h-6" /> }, faq: { name: "FAQ Section", icon: <QuestionMarkCircleIcon className="w-6 h-6" /> } }
        },
        productListLabel: 'Product Details',
        productNameLabel: "Product Name",
        priceLabel: "Price",
        oldPriceLabel: "Old Price (Optional)",
        imageUrlLabel: "Product Image",
        addProduct: "Add Product",
        projectGalleryLabel: 'Portfolio Project Details',
        projectNameLabel: "Project Name",
        projectDescLabel: "Brief Project Description",
        projectImageUrlLabel: "Project Image",
        projectUrlLabel: "Live Project URL",
        addProject: 'Add Project',
        testimonialsLabel: 'Customer Testimonials',
        customerNameLabel: 'Customer Name',
        testimonialTextLabel: 'Testimonial Text',
        customerPhotoLabel: 'Customer Photo',
        addTestimonial: 'Add Testimonial',
        ourTeamLabel: 'Team Members',
        memberNameLabel: 'Team Member Name',
        memberRoleLabel: 'Position / Role',
        memberPhotoLabel: 'Team Member Photo',
        addMember: 'Add Team Member',
        servicesLabel: 'Services Offered',
        serviceNameLabel: 'Service Name',
        serviceDescLabel: 'Service Description',
        addService: 'Add Service',
        faqLabel: 'Frequently Asked Questions (FAQ)',
        questionLabel: 'Question',
        answerLabel: 'Answer',
        addFaq: 'Add FAQ',
        postCategoriesLabel: 'Post Categories (comma-separated)',
        processLabel: 'Work Process',
        detailedAboutMeLabel: 'About Me (Detailed)',
        customParamsLabel: 'Additional Parameters',
        customParamsPlaceholderKey: 'Parameter Name',
        customParamsPlaceholderValue: 'Parameter Value',
        customParamsExample: 'Example: `Target Audience` = `Young Adults`',
        addParam: 'Add Parameter',
        submitButton: 'Build My Website!',
        loadingButton: 'Submitting...',
        errorMsg: 'Submission failed. Please try again.',
        successTitle: 'Submission Successful!',
        successSubtitle: 'Your data has been received. We will start building your dream website shortly! Estimated time is 30-60 minutes after payment.',
        paymentTitle: 'Payment Information',
        paymentSubtitle: 'Please make a payment of',
        paymentAmount: '$15 USD',
        paymentStart: 'to begin the website creation process.',
        bankTransfer: 'Bank Transfer',
        qrisSupport: 'Supports all E-Wallets & M-Banking',
        paymentConfirmation: 'After payment, please confirm via WhatsApp to',
        summaryTitle: 'Your Request Summary',
    }
};

export default function Home() {
  const [lang, setLang] = useState('id');
  const [submittedData, setSubmittedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const POCKETBASE_URL = 'http://152.42.249.230:8090'; 
  const COLLECTION_NAME = 'website_requests';

  const generateDynamicPrompt = (data) => {
    const currentLang = data.lang || 'id';
    const c = content[currentLang] || content.id;
    
    let prompt = `INSTRUCTION: Generate a website based on the following detailed specifications.\n\n`;
    prompt += `**WEBSITE TYPE:** ${data.websiteType}\n`;
    prompt += `**WEBSITE LANGUAGE:** ${currentLang.toUpperCase()}\n\n`;

    prompt += `### CORE BRANDING\n`;
    prompt += `- **Brand Name:** ${data.companyName}\n`;
    if (data.logoFile) prompt += `- **Logo:** A logo file has been uploaded to the 'logo' field in the database. Use this file as the primary logo.\n`;
    else if (data.logoUrl) prompt += `- **Logo URL:** ${data.logoUrl}\n`;
    prompt += `- **Brand Description:** "${data.aboutText}"\n`;
    prompt += `- **Contact Email:** ${data.contactEmail}\n\n`;

    prompt += `### DESIGN SPECIFICATIONS\n`;
    prompt += `- **Color Palette:** The primary color is ${data.colors[0]}. The full palette is: ${data.colors.join(', ')}.\n`;
    prompt += `- **Aesthetic:** Modern, professional, responsive, and user-friendly.\n\n`;

    prompt += `### WEBSITE STRUCTURE & FEATURES\n`;
    if (data.features.length === 0) prompt += `- This should be a standard landing page with hero, about, and contact sections.\n`;
    
    const generateListPrompt = (list, fileFieldName, textDataKey) => {
        let listPrompt = `The data for this section is in the '${textDataKey}' JSON field. The corresponding images have been uploaded to the '${fileFieldName}' file field. In the generated website, you MUST associate each item from the text data with its corresponding image from the file field by index.\n`;
        list.forEach((item, index) => {
            let itemDetails = Object.entries(item)
                .filter(([key, value]) => !['fileObject', 'id', 'previewUrl'].includes(key) && value)
                .map(([key, value]) => `${key}: "${value}"`)
                .join(', ');

            if (item.fileObject) {
                 if (itemDetails) itemDetails += ', ';
                 itemDetails += `image: "(File ${index + 1} from the '${fileFieldName}' field)"`;
            }

            listPrompt += `  - Item ${index+1} Data: { ${itemDetails} }\n`;
        });
        return listPrompt;
    };
    
    const featureMap = c.featureMapping[data.websiteType] || {};
    data.features.forEach(featureName => {
        let handled = false;
        const findFeatureKey = (name) => Object.keys(featureMap).find(key => featureMap[key].name === name);
        
        const featureKey = findFeatureKey(featureName);
        if(!featureKey) return;

        switch (featureKey) {
            case 'productList':
                if (data.products.length > 0) {
                    prompt += `\n**Feature: Product Catalog**\nCreate a product grid.\n` + generateListPrompt(data.products, 'product_images', 'products');
                    handled = true;
                }
                break;
            case 'projectGallery':
                if (data.portfolioProjects.length > 0) {
                    prompt += `\n**Feature: Project Gallery**\nCreate a portfolio gallery.\n` + generateListPrompt(data.portfolioProjects, 'portfolio_images', 'portfolioProjects');
                    handled = true;
                }
                break;
            case 'testimonials':
                 if (data.testimonials.length > 0) {
                    prompt += `\n**Feature: Testimonials**\nDisplay these customer testimonials.\n` + generateListPrompt(data.testimonials, 'testimonial_photos', 'testimonials');
                    handled = true;
                }
                break;
            case 'ourTeam':
                if (data.teamMembers.length > 0) {
                    prompt += `\n**Feature: Team Profiles**\nIntroduce the team members.\n` + generateListPrompt(data.teamMembers, 'team_photos', 'teamMembers');
                    handled = true;
                }
                break;
            case 'services':
                if (data.services.length > 0) {
                    prompt += `\n**Feature: Services List**\nDetail the services offered. Data is in the 'services' JSON field.\n`;
                    handled = true;
                }
                break;
            case 'faq':
                if (data.faqs.length > 0) {
                    prompt += `\n**Feature: FAQ**\nCreate a collapsible FAQ section. Data is in the 'faqs' JSON field.\n`;
                    handled = true;
                }
                break;
            case 'postCategories':
                 if (data.postCategories) {
                    prompt += `\n**Feature: Blog Categories:** The blog should have these categories: ${data.postCategories}.\n`;
                    handled = true;
                }
                break;
            case 'process':
                if (data.workProcess) {
                    prompt += `\n**Feature: Work Process:** Describe the work process using this text: "${data.workProcess}".\n`;
                    handled = true;
                }
                break;
            case 'aboutMe':
                 if (data.detailedAboutMe) {
                    prompt += `\n**Feature: Detailed Profile:** Use this text for a detailed 'About Me' section: "${data.detailedAboutMe}".\n`;
                    handled = true;
                }
                break;
        }

        if (!handled) {
            prompt += `- A section for **${featureName}**.\n`;
        }
    });

    if (data.customFields.length > 0) {
        prompt += `\n### ADDITIONAL PARAMETERS\n`;
        data.customFields.forEach(field => { if(field.key && field.value) prompt += `- **${field.key}:** ${field.value}\n`});
    }
    return prompt;
  };

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);

    const fd = new FormData();
    
    fd.append('companyName', formData.companyName);
    fd.append('websiteType', formData.websiteType);
    fd.append('contactEmail', formData.contactEmail);
    fd.append('aboutText', formData.aboutText);
    fd.append('postCategories', formData.postCategories);
    fd.append('workProcess', formData.workProcess);
    fd.append('detailedAboutMe', formData.detailedAboutMe);
    fd.append('lang', lang);
    fd.append('status', 'pending');

    if (formData.logoFile) {
        fd.append('logo', formData.logoFile);
    } else {
        fd.append('logoUrl', formData.logoUrl);
    }
    
    const cleanAndStringify = (arr, fieldsToKeep) => JSON.stringify(arr.filter(item => item.name || item.question).map(item => {
        let cleanItem = {};
        fieldsToKeep.forEach(field => { if(item[field]) cleanItem[field] = item[field]; });
        return cleanItem;
    }));

    fd.append('colors', JSON.stringify(formData.colors));
    fd.append('features', JSON.stringify(formData.features));
    fd.append('customFields', JSON.stringify(formData.customFields.filter(f => f.key)));

    const processDynamicData = (dataKey, fileKey, fieldsToKeep) => {
        const textData = [];
        const files = [];
        formData[dataKey].forEach(item => {
            if (item.name || item.question) {
                let cleanItem = {};
                fieldsToKeep.forEach(field => { if(item[field]) cleanItem[field] = item[field]; });
                textData.push(cleanItem);
                if (item.fileObject) files.push(item.fileObject);
            }
        });
        fd.append(dataKey, JSON.stringify(textData));
        files.forEach(file => fd.append(fileKey, file));
    };

    processDynamicData('products', 'product_images', ['name', 'price', 'oldPrice']);
    processDynamicData('portfolioProjects', 'portfolio_images', ['name', 'description', 'projectUrl']);
    processDynamicData('testimonials', 'testimonial_photos', ['name', 'text']);
    processDynamicData('teamMembers', 'team_photos', ['name', 'role']);
    
    fd.append('services', cleanAndStringify(formData.services, ['name', 'description']));
    fd.append('faqs', cleanAndStringify(formData.faqs, ['question', 'answer']));

    fd.append('generated_prompt', generateDynamicPrompt(formData));
    
    try {
      const response = await fetch(`${POCKETBASE_URL}/api/collections/${COLLECTION_NAME}/records`, {
        method: 'POST',
        body: fd,
      });

      if (!response.ok) throw new Error((await response.json()).message);
      
      setSubmittedData(formData);
    } catch (err) {
      console.error('Submission Error:', err);
      setError((content[lang] || content.id).errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative isolate min-h-screen bg-black">
      <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"><div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#2563eb] to-[#06b6d4] opacity-20 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div></div>
      <main className="container mx-auto px-6 py-12 md:py-24">
         <Header lang={lang} setLang={setLang} content={content[lang] || content.id} />
         <div className="mt-16 max-w-3xl mx-auto">
           {submittedData ? (
             <SubmissionSummary data={submittedData} content={content[lang] || content.id} />
           ) : (
             <GeneratorForm onSubmit={handleFormSubmit} isLoading={isLoading} error={error} content={content} lang={lang} />
           )}
         </div>
      </main>
    </div>
  );
}

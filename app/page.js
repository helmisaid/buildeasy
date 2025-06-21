// File: app/page.js
// Description: The main page, updated to handle file uploads with FormData and an intelligent prompt generator.

"use client";

import { useState } from 'react';
import GeneratorForm from '../components/GeneratorForm';
import Header from '../components/Header';
import SuccessMessage from '../components/SuccessMessage';

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
            'Toko Online': { productList: "Daftar Produk", featuredProduct: "Produk Unggulan", testimonials: "Testimonial Pelanggan" },
            'Portfolio Kreatif': { projectGallery: "Galeri Proyek", aboutMe: "Tentang Saya (Detail)", process: "Proses Kerja Saya" },
            'Blog Pribadi': { postCategories: "Kategori Tulisan", newsletter: "Form Langganan Newsletter", recentPosts: "Tampilan Tulisan Terbaru" },
            'Profil Perusahaan': { ourTeam: "Tim Kami", services: "Layanan Kami", faq: "Tanya Jawab (FAQ)" }
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
        successSubtitle: 'Kami akan segera membuatkanmu website! Perkiraan waktu pengerjaan 30-60 menit.',
        paymentTitle: 'Informasi Pembayaran',
        paymentSubtitle: 'Silakan lakukan pembayaran sebesar',
        paymentAmount: 'Rp 150.000',
        paymentStart: 'untuk memulai proses pembuatan website.',
        bankTransfer: 'Bank Transfer',
        qrisSupport: 'Mendukung semua E-Wallet & M-Banking',
        paymentConfirmation: 'Setelah pembayaran, mohon konfirmasi melalui WhatsApp ke nomor',
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
            'E-commerce Store': { productList: "Product List", featuredProduct: "Featured Product", testimonials: "Customer Testimonials" },
            'Creative Portfolio': { projectGallery: "Project Gallery", aboutMe: "About Me (Detailed)", process: "My Work Process" },
            'Personal Blog': { postCategories: "Post Categories", newsletter: "Newsletter Signup Form", recentPosts: "Recent Posts Display" },
            'Company Profile': { ourTeam: "Our Team", services: "Our Services", faq: "FAQ Section" }
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
        successSubtitle: 'We will start building your website shortly! Estimated time is 30-60 minutes.',
        paymentTitle: 'Payment Information',
        paymentSubtitle: 'Please make a payment of',
        paymentAmount: '$15 USD',
        paymentStart: 'to begin the website creation process.',
        bankTransfer: 'Bank Transfer',
        qrisSupport: 'Supports all E-Wallets & M-Banking',
        paymentConfirmation: 'After payment, please confirm via WhatsApp to',
    }
};

export default function Home() {
  const [lang, setLang] = useState('id');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const POCKETBASE_URL = 'https://dataclient.evop.tech'; 
  const COLLECTION_NAME = 'website_requests';

  const generateDynamicPrompt = (data) => {
    const currentLang = data.lang || 'id';
    const c = content[currentLang] || content.id;
    
    let prompt = `Generate a detailed "${data.websiteType}" website.\n`;
    prompt += `**Client Language for Website Content:** ${currentLang.toUpperCase()}\n\n`;

    prompt += `### Core Details\n`;
    prompt += `- **Company Name:** ${data.companyName}\n`;
    if (data.logoFile) prompt += `- **Logo:** A logo file has been uploaded to the 'logo' field.\n`;
    else if (data.logoUrl) prompt += `- **Logo URL:** ${data.logoUrl}\n`;
    prompt += `- **Contact Email for Forms:** ${data.contactEmail}\n`;
    prompt += `- **About Us/Description:** "${data.aboutText}"\n\n`;

    prompt += `### Design Specifications\n`;
    prompt += `- **Color Palette:** ${data.colors.join(', ')} (Primary should be ${data.colors[0]})\n`;
    prompt += `- **Aesthetic:** Modern, professional, responsive, and user-friendly.\n\n`;

    prompt += `### Required Features & Content Sections\n`;
    if (data.features.length === 0) prompt += `- A standard landing page with hero, about, and contact sections.\n`;
    
    const generateListPrompt = (list, fileFieldName, textDataKey) => {
        let listPrompt = `The data for this list is in the '${textDataKey}' JSON field. The corresponding images have been uploaded to the '${fileFieldName}' file field. In the generated website, you must associate each item from the text data with its corresponding image from the file field by index (e.g., the first image in the file field belongs to the first item in the JSON data).\n`;
        list.forEach((item, index) => {
            // FIX: This filter now correctly checks if the value exists before including it.
            const itemDetails = Object.entries(item)
                .filter(([key, value]) => !['fileObject', 'id', 'previewUrl'].includes(key) && value)
                .map(([key, value]) => `${key}: "${value}"`)
                .join(', ');
            listPrompt += `  - Item ${index+1} Data: { ${itemDetails} }\n`;
        });
        return listPrompt;
    };
    
    const featureMap = c.featureMapping[data.websiteType] || {};
    if (data.features.includes(featureMap.productList) && data.products.length > 0) {
        prompt += `\n**Product List Section:**\nCreate a product grid.\n` + generateListPrompt(data.products, 'product_images', 'products');
    }
    if (data.features.includes(featureMap.projectGallery) && data.portfolioProjects.length > 0) {
        prompt += `\n**Project Gallery Section:**\nCreate a portfolio gallery.\n` + generateListPrompt(data.portfolioProjects, 'portfolio_images', 'portfolioProjects');
    }
    if (data.features.includes(featureMap.testimonials) && data.testimonials.length > 0) {
        prompt += `\n**Testimonials Section:**\nDisplay these customer testimonials.\n` + generateListPrompt(data.testimonials, 'testimonial_photos', 'testimonials');
    }
    if (data.features.includes(featureMap.ourTeam) && data.teamMembers.length > 0) {
        prompt += `\n**Our Team Section:**\nIntroduce the team members.\n` + generateListPrompt(data.teamMembers, 'team_photos', 'teamMembers');
    }
     if (data.features.includes(featureMap.services) && data.services.length > 0) {
        prompt += `\n**Our Services Section:**\nDetail the services offered. The data is in the 'services' JSON field.\n`;
    }
    if (data.features.includes(featureMap.faq) && data.faqs.length > 0) {
        prompt += `\n**FAQ Section:**\nCreate a collapsible FAQ section. The data is in the 'faqs' JSON field.\n`;
    }
    if (data.features.includes(featureMap.postCategories) && data.postCategories) {
        prompt += `\n**Blog Post Categories:** The blog should have these categories: ${data.postCategories}.\n`;
    }
    if (data.features.includes(featureMap.process) && data.workProcess) {
        prompt += `\n**My Work Process Section:** Describe the work process using this text: "${data.workProcess}".\n`;
    }
     if (data.features.includes(featureMap.aboutMe) && data.detailedAboutMe) {
        prompt += `\n**Detailed About Me Section:** Use this text: "${data.detailedAboutMe}".\n`;
    }

    if (data.customFields.length > 0) {
        prompt += `\n### Additional Client Parameters\n`;
        data.customFields.forEach(field => prompt += `- **${field.key}:** ${field.value}\n`);
    }
    return prompt;
  };

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);

    const fd = new FormData();
    
    // Append simple fields
    fd.append('companyName', formData.companyName);
    fd.append('websiteType', formData.websiteType);
    fd.append('contactEmail', formData.contactEmail);
    fd.append('aboutText', formData.aboutText);
    fd.append('postCategories', formData.postCategories);
    fd.append('workProcess', formData.workProcess);
    fd.append('detailedAboutMe', formData.detailedAboutMe);
    fd.append('lang', lang);
    fd.append('status', 'pending');

    // Handle Logo
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
      
      setIsSubmitted(true);
    } catch (err) {
      console.error('Submission Error:', err);
      setError((content[lang] || content.id).errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative isolate min-h-screen">
      <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"><div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#2563eb] to-[#06b6d4] opacity-20 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div></div>
      <main className="container mx-auto px-6 py-12 md:py-24">
         <Header lang={lang} setLang={setLang} content={content[lang] || content.id} />
         <div className="mt-16 max-w-3xl mx-auto">
           {isSubmitted ? (
             <SuccessMessage content={content[lang] || content.id} />
           ) : (
             <GeneratorForm onSubmit={handleFormSubmit} isLoading={isLoading} error={error} content={content} lang={lang} />
           )}
         </div>
      </main>
    </div>
  );
}

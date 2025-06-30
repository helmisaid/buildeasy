// File: app/page.js
// Description: The main page, updated with the new PocketBase URL and improved logic.

"use client";

import { useState } from 'react';
import GeneratorForm from '../components/GeneratorForm';
import SubmissionSummary from '../components/SubmissionSummary';
import Header from '../components/Header';
import content from '../lib/content'; // Import the content object

export default function Home() {
  const [lang, setLang] = useState('id');
  const [submittedData, setSubmittedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const POCKETBASE_URL = 'http://152.42.249.230:8090'; // Endpoint Updated
  const COLLECTION_NAME = 'website_requests';

  const generateDynamicPrompt = (data) => {
    const currentLang = data.lang || 'id';
    const c = content[currentLang] || content.id;
    
    let prompt = `INSTRUCTION: Generate a complete, multi-page website based on the following detailed specifications.\n\n`;
    prompt += `**WEBSITE LANGUAGE:** ${currentLang.toUpperCase()}\n\n`;

    prompt += `### CORE BRANDING & DESIGN\n`;
    prompt += `- **Brand Name:** ${data.companyName}\n`;
    if (data.logoFile) prompt += `- **Logo:** A logo file has been uploaded to the 'logo' field in the database. Use this file as the primary logo.\n`;
    else if (data.logoUrl) prompt += `- **Logo URL:** ${data.logoUrl}\n`;
    prompt += `- **Brand Description:** "${data.aboutText}"\n`;
    prompt += `- **Contact Email:** ${data.contactEmail}\n`;
    prompt += `- **Color Palette:** The primary color is ${data.colors[0]}. The full palette is: ${data.colors.join(', ')}.\n`;
    prompt += `- **Typography:** Use the Google Font "${data.font}" for all text content.\n`;
    if (data.useAnimation) {
        prompt += `- **Animation Style:** Incorporate subtle and elegant animations (e.g., fade-ins, smooth transitions).\n\n`;
    } else {
        prompt += `- **Animation Style:** No animations requested.\n\n`;
    }
    
    prompt += `### WEBSITE PAGE STRUCTURE\n`;
    prompt += `The website must have the following pages with the specified slugs and components in order:\n`;
    data.pages.forEach(page => {
        prompt += `\n**PAGE: ${page.slug === '/' ? 'Homepage' : page.slug}**\n`;
        prompt += `- **URL Slug:** ${page.slug}\n`;
        prompt += `- **Components on this page:**\n`;
        page.components.forEach(comp => {
            prompt += `  - **${comp.name}**\n`;
        });
    });

    prompt += `\n### FEATURE CONTENT DATA\n`;
    prompt += `When building a component (e.g., 'Project Gallery'), use the corresponding data from this section. Associate uploaded files by their index.\n`;
    
    const generateListPrompt = (list, fileFieldName, textDataKey) => {
        let listPrompt = `The data for this list is in the '${textDataKey}' JSON field. The corresponding images have been uploaded to the '${fileFieldName}' file field.\n`;
        list.forEach((item, index) => {
            let itemDetails = Object.entries(item)
                .filter(([key, value]) => !['fileObject', 'id', 'previewUrl'].includes(key) && value)
                .map(([key, value]) => `${key}: "${value}"`)
                .join(', ');

            if (item.fileObject) {
                 if (itemDetails) itemDetails += ', ';
                 itemDetails += `image: "(File ${index + 1} from the '${fileFieldName}' field)"`;
            }

            listPrompt += `  - Item ${index+1}: { ${itemDetails} }\n`;
        });
        return listPrompt;
    };
    
    if (data.products.length > 0) prompt += `\n**Product Catalog Data:**\n` + generateListPrompt(data.products, 'product_images', 'products');
    if (data.portfolioProjects.length > 0) prompt += `\n**Project Gallery Data:**\n` + generateListPrompt(data.portfolioProjects, 'portfolio_images', 'portfolioProjects');
    if (data.testimonials.length > 0) prompt += `\n**Testimonials Data:**\n` + generateListPrompt(data.testimonials, 'testimonial_photos', 'testimonials');
    if (data.teamMembers.length > 0) prompt += `\n**Team Profiles Data:**\n` + generateListPrompt(data.teamMembers, 'team_photos', 'teamMembers');
    if (data.services.length > 0) prompt += `\n**Services List Data:** Data is in the 'services' JSON field.\n`;
    if (data.faqs.length > 0) prompt += `\n**FAQ Data:** Data is in the 'faqs' JSON field.\n`;
    if (data.postCategories) prompt += `\n**Blog Categories:** ${data.postCategories}.\n`;
    if (data.workProcess) prompt += `\n**Work Process Text:** "${data.workProcess}".\n`;
    if (data.detailedAboutMe) prompt += `\n**Detailed Profile Text:** "${data.detailedAboutMe}".\n`;

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
    
    Object.keys(formData).forEach(key => {
        const value = formData[key];
        if (key === 'logoFile' && value) {
            fd.append('logo', value);
        } else if (key === 'useAnimation') {
            fd.append(key, value ? 'true' : 'false');
        } else if (Array.isArray(value)) {
            // Arrays are handled separately below
        } else if (key !== 'logoPreview' && typeof value !== 'object') {
            fd.append(key, value);
        }
    });

    fd.append('lang', lang);
    fd.append('status', 'pending');
    
    const cleanAndStringify = (arr, fieldsToKeep) => JSON.stringify(arr.map(item => {
        let cleanItem = {};
        fieldsToKeep.forEach(field => { if(item[field]) cleanItem[field] = item[field]; });
        return cleanItem;
    }));

    fd.append('pages', cleanAndStringify(formData.pages, ['slug', 'components']));
    fd.append('colors', JSON.stringify(formData.colors));
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

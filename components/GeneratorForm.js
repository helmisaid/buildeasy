// File: components/GeneratorForm.js
// Description: The main form, with a smart page builder that filters components by website type.

import { Bars3Icon, DocumentDuplicateIcon, IdentificationIcon, LightBulbIcon, PaintBrushIcon, PhotoIcon, PlusIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';

const SectionHeader = ({ icon, title }) => (
    <div className="flex items-center gap-3 border-b-2 border-[#2563eb]/50 pb-2 mb-6">
        {icon}
        <h3 className="text-xl font-bold text-white">{title}</h3>
    </div>
);

const GeneratorForm = ({ onSubmit, isLoading, error, content, lang }) => {
  const [formData, setFormData] = useState({
    companyName: '', logoUrl: '', logoFile: null, logoPreview: null,
    websiteType: content[lang].websiteTypeOptions[0],
    contactEmail: '', aboutText: '',
    colors: ['#2563eb', '#06b6d4'],
    font: 'Inter',
    useAnimation: true,
    pages: [{ id: 1, slug: '/', components: [] }],
    products: [], portfolioProjects: [], testimonials: [], teamMembers: [], services: [], faqs: [],
    postCategories: '', workProcess: '', detailedAboutMe: '',
    customFields: [{ id: 1, key: '', value: '' }],
  });
  
  const currentContent = content[lang] || content.id;
  const availableFeatures = currentContent.featureMapping[formData.websiteType] || {};
  
  // NEW: Filter available components based on the selected website type
  const componentIdsForType = currentContent.componentMapping[formData.websiteType] || [];
  const filteredAvailableComponents = (currentContent.availableComponents || []).filter(c => componentIdsForType.includes(c.id));
  
  const formDataRef = useRef(formData);
  useEffect(() => {
      formDataRef.current = formData;
  });

  const setDefaultFeaturesForType = (type) => {
    setFormData(prev => ({
      ...prev,
      websiteType: type,
      pages: [{ id: 1, slug: '/', components: [] }], // Reset pages
      products: [], portfolioProjects: [], testimonials: [], teamMembers: [], services: [], faqs: [],
      postCategories: '', workProcess: '', detailedAboutMe: ''
    }));
  };

  useEffect(() => {
    setDefaultFeaturesForType(currentContent.websiteTypeOptions[0]);
  }, [lang, content]);
  
  useEffect(() => {
    return () => {
        const lastFormData = formDataRef.current;
        if (lastFormData.logoPreview) {
            URL.revokeObjectURL(lastFormData.logoPreview);
        }
        ['products', 'portfolioProjects', 'testimonials', 'teamMembers'].forEach(key => {
            if (lastFormData[key]) {
                lastFormData[key].forEach(item => {
                    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
                });
            }
        });
    };
  }, []);

  const handleWebsiteTypeChange = (e) => setDefaultFeaturesForType(e.target.value);
  const handleLogoFileChange = (file) => {
    if (file) {
      if (formData.logoPreview) URL.revokeObjectURL(formData.logoPreview);
      setFormData(prev => ({ ...prev, logoFile: file, logoUrl: '', logoPreview: URL.createObjectURL(file) }));
    }
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleColorChange = (index, value) => setFormData(prev => ({ ...prev, colors: prev.colors.map((c, i) => i === index ? value : c) }));
  const addColor = () => setFormData(prev => ({...prev, colors: [...prev.colors, '#ffffff']}));
  const removeColor = (index) => { if (formData.colors.length > 1) setFormData(prev => ({ ...prev, colors: formData.colors.filter((_, i) => i !== index) })); };

  const addPage = () => setFormData(prev => ({ ...prev, pages: [...prev.pages, { id: Date.now(), slug: '', components: [] }] }));
  const removePage = (pageId) => { if (formData.pages.length > 1) setFormData(prev => ({ ...prev, pages: prev.pages.filter(p => p.id !== pageId) })); };
  const handlePageChange = (pageId, field, value) => {
      if (field === 'slug') {
          const slugValue = value.startsWith('/') ? value.substring(1) : value;
          value = '/' + slugValue.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
      }
      setFormData(prev => ({ ...prev, pages: prev.pages.map(p => p.id === pageId ? { ...p, [field]: value } : p)}));
  };
  const addComponentToPage = (pageId, componentString) => {
    if (!componentString) return;
    const component = JSON.parse(componentString);
    setFormData(prev => {
        const newState = { ...prev };
        const keyMap = {
            'products': 'products', 'gallery': 'portfolioProjects', 'testimonials': 'testimonials',
            'team': 'teamMembers', 'services': 'services', 'faq': 'faqs'
        };
        const dataKey = keyMap[component.id];
        if (dataKey && newState[dataKey].length === 0) {
            const initialItem = {
                products: {id: Date.now(), name: '', price: '', oldPrice: '', fileObject: null, previewUrl: null},
                portfolioProjects: {id: Date.now(), name: '', description: '', fileObject: null, previewUrl: null, projectUrl: ''},
                testimonials: {id: Date.now(), name: '', text: '', fileObject: null, previewUrl: null},
                teamMembers: {id: Date.now(), name: '', role: '', fileObject: null, previewUrl: null},
                services: {id: Date.now(), name: '', description: ''},
                faqs: {id: Date.now(), question: '', answer: ''}
            };
            newState[dataKey] = [initialItem[dataKey]];
        }
        newState.pages = prev.pages.map(p => p.id === pageId ? { ...p, components: [...p.components, component] } : p);
        return newState;
    });
  };
  const removeComponentFromPage = (pageId, componentIndex) => setFormData(prev => ({ ...prev, pages: prev.pages.map(p => p.id === pageId ? { ...p, components: p.components.filter((_, i) => i !== componentIndex) } : p)}));
  
  const createDynamicFormHandlers = (key) => ({
    handleChange: (id, field, value) => setFormData(prev => ({ ...prev, [key]: prev[key].map(item => item.id === id ? {...item, [field]: value} : item) })),
    add: (item) => setFormData(prev => ({ ...prev, [key]: [...prev[key], {...item, id: Date.now()}] })),
    remove: (id) => {
        const itemToRemove = formData[key].find(item => item.id === id);
        if (itemToRemove && itemToRemove.previewUrl) URL.revokeObjectURL(itemToRemove.previewUrl);
        setFormData(prev => ({ ...prev, [key]: prev[key].filter(item => item.id !== id) }));
    },
    handleFileChange: (id, file) => {
      if(file){
        const oldItem = formData[key].find(item => item.id === id);
        if (oldItem && oldItem.previewUrl) URL.revokeObjectURL(oldItem.previewUrl);
        setFormData(prev => ({ ...prev, [key]: prev[key].map(item => item.id === id ? {...item, fileObject: file, previewUrl: URL.createObjectURL(file) } : item) }));
      }
    }
  });
  
  const productHandlers = createDynamicFormHandlers('products');
  const portfolioHandlers = createDynamicFormHandlers('portfolioProjects');
  const testimonialHandlers = createDynamicFormHandlers('testimonials');
  const teamHandlers = createDynamicFormHandlers('teamMembers');
  const serviceHandlers = createDynamicFormHandlers('services');
  const faqHandlers = createDynamicFormHandlers('faqs');
  const customFieldHandlers = createDynamicFormHandlers('customFields');
  
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };
  
  const inputClass = "w-full bg-gray-800/80 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all";
  const labelClass = "block text-sm font-medium text-gray-300 mb-2";
  const requiredSpan = <span className="text-red-500 ml-1">*</span>;
  const renderDynamicItem = (item, onRemove, children) => (<div key={item.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 space-y-3 relative">{onRemove && <button type="button" onClick={() => onRemove(item.id)} className="absolute -top-3 -right-3 bg-red-600 p-1 rounded-full text-white hover:bg-red-500"><XMarkIcon className="h-4 w-4"/></button>}{children}</div>);
  const renderAddButton = (onClick, text) => (<button type="button" onClick={onClick} className="flex items-center gap-2 text-sm text-[#06b6d4] hover:text-white font-semibold transition-colors mt-4"><PlusIcon className="h-5 w-5"/>{text}</button>);
  const ImageUploader = ({ itemId, previewSrc, onFileChange }) => (
    <div className="flex items-center gap-4">
        <div className="flex-shrink-0 h-16 w-16 rounded-md bg-gray-800 flex items-center justify-center">
            {previewSrc ? <img src={previewSrc} alt="Preview" className="h-full w-full object-contain rounded-md" /> : <PhotoIcon className="h-8 w-8 text-gray-500"/>}
        </div>
        <label htmlFor={`file-upload-${itemId}`} className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-[#06b6d4] hover:text-white px-3 py-2 transition-colors text-sm">
            <span>Upload</span>
            <input id={`file-upload-${itemId}`} type="file" className="sr-only" onChange={(e) => onFileChange(e.target.files[0])} accept="image/*" />
        </label>
    </div>
  );
  
  const googleFonts = [
    { name: 'Inter', category: 'Sans Serif' }, { name: 'Poppins', category: 'Sans Serif' }, { name: 'Lato', category: 'Sans Serif' },
    { name: 'Roboto', category: 'Sans Serif' }, { name: 'Montserrat', category: 'Sans Serif' }, { name: 'Open Sans', category: 'Sans Serif' },
    { name: 'Playfair Display', category: 'Serif' }, { name: 'Merriweather', category: 'Serif' }, { name: 'Lora', category: 'Serif' },
    { name: 'Oswald', category: 'Display' }, { name: 'Raleway', category: 'Display' }, { name: 'Caveat', category: 'Handwriting' },
  ];
  
  const isComponentUsed = (componentId) => formData.pages.some(p => p.components.some(c => c.id === componentId));

  return (
    <div className="bg-gray-900/50 backdrop-blur-md p-8 rounded-2xl border border-gray-700/50 shadow-2xl shadow-[#2563eb]/10">
      <form onSubmit={handleSubmit} className="space-y-10">
        <div>
            <SectionHeader icon={<IdentificationIcon className="w-7 h-7 text-[#06b6d4]" />} title="Informasi Dasar" />
            <div className="space-y-6">
              <div><label htmlFor="companyName" className={labelClass}>{currentContent.companyNameLabel}{requiredSpan}</label><input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} className={inputClass} placeholder={currentContent.companyNamePlaceholder} required /></div>
              <div><label className={labelClass}>{currentContent.logoLabel}</label><ImageUploader itemId="logo" previewSrc={formData.logoPreview} onFileChange={handleLogoFileChange}/><div className="mt-4"><label htmlFor="logoUrl" className="text-sm text-gray-400">{currentContent.logoUrlLabel}</label><input type="url" id="logoUrl" name="logoUrl" value={formData.logoUrl} onChange={e => { handleInputChange(e); setFormData(prev => ({...prev, logoFile: null, logoPreview: null})); }} className={`${inputClass} mt-1`} placeholder={currentContent.logoUrlPlaceholder} /></div></div>
              <div><label htmlFor="websiteType" className={labelClass}>{currentContent.websiteTypeLabel}{requiredSpan}</label><select id="websiteType" name="websiteType" value={formData.websiteType} onChange={handleWebsiteTypeChange} className={inputClass}>{currentContent.websiteTypeOptions.map(opt => <option key={opt}>{opt}</option>)}</select></div>
              <div><label htmlFor="aboutText" className={labelClass}>{currentContent.aboutTextLabel}{requiredSpan}</label><textarea id="aboutText" name="aboutText" rows="4" value={formData.aboutText} onChange={handleInputChange} className={inputClass} placeholder={currentContent.aboutTextPlaceholder} required /></div>
              <div><label htmlFor="contactEmail" className={labelClass}>{currentContent.contactEmailLabel}{requiredSpan}</label><input type="email" id="contactEmail" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} className={inputClass} placeholder={currentContent.contactEmailPlaceholder} required /></div>
            </div>
        </div>

        <div>
            <SectionHeader icon={<PaintBrushIcon className="w-7 h-7 text-[#06b6d4]" />} title={currentContent.designSpecLabel} />
             <div className="space-y-6">
                <div>
                    <label className={labelClass}>{currentContent.colorPaletteLabel}</label>
                    <div className="space-y-3">{formData.colors.map((color, index) => <div key={index} className="flex items-center gap-3"><input type="color" value={color} onChange={(e) => handleColorChange(index, e.target.value)} className="p-1 h-10 w-10 block bg-gray-800 border-gray-700 cursor-pointer rounded-md"/><input type="text" value={color} onChange={(e) => handleColorChange(index, e.target.value)} className={inputClass} /><button type="button" onClick={() => removeColor(index)} className="p-2 text-gray-400 hover:text-white hover:bg-red-500 rounded-md disabled:opacity-50" disabled={formData.colors.length <= 1}><XMarkIcon className="h-5 w-5"/></button></div>)}{renderAddButton(addColor, currentContent.addColor)}</div>
                </div>
                <div>
                    <label htmlFor="font" className={labelClass}>{currentContent.fontLabel}</label>
                    <select id="font" name="font" value={formData.font} onChange={handleInputChange} className={inputClass}>
                        {['Sans Serif', 'Serif', 'Display', 'Handwriting'].map(category => (
                            <optgroup key={category} label={category}>
                                {googleFonts.filter(f => f.category === category).map(font => (
                                    <option key={font.name} value={font.name} style={{fontFamily: font.name}}>{font.name}</option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>
                 <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                        <input id="useAnimation" name="useAnimation" type="checkbox" checked={formData.useAnimation} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-600 text-[#06b6d4] focus:ring-offset-gray-900 focus:ring-[#06b6d4] bg-gray-700"/>
                    </div>
                    <div className="ml-3 text-sm leading-6">
                        <label htmlFor="useAnimation" className="font-medium text-gray-300">{currentContent.animationLabel}</label>
                    </div>
                </div>
             </div>
        </div>

        <div>
            <SectionHeader icon={<DocumentDuplicateIcon className="w-7 h-7 text-[#06b6d4]" />} title={currentContent.pageBuilderLabel} />
            <div className="space-y-6">
            {formData.pages.map((page, pageIndex) => (
                <div key={page.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                         <h4 className="font-bold text-white">{currentContent.pageLabel} {pageIndex + 1} {pageIndex === 0 ? "(Homepage)" : ""}</h4>
                         {formData.pages.length > 1 && <button type="button" onClick={() => removePage(page.id)} className="p-1 text-gray-400 hover:text-white"><XMarkIcon className="h-5 w-5"/></button>}
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className={labelClass}>{currentContent.slugLabel}{requiredSpan}</label>
                            <input type="text" value={page.slug} onChange={(e) => handlePageChange(page.id, 'slug', e.target.value)} placeholder={currentContent.slugPlaceholder} className={inputClass} disabled={pageIndex === 0} required />
                        </div>
                        <div>
                            <label className={labelClass}>Komponen</label>
                            <div className="space-y-2">
                                {page.components.map((comp, compIndex) => (
                                    <div key={compIndex} className="flex items-center justify-between bg-gray-700/60 p-2 rounded-md">
                                        <div className="flex items-center gap-2 text-white">
                                            <Bars3Icon className="h-5 w-5 text-gray-500" />
                                            {comp.name}
                                        </div>
                                        <button type="button" onClick={() => removeComponentFromPage(page.id, compIndex)} className="p-1 text-gray-400 hover:text-white"><XMarkIcon className="h-4 w-4"/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <select onChange={(e) => { addComponentToPage(page.id, e.target.value); e.target.value = ""; }} className={inputClass} value="">
                                <option value="" disabled>{currentContent.selectComponentLabel}</option>
                                {filteredAvailableComponents.map(c => <option key={c.id} value={JSON.stringify(c)}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            ))}
            {renderAddButton(addPage, currentContent.addPage)}
            </div>
        </div>
        
        {/* --- Feature Content Section --- */}
        <div>
             <SectionHeader icon={<SparklesIcon className="w-7 h-7 text-[#06b6d4]" />} title="Isi Konten Fitur" />
             {isComponentUsed('products') && <div className="space-y-4 mt-6"><h3 className={labelClass}>{currentContent.productListLabel}</h3>{formData.products.map(p => renderDynamicItem(p, productHandlers.remove, <><ImageUploader itemId={`product-${p.id}`} previewSrc={p.previewUrl} onFileChange={(file) => productHandlers.handleFileChange(p.id, file)} /><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><div><label className="text-xs text-gray-400">{currentContent.productNameLabel}{requiredSpan}</label><input type="text" value={p.name} onChange={e => productHandlers.handleChange(p.id, 'name', e.target.value)} className={inputClass} required /></div><div><label className="text-xs text-gray-400">{currentContent.priceLabel}{requiredSpan}</label><input type="text" value={p.price} onChange={e => productHandlers.handleChange(p.id, 'price', e.target.value)} className={inputClass} required /></div></div><div><label className="text-xs text-gray-400">{currentContent.oldPriceLabel}</label><input type="text" value={p.oldPrice} onChange={e => productHandlers.handleChange(p.id, 'oldPrice', e.target.value)} className={inputClass} /></div></>))}{renderAddButton(() => productHandlers.add({ name: '', price: '', oldPrice: '' }), currentContent.addProduct)}</div>}
             {isComponentUsed('gallery') && <div className="space-y-4 mt-6"><h3 className={labelClass}>{currentContent.projectGalleryLabel}</h3>{formData.portfolioProjects.map(p => renderDynamicItem(p, portfolioHandlers.remove, <><ImageUploader itemId={`portfolio-${p.id}`} previewSrc={p.previewUrl} onFileChange={(file) => portfolioHandlers.handleFileChange(p.id, file)} /><div><label className="text-xs text-gray-400">{currentContent.projectNameLabel}{requiredSpan}</label><input type="text" value={p.name} onChange={e => portfolioHandlers.handleChange(p.id, 'name', e.target.value)} className={inputClass} required /></div><div><label className="text-xs text-gray-400">{currentContent.projectDescLabel}</label><textarea value={p.description} onChange={e => portfolioHandlers.handleChange(p.id, 'description', e.target.value)} className={inputClass} rows={2} /></div><div><label className="text-xs text-gray-400">{currentContent.projectUrlLabel}</label><input type="url" value={p.projectUrl} onChange={e => portfolioHandlers.handleChange(p.id, 'projectUrl', e.target.value)} className={inputClass} /></div></>))}{renderAddButton(() => portfolioHandlers.add({ name: '', description: '', projectUrl: '' }), currentContent.addProject)}</div>}
             {isComponentUsed('testimonials') && <div className="space-y-4 mt-6"><h3 className={labelClass}>{currentContent.testimonialsLabel}</h3>{formData.testimonials.map(t => renderDynamicItem(t, testimonialHandlers.remove, <><ImageUploader itemId={`testimonial-${t.id}`} previewSrc={t.previewUrl} onFileChange={(file) => testimonialHandlers.handleFileChange(t.id, file)} /><div><label className="text-xs text-gray-400">{currentContent.customerNameLabel}{requiredSpan}</label><input type="text" value={t.name} onChange={e => testimonialHandlers.handleChange(t.id, 'name', e.target.value)} className={inputClass} required /></div><div><label className="text-xs text-gray-400">{currentContent.testimonialTextLabel}{requiredSpan}</label><textarea value={t.text} onChange={e => testimonialHandlers.handleChange(t.id, 'text', e.target.value)} className={inputClass} rows={2} required /></div></>))}{renderAddButton(() => testimonialHandlers.add({ name: '', text: '' }), currentContent.addTestimonial)}</div>}
             {isComponentUsed('team') && <div className="space-y-4 mt-6"><h3 className={labelClass}>{currentContent.ourTeamLabel}</h3>{formData.teamMembers.map(m => renderDynamicItem(m, teamHandlers.remove, <><ImageUploader itemId={`team-${m.id}`} previewSrc={m.previewUrl} onFileChange={(file) => teamHandlers.handleFileChange(m.id, file)} /><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><div><label className="text-xs text-gray-400">{currentContent.memberNameLabel}{requiredSpan}</label><input type="text" value={m.name} onChange={e => teamHandlers.handleChange(m.id, 'name', e.target.value)} className={inputClass} required /></div><div><label className="text-xs text-gray-400">{currentContent.memberRoleLabel}</label><input type="text" value={m.role} onChange={e => teamHandlers.handleChange(m.id, 'role', e.target.value)} className={inputClass} /></div></div></>))}{renderAddButton(() => teamHandlers.add({ name: '', role: '' }), currentContent.addMember)}</div>}
             {isComponentUsed('services') && <div className="space-y-4 mt-6"><h3 className={labelClass}>{currentContent.servicesLabel}</h3>{formData.services.map(s => renderDynamicItem(s, serviceHandlers.remove, <><div><label className="text-xs text-gray-400">{currentContent.serviceNameLabel}{requiredSpan}</label><input type="text" value={s.name} onChange={e => serviceHandlers.handleChange(s.id, 'name', e.target.value)} className={inputClass} required /></div><div><label className="text-xs text-gray-400">{currentContent.serviceDescLabel}</label><textarea value={s.description} onChange={e => serviceHandlers.handleChange(s.id, 'description', e.target.value)} className={inputClass} rows={2} /></div></>))}{renderAddButton(() => serviceHandlers.add({ name: '', description: '' }), currentContent.addService)}</div>}
             {isComponentUsed('faq') && <div className="space-y-4 mt-6"><h3 className={labelClass}>{currentContent.faqLabel}</h3>{formData.faqs.map(f => renderDynamicItem(f, faqHandlers.remove, <><div><label className="text-xs text-gray-400">{currentContent.questionLabel}{requiredSpan}</label><input type="text" value={f.question} onChange={e => faqHandlers.handleChange(f.id, 'question', e.target.value)} className={inputClass} required /></div><div><label className="text-xs text-gray-400">{currentContent.answerLabel}{requiredSpan}</label><textarea value={f.answer} onChange={e => faqHandlers.handleChange(f.id, 'answer', e.target.value)} className={inputClass} rows={2} required /></div></>))}{renderAddButton(() => faqHandlers.add({ question: '', answer: '' }), currentContent.addFaq)}</div>}
        </div>

        <div>
            <SectionHeader icon={<LightBulbIcon className="w-7 h-7 text-[#06b6d4]" />} title={currentContent.customParamsLabel} />
            <div className="space-y-3">
                {formData.customFields.map(f => renderDynamicItem(f, () => customFieldHandlers.remove(f.id),
                    <div className="grid grid-cols-12 gap-3 items-center">
                        <div className="col-span-5"><input type="text" value={f.key} onChange={(e) => customFieldHandlers.handleChange(f.id, 'key', e.target.value)} placeholder={currentContent.customParamsPlaceholderKey} className={inputClass} /></div>
                        <div className="col-span-6"><input type="text" value={f.value} onChange={(e) => customFieldHandlers.handleChange(f.id, 'value', e.target.value)} placeholder={currentContent.customParamsPlaceholderValue} className={inputClass} /></div>
                    </div>
                ))}
            </div>
            {renderAddButton(() => customFieldHandlers.add({ key: '', value: '' }), currentContent.addParam)}
            <p className="text-xs text-gray-500 mt-2">{currentContent.customParamsExample}</p>
        </div>

        {error && <p className="text-red-400 text-sm text-center pt-4">{error}</p>}
        <div className="pt-8 border-t border-gray-800">
            <button type="submit" disabled={isLoading} className="w-full disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold bg-gradient-to-br from-[#2563eb] to-[#06b6d4] hover:from-[#1d4ed8] hover:to-[#0891b2] text-white py-3 px-6 rounded-lg shadow-lg hover:shadow-[#2563eb]/30 transform hover:-translate-y-0.5 transition-all duration-300">{isLoading ? currentContent.loadingButton : currentContent.submitButton}</button>
        </div>
      </form>
    </div>
  );
};

export default GeneratorForm;

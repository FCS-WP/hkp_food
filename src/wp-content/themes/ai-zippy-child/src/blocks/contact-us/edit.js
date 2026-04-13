import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
	const { address, email, phone, socialIcons = [] } = attributes;
	const blockProps = useBlockProps({ className: 'contact-us' });

	const updateSocialIcons = (updated) => {
		setAttributes({ socialIcons: updated });
	};

	const updateSocialIcon = (index, key, value) => {
		const updated = socialIcons.map((item, i) => (i === index ? { ...item, [key]: value } : item));
		updateSocialIcons(updated);
	};

	const selectSocialIcon = (index, media) => {
		const updated = socialIcons.map((item, i) => {
			if (i !== index) return item;
			return {
				...item,
				imageId: media?.id || 0,
				imageUrl: media?.url || '',
				imageAlt: media?.alt || item.imageAlt || '',
			};
		});
		updateSocialIcons(updated);
	};

	const addSocialIcon = () => {
		updateSocialIcons([
			...socialIcons,
			{ url: '#', imageId: 0, imageUrl: '', imageAlt: '' },
		]);
	};

	const removeSocialIcon = (index) => {
		updateSocialIcons(socialIcons.filter((_, i) => i !== index));
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Contact Details', 'ai-zippy-child')} initialOpen={true}>
					<TextareaControl label={__('Address', 'ai-zippy-child')} value={address} onChange={(val) => setAttributes({ address: val })} rows={3} />
					<TextControl label={__('Email', 'ai-zippy-child')} value={email} onChange={(val) => setAttributes({ email: val })} />
					<TextControl label={__('Phone', 'ai-zippy-child')} value={phone} onChange={(val) => setAttributes({ phone: val })} />
				</PanelBody>
				<PanelBody title={__('Social Icons', 'ai-zippy-child')} initialOpen={false}>
					<div className="contact-us__socials-editor">
						{socialIcons.map((icon, i) => (
							<div key={i} className="contact-us__social-item-editor">
								<MediaUploadCheck>
									<MediaUpload
										onSelect={(media) => selectSocialIcon(i, media)}
										allowedTypes={['image']}
										value={icon.imageId}
										render={({ open }) => (
											<div className="contact-us__social-thumb" onClick={open}>
												{icon.imageUrl ? <img src={icon.imageUrl} alt={icon.imageAlt} /> : <span>{__('+ Icon', 'ai-zippy-child')}</span>}
											</div>
										)}
									/>
								</MediaUploadCheck>
								<TextControl placeholder={__('Link URL', 'ai-zippy-child')} value={icon.url} onChange={(val) => updateSocialIcon(i, 'url', val)} />
								<Button isDestructive variant="tertiary" onClick={() => removeSocialIcon(i)}>✕</Button>
							</div>
						))}
						<Button variant="secondary" onClick={addSocialIcon}>{__('+ Add Social Icon', 'ai-zippy-child')}</Button>
					</div>
				</PanelBody>
			</InspectorControls>
			<section {...blockProps}>
				<div className="contact-us__content-row">
					<div className="contact-us__card">
						<p><strong>{__('Address:', 'ai-zippy-child')}</strong><br />{address}</p>
						<p><strong>{__('Email:', 'ai-zippy-child')}</strong><br />{email}</p>
						<p><strong>{__('Phone:', 'ai-zippy-child')}</strong><br />{phone}</p>
						<div className="contact-us__socials">
							{socialIcons.map((icon, i) => (
								icon.imageUrl ? <span key={i} className="contact-us__social-preview"><img src={icon.imageUrl} alt={icon.imageAlt} /></span> : null
							))}
						</div>
					</div>
					<div className="contact-us__form-placeholder"><span>{__('Contact Form', 'ai-zippy-child')}</span></div>
				</div>
			</section>
		</>
	);
}

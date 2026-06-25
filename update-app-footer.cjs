const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add state for footerText
content = content.replace(
    "const [contactUsText, setContactUsText] = useState<string>('');",
    "const [contactUsText, setContactUsText] = useState<string>('');\n  const [footerText, setFooterText] = useState<string>('');"
);

// Add to homepage-options fetch
content = content.replace(
    "if (data.contactUsText) setContactUsText(data.contactUsText);",
    "if (data.contactUsText) setContactUsText(data.contactUsText);\n          if (data.footerText) setFooterText(data.footerText);"
);

// Add to homepage-options save
content = content.replace(
    "contactUsText: contactUsText.trim()",
    "contactUsText: contactUsText.trim(),\n        footerText: footerText.trim()"
);

// Update footer to use footerText
const footerOriginal = `            <div className="mt-6 text-sm font-medium text-blue-200 text-left md:text-right space-y-1">
              <p>Lira City, Northern Uganda</p>
              <p>Call: 0769302480 / 0770795585</p>
              <p>WhatsApp: +256 770 795585</p>
            </div>`;
const footerModified = `            <div className="mt-6 text-sm font-medium text-blue-200 text-left md:text-right space-y-1">
              {footerText ? (
                <div className="whitespace-pre-wrap">{footerText}</div>
              ) : (
                <>
                  <p>Lira City, Northern Uganda</p>
                  <p>Call: 0769302480 / 0770795585</p>
                  <p>WhatsApp: +256 770 795585</p>
                </>
              )}
            </div>`;
content = content.replace(footerOriginal, footerModified);

// Add to admin options form
const adminFormOriginal = `                            <div>
                              <label className="block text-[10px] font-bold text-white uppercase mb-1.5 font-mono font-bold">CONTACT US PAGE CONTENT</label>
                              <textarea
                                value={contactUsText}
                                onChange={(e) => setContactUsText(e.target.value)}
                                className="w-full h-24 bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#fcd34d] resize-none leading-relaxed"
                                placeholder="Write the contact us instructions here..."
                              />
                            </div>`;
const adminFormModified = `                            <div>
                              <label className="block text-[10px] font-bold text-white uppercase mb-1.5 font-mono font-bold">CONTACT US PAGE CONTENT</label>
                              <textarea
                                value={contactUsText}
                                onChange={(e) => setContactUsText(e.target.value)}
                                className="w-full h-24 bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#fcd34d] resize-none leading-relaxed"
                                placeholder="Write the contact us instructions here..."
                              />
                            </div>
                            
                            <div>
                              <label className="block text-[10px] font-bold text-white uppercase mb-1.5 font-mono font-bold">FOOTER CONTACTS / COPYRIGHT TEXT</label>
                              <textarea
                                value={footerText}
                                onChange={(e) => setFooterText(e.target.value)}
                                className="w-full h-24 bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#fcd34d] resize-none leading-relaxed"
                                placeholder="Write the footer content here..."
                              />
                            </div>`;
content = content.replace(adminFormOriginal, adminFormModified);

fs.writeFileSync('src/App.tsx', content);
console.log('Updated App.tsx');

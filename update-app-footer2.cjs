const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add state for footerCopyrightText
content = content.replace(
    "const [footerText, setFooterText] = useState<string>('');",
    "const [footerText, setFooterText] = useState<string>('');\n  const [footerCopyrightText, setFooterCopyrightText] = useState<string>('');"
);

// Add to homepage-options fetch
content = content.replace(
    "if (data.footerText) setFooterText(data.footerText);",
    "if (data.footerText) setFooterText(data.footerText);\n          if (data.footerCopyrightText) setFooterCopyrightText(data.footerCopyrightText);"
);

// Add to homepage-options save
content = content.replace(
    "footerText: footerText.trim()",
    "footerText: footerText.trim(),\n        footerCopyrightText: footerCopyrightText.trim()"
);

// Update footer to use footerCopyrightText
const copyrightOriginal = `<p>&copy; {new Date().getFullYear()} Voice Of Jesus Radio.</p>`;
const copyrightModified = `{footerCopyrightText ? <p dangerouslySetInnerHTML={{ __html: footerCopyrightText }} /> : <p>&copy; {new Date().getFullYear()} Voice Of Jesus Radio.</p>}`;
content = content.replace(copyrightOriginal, copyrightModified);

// Add to admin options form
const adminFormOriginal = `                            <div>
                              <label className="block text-[10px] font-bold text-white uppercase mb-1.5 font-mono font-bold">FOOTER CONTACTS / COPYRIGHT TEXT</label>
                              <textarea
                                value={footerText}
                                onChange={(e) => setFooterText(e.target.value)}
                                className="w-full h-24 bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#fcd34d] resize-none leading-relaxed"
                                placeholder="Write the footer content here..."
                              />
                            </div>`;
const adminFormModified = `                            <div>
                              <label className="block text-[10px] font-bold text-white uppercase mb-1.5 font-mono font-bold">FOOTER CONTACTS TEXT</label>
                              <textarea
                                value={footerText}
                                onChange={(e) => setFooterText(e.target.value)}
                                className="w-full h-24 bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#fcd34d] resize-none leading-relaxed"
                                placeholder="Write the footer content here..."
                              />
                            </div>
                            
                            <div>
                              <label className="block text-[10px] font-bold text-white uppercase mb-1.5 font-mono font-bold">FOOTER COPYRIGHT TEXT</label>
                              <input
                                type="text"
                                value={footerCopyrightText}
                                onChange={(e) => setFooterCopyrightText(e.target.value)}
                                className="w-full bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#fcd34d] font-mono"
                                placeholder="&copy; 2024 Voice Of Jesus Radio."
                              />
                            </div>`;
content = content.replace(adminFormOriginal, adminFormModified);

fs.writeFileSync('src/App.tsx', content);
console.log('Updated App.tsx again');

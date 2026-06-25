const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// State additions
content = content.replace(
  "const [isPublishingBlog, setIsPublishingBlog] = useState<boolean>(false);",
  "const [isPublishingBlog, setIsPublishingBlog] = useState<boolean>(false);\n  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);\n  const [isDeletingBlogId, setIsDeletingBlogId] = useState<string | null>(null);\n  const [aboutUsText, setAboutUsText] = useState<string>('');\n  const [contactUsText, setContactUsText] = useState<string>('');"
);

// Loading options
content = content.replace(
  "if (data && data.announcementText) {\n          setAnnouncementText(data.announcementText);\n        }",
  "if (data) {\n          if (data.announcementText) setAnnouncementText(data.announcementText);\n          if (data.aboutUsText) setAboutUsText(data.aboutUsText);\n          if (data.contactUsText) setContactUsText(data.contactUsText);\n        }"
);

// Saving options
content = content.replace(
  "totalReceivedUgx: Number(homeTotalReceived)",
  "totalReceivedUgx: Number(homeTotalReceived),\n        aboutUsText: aboutUsText.trim(),\n        contactUsText: contactUsText.trim()"
);

// Sidebar & Top Nav
content = content.replace(/>Admin Console<\/span>/g, '>Admin Login</span>');
content = content.replace(/>Admin Console<\/button>/g, '>Admin Login</button>');

// Logo text update
content = content.replace(
  '<div className="z-10 flex flex-col sm:flex-row items-center gap-4 md:gap-6 mb-8 md:mb-12">',
  '<div className="z-10 flex flex-col items-center gap-3 mb-8 md:mb-12 text-center">'
);
content = content.replace(
  '<div className="w-16 h-16 md:w-24 md:h-24 bg-[#1e3a8a]/40 rounded-full flex items-center justify-center text-[#fcd34d] text-4xl md:text-5xl font-black shadow-lg">†</div>',
  '<div className="w-16 h-16 md:w-20 md:h-20 bg-[#1e3a8a]/40 rounded-full flex items-center justify-center text-[#fcd34d] text-4xl font-black shadow-lg">†</div>'
);
content = content.replace(
  '<h2 className="text-4xl md:text-6xl lg:text-[80px] font-extrabold tracking-tighter text-white uppercase drop-shadow-sm">Voice Of Jesus</h2>',
  '<h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter text-white uppercase drop-shadow-sm whitespace-nowrap">Voice Of Jesus Online Radio</h2>'
);

// Footer Contacts
const footerContacts = `            <div className="mt-6 flex gap-3">
               {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                  <a key={social} href={\`https://\${social}.com\`} target="_blank" rel="noreferrer" className="w-10 h-10 border-2 border-blue-400/30 rounded-full flex items-center justify-center hover:bg-[#1e3a8a]/40 hover:text-[#fcd34d] transition-colors font-bold uppercase text-sm">
                    {social.substring(0, 1)}
                  </a>
               ))}
            </div>
            
            <div className="mt-6 text-sm font-medium text-blue-200 text-left md:text-right space-y-1">
              <p>Lira City, Northern Uganda</p>
              <p>Call: 0769302480 / 0770795585</p>
              <p>WhatsApp: +256 770 795585</p>
            </div>`;

content = content.replace(
  `            <div className="mt-6 flex gap-3">
               {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                  <a key={social} href={\`https://\${social}.com\`} target="_blank" rel="noreferrer" className="w-10 h-10 border-2 border-blue-400/30 rounded-full flex items-center justify-center hover:bg-[#1e3a8a]/40 hover:text-[#fcd34d] transition-colors font-bold uppercase text-sm">
                    {social.substring(0, 1)}
                  </a>
               ))}
            </div>`,
  footerContacts
);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log('done');

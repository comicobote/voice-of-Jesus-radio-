const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Blog handlers
const blogHandlers = `
  const handleDeleteBlog = (blogId: string) => {
    if (!window.confirm('Are you sure you want to delete this chronicle?')) return;
    setIsDeletingBlogId(blogId);
    customFetch("/api/delete_blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: blogId, email: adminEmail, password: adminPassword })
    })
    .then(() => {
      setBlogsList(prev => prev.filter(b => b.id !== blogId));
      setIsDeletingBlogId(null);
    })
    .catch(() => setIsDeletingBlogId(null));
  };

  const handleEditBlogSubmit = (e: React.FormEvent, blogId: string) => {
    e.preventDefault();
    setIsPublishingBlog(true);
    customFetch("/api/edit_blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: blogId,
        title: newBlogTitle.trim(),
        content: newBlogContent.trim(),
        category: newBlogCategory,
        author: newBlogAuthor.trim(),
        imageUrl: newBlogImageUrl.trim(),
        email: adminEmail,
        password: adminPassword
      })
    })
    .then(() => {
      setBlogsList(prev => prev.map(b => b.id === blogId ? { ...b, title: newBlogTitle, content: newBlogContent, category: newBlogCategory, author: newBlogAuthor, imageUrl: newBlogImageUrl } : b));
      setEditingBlogId(null);
      setNewBlogTitle('');
      setNewBlogContent('');
      setNewBlogImageUrl('');
      setIsPublishingBlog(false);
    })
    .catch(() => setIsPublishingBlog(false));
  };

  const startEditingBlog = (blog: any) => {
    setEditingBlogId(blog.id);
    setNewBlogTitle(blog.title);
    setNewBlogContent(blog.content);
    setNewBlogCategory(blog.category);
    setNewBlogAuthor(blog.author);
    setNewBlogImageUrl(blog.imageUrl);
  };
`;

content = content.replace(
  "const handleAdminSignIn = (e: React.FormEvent) => {",
  blogHandlers + "\n\n  const handleAdminSignIn = (e: React.FormEvent) => {"
);

// Map over blogs rendering modification: Home and Blog views
const blogCardOriginal = `
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                               <div className="flex items-center justify-between text-[10px] text-blue-200 font-mono">
                                <span className="uppercase font-bold">by: {b.author}</span>
                                <span>{b.date}</span>
                              </div>
                              <h4 className="font-extrabold text-white text-lg leading-tight">{b.title}</h4>
                              <p className="text-xs text-blue-100/80 line-clamp-3 leading-relaxed">
                                {b.content}
                              </p>
                            </div>
                            
                            <button 
                              onClick={() => setSelectedFullBlog(b)}
                              className="text-[#fcd34d] text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all mt-auto"
                            >
                              Read Full Passage <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>`;

const blogCardModifiedHome = `
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                               <div className="flex items-center justify-between text-[10px] text-blue-200 font-mono">
                                <span className="uppercase font-bold">by: {b.author}</span>
                                <span>{b.date}</span>
                              </div>
                              <h4 className="font-extrabold text-white text-lg leading-tight">{b.title}</h4>
                              <p className="text-xs text-blue-100/80 line-clamp-3 leading-relaxed">
                                {b.content}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between mt-auto">
                              <button 
                                onClick={() => setSelectedFullBlog(b)}
                                className="text-[#fcd34d] text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all"
                              >
                                Read Full Passage <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                              
                              {adminIsLoggedIn && (
                                <div className="flex gap-2">
                                  <button onClick={(e) => { e.stopPropagation(); startEditingBlog(b); setActiveTab('admin'); }} className="p-1.5 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/40">
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); handleDeleteBlog(b.id); }} disabled={isDeletingBlogId === b.id} className="p-1.5 bg-red-500/20 text-red-300 rounded hover:bg-red-500/40">
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>`;

const blogCardOriginal2 = `
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[10px] text-blue-200 font-mono">
                                <span className="uppercase font-bold text-[#fcd34d]">by {b.author}</span>
                                <span>{b.date}</span>
                              </div>
                              <h4 className="font-extrabold text-white text-lg leading-tight">{b.title}</h4>
                              <p className="text-xs text-blue-100/80 line-clamp-3 leading-relaxed">
                                {b.content}
                              </p>
                            </div>
                            
                            <button 
                              onClick={() => setSelectedFullBlog(b)}
                              className="text-[#fcd34d] text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all mt-auto"
                            >
                              Read Full Passage <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>`;
const blogCardModifiedBlog = `
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[10px] text-blue-200 font-mono">
                                <span className="uppercase font-bold text-[#fcd34d]">by {b.author}</span>
                                <span>{b.date}</span>
                              </div>
                              <h4 className="font-extrabold text-white text-lg leading-tight">{b.title}</h4>
                              <p className="text-xs text-blue-100/80 line-clamp-3 leading-relaxed">
                                {b.content}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between mt-auto">
                              <button 
                                onClick={() => setSelectedFullBlog(b)}
                                className="text-[#fcd34d] text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all"
                              >
                                Read Full Passage <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                              
                              {adminIsLoggedIn && (
                                <div className="flex gap-2">
                                  <button onClick={(e) => { e.stopPropagation(); startEditingBlog(b); setActiveTab('admin'); }} className="p-1.5 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/40">
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); handleDeleteBlog(b.id); }} disabled={isDeletingBlogId === b.id} className="p-1.5 bg-red-500/20 text-red-300 rounded hover:bg-red-500/40">
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>`;

content = content.replace(blogCardOriginal, blogCardModifiedHome);
content = content.replace(blogCardOriginal2, blogCardModifiedBlog);

// Admin form edits
const adminEditPostSection = `
                        <form onSubmit={editingBlogId ? (e) => handleEditBlogSubmit(e, editingBlogId) : handlePublishBlog} className="bg-[#1e3a8a]/20 border border-blue-400/30 rounded-xl p-5 md:p-6 space-y-5 text-left shadow-sm">
                          <h4 className="text-yellow-400 font-sans text-xs font-bold uppercase tracking-widest border-b border-blue-400/30 pb-2 flex items-center justify-between gap-2 font-black">
                            <span className="flex items-center gap-2"><Edit3 className="w-4 h-4 text-[#fcd34d]" /> 3. {editingBlogId ? 'Edit Devotion Chronicle' : 'Publish New Devotion Chronicle'}</span>
                            {editingBlogId && (
                              <button type="button" onClick={() => { setEditingBlogId(null); setNewBlogTitle(''); setNewBlogContent(''); setNewBlogImageUrl(''); }} className="text-[10px] bg-red-500/20 text-red-300 px-2 py-1 rounded">Cancel Edit</button>
                            )}
                          </h4>`;

content = content.replace(
  `<form onSubmit={handlePublishBlog} className="bg-[#1e3a8a]/20 border border-blue-400/30 rounded-xl p-5 md:p-6 space-y-5 text-left shadow-sm">
                          <h4 className="text-yellow-400 font-sans text-xs font-bold uppercase tracking-widest border-b border-blue-400/30 pb-2 flex items-center gap-2 font-black">
                            <Edit3 className="w-4 h-4 text-[#fcd34d]" />
                            <span>3. Publish New Devotion Chronicle (Admin Only)</span>
                          </h4>`,
  adminEditPostSection
);

content = content.replace(
  `<button type="submit" disabled={isPublishingBlog} className="w-full bg-[#fcd34d] hover:bg-yellow-300 text-[#1e1b4b] py-3 rounded-xl font-bold font-sans text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                              {isPublishingBlog ? 'Publishing Post...' : 'Publish Chronicle Now'} <Send className="w-4 h-4" />
                            </button>`,
  `<button type="submit" disabled={isPublishingBlog} className="w-full bg-[#fcd34d] hover:bg-yellow-300 text-[#1e1b4b] py-3 rounded-xl font-bold font-sans text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                              {isPublishingBlog ? 'Saving...' : (editingBlogId ? 'Update Chronicle Now' : 'Publish Chronicle Now')} <Send className="w-4 h-4" />
                            </button>`
);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log('done updating blog handlers');

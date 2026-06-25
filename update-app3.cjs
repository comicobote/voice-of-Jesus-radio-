const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// The about page
const originalAboutSection = `
                  <div className="space-y-4 text-left text-xs text-white leading-relaxed font-sans font-medium">
                    <h4 className="text-white font-sans text-base font-bold uppercase mb-2">Our Celestial Mission</h4>
                    <p>
                      Voice of Jesus Radio was established in the hearts of pastoral leaders in Lira, Northern Uganda, in response to a divine mandate: 
                      <em> "Go into all the world and preach the gospel to every creature" (Mark 16:15)</em>. Over our years on the digital and FM back-ups, we have served as a source of recovery, comfort, and deliverance for thousands of homes.
                    </p>
                    <p>
                      From spiritual warfare prayers, high-definition praise beats of East-Africa, to laying of hands on stream callers, our program slots are carefully crafted. Hundreds have testified to healing from malaria, chronic pain, spiritual afflictions and social reconciliation through direct faith intercession.
                    </p>
                    <p className="bg-amber-500/10 border-l-4 border-amber-550 rounded-r-xl p-4 text-amber-900 font-sans">
                      <strong>Operational costs statement:</strong> To keep this digital station broadcast equipment on continuous standby, pay for our secure web hosting, domain name records and continuous Zeno radio satellite streaming platform subscription, we need exactly <strong>500,000 UGX</strong> every single year. Your generous sacrificial contributions directly finance this ministry on the airwaves of hope.
                    </p>
                  </div>`;

const modifiedAboutSection = `
                  <div className="space-y-4 text-left text-xs text-white leading-relaxed font-sans font-medium">
                    {aboutUsText ? (
                      <div className="whitespace-pre-wrap">{aboutUsText}</div>
                    ) : (
                      <>
                        <h4 className="text-white font-sans text-base font-bold uppercase mb-2">Our Celestial Mission</h4>
                        <p>
                          Voice of Jesus Radio was established in the hearts of pastoral leaders in Lira, Northern Uganda, in response to a divine mandate: 
                          <em> "Go into all the world and preach the gospel to every creature" (Mark 16:15)</em>. Over our years on the digital and FM back-ups, we have served as a source of recovery, comfort, and deliverance for thousands of homes.
                        </p>
                        <p>
                          From spiritual warfare prayers, high-definition praise beats of East-Africa, to laying of hands on stream callers, our program slots are carefully crafted. Hundreds have testified to healing from malaria, chronic pain, spiritual afflictions and social reconciliation through direct faith intercession.
                        </p>
                        <p className="bg-amber-500/10 border-l-4 border-[#fcd34d] rounded-r-xl p-4 text-[#fcd34d] font-sans">
                          <strong>Operational costs statement:</strong> To keep this digital station broadcast equipment on continuous standby, pay for our secure web hosting, domain name records and continuous Zeno radio satellite streaming platform subscription, we need exactly <strong>500,000 UGX</strong> every single year. Your generous sacrificial contributions directly finance this ministry on the airwaves of hope.
                        </p>
                      </>
                    )}
                  </div>`;

// The Contact Us Text Block 
const originalContactText = `                    <p className="text-white text-xs leading-relaxed font-sans font-medium">
                      If you sent mobile money via MTN or Airtel locally, and you have not seen your contribution marked successfully, call our desk lines with the exact <strong>transaction ID and exact time stamp</strong> immediately.
                    </p>
                    <p className="text-white text-xs leading-relaxed font-sans font-medium">
                      Note that for prayer requests during live programs, please try to limit the message to less than 150 words so that the studio host can read it out quickly between segments. May God richly bless you.
                    </p>`;
const modifiedContactText = `                    {contactUsText ? (
                      <div className="text-white text-xs leading-relaxed font-sans font-medium whitespace-pre-wrap">{contactUsText}</div>
                    ) : (
                      <>
                        <p className="text-white text-xs leading-relaxed font-sans font-medium">
                          If you sent mobile money via MTN or Airtel locally, and you have not seen your contribution marked successfully, call our desk lines with the exact <strong>transaction ID and exact time stamp</strong> immediately.
                        </p>
                        <p className="text-white text-xs leading-relaxed font-sans font-medium">
                          Note that for prayer requests during live programs, please try to limit the message to less than 150 words so that the studio host can read it out quickly between segments. May God richly bless you.
                        </p>
                      </>
                    )}`;


// Now adding it to the admin console layout form
const homepageOptionsFormOriginal = `
                            <div>
                              <label className="block text-[10px] font-bold text-white uppercase mb-1.5 font-mono font-bold">MINISTRY CAMPAIGN TARGET (UGX)</label>
                              <input
                                type="number"
                                required
                                value={homeTargetUgx}
                                onChange={(e) => setHomeTargetUgx(e.target.value)}
                                className="w-full bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#fcd34d] font-mono"
                              />
                            </div>
                          </div>`;

const homepageOptionsFormModified = `
                            <div>
                              <label className="block text-[10px] font-bold text-white uppercase mb-1.5 font-mono font-bold">MINISTRY CAMPAIGN TARGET (UGX)</label>
                              <input
                                type="number"
                                required
                                value={homeTargetUgx}
                                onChange={(e) => setHomeTargetUgx(e.target.value)}
                                className="w-full bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#fcd34d] font-mono"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-[10px] font-bold text-white uppercase mb-1.5 font-mono font-bold">ABOUT US PAGE CONTENT</label>
                              <textarea
                                value={aboutUsText}
                                onChange={(e) => setAboutUsText(e.target.value)}
                                className="w-full h-24 bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#fcd34d] resize-none leading-relaxed"
                                placeholder="Write the about us content here..."
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-white uppercase mb-1.5 font-mono font-bold">CONTACT US PAGE CONTENT</label>
                              <textarea
                                value={contactUsText}
                                onChange={(e) => setContactUsText(e.target.value)}
                                className="w-full h-24 bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#fcd34d] resize-none leading-relaxed"
                                placeholder="Write the contact us instructions here..."
                              />
                            </div>

                          </div>`;

content = content.replace(originalAboutSection, modifiedAboutSection);
content = content.replace(originalContactText, modifiedContactText);
content = content.replace(homepageOptionsFormOriginal, homepageOptionsFormModified);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log('done updating about and contact forms');

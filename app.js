/**
 * Mahinam Family Portal - Elder Friendly Application Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize LocalStorage with initial data
    if (!localStorage.getItem('mahinam_updates')) {
        localStorage.setItem('mahinam_updates', JSON.stringify(INITIAL_UPDATES));
    }
    if (!localStorage.getItem('mahinam_custom_members')) {
        localStorage.setItem('mahinam_custom_members', JSON.stringify([]));
    }

    const customMembers = JSON.parse(localStorage.getItem('mahinam_custom_members') || '[]');
    window.allFamilyMembers = [...FAMILY_MEMBERS, ...customMembers];

    // Initialize Tree Renderer
    window.treeInstance = new FamilyTreeRenderer('family-tree-container', window.allFamilyMembers);
    window.treeInstance.init();

    setupNavigation();
    setupHomePartitions();
    setupUpdatesFeed();
    setupDirectory();
    setupEventsCalendar();
    setupForms();
});

// Navigation History Stack & Global Back Controller
window.navHistory = ['home-section'];

function updateHeaderBackButton() {
    const backBtn = document.getElementById('global-header-back-btn');
    if (!backBtn) return;
    const current = window.navHistory[window.navHistory.length - 1];
    if (current && current !== 'home-section') {
        backBtn.classList.remove('hidden');
    } else {
        backBtn.classList.add('hidden');
    }
}

window.goBack = function() {
    if (window.navHistory.length > 1) {
        window.navHistory.pop(); // Remove current screen
        const prev = window.navHistory[window.navHistory.length - 1];
        if (prev && prev.startsWith('member:')) {
            const memberId = prev.replace('member:', '');
            window.openMemberPage(memberId, false);
        } else {
            window.navigateToSection(prev || 'home-section', false);
        }
    } else {
        window.navigateToSection('home-section', false);
    }
    updateHeaderBackButton();
};

// Responsive Device Navigation Enforcer
function enforceResponsiveNav() {
    const desktopNav = document.getElementById('desktop-header-nav');
    const bottomNav = document.getElementById('mobile-bottom-nav') || document.querySelector('.elder-nav-bar');
    const isMobile = window.innerWidth < 1024 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (desktopNav) {
        if (isMobile) {
            desktopNav.style.setProperty('display', 'none', 'important');
            desktopNav.classList.add('hidden');
        } else {
            desktopNav.style.setProperty('display', 'flex', 'important');
            desktopNav.classList.remove('hidden');
        }
    }
    if (bottomNav) {
        if (isMobile) {
            bottomNav.style.setProperty('display', 'flex', 'important');
            bottomNav.classList.remove('hidden');
        } else {
            bottomNav.style.setProperty('display', 'none', 'important');
            bottomNav.classList.add('hidden');
        }
    }
}
window.addEventListener('resize', enforceResponsiveNav);
window.addEventListener('orientationchange', enforceResponsiveNav);
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enforceResponsiveNav);
} else {
    enforceResponsiveNav();
}

// Navigation Controller
function setupNavigation() {
    enforceResponsiveNav();
    const desktopLinks = document.querySelectorAll('.portal-nav-btn');
    const mobileLinks = document.querySelectorAll('.elder-nav-btn');
    const sections = document.querySelectorAll('.page-section');

    function switchSection(targetId, addToHistory = true) {
        sections.forEach(s => s.classList.add('hidden'));
        const activeSection = document.getElementById(targetId);
        if (activeSection) {
            activeSection.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        if (addToHistory) {
            if (window.navHistory[window.navHistory.length - 1] !== targetId) {
                window.navHistory.push(targetId);
                try {
                    history.pushState({ targetId }, '', '#' + targetId);
                } catch (e) {}
            }
        }
        updateHeaderBackButton();

        desktopLinks.forEach(link => {
            if (link.getAttribute('data-target') === targetId) {
                link.classList.add('active-tab');
            } else {
                link.classList.remove('active-tab');
            }
        });

        mobileLinks.forEach(link => {
            if (link.getAttribute('data-target') === targetId) {
                link.classList.add('active-tab');
            } else {
                link.classList.remove('active-tab');
            }
        });
    }

    [...desktopLinks, ...mobileLinks].forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.getAttribute('data-target');
            if (target) switchSection(target);
        });
    });

    window.navigateToSection = switchSection;

    // Handle physical/browser back button
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.targetId) {
            if (e.state.targetId.startsWith('member:')) {
                window.openMemberPage(e.state.targetId.replace('member:', ''), false);
            } else {
                switchSection(e.state.targetId, false);
            }
        } else {
            window.goBack();
        }
    });
}

// Populate First Page Partition Boxes (Home Dashboard in Hinglish)
function setupHomePartitions() {
    // 1. Home Updates Partition (Show top 3)
    const homeUpdates = document.getElementById('home-updates-container');
    if (homeUpdates) {
        const updates = JSON.parse(localStorage.getItem('mahinam_updates') || '[]');
        homeUpdates.innerHTML = updates.slice(0, 3).map(u => `
            <div class="p-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm">
                <div class="flex items-center justify-between text-slate-600 mb-1">
                    <span class="font-extrabold text-[#8b1e15]">${u.category}</span>
                    <span class="text-xs font-semibold">${u.date}</span>
                </div>
                <h4 class="font-bold text-slate-900 text-base mb-1">${u.title}</h4>
                <p class="text-slate-700 leading-relaxed">${u.summary}</p>
                <div class="mt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-200 pt-2 font-medium">
                    <span>Lekhak: ${u.author}</span>
                    <button onclick="window.likeUpdate('${u.id}')" class="text-rose-700 flex items-center gap-1 font-bold">
                        <i class="fa-regular fa-heart"></i> ${u.likes || 0}
                    </button>
                </div>
            </div>
        `).join('');
    }

    // 2. Home Events & Functions Partition
    const homeEvents = document.getElementById('home-events-container');
    if (homeEvents) {
        homeEvents.innerHTML = FAMILY_EVENTS.slice(0, 3).map(ev => `
            <div class="flex items-start gap-3.5 p-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm">
                <div class="w-12 h-12 rounded-xl bg-[#8b1e15] text-white flex flex-col items-center justify-center font-bold flex-shrink-0 shadow-sm">
                    <span class="text-[10px] uppercase leading-none">${ev.date.split(' ')[0]}</span>
                    <span class="text-base leading-none mt-0.5">${ev.date.split(' ')[1]}</span>
                </div>
                <div>
                    <span class="text-xs text-[#8b1e15] font-extrabold uppercase tracking-wider">${ev.type}</span>
                    <h5 class="font-bold text-slate-900 text-base leading-tight">${ev.title}</h5>
                    <p class="text-slate-600 text-xs mt-0.5">${ev.desc}</p>
                </div>
            </div>
        `).join('');
    }

    // 3. Quick Member Search
    const searchInput = document.getElementById('quick-search-input');
    const searchResults = document.getElementById('quick-search-results');
    if (searchInput && searchResults) {
        searchInput.addEventListener('input', () => {
            const q = searchInput.value.toLowerCase().trim();
            if (!q) {
                searchResults.innerHTML = '';
                return;
            }

            const matches = window.allFamilyMembers.filter(m => 
                m.name.toLowerCase().includes(q) || 
                (m.hindiName && m.hindiName.includes(q)) ||
                (m.relationship && m.relationship.toLowerCase().includes(q))
            );

            if (matches.length === 0) {
                searchResults.innerHTML = `<span class="text-sm text-slate-500 block py-1.5 font-medium">Koi sadasya nahi mila.</span>`;
                return;
            }

            searchResults.innerHTML = matches.slice(0, 5).map(m => `
                <div class="p-3 bg-white hover:bg-amber-50 rounded-xl border-2 border-slate-300 cursor-pointer flex items-center justify-between text-sm"
                     onclick="window.openMemberPage('${m.id}')">
                    <div>
                        <span class="font-bold text-slate-900 text-base">${m.name}</span>
                        <span class="text-xs text-slate-600 block">${m.relationship}</span>
                    </div>
                    <span class="btn-elder-outline text-xs py-1 px-3">Open →</span>
                </div>
            `).join('');
        });
    }
}

// Dedicated Profile Page (Shivshankar Jha, Markhande Jha, etc. in Elder-Friendly Layout)
window.openMemberPage = function(memberId, addToHistory = true) {
    const member = window.allFamilyMembers.find(m => m.id === memberId);
    if (!member) return;

    const sections = document.querySelectorAll('.page-section');
    sections.forEach(s => s.classList.add('hidden'));

    const memberPage = document.getElementById('member-view-section');
    if (!memberPage) return;
    memberPage.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (addToHistory) {
        const historyEntry = 'member:' + memberId;
        if (window.navHistory[window.navHistory.length - 1] !== historyEntry) {
            window.navHistory.push(historyEntry);
            try {
                history.pushState({ targetId: historyEntry }, '', '#' + historyEntry);
            } catch (e) {}
        }
    }
    updateHeaderBackButton();

    // Previous Generation (Pita / Mata)
    let parentBox = '';
    if (member.id === 'gen2-shivshankar') {
        parentBox = `
            <div class="p-4 bg-slate-50 border-2 border-slate-300 rounded-xl">
                <span class="text-xs text-slate-600 uppercase font-extrabold tracking-wider block mb-1">Previous Generation (Pujya Pitashri)</span>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h4 class="font-bold text-slate-900 text-lg">Markhande Jha (मार्कण्डेय झा)</h4>
                        <p class="text-sm text-slate-600">Pujya Par-Baba • 7 Bachhon ke Pita</p>
                    </div>
                    <button onclick="window.openMemberPage('gen1-markhande')" class="btn-elder-outline text-xs py-1.5 px-3 self-start sm:self-center">
                        View Father's Details →
                    </button>
                </div>
            </div>
        `;
    } else if (member.fatherName || (member.parentIds && member.parentIds.length > 0)) {
        const father = member.fatherName || 'Shivshankar Jha';
        const mother = member.motherName ? ` & ${member.motherName}` : '';
        const parentId = member.parentIds[0] || 'gen2-shivshankar';

        parentBox = `
            <div class="p-4 bg-slate-50 border-2 border-slate-300 rounded-xl flex items-center justify-between gap-3">
                <div>
                    <span class="text-xs text-slate-600 uppercase font-extrabold block">Father / Mother</span>
                    <h5 class="font-bold text-slate-900 text-base">${father}${mother}</h5>
                </div>
                <button onclick="window.openMemberPage('${parentId}')" class="btn-elder-outline text-xs py-1.5 px-3">
                    View Father's Details →
                </button>
            </div>
        `;
    }

    // Spouse Box
    let spouseBox = '';
    if (member.spouseName) {
        const isShantiDevi = member.id === 'gen2-shivshankar';
        spouseBox = `
            <div class="p-4 bg-slate-50 border-2 border-slate-300 rounded-xl">
                <span class="text-xs text-slate-600 uppercase font-extrabold tracking-wider block mb-1">
                    ${member.gender === 'female' ? 'Husband' : 'Wife'}
                </span>
                <h4 class="font-bold text-slate-900 text-lg">${member.spouseName}</h4>
                ${member.spouseHindiName ? `<p class="text-sm text-slate-700 font-hindi">${member.spouseHindiName}</p>` : ''}
                ${isShantiDevi ? `<p class="text-xs text-slate-600 mt-1 font-medium">Pujya Dadi Ji • Neeta, Krishna, Neelu aur Neetu ki Mata Ji.</p>` : ''}
            </div>
        `;
    } else if (member.maritalStatus === 'Unmarried') {
        spouseBox = `
            <div class="p-4 bg-slate-50 border-2 border-slate-300 rounded-xl">
                <span class="text-xs text-slate-600 uppercase font-extrabold block">Marital Status</span>
                <h5 class="font-bold text-slate-700 text-base italic">Unmarried</h5>
            </div>
        `;
    }

    // Direct Children Box
    let childrenBox = '';
    if (member.childrenIds && member.childrenIds.length > 0) {
        const children = member.childrenIds.map(cid => window.allFamilyMembers.find(m => m.id === cid)).filter(Boolean);
        childrenBox = `
            <div class="mt-5 pt-4 border-t-2 border-slate-200">
                <span class="text-sm font-extrabold text-slate-900 block mb-3">Direct Children (${children.length}):</span>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    ${children.map(child => `
                        <div class="p-3.5 bg-white border-2 border-slate-300 rounded-xl hover:border-[#8b1e15] cursor-pointer flex items-center justify-between text-sm shadow-sm"
                             onclick="window.openMemberPage('${child.id}')">
                            <div>
                                <span class="font-bold text-slate-900 block text-base">${child.name}</span>
                                <span class="text-slate-600 text-xs">${child.relationship}</span>
                                ${child.spouseName ? `<span class="text-slate-700 block text-xs mt-0.5">Spouse: ${child.spouseName}</span>` : ''}
                            </div>
                            <span class="btn-elder-outline text-xs py-1 px-3">Open →</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    const container = document.getElementById('member-view-container');
    if (!container) return;

    container.innerHTML = `
        <div class="elder-card space-y-4">
            
            <!-- Top bar -->
            <div class="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                <button onclick="window.goBack()" class="btn-elder-outline text-sm py-1.5 px-4 font-bold flex items-center gap-1.5 hover:bg-red-50 shadow-sm">
                    <i class="fa-solid fa-arrow-left"></i> ← Back
                </button>
                <button onclick="window.navigateToSection('home-section')" class="text-xs text-[#8b1e15] font-bold hover:underline">
                    Home Dashboard →
                </button>
            </div>

            <!-- Header of the person -->
            <div class="p-4 sm:p-5 bg-amber-50/70 border-2 border-amber-300 rounded-2xl">
                <span class="peedhi-badge peedhi-2 text-xs">
                    ${member.generationLabel}
                </span>
                <h2 class="text-2xl sm:text-3xl font-black text-slate-900 mt-2">${member.name}</h2>
                <p class="text-base text-slate-700 font-hindi">${member.hindiName || ''}</p>
                <p class="text-sm text-slate-600 mt-1 font-semibold">${member.relationship} • ${member.branch}</p>
            </div>

            <!-- Parents & Spouse Partition Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                ${parentBox ? `<div>${parentBox}</div>` : ''}
                ${spouseBox ? `<div>${spouseBox}</div>` : ''}
            </div>

            <!-- Bio -->
            <div class="p-4 bg-white border-2 border-slate-200 rounded-xl text-sm leading-relaxed text-slate-700">
                <strong class="text-slate-900 block text-base mb-1">Parivar Jankari:</strong>
                ${member.bio}
                ${member.notes ? `<div class="mt-2 p-2.5 bg-amber-100/70 border border-amber-300 rounded-lg text-amber-950 text-xs font-medium">Note: ${member.notes}</div>` : ''}
            </div>

            <!-- Children list -->
            ${childrenBox}

        </div>
    `;
};

// All Updates Section
function setupUpdatesFeed() {
    const container = document.getElementById('updates-feed-container');
    if (!container) return;
    const updates = JSON.parse(localStorage.getItem('mahinam_updates') || '[]');

    container.innerHTML = updates.map(u => `
        <div class="p-4 bg-white border-2 border-slate-300 rounded-xl text-sm shadow-sm">
            <div class="flex items-center justify-between text-slate-600 mb-1">
                <span class="font-extrabold text-[#8b1e15]">${u.category}</span>
                <span class="text-xs font-semibold">${u.date}</span>
            </div>
            <h4 class="font-bold text-slate-900 text-lg mb-1.5">${u.title}</h4>
            <p class="text-slate-700 leading-relaxed">${u.content || u.summary}</p>
            <div class="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-slate-600 text-xs font-medium">
                <span>By: ${u.author}</span>
                <button onclick="window.likeUpdate('${u.id}')" class="text-rose-700 flex items-center gap-1 font-bold">
                    <i class="fa-regular fa-heart"></i> ${u.likes || 0}
                </button>
            </div>
        </div>
    `).join('');
}

window.likeUpdate = function(id) {
    const updates = JSON.parse(localStorage.getItem('mahinam_updates') || '[]');
    const idx = updates.findIndex(u => u.id === id);
    if (idx !== -1) {
        updates[idx].likes = (updates[idx].likes || 0) + 1;
        localStorage.setItem('mahinam_updates', JSON.stringify(updates));
        setupHomePartitions();
        setupUpdatesFeed();
    }
};

// All Directory
function setupDirectory() {
    const grid = document.getElementById('directory-grid');
    const searchInput = document.getElementById('directory-search');
    const genFilter = document.getElementById('directory-gen-filter');

    function render() {
        if (!grid) return;
        const q = (searchInput?.value || '').toLowerCase().trim();
        const gen = genFilter?.value || 'all';

        const filtered = window.allFamilyMembers.filter(m => {
            const matchName = m.name.toLowerCase().includes(q) || 
                              (m.hindiName && m.hindiName.includes(q)) ||
                              (m.relationship && m.relationship.toLowerCase().includes(q)) ||
                              (m.spouseName && m.spouseName.toLowerCase().includes(q));
            const matchGen = gen === 'all' || m.generation.toString() === gen;
            return matchName && matchGen;
        });

        grid.innerHTML = filtered.map(m => `
            <div class="p-3.5 bg-white border-2 border-slate-300 rounded-xl hover:border-[#8b1e15] cursor-pointer text-sm shadow-sm"
                 onclick="window.openMemberPage('${m.id}')">
                <div class="flex items-start justify-between">
                    <div>
                        <h5 class="font-bold text-slate-900 text-base">${m.name}</h5>
                        <p class="text-slate-600 font-hindi text-xs">${m.hindiName || ''}</p>
                        <p class="text-slate-700 font-medium mt-0.5">${m.relationship}</p>
                        ${m.spouseName ? `<p class="text-slate-600 text-xs">Jeevansathi: ${m.spouseName}</p>` : ''}
                    </div>
                    <span class="peedhi-badge peedhi-${m.generation} text-[10px]">Peedhi ${m.generation}</span>
                </div>
            </div>
        `).join('');
    }

    if (searchInput) searchInput.addEventListener('input', render);
    if (genFilter) genFilter.addEventListener('change', render);
    render();
}

// Events Calendar
function setupEventsCalendar() {
    const container = document.getElementById('events-calendar-container');
    if (!container) return;
    container.innerHTML = FAMILY_EVENTS.map(ev => `
        <div class="p-4 bg-white border-2 border-slate-300 rounded-xl text-sm flex items-start gap-3.5 shadow-sm">
            <div class="w-14 h-14 rounded-xl bg-[#8b1e15] text-white flex flex-col items-center justify-center font-bold flex-shrink-0">
                <span class="text-xs uppercase">${ev.date.split(' ')[0]}</span>
                <span class="text-lg leading-none mt-0.5">${ev.date.split(' ')[1]}</span>
            </div>
            <div>
                <span class="text-xs text-[#8b1e15] font-extrabold uppercase">${ev.type}</span>
                <h5 class="font-bold text-slate-900 text-base">${ev.title}</h5>
                <p class="text-slate-700 text-xs sm:text-sm mt-0.5">${ev.desc}</p>
                <span class="text-slate-500 text-xs block mt-1"><i class="fa-solid fa-location-dot"></i> ${ev.location}</span>
            </div>
        </div>
    `).join('');
}

function setupForms() {
    // Add Member
    const memberForm = document.getElementById('suggest-member-form');
    if (memberForm) {
        memberForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('new-member-name').value.trim();
            const hindiName = document.getElementById('new-member-hindiname').value.trim();
            const gen = parseInt(document.getElementById('new-member-gen').value);
            const relation = document.getElementById('new-member-relation').value.trim();
            const branch = document.getElementById('new-member-branch').value;
            const spouse = document.getElementById('new-member-spouse').value.trim();
            const bio = document.getElementById('new-member-bio').value.trim();

            if (!name) return;

            const newMember = {
                id: 'mem-' + Date.now(),
                name,
                hindiName,
                generation: gen || 4,
                relationship: relation || 'Parivar Sadasya',
                branch: branch || 'Shivshankar Jha Shakha',
                spouseName: spouse || null,
                gender: 'male',
                bio: bio || 'Parivar sadasya ka record joda gaya.',
                hasDetailedData: true,
                parentIds: []
            };

            const custom = JSON.parse(localStorage.getItem('mahinam_custom_members') || '[]');
            custom.push(newMember);
            localStorage.setItem('mahinam_custom_members', JSON.stringify(custom));

            window.allFamilyMembers.push(newMember);
            window.treeInstance.members = window.allFamilyMembers;
            window.treeInstance.render();
            setupDirectory();

            memberForm.reset();
            document.getElementById('suggest-member-modal').classList.add('hidden');
            alert(`Record: ${name} ji ka naam jod diya gaya hai.`);
        });
    }

    // Post Update
    const updateForm = document.getElementById('new-update-form');
    if (updateForm) {
        updateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('update-title').value.trim();
            const category = document.getElementById('update-category').value;
            const author = document.getElementById('update-author').value.trim();
            const content = document.getElementById('update-content').value.trim();

            if (!title || !content) return;

            const newUpdate = {
                id: 'upd-' + Date.now(),
                title,
                category,
                date: new Date().toISOString().split('T')[0],
                author: author || 'Parivar Sadasya',
                summary: content.slice(0, 110) + (content.length > 110 ? '...' : ''),
                content,
                likes: 0
            };

            const existing = JSON.parse(localStorage.getItem('mahinam_updates') || '[]');
            existing.unshift(newUpdate);
            localStorage.setItem('mahinam_updates', JSON.stringify(existing));

            updateForm.reset();
            document.getElementById('post-update-modal').classList.add('hidden');
            setupHomePartitions();
            setupUpdatesFeed();
            alert('Aapka update safaltapoorvak post ho gaya hai.');
        });
    }
}

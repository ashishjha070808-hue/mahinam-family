/**
 * Mahinam Family Portal - Interactive Dynamic Lineage Tree
 * All 4 sons of Markhande Jha treated equally.
 * Clicking on any son dynamically displays their branch (Peedhi 3).
 * Clear standard English action buttons: Open, View Details, Back, etc.
 */

class FamilyTreeRenderer {
    constructor(containerId, members) {
        this.container = document.getElementById(containerId);
        this.members = members;
        // Default selected brother: Shivshankar Jha (since his data is currently filled)
        this.selectedBrotherId = 'gen2-shivshankar';
    }

    init() {
        if (!this.container) return;
        this.render();
    }

    getMember(id) {
        return this.members.find(m => m.id === id);
    }

    getChildrenOf(parentId) {
        return this.members.filter(m => (m.parentIds && m.parentIds.includes(parentId)));
    }

    selectBrother(brotherId) {
        this.selectedBrotherId = brotherId;
        this.render();

        // Smooth scroll to the branch container
        const branchEl = document.getElementById('selected-branch-container');
        if (branchEl) {
            branchEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    render() {
        if (!this.container) return;

        const markhande = this.getMember('gen1-markhande');
        const ramshankar = this.getMember('gen2-ramshankar');
        const shivshankar = this.getMember('gen2-shivshankar');
        const gaurishankar = this.getMember('gen2-gaurishankar');
        const jatashankar = this.getMember('gen2-jatashankar');

        const brothers = [
            { id: 'gen2-ramshankar', order: '1st Son', name: 'Ramshankar Jha', hindi: 'रामशंकर झा', subtitle: 'Bade Bete • Inki Shakha' },
            { id: 'gen2-shivshankar', order: '2nd Son', name: 'Shivshankar Jha', hindi: 'शिवशंकर झा', subtitle: 'Wife: Shanti Devi (4 Children)' },
            { id: 'gen2-gaurishankar', order: '3rd Son', name: 'Gaurishankar Jha', hindi: 'गौरीशंकर झा', subtitle: 'Teesre Bete • Inki Shakha' },
            { id: 'gen2-jatashankar', order: '4th Son', name: 'Jatashankar Jha', hindi: 'जटाशंकर झा', subtitle: 'Chauthe Bete • Inki Shakha' }
        ];

        // Shivshankar's 4 children
        const neeta = this.getMember('gen3-neeta');
        const krishna = this.getMember('gen3-krishna');
        const neelu = this.getMember('gen3-neelu');
        const neetu = this.getMember('gen3-neetu');

        // Dynamic Branch HTML
        let branchHtml = '';

        if (this.selectedBrotherId === 'gen2-shivshankar') {
            branchHtml = `
                <div class="p-4 bg-slate-50 border-2 border-slate-300 rounded-2xl space-y-3.5 shadow-sm">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-200 pb-2.5">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="peedhi-badge peedhi-3 text-xs">PEEDHI 3</span>
                            <h4 class="text-base sm:text-lg font-black text-slate-900">
                                Shivshankar Jha & Shanti Devi ke 4 Bachhe:
                            </h4>
                        </div>
                        <button onclick="window.openMemberPage('gen2-shivshankar')" class="text-xs text-[#8b1e15] font-bold hover:underline self-start sm:self-center">
                            View Details →
                        </button>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
                        
                        <!-- 1. NEETA JHA -->
                        <div class="p-4 bg-white border-2 border-slate-200 hover:border-[#8b1e15] rounded-xl space-y-1.5 shadow-sm transition-all">
                            <div class="flex items-center justify-between">
                                <strong class="text-slate-900 text-base">1. Neeta Jha & Sanjay Jha</strong>
                                <button onclick="window.openMemberPage('gen3-neeta')" class="text-xs text-[#8b1e15] font-bold hover:underline bg-red-50 border border-red-200 px-2.5 py-1 rounded-md">
                                    Open →
                                </button>
                            </div>
                            <p class="text-xs text-slate-600 leading-relaxed">
                                <strong>Bachhe:</strong> Manisha Acharya, Meenakshi Jha, Mukund Jha
                            </p>
                            <div class="pt-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                                <i class="fa-solid fa-star text-amber-500"></i> Nati: Atharva Acharya (Peedhi 5)
                            </div>
                        </div>

                        <!-- 2. KRISHNA JHA -->
                        <div class="p-4 bg-white border-2 border-slate-200 hover:border-[#8b1e15] rounded-xl space-y-1.5 shadow-sm transition-all">
                            <div class="flex items-center justify-between">
                                <strong class="text-slate-900 text-base">2. Krishna Jha & Menka Devi</strong>
                                <button onclick="window.openMemberPage('gen3-krishna')" class="text-xs text-[#8b1e15] font-bold hover:underline bg-red-50 border border-red-200 px-2.5 py-1 rounded-md">
                                    Open →
                                </button>
                            </div>
                            <p class="text-xs text-slate-600 leading-relaxed">
                                <strong>Bachhe:</strong> Ashish Jha (Beta), Sheetal Jha (Beti)
                            </p>
                            <div class="pt-1 text-[11px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md inline-block">
                                Peedhi 4: 2 Sadasya
                            </div>
                        </div>

                        <!-- 3. NEELU CHAUDHARY -->
                        <div class="p-4 bg-white border-2 border-slate-200 hover:border-[#8b1e15] rounded-xl space-y-1.5 shadow-sm transition-all">
                            <div class="flex items-center justify-between">
                                <strong class="text-slate-900 text-base">3. Neelu Chaudhary & Chandan Chaudhary</strong>
                                <button onclick="window.openMemberPage('gen3-neelu')" class="text-xs text-[#8b1e15] font-bold hover:underline bg-red-50 border border-red-200 px-2.5 py-1 rounded-md">
                                    Open →
                                </button>
                            </div>
                            <p class="text-xs text-slate-600 leading-relaxed">
                                <strong>Bachhe:</strong> Ankit Chaudhary (Beta), Madhav Chaudhary (Beta)
                            </p>
                            <div class="pt-1 text-[11px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md inline-block">
                                Peedhi 4: 2 Bete
                            </div>
                        </div>

                        <!-- 4. NEETU CHAUDHARY -->
                        <div class="p-4 bg-white border-2 border-slate-200 hover:border-[#8b1e15] rounded-xl space-y-1.5 shadow-sm transition-all">
                            <div class="flex items-center justify-between">
                                <strong class="text-slate-900 text-base">4. Neetu Chaudhary & Sonu Chaudhary</strong>
                                <button onclick="window.openMemberPage('gen3-neetu')" class="text-xs text-[#8b1e15] font-bold hover:underline bg-red-50 border border-red-200 px-2.5 py-1 rounded-md">
                                    Open →
                                </button>
                            </div>
                            <p class="text-xs text-slate-600 leading-relaxed">
                                <strong>Bachhe:</strong> Suhana Chaudhary, Kittu Chaudhary (Nickname), Yuvraj Chaudhary
                            </p>
                            <div class="pt-1 text-[11px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md inline-block">
                                Peedhi 4: 3 Sadasya
                            </div>
                        </div>

                    </div>
                </div>
            `;
        } else if (this.selectedBrotherId === 'gen2-ramshankar') {
            branchHtml = `
                <div class="p-4 bg-amber-50/60 border-2 border-amber-300 rounded-2xl space-y-3.5 shadow-sm">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-amber-200 pb-2.5">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="peedhi-badge peedhi-3 text-xs">PEEDHI 3</span>
                            <h4 class="text-base sm:text-lg font-black text-slate-900">
                                Ramshankar Jha Ji ki Shakha (1st Son):
                            </h4>
                        </div>
                        <button onclick="window.openMemberPage('gen2-ramshankar')" class="text-xs text-[#8b1e15] font-bold hover:underline self-start sm:self-center">
                            View Details →
                        </button>
                    </div>

                    <div class="p-5 bg-white border-2 border-slate-200 rounded-xl text-center space-y-2">
                        <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-xl font-bold">
                            <i class="fa-solid fa-users"></i>
                        </div>
                        <h5 class="text-lg font-bold text-slate-900">Ramshankar Jha Ji ke Parivar ka Data</h5>
                        <p class="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                            Markhande Jha ji ke bade bete <strong>Pujya Ramshankar Jha Ji</strong> ke parivar evam santan ka data aane wale update mein joda jayega.
                        </p>
                    </div>
                </div>
            `;
        } else if (this.selectedBrotherId === 'gen2-gaurishankar') {
            branchHtml = `
                <div class="p-4 bg-slate-50 border-2 border-slate-300 rounded-2xl space-y-3.5 shadow-sm">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-200 pb-2.5">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="peedhi-badge peedhi-3 text-xs">PEEDHI 3</span>
                            <h4 class="text-base sm:text-lg font-black text-slate-900">
                                Gaurishankar Jha Ji ki Shakha (3rd Son):
                            </h4>
                        </div>
                        <button onclick="window.openMemberPage('gen2-gaurishankar')" class="text-xs text-[#8b1e15] font-bold hover:underline self-start sm:self-center">
                            View Details →
                        </button>
                    </div>

                    <div class="p-5 bg-white border-2 border-slate-200 rounded-xl text-center space-y-2">
                        <div class="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto text-xl font-bold">
                            <i class="fa-solid fa-users"></i>
                        </div>
                        <h5 class="text-lg font-bold text-slate-900">Gaurishankar Jha Ji ke Parivar ka Data</h5>
                        <p class="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                            Markhande Jha ji ke teesre bete <strong>Gaurishankar Jha Ji</strong> ke parivar evam santan ka data aane wale agle update mein joda jayega.
                        </p>
                    </div>
                </div>
            `;
        } else if (this.selectedBrotherId === 'gen2-jatashankar') {
            branchHtml = `
                <div class="p-4 bg-slate-50 border-2 border-slate-300 rounded-2xl space-y-3.5 shadow-sm">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-200 pb-2.5">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="peedhi-badge peedhi-3 text-xs">PEEDHI 3</span>
                            <h4 class="text-base sm:text-lg font-black text-slate-900">
                                Jatashankar Jha Ji ki Shakha (4th Son):
                            </h4>
                        </div>
                        <button onclick="window.openMemberPage('gen2-jatashankar')" class="text-xs text-[#8b1e15] font-bold hover:underline self-start sm:self-center">
                            View Details →
                        </button>
                    </div>

                    <div class="p-5 bg-white border-2 border-slate-200 rounded-xl text-center space-y-2">
                        <div class="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto text-xl font-bold">
                            <i class="fa-solid fa-users"></i>
                        </div>
                        <h5 class="text-lg font-bold text-slate-900">Jatashankar Jha Ji ke Parivar ka Data</h5>
                        <p class="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                            Markhande Jha ji ke chauthe bete <strong>Jatashankar Jha Ji</strong> ke parivar evam santan ka data aane wale agle update mein joda jayega.
                        </p>
                    </div>
                </div>
            `;
        }

        // Render the tree
        this.container.innerHTML = `
            <div class="space-y-6">

                <!-- =====================================================================
                     PEEDHI 1: MARKHANDE JHA (PITA / MOOL PURVAJ)
                     ===================================================================== -->
                <div class="elder-card border-2 border-slate-300">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-200 pb-3 mb-4">
                        <div>
                            <span class="peedhi-badge peedhi-1 text-xs">Peedhi 1 • Mool Purvaj Pita</span>
                            <h3 class="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Markhande Jha (मार्कण्डेय झा)</h3>
                            <p class="text-sm text-slate-600 font-medium">Inke 4 Bete aur 3 Anya Santan hain • Sabhi 4 Beton ka samman barabar hai</p>
                        </div>
                        <button onclick="window.openMemberPage('gen1-markhande')" class="btn-elder-outline text-xs py-1.5 px-3.5 self-start sm:self-center shadow-sm">
                            View Details →
                        </button>
                    </div>

                    <!-- =====================================================================
                         PEEDHI 2: MARKHANDE JHA KE 4 BETE (CLICK BUTTON TO SHOW EACH BRANCH)
                         ===================================================================== -->
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="peedhi-badge peedhi-2 text-xs">Peedhi 2 • Markhande Jha ke 4 Bete:</span>
                            </div>
                            <span class="text-xs font-semibold text-slate-500">Tap any son to view branch</span>
                        </div>

                        <!-- 4 SONS GRID - INTERACTIVE BUTTONS & EQUAL STYLING -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            ${brothers.map(b => {
                                const isSelected = (this.selectedBrotherId === b.id);
                                return `
                                    <div onclick="window.treeInstance.selectBrother('${b.id}')"
                                         class="p-4 rounded-xl space-y-2.5 transition-all cursor-pointer ${
                                            isSelected 
                                                ? 'bg-red-50/50 border-2 border-[#8b1e15] shadow-md ring-2 ring-[#8b1e15]/20' 
                                                : 'bg-white border-2 border-slate-300 hover:border-slate-400'
                                         }">
                                        <div class="flex items-start justify-between border-b border-slate-200 pb-2">
                                            <div>
                                                <div class="flex items-center gap-1.5">
                                                    <span class="text-xs font-bold text-slate-500 uppercase">${b.order}</span>
                                                    ${isSelected ? `<span class="bg-[#8b1e15] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full"><i class="fa-solid fa-check"></i> Selected</span>` : ''}
                                                </div>
                                                <h4 class="text-lg font-bold text-slate-900">${b.name}</h4>
                                                <p class="text-xs text-slate-500 font-hindi">${b.hindi}</p>
                                            </div>
                                            <button onclick="event.stopPropagation(); window.openMemberPage('${b.id}')" class="btn-elder-outline text-xs py-1 px-2.5">
                                                View Details →
                                            </button>
                                        </div>

                                        <p class="text-xs text-slate-600 font-medium">${b.subtitle}</p>

                                        <div class="pt-1 flex items-center justify-between">
                                            <button onclick="event.stopPropagation(); window.treeInstance.selectBrother('${b.id}')" 
                                                    class="${isSelected ? 'btn-elder-primary' : 'btn-elder-outline'} text-xs py-1 px-3 w-full justify-between">
                                                <span>${isSelected ? 'Branch Open ↓' : 'Open Branch ↓'}</span>
                                                <i class="fa-solid ${isSelected ? 'fa-circle-chevron-down' : 'fa-arrow-down'}"></i>
                                            </button>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>

                        <!-- 3 Other Children of Markhande Jha -->
                        <div class="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600">
                            <strong>Markhande Jha ki anya 3 santan:</strong> Inki jankari aane wale update mein darj ki jayegi.
                        </div>

                        <!-- =====================================================================
                             DYNAMIC PEEDHI 3 CONTAINER (CHANGES ACCORDING TO CLICKED BROTHER)
                             ===================================================================== -->
                        <div id="selected-branch-container" class="mt-4">
                            ${branchHtml}
                        </div>

                    </div>

                </div>

            </div>
        `;
    }
}

window.FamilyTreeRenderer = FamilyTreeRenderer;

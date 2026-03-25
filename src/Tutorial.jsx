import React, { useEffect, useState, useRef } from 'react';

// ─── Confetti ────────────────────────────────────────────────────────
function Confetti() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ['#6366F1','#818CF8','#10B981','#F59E0B','#EF4444','#EC4899','#FCD34D','#34D399'];

    // Rain particles (fall from top)
    const rainParticles = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: -30 - Math.random() * 400,
      w: Math.random() * 14 + 4,
      h: Math.random() * 7 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 5 + 3,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 9,
    }));

    // Gun barrel positions (estimated from celebration.png)
    const guns = [
      { x: 320,                  y: canvas.height - 480, spreadMin: -1.484, spreadMax: -0.960 },
      { x: canvas.width - 320,   y: canvas.height - 480, spreadMin: -2.182, spreadMax: -1.658 },
    ];

    const createBurst = () => {
      const particles = [];
      guns.forEach(gun => {
        for (let i = 0; i < 70; i++) {
          const angle = gun.spreadMin + Math.random() * (gun.spreadMax - gun.spreadMin);
          const speed = Math.random() * 22 + 12;
          particles.push({
            x: gun.x, y: gun.y,
            w: Math.random() * 14 + 4,
            h: Math.random() * 7 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            rot: Math.random() * 360,
            rotV: (Math.random() - 0.5) * 20,
            life: 0, maxLife: 100,
          });
        }
      });
      return particles;
    };

    let burstParticles = [];
    let frame = 0;
    let rafId;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (frame % 90 === 0) burstParticles.push(...createBurst());

      const rainAlpha = Math.max(0, 1 - frame / 180);
      rainParticles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.rotV;
        ctx.save();
        ctx.globalAlpha = rainAlpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      burstParticles = burstParticles.filter(p => p.life < p.maxLife);
      burstParticles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.45; p.rot += p.rotV; p.life++;
        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      frame++;
      if (frame < 450) rafId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(rafId);
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 9998 }} />;
}

// ─── Spotlight box ───────────────────────────────────────────────────
function Spotlight({ rect, padding = 8 }) {
  if (!rect) return null;
  return (
    <div
      className="fixed pointer-events-none"
      style={{
        left: rect.left - padding,
        top: rect.top - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
        borderRadius: 10,
        boxShadow: '0 0 0 9999px rgba(0,0,0,0.52)',
        border: '2px solid rgba(99,102,241,0.9)',
        zIndex: 70,
        transition: 'left 200ms ease-out, top 200ms ease-out, width 200ms ease-out, height 200ms ease-out',
      }}
    />
  );
}

// ─── Step definitions ────────────────────────────────────────────────
export const TUTORIAL_STEPS = [
  // 0
  {
    id: 'welcome',
    type: 'center',
    title: 'Welcome to the IMS',
    description: "This tutorial walks you through the core inventory workflow.",
    bullets: [
      '🛒 Purchase ingredients into a warehouse',
      '🚚 Batch move lots to another location',
      '📋 Set up a production recipe',
      '🏭 Produce finished goods',
      '🧪 Draw down into smaller units',
      '📊 Track full transaction history',
    ],
  },
  // 1
  {
    id: 'navigate-to-ingredients',
    type: 'spotlight',
    target: '[data-tutorial="sidebar-ingredients"]',
    position: 'right',
    title: 'Navigate to Ingredients',
    description: "First, let's go to the Ingredients category where powder is stored.",
    instruction: 'Click "Ingredients" in the sidebar',
  },
  // 2
  {
    id: 'go-to-items-lots-tab',
    type: 'spotlight',
    target: '[data-tutorial="tab-itemFF"]',
    position: 'bottom',
    title: 'Go to Items & Lots Tab',
    description: 'The Items & Lots tab shows all items and their current stock.',
    instruction: 'Click the "Items & Lots" tab',
  },
  // 3
  {
    id: 'purchase-powder',
    type: 'spotlight',
    target: '[data-tutorial="purchase-btn-powder-bag"]',
    position: 'bottom',
    title: 'Purchase Powder',
    description: 'Click Purchase Lots to buy 3 bags of powder and assign them to SG Warehouse.',
    instruction: 'Click "Purchase Lots" on the powder (2.5kg bag) row',
  },
  // 4
  {
    id: 'purchase-location',
    type: 'spotlight',
    target: '[data-tutorial="purchase-modal-location"]',
    position: 'left',
    title: 'Set the Location',
    description: 'Choose where these lots will be stored.',
    instruction: 'Select "SG Warehouse" from the dropdown',
    showNext: true,
  },
  // 5
  {
    id: 'purchase-attributes',
    type: 'spotlight',
    target: '[data-tutorial="purchase-modal-attributes"]',
    position: 'left',
    title: 'Fill in Attribute Fields',
    description: "These attributes are shared across all lots you're about to create.",
    bullets: [
      "Manufacturing date: today's date",
      'Production batch: 1',
    ],
    instruction: 'Enter the values above, then click Next',
    showNext: true,
  },
  // 6
  {
    id: 'purchase-lots',
    type: 'spotlight',
    target: '[data-tutorial="purchase-modal-lots"]',
    position: 'left',
    title: 'Create 3 Lots',
    description: 'Each row is a separate lot. Use "Add Another" to add more rows.',
    bullets: [
      'Add 3 rows (one per lot)',
      'Quantity per lot: 2.5',
      'Price per lot: $5.00',
    ],
    instruction: 'Fill in all 3 rows, then click Purchase Lots',
  },
  // 7
  {
    id: 'milestone-purchase',
    type: 'milestone',
    phase: 0,
    text: "Your ingredients are now in SG Warehouse. Next, you'll batch move the lots to Uskun Warehouse — where production happens.",
  },
  // 8
  {
    id: 'select-and-move',
    type: 'spotlight',
    target: '[data-tutorial="lot-area-powder-bag"]',
    position: 'top',
    title: 'Select Lots & Batch Move',
    description: 'Use the checkboxes to select the powder lots. The Batch Actions button will appear in the header — click it, then choose Move.',
    instruction: 'Select lots → Batch Actions → Move',
  },
  // 9
  {
    id: 'move-to-uskun',
    type: 'corner',
    title: 'Move to Uskun Warehouse',
    description: 'Select Uskun Warehouse as the destination and confirm.',
    instruction: 'Set the destination to Uskun Warehouse and click Move Lots',
  },
  // 10
  {
    id: 'milestone-move',
    type: 'milestone',
    phase: 1,
    text: "Lots are at Uskun Warehouse. Time to set up a production recipe and manufacture Marker Solution (200L drum).",
  },
  // 11
  {
    id: 'navigate-to-finished-goods',
    type: 'spotlight',
    target: '[data-tutorial="sidebar-finished-goods"]',
    position: 'right',
    title: 'Go to Finished Goods',
    description: 'Now navigate to Finished Goods to work with Marker Solution.',
    instruction: 'Click "Finished Goods" in the sidebar',
  },
  // 12
  {
    id: 'create-production-recipe',
    type: 'spotlight',
    target: '[data-tutorial="recipe-btn-marker-200L"]',
    position: 'bottom',
    title: 'Create a Production Recipe',
    description: 'Marker Solution (200L Drum) is manufactured from powder and solvent. Click Create Recipe to define the formula.',
    instruction: 'Click "Create Recipe" on the Marker Solution (200L drum) row',
  },
  // 13
  {
    id: 'define-recipe',
    type: 'corner',
    title: 'Define the Recipe',
    description: 'Add the source ingredients and set the output quantity.',
    bullets: [
      'Powder (2.5kg bag) — qty 5',
      'Solvent (200L drum) — qty 20',
      'Output quantity: 22',
    ],
    instruction: 'Add both sources, set output qty to 22, then Save',
  },
  // 14
  {
    id: 'produce-marker',
    type: 'spotlight',
    target: '[data-tutorial="produce-btn-marker-200L"]',
    position: 'bottom',
    title: 'Produce Marker Solution',
    description: 'Your recipe is saved. Click Produce to start a production run for Marker Solution.',
    instruction: 'Click "Produce" on the Marker Solution (200L drum) row',
  },
  // 15
  {
    id: 'exec-select-location',
    type: 'spotlight',
    target: '[data-tutorial="exec-location"]',
    position: 'left',
    title: 'Select the Source Location',
    description: 'Choose the warehouse where your source lots are stored. This filters the available lots in the Sources section.',
    instruction: 'Select "Uskun Warehouse" from the dropdown, then click Next',
    showNext: true,
  },
  // 16
  {
    id: 'sources-section',
    type: 'spotlight',
    target: '[data-tutorial="exec-sources-section"]',
    position: 'left',
    title: 'Fill in Sources',
    description: 'Select a lot and enter the qty for each ingredient segment.',
    bullets: [
      'Powder (2.5kg bag): select any lot → qty 5',
      'Solvent (200L drum): select any lot → qty 20',
    ],
    instruction: 'Select lots and set quantities, then click Next',
    showNext: true,
  },
  // 17
  {
    id: 'destination-section',
    type: 'spotlight',
    target: '[data-tutorial="exec-destination-section"]',
    position: 'left',
    title: 'Add Destination Lots',
    description: 'Each row creates one produced lot of Marker Solution.',
    bullets: [
      'Set Manufacturing Date to today and Blending Batch to 1',
      'Click "+ Add Destination Lot to create a new row"',
      'Set quantity to 22',
    ],
    instruction: 'Add 1 lot row with qty 22, then click Next',
    showNext: true,
  },
  // 18
  {
    id: 'status-section',
    type: 'spotlight',
    target: '[data-tutorial="exec-status-section"]',
    position: 'left',
    title: 'Check the Status',
    description: 'This section shows whether your source quantities match the recipe ratio.',
    bullets: [
      'Powder: target 5 — should show green',
      'Solvent: target 20 — should show green',
      'If yellow/red, adjust quantities in Sources',
    ],
    instruction: 'Confirm both sources are green, then click Next',
    showNext: true,
  },
  // 19
  {
    id: 'fill-and-produce',
    type: 'corner',
    title: 'Fill in and Produce',
    description: 'Select source lots for each ingredient, add destination lots, and confirm the production run.',
    instruction: 'Fill in the form and click Produce',
  },
  // 20
  {
    id: 'milestone-manufacture',
    type: 'milestone',
    phase: 2,
    text: "Marker Solution is now in 200L drums. Next, draw it down into smaller 5L Jerry cans for distribution.",
  },
  // 21
  {
    id: 'create-drawdown-recipe',
    type: 'spotlight',
    target: '[data-tutorial="drawdown-btn-marker-5L"]',
    position: 'top',
    title: 'Create a Draw Down Recipe',
    description: 'Marker Solution (5L Jerrycan) is drawn down from 200L Drums. Click Create Drawdown to define the ratio.',
    instruction: 'Click "Create Drawdown" on the Marker Solution (5L Jerry can) row',
  },
  // 22
  {
    id: 'define-drawdown',
    type: 'corner',
    title: 'Define the Draw Down',
    description: 'Add Marker Solution (200L drum) as the source and set a 1:1 ratio.',
    bullets: [
      'Source: Marker Solution (200L drum) — qty 1',
      'Output quantity: 1',
    ],
    instruction: 'Set the source and output, then Save',
  },
  // 23
  {
    id: 'execute-drawdown',
    type: 'spotlight',
    target: '[data-tutorial="drawdown-execute-btn-marker-5L"]',
    position: 'top',
    title: 'Draw Down',
    description: 'Your draw-down recipe is ready. Click Draw Down to fill 5L Jerry cans from the 200L drum stock.',
    instruction: 'Click "Draw Down" on the Marker Solution (5L Jerry can) row',
  },
  // 24
  {
    id: 'fill-drawdown-location-source',
    type: 'spotlight',
    target: '[data-tutorial="exec-location-sources"]',
    position: 'left',
    title: '📍 Select Location & Source Lot',
    description: 'Choose "Uskun Warehouse" as the location — this filters available lots. Then select the Marker Solution (200L drum) lot you just produced as the source.',
    instruction: 'Select "Uskun Warehouse" as location, then select the produced lot as the source, then click Next',
    showNext: true,
  },
  // 25
  {
    id: 'fill-drawdown-attributes',
    type: 'spotlight',
    target: '[data-tutorial="exec-destination-section"]',
    position: 'left',
    title: '📋 Copy Source Attributes',
    description: 'Pre-fill the destination lot\'s attributes by copying from the source lot. Use the "Copy from" dropdown in the Attributes header.',
    instruction: 'Use "Copy from" to copy attributes from the source lot, then click Next',
    showNext: true,
  },
  // 26
  {
    id: 'fill-drawdown-dest-lots',
    type: 'spotlight',
    target: '[data-tutorial="exec-add-dest-lot"]',
    position: 'top',
    title: '📦 Add Destination Lots',
    description: 'Create 2 destination lots of 11L each. Click "Add Destination Lot" to add a second row.',
    instruction: 'Add 2 destination lots of 11L each, then click Next',
    showNext: true,
  },
  // 27
  {
    id: 'fill-drawdown-execute',
    type: 'spotlight',
    target: '[data-tutorial="exec-status-section"]',
    position: 'left',
    title: '✅ Check Status & Draw Down',
    description: 'Review the status summary to ensure everything balances, then click Draw Down to complete the transaction.',
    instruction: 'Check status, then click Draw Down',
  },
  // 28
  {
    id: 'milestone-drawdown',
    type: 'milestone',
    phase: 3,
    text: "Draw-down complete! Finally, let's view the full transaction history — every step of this workflow is recorded here.",
  },
  // 29
  {
    id: 'view-history',
    type: 'corner',
    title: 'View Transaction History',
    description: 'Click on any lot card to see its full transaction history — purchases, productions, draw-downs, and moves are all recorded here.',
    instruction: 'Click any lot card to open its history',
  },
  // 30
  {
    id: 'completion',
    type: 'completion',
    title: "You're all set!",
    description: "You've completed the core IMS workflow. Every action is fully traceable through transaction history.",
    bullets: [
      '✅ Purchased powder lots at SG Warehouse',
      '✅ Batch moved lots to Uskun Warehouse',
      '✅ Created a production recipe for Marker Solution',
      '✅ Produced Marker Solution (200L drum)',
      '✅ Created a draw-down recipe for 5L Jerrycan',
      '✅ Drew down into 5L Jerry cans',
      '✅ Viewed full transaction history',
    ],
  },
];

// ─── Milestone card ──────────────────────────────────────────────────
const MILESTONE_PHASES = [
  { label: 'PURCHASE' },
  { label: 'MOVE' },
  { label: 'MANUFACTURE' },
  { label: 'DRAW DOWN' },
];

function MilestoneCard({ phase, text, onNext }) {
  const startPct = 8 + (84 / 3) * phase;
  const endPct   = phase === 3 ? startPct : 8 + (84 / 3) * (phase + 1);

  const [truckPct,   setTruckPct]   = useState(startPct);
  const [typed,      setTyped]      = useState('');
  const [showBtn,    setShowBtn]    = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setTruckPct(startPct);
    setTyped('');
    setShowBtn(false);
    setShowCursor(true);

    const truckTimer = setTimeout(() => setTruckPct(endPct), 60);

    let i = 0;
    let typeInterval;
    const typeTimer = setTimeout(() => {
      typeInterval = setInterval(() => {
        i++;
        setTyped(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(typeInterval);
          setShowCursor(false);
          setShowBtn(true);
        }
      }, 22);
    }, 1100);

    return () => {
      clearTimeout(truckTimer);
      clearTimeout(typeTimer);
      clearInterval(typeInterval);
    };
  }, [phase, text]); // eslint-disable-line

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 80, backgroundColor: 'rgba(15,15,35,0.72)' }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl mx-4"
        style={{ maxWidth: 500, width: '100%', padding: '32px 32px 28px', border: '1px solid rgba(99,102,241,0.18)' }}
      >
        {/* Roadmap */}
        <div style={{ position: 'relative', height: 80, marginBottom: 28, userSelect: 'none' }}>
          {/* Dashed line */}
          <div style={{
            position: 'absolute', top: 54,
            left: '8%', right: '8%', height: 0,
            borderTop: '2px dashed #CBD5E1',
          }} />

          {/* Nodes */}
          {MILESTONE_PHASES.map((p, i) => {
            const leftPct = 8 + (84 / 3) * i;
            const done   = i <= phase;
            const active = phase < 3 && i === phase + 1;
            return (
              <div key={i} style={{ position: 'absolute', left: `${leftPct}%`, transform: 'translateX(-50%)', textAlign: 'center' }}>
                <div style={{
                  width: active ? 24 : 18,
                  height: active ? 24 : 18,
                  borderRadius: active ? 6 : '50%',
                  backgroundColor: (done || active) ? '#1E1B4B' : '#E2E8F0',
                  border: active ? '2px solid #6366F1' : 'none',
                  margin: '0 auto',
                  marginTop: active ? 41 : 44,
                  transition: 'all 400ms ease',
                }} />
                <div style={{
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: (done || active) ? '#1E1B4B' : '#94A3B8',
                  marginTop: 6,
                  whiteSpace: 'nowrap',
                }}>
                  {p.label}
                </div>
              </div>
            );
          })}

          {/* Truck */}
          <div style={{
            position: 'absolute',
            top: 6,
            left: `${truckPct}%`,
            transform: 'translateX(-50%) scaleX(-1)',
            fontSize: 22,
            transition: 'left 2000ms cubic-bezier(0.4,0,0.2,1)',
            pointerEvents: 'none',
          }}>
            🚚
          </div>
        </div>

        {/* Typewriter text */}
        <div
          className="rounded-xl px-4 py-3 mb-6 text-sm leading-relaxed"
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            color: '#334155',
            minHeight: 64,
            fontFamily: 'monospace',
          }}
        >
          {typed}
          {showCursor && (
            <span style={{ animation: 'blink 0.8s step-start infinite', color: '#6366F1' }}>|</span>
          )}
        </div>

        {/* Continue button */}
        <div className="flex justify-end">
          {showBtn && (
            <button
              className="px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#6366F1', color: '#fff' }}
              onClick={onNext}
            >
              Continue →
            </button>
          )}
        </div>
      </div>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}

// ─── Tooltip position helper ─────────────────────────────────────────
function getTooltipPos(rect, position) {
  const GAP = 14;
  const W = 320;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  switch (position) {
    case 'bottom': return { top: Math.min(rect.bottom + GAP, vh - 260), left: Math.max(8, Math.min(rect.left, vw - W - 8)) };
    case 'top':    return { bottom: vh - rect.top + GAP, left: Math.max(8, Math.min(rect.left, vw - W - 8)) };
    case 'right':  return { top: Math.max(8, rect.top), left: Math.min(rect.right + GAP, vw - W - 8) };
    case 'left':   return { top: Math.max(8, rect.top), right: vw - rect.left + GAP };
    default:       return { bottom: 24, right: 24 };
  }
}

// ─── Setup Tutorial steps ─────────────────────────────────────────────
// Order: UOM → Location → Form Factor → Item → attach FF → Schemas → Policy → Items & Lots
export const SETUP_TUTORIAL_STEPS = [
  // 0
  { id: 'setup-welcome', type: 'center', title: 'Setup Tutorial',
    description: 'Configure your IMS from scratch — create units of measure, locations, form factors, items, attributes, and warehouse policies.',
    bullets: ['📏 Create a Unit of Measure', '📍 Create a Location', '📦 Create a Form Factor', '🧪 Create an Item', '📋 Define Attributes', '🏭 Set a Warehouse Policy'] },
  // 1 — auto when selectedCategoryId === '__uom'
  { id: 'setup-nav-uom', type: 'spotlight', target: '[data-tutorial="sidebar-uom"]', position: 'right',
    title: '📏 Units of Measure', description: 'First, define a unit of measure that your item will use.',
    instruction: 'Click "Units of Measure" in the sidebar' },
  // 2 — showNext (click Add to open inline form, then Next)
  { id: 'setup-add-uom', type: 'spotlight', target: '[data-tutorial="add-uom-btn"]', position: 'bottom',
    title: 'Add a Unit of Measure', description: 'Click the Add button to open the creation form.',
    instruction: 'Click "Add Unit", then click Next', showNext: true },
  // 3 — auto when uomCount > init
  { id: 'setup-fill-uom', type: 'spotlight', target: '[data-tutorial="uom-inline-form"]', position: 'bottom',
    title: 'Fill in UoM Details', description: 'Enter the details for your unit of measure.',
    bullets: ['Name: testUoM', 'Symbol: tUoM', 'Type: weight'],
    instruction: 'Fill in the fields above, then click Save' },
  // 4 — auto when selectedCategoryId === '__locations'
  { id: 'setup-nav-locations', type: 'spotlight', target: '[data-tutorial="sidebar-locations"]', position: 'right',
    title: '📍 Locations', description: 'Now create a warehouse location where your item will be stored.',
    instruction: 'Click "Locations" in the sidebar' },
  // 5 — auto when activeModal?.type === 'addLocation'
  { id: 'setup-add-location', type: 'spotlight', target: '[data-tutorial="add-location-btn"]', position: 'bottom',
    title: 'Add a Location', description: 'Click Add Location to open the form.',
    instruction: 'Click "Add Location"' },
  // 6 — auto when locationCount > init
  { id: 'setup-fill-location', type: 'corner', title: 'Create testLocation',
    description: 'Fill in the location details.',
    bullets: ['Name: testLocation', 'Type: warehouse (or any)', 'Capacity: 5000'],
    instruction: 'Fill in the form, then click Save' },
  // 7 — auto when selectedCategoryId === 'ingredients'
  { id: 'setup-nav-category', type: 'spotlight', target: '[data-tutorial="sidebar-ingredients"]', position: 'right',
    title: '📦 Navigate to Ingredients', description: 'Go to Ingredients to create form factors and items.',
    instruction: 'Click "Ingredients" in the sidebar' },
  // 8 — auto when managerActiveTab === 'formFactors'
  { id: 'setup-go-ff-tab', type: 'spotlight', target: '[data-tutorial="tab-formfactors"]', position: 'bottom',
    title: 'Go to Form Factors Tab', description: 'Form factors define the packaging format of an item (e.g. bag, drum, can).',
    instruction: 'Click the "Form Factors" tab' },
  // 9 — auto when ffCount > init
  { id: 'setup-add-ff', type: 'spotlight', target: '[data-tutorial="add-formfactor-btn"]', position: 'top',
    title: 'Create a Form Factor', description: 'Click Add, enter "testFormFactor" as the name, then Save.',
    instruction: 'Click Add, type "testFormFactor", then Add' },
  // 10 — auto when managerActiveTab === 'items'
  { id: 'setup-go-items-tab', type: 'spotlight', target: '[data-tutorial="tab-items"]', position: 'bottom',
    title: 'Go to Items Tab', description: 'Now create the item that will use testUoM.',
    instruction: 'Click the "Items" tab' },
  // 11 — auto when activeModal?.type === 'addItem'
  { id: 'setup-add-item', type: 'spotlight', target: '[data-tutorial="add-item-btn"]', position: 'bottom',
    title: 'Create an Item', description: 'Click Add Item to create test powder.',
    instruction: 'Click "Add Item"' },
  // 12 — auto when itemCount > init
  { id: 'setup-fill-item', type: 'corner', title: 'Fill in Item Details',
    description: 'Enter the item details, including the UoM you just created.',
    bullets: ['Name: test powder', 'SKU: PW-001', 'UoM: testUoM', 'Default form factor: testFormFactor'],
    instruction: 'Fill in the fields above, then click Save' },
  // 13 — auto when activeModal?.type === 'attachFormFactors'
  { id: 'setup-attach-ff', type: 'spotlight', target: '[data-tutorial="items-list"]', position: 'bottom',
    title: 'Attach Form Factor',
    description: 'Find the test powder row and click the "FF" button to attach form factors.',
    instruction: 'Click the FF button on the test powder row' },
  // 14 — showNext
  { id: 'setup-select-ff', type: 'corner', title: 'Select testFormFactor',
    description: 'In the modal, select testFormFactor from the list and save.',
    instruction: 'Check "testFormFactor", then click Save', showNext: true },
  // 15 — auto when managerActiveTab === 'schemas'
  { id: 'setup-go-schemas-tab', type: 'spotlight', target: '[data-tutorial="tab-schemas"]', position: 'bottom',
    title: 'Go to Attribute Schemas', description: 'Attribute schemas define metadata fields recorded per lot.',
    instruction: 'Click the "Attribute Schemas" tab' },
  // 16 — auto when activeModal?.type === 'addSchema'
  { id: 'setup-add-schema', type: 'spotlight', target: '[data-tutorial="add-schema-btn"]', position: 'bottom',
    title: 'Add an Attribute Schema', description: 'Define attributes for test powder / testFormFactor.',
    instruction: 'Click "Add Schema"' },
  // 17 — auto when schemaCount > init
  { id: 'setup-fill-schema', type: 'corner', title: 'Define Attribute Fields',
    description: 'Add two fields to capture lot-level metadata.',
    bullets: ['Item - test powder', 'Form Factor - testFormFactor', 'Field 1 — Name: Manufacturing Date, Type: date', 'Field 2 — Name: Batch Number, Type: text'],
    instruction: 'Add both fields, then click Save' },
  // 18 — auto when managerActiveTab === 'policies'
  { id: 'setup-go-policies-tab', type: 'spotlight', target: '[data-tutorial="tab-policies"]', position: 'bottom',
    title: 'Go to Warehouse Policy', description: 'Warehouse policies define stock rules per location for this item.',
    instruction: 'Click the "Warehouse Policy" tab' },
  // 19 — auto when activeModal?.type === 'addPolicy'
  { id: 'setup-add-policy', type: 'spotlight', target: '[data-tutorial="add-policy-btn"]', position: 'bottom',
    title: 'Add a Warehouse Policy', description: 'Define minimum and maximum stock levels for test powder at testLocation.',
    instruction: 'Click "Add Policy"' },
  // 20 — auto when policyCount > init
  { id: 'setup-fill-policy', type: 'corner', title: 'Fill in Policy Values',
    description: 'Set arbitrary stock limits for test powder at testLocation.',
    bullets: ['Location: testLocation', 'Min Stock: 10', 'Max Stock: 100'],
    instruction: 'Fill in the fields above, then click Save' },
  // 21 — auto when managerActiveTab === 'itemFF'
  { id: 'setup-go-itemff-tab', type: 'spotlight', target: '[data-tutorial="tab-itemFF"]', position: 'bottom',
    title: 'Items & Lots', description: 'Go to Items & Lots to see your fully configured item.',
    instruction: 'Click the "Items & Lots" tab' },
  // 22
  { id: 'setup-completion', type: 'completion', title: 'Setup Complete!',
    description: 'Your IMS is configured and ready for inventory operations.',
    bullets: ['✅ Created testUoM unit of measure', '✅ Created testLocation warehouse', '✅ Created testFormFactor form factor', '✅ Created test powder item with testUoM', '✅ Defined Manufacturing Date and Batch Number attributes', '✅ Set warehouse policy for testLocation'] },
];

// ─── Main Tutorial component ─────────────────────────────────────────
export default function Tutorial({ steps = TUTORIAL_STEPS, stepIndex, onNext, onBack, onSkip }) {
  const [targetRect, setTargetRect] = useState(null);
  const [confettiKey, setConfettiKey] = useState(0);
  const rafRef = useRef(null);

  const step = steps[stepIndex];

  // Poll for target element rect
  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    if (!step?.target) { setTargetRect(null); return; }
    const poll = () => {
      const el = document.querySelector(step.target);
      if (el) {
        const r = el.getBoundingClientRect();
        setTargetRect({ left: r.left, top: r.top, width: r.width, height: r.height, right: r.right, bottom: r.bottom });
      } else {
        setTargetRect(null);
      }
      rafRef.current = requestAnimationFrame(poll);
    };
    poll();
    return () => cancelAnimationFrame(rafRef.current);
  }, [step?.target, stepIndex]);

  if (!step) return null;

  const totalActionSteps = steps.length - 2; // exclude welcome + completion

  // ── Welcome modal ──
  if (step.type === 'center') {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 80, backgroundColor: 'rgba(0,0,0,0.55)' }}>
        <div
          className="bg-white rounded-2xl p-8 mx-4 shadow-2xl"
          style={{ maxWidth: 440, width: '100%', border: '1px solid rgba(99,102,241,0.2)' }}
        >
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#1E1B4B' }}>{step.title}</h2>
          <p className="text-sm mb-5" style={{ color: '#64748B' }}>{step.description}</p>
          <ul className="space-y-2.5 mb-7">
            {step.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#64748B' }}>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between">
            <button className="text-sm cursor-pointer hover:underline" style={{ color: '#CBD5E1' }} onClick={onSkip}>
              Skip tutorial
            </button>
            <button
              className="px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#6366F1', color: '#fff' }}
              onClick={onNext}
            >
              Start Tutorial →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Milestone card ──
  if (step.type === 'milestone') {
    return <MilestoneCard phase={step.phase} text={step.text} onNext={onNext} />;
  }

  // ── Completion modal ──
  if (step.type === 'completion') {
    return (
      <>
        <Confetti key={confettiKey} />
        <img
          src="/celebration.png"
          alt=""
          style={{
            position: 'fixed', bottom: 0, left: 0,
            height: 800, width: 'auto',
            zIndex: 9999, pointerEvents: 'none',
          }}
        />
        <img
          src="/celebration.png"
          alt=""
          style={{
            position: 'fixed', bottom: 0, right: 0,
            height: 800, width: 'auto',
            zIndex: 9999, pointerEvents: 'none',
            transform: 'scaleX(-1)',
          }}
        />
        <div className="fixed inset-0 flex flex-col items-center justify-center" style={{ zIndex: 9997, backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div
            className="bg-white rounded-2xl p-8 mx-4 shadow-2xl text-center"
            style={{ maxWidth: 440, width: '100%', border: '1px solid rgba(99,102,241,0.2)' }}
          >
            <div style={{ fontSize: 72, lineHeight: 1, marginBottom: 16 }}>👍</div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#1E1B4B' }}>{step.title}</h2>
            <p className="text-sm mb-5" style={{ color: '#64748B' }}>{step.description}</p>
            <ul className="space-y-1.5 mb-7 text-left">
              {step.bullets.map((b, i) => (
                <li key={i} className="text-sm" style={{ color: '#64748B' }}>{b}</li>
              ))}
            </ul>
            <button
              className="px-8 py-2.5 rounded-lg text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#6366F1', color: '#fff' }}
              onClick={onSkip}
            >
              Close Tutorial
            </button>
          </div>
          <button
            onClick={() => setConfettiKey(k => k + 1)}
            title="Replay confetti"
            style={{
              marginTop: 16,
              width: 40, height: 40,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.4)',
              color: '#fff',
              fontSize: 20,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)',
            }}
          >
            ↻
          </button>
        </div>
      </>
    );
  }

  // ── Spotlight / corner tooltip ──
  const isCorner = step.type === 'corner';
  const tooltipPos = isCorner || !targetRect
    ? { bottom: 24, left: 24 }
    : getTooltipPos(targetRect, step.position);

  const progressPct = (stepIndex / (TUTORIAL_STEPS.length - 1)) * 100;

  return (
    <>
      {step.type === 'spotlight' && targetRect && <Spotlight rect={targetRect} />}

      {/* Tooltip card */}
      <div
        style={{
          position: 'fixed',
          zIndex: 72,
          width: 320,
          ...tooltipPos,
          backgroundColor: '#fff',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(99,102,241,0.18), 0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid rgba(99,102,241,0.2)',
          overflow: 'hidden',
        }}
      >
        {/* Progress bar */}
        <div style={{ height: 3, backgroundColor: '#EEF2FF' }}>
          <div
            style={{
              height: '100%',
              width: `${progressPct}%`,
              backgroundColor: '#6366F1',
              transition: 'width 300ms ease-out',
            }}
          />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-sm mb-1" style={{ color: '#1E1B4B' }}>{step.title}</h3>
          {step.description && (
            <p className="text-xs mb-2" style={{ color: '#64748B' }}>{step.description}</p>
          )}
          {step.bullets && (
            <ul className="space-y-1 mb-3">
              {step.bullets.map((b, i) => (
                <li key={i} className="flex gap-1.5 text-xs" style={{ color: '#64748B' }}>
                  <span style={{ color: '#818CF8', flexShrink: 0 }}>›</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
          {step.instruction && (
            <div
              className="text-xs px-3 py-2 rounded-lg font-medium"
              style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}
            >
              👉 {step.instruction}
            </div>
          )}
          <div className="flex items-center gap-2 mt-3" style={{ flexWrap: 'nowrap' }}>
            <span className="text-xs flex-shrink-0" style={{ color: '#CBD5E1' }}>
              Step {stepIndex} of {totalActionSteps}
            </span>
            <div className="flex-1" />
            <button
              className="text-xs flex-shrink-0 cursor-pointer transition-colors hover:text-slate-500"
              style={{ color: '#CBD5E1' }}
              onClick={onSkip}
            >
              Skip
            </button>
            {stepIndex > 1 && (
              <button
                className="text-xs flex-shrink-0 px-2.5 py-1 rounded-lg font-semibold cursor-pointer hover:opacity-90"
                style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}
                onClick={onBack}
              >
                ← Back
              </button>
            )}
            {step.showNext && (
              <button
                className="text-xs flex-shrink-0 px-2.5 py-1 rounded-lg font-semibold cursor-pointer hover:opacity-90"
                style={{ backgroundColor: '#6366F1', color: '#fff' }}
                onClick={onNext}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

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
    const particles = Array.from({ length: 220 }, () => ({
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
    let rafId;
    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const alpha = Math.max(0, 1 - frame / 180);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.rotV;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      if (frame < 220) rafId = requestAnimationFrame(animate);
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
  {
    id: 'welcome',
    type: 'center',
    title: '👋 Welcome to Nanolumi IMS!',
    description: "Let's manufacture Coke from scratch. This tutorial walks you through the full production workflow.",
    bullets: [
      '🏭 Add a production location for Coke',
      '📏 Add Grams as a unit of measure',
      '🧪 Add Coke Powder as a new ingredient',
      '📦 Define its form factor and attributes',
      '🔗 Build a 3-ingredient recipe for Coke',
      '🏭 Run your first production batch',
    ],
  },
  {
    id: 'go-to-manager',
    type: 'spotlight',
    target: '[data-tutorial="mode-manager"]',
    position: 'bottom',
    title: 'Open Catalog Manager',
    description: 'Switch to Catalog Manager to configure ingredients and recipes.',
    instruction: 'Click "Catalog Manager"',
  },
  {
    id: 'navigate-to-locations',
    type: 'spotlight',
    target: '[data-tutorial="sidebar-locations"]',
    position: 'right',
    title: 'Open Locations',
    description: 'Before anything else, define where Coke will be produced. This is the destination warehouse when you run production.',
    instruction: 'Click "Locations" in the sidebar',
  },
  {
    id: 'click-add-location',
    type: 'spotlight',
    target: '[data-tutorial="add-location-btn"]',
    position: 'bottom',
    title: 'Add the Coke Production Floor',
    description: "This location is where Coke will be physically produced. You'll select it as the destination warehouse later.",
    instruction: 'Click "+ Add Location"',
  },
  {
    id: 'fill-location',
    type: 'corner',
    title: 'Create the Production Location',
    description: 'Enter the following details for the production facility:',
    bullets: ['Name: Coke Production Floor', 'Type: Warehouse', 'Capacity: 5000'],
    instruction: 'Fill the form and click Save',
  },
  {
    id: 'navigate-to-uom',
    type: 'spotlight',
    target: '[data-tutorial="sidebar-uom"]',
    position: 'right',
    title: 'Open Units of Measure',
    description: 'Next, add Grams as a unit — Coke Powder is measured in grams.',
    instruction: 'Click "Units of Measure" in the sidebar',
  },
  {
    id: 'add-grams',
    type: 'spotlight',
    target: '[data-tutorial="add-uom-btn"]',
    position: 'left',
    title: 'Add the Gram Unit',
    description: 'Create the unit Coke Powder will be measured in.',
    bullets: ['Name: Gram', 'Symbol: g', 'Type: weight'],
    instruction: 'Click "+ Add Unit", fill the form, then save',
  },
  {
    id: 'select-beverages',
    type: 'spotlight',
    target: '[data-tutorial="sidebar-beverages"]',
    position: 'right',
    title: 'Select Beverages',
    description: 'Navigate to the Beverages category.',
    instruction: 'Click "Beverages" in the sidebar',
  },
  {
    id: 'go-form-factors-tab',
    type: 'spotlight',
    target: '[data-tutorial="tab-formfactors"]',
    position: 'bottom',
    title: 'Open Form Factors Tab',
    description: 'Before adding Coke Powder, we need to add its packaging type.',
    instruction: 'Click the "Form Factors" tab',
  },
  {
    id: 'add-form-factor',
    type: 'spotlight',
    target: '[data-tutorial="add-formfactor-btn"]',
    position: 'top',
    title: 'Add "500g Bag" Form Factor',
    description: 'This is the packaging Coke Powder comes in.',
    instruction: 'Click "+ Add Form Factor", type "500g Bag" under Name, set Qty to 500 and quantity to your created gram unit, then press Enter',
  },
  {
    id: 'go-items-tab',
    type: 'spotlight',
    target: '[data-tutorial="tab-items"]',
    position: 'bottom',
    title: 'Go to Items Tab',
    description: 'Now add Coke Powder as a new ingredient item.',
    instruction: 'Click the "Items" tab',
  },
  {
    id: 'click-add-item',
    type: 'spotlight',
    target: '[data-tutorial="add-item-btn"]',
    position: 'bottom',
    title: 'Add Coke Powder',
    description: 'Create Coke Powder as a new ingredient.',
    instruction: 'Click "+ Add Item"',
  },
  {
    id: 'fill-item',
    type: 'corner',
    title: 'Fill in Item Details',
    description: 'Enter the following for Coke Powder:',
    bullets: ['Name: Coke Powder', 'SKU: CP-001', 'Default Form Factor: 500g Bag'],
    instruction: 'Fill the form and click Save',
  },
  {
    id: 'go-schemas-tab',
    type: 'spotlight',
    target: '[data-tutorial="tab-schemas"]',
    position: 'bottom',
    title: 'Open Attribute Schemas',
    description: 'Define what data must be recorded for every Coke Powder lot.',
    instruction: 'Click the "Attribute Schemas" tab',
  },
  {
    id: 'click-add-schema',
    type: 'spotlight',
    target: '[data-tutorial="add-schema-btn"]',
    position: 'bottom',
    title: 'Add a Schema',
    description: 'Create an attribute schema for Coke Powder (500g Bag).',
    instruction: 'Click "+ Add Schema"',
  },
  {
    id: 'fill-schema',
    type: 'corner',
    title: 'Configure Schema Fields',
    description: 'Set up the schema for Coke Powder → 500g Bag:',
    bullets: [
      'Item: Coke Powder',
      'Form Factor: 500g Bag',
      'Field 1: "Carbonation Amount" — Number, Required',
      'Field 2: "Expiry Date" — Date, Required',
    ],
    instruction: 'Add both fields, then click Save Schema',
  },
  {
    id: 'back-to-items-tab',
    type: 'spotlight',
    target: '[data-tutorial="tab-items"]',
    position: 'bottom',
    title: 'Back to Items Tab',
    description: "Now let's define the Coke manufacturing recipe!",
    instruction: 'Click the "Items" tab',
  },
  {
    id: 'open-recipe',
    type: 'spotlight',
    target: '[data-tutorial="recipe-btn-coke"]',
    position: 'left',
    title: 'Open Coke Recipe Builder',
    description: 'Coke already exists as an item — now give it a recipe.',
    instruction: 'Click the flask icon (🧪) on the Coke row',
  },
  {
    id: 'build-recipe',
    type: 'corner',
    title: 'Build the Coke Recipe',
    description: 'Add these 3 source ingredients using the + button:',
    bullets: [
      'Sparkling Water → 5 Gal Keg, qty 1',
      'Bottle → 1L Bottle, qty 24',
      'Coke Powder → 500g Bag, qty 1',
    ],
    instruction: 'Set output Form Factor and qty, give your recipe a name, then click Save Recipe',
  },
  {
    id: 'switch-to-catalog',
    type: 'spotlight',
    target: '[data-tutorial="mode-catalog"]',
    position: 'bottom',
    title: 'Switch to Catalog',
    description: 'Recipe saved! Now produce Coke from the Catalog view.',
    instruction: 'Click "Catalog"',
  },
  {
    id: 'select-beverages-catalog',
    type: 'spotlight',
    target: '[data-tutorial="sidebar-beverages"]',
    position: 'right',
    title: 'Select Beverages',
    description: 'Navigate to Beverages in the Catalog.',
    instruction: 'Click "Beverages"',
  },
  {
    id: 'produce-coke',
    type: 'spotlight',
    target: '[data-tutorial="produce-btn-coke"]',
    position: 'top',
    title: '🏭 Produce Coke!',
    description: 'Everything is set up. Manufacture your first Coke batch!',
    instruction: 'Click "▶ Produce" on the Coke row',
  },
  {
    id: 'confirm-production',
    type: 'corner',
    title: 'Configure the Production Run',
    description: 'Set up your production run:',
    bullets: [
      'Select a source warehouse for each ingredient',
      'Set Destination Warehouse to "Coke Production Floor"',
      'Set multiplier (×1 is fine for testing)',
    ],
    instruction: 'Click "Confirm Produce" to finalize',
  },
  {
    id: 'completion',
    type: 'completion',
    title: 'You did it!',
    description: "You've mastered the full Nanolumi IMS workflow:",
    bullets: [
      '✅ Created the Coke Production Floor location',
      '✅ Added Gram as a unit of measure',
      '✅ Added Coke Powder as a new ingredient',
      '✅ Created its form factor (500g Bag)',
      '✅ Defined attribute schema (Carbonation Amount + Expiry Date)',
      '✅ Built a 3-ingredient recipe for Coke',
      '✅ Ran your first production batch!',
    ],
  },
];

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

// ─── Main Tutorial component ─────────────────────────────────────────
export default function Tutorial({ stepIndex, onNext, onSkip }) {
  const [targetRect, setTargetRect] = useState(null);
  const rafRef = useRef(null);

  const step = TUTORIAL_STEPS[stepIndex];

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

  const totalActionSteps = TUTORIAL_STEPS.length - 2; // exclude welcome + completion

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

  // ── Completion modal ──
  if (step.type === 'completion') {
    return (
      <>
        <Confetti />
        <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9997, backgroundColor: 'rgba(0,0,0,0.6)' }}>
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
        </div>
      </>
    );
  }

  // ── Spotlight / corner tooltip ──
  const isCorner = step.type === 'corner';
  const tooltipPos = isCorner || !targetRect
    ? { bottom: 24, right: 24 }
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
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs" style={{ color: '#CBD5E1' }}>
              Step {stepIndex} of {totalActionSteps}
            </span>
            <button
              className="text-xs cursor-pointer transition-colors hover:text-slate-500"
              style={{ color: '#CBD5E1' }}
              onClick={onSkip}
            >
              Skip tutorial
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

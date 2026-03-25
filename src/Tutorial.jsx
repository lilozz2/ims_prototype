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
    id: 'select-and-move',
    type: 'spotlight',
    target: '[data-tutorial="lot-area-powder-bag"]',
    position: 'top',
    title: 'Select Lots & Batch Move',
    description: 'Use the checkboxes to select the powder lots. The Batch Actions button will appear in the header — click it, then choose Move.',
    instruction: 'Select lots → Batch Actions → Move',
  },
  // 8
  {
    id: 'move-to-uskun',
    type: 'corner',
    title: 'Move to Uskun Warehouse',
    description: 'Select Uskun Warehouse as the destination and confirm.',
    instruction: 'Set the destination to Uskun Warehouse and click Move Lots',
  },
  // 9
  {
    id: 'navigate-to-finished-goods',
    type: 'spotlight',
    target: '[data-tutorial="sidebar-finished-goods"]',
    position: 'right',
    title: 'Go to Finished Goods',
    description: 'Now navigate to Finished Goods to work with Marker Solution.',
    instruction: 'Click "Finished Goods" in the sidebar',
  },
  // 10
  {
    id: 'create-production-recipe',
    type: 'spotlight',
    target: '[data-tutorial="recipe-btn-marker-200L"]',
    position: 'bottom',
    title: 'Create a Production Recipe',
    description: 'Marker Solution (200L Drum) is manufactured from powder and solvent. Click Create Recipe to define the formula.',
    instruction: 'Click "Create Recipe" on the Marker Solution (200L drum) row',
  },
  // 11
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
  // 12
  {
    id: 'produce-marker',
    type: 'spotlight',
    target: '[data-tutorial="produce-btn-marker-200L"]',
    position: 'bottom',
    title: 'Produce Marker Solution',
    description: 'Your recipe is saved. Click Produce to start a production run for Marker Solution.',
    instruction: 'Click "Produce" on the Marker Solution (200L drum) row',
  },
  // 13
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
  // 14
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
  // 15
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
  // 16
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
  // 17
  {
    id: 'fill-and-produce',
    type: 'corner',
    title: 'Fill in and Produce',
    description: 'Select source lots for each ingredient, add destination lots, and confirm the production run.',
    instruction: 'Fill in the form and click Produce',
  },
  // 18
  {
    id: 'create-drawdown-recipe',
    type: 'spotlight',
    target: '[data-tutorial="drawdown-btn-marker-5L"]',
    position: 'bottom',
    title: 'Create a Draw Down Recipe',
    description: 'Marker Solution (5L Jerrycan) is drawn down from 200L Drums. Click Create Drawdown to define the ratio.',
    instruction: 'Click "Create Drawdown" on the Marker Solution (5L Jerry can) row',
  },
  // 19
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
  // 20
  {
    id: 'execute-drawdown',
    type: 'spotlight',
    target: '[data-tutorial="drawdown-execute-btn-marker-5L"]',
    position: 'bottom',
    title: 'Draw Down',
    description: 'Your draw-down recipe is ready. Click Draw Down to fill 5L Jerry cans from the 200L drum stock.',
    instruction: 'Click "Draw Down" on the Marker Solution (5L Jerry can) row',
  },
  // 21
  {
    id: 'fill-and-drawdown',
    type: 'corner',
    title: 'Fill in and Draw Down',
    description: 'Select a 200L drum source lot, add destination jerrycan lots, and confirm.',
    instruction: 'Fill in the form and click Draw Down',
  },
  // 22
  {
    id: 'view-history',
    type: 'corner',
    title: 'View Transaction History',
    description: 'Click on any lot card to see its full transaction history — purchases, productions, draw-downs, and moves are all recorded here.',
    instruction: 'Click any lot card to open its history',
  },
  // 23
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
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs" style={{ color: '#CBD5E1' }}>
              Step {stepIndex} of {totalActionSteps}
            </span>
            <div className="flex items-center gap-2">
              <button
                className="text-xs cursor-pointer transition-colors hover:text-slate-500"
                style={{ color: '#CBD5E1' }}
                onClick={onSkip}
              >
                Skip tutorial
              </button>
              {step.showNext && (
                <button
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold cursor-pointer hover:opacity-90"
                  style={{ backgroundColor: '#6366F1', color: '#fff' }}
                  onClick={onNext}
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, ArrowRight, Check } from 'lucide-react';

// ── Source Node Popover ───────────────────────────────────────────

function SourceNodePopover({ node, data, onSave, onClose }) {
  const [itemId, setItemId] = useState(node?.itemId || '');
  const [formFactor, setFormFactor] = useState(node?.formFactor || '');
  const [qty, setQty] = useState(node?.qty || 1);
  const popoverRef = useRef(null);

  // Build flat list of all items
  const allItems = [];
  for (const cat of data.categories) {
    for (const item of cat.items) {
      allItems.push({ ...item, categoryId: cat.id, categoryName: cat.name });
    }
  }

  const selectedItem = allItems.find(i => i.id === itemId);

  useEffect(() => {
    if (popoverRef.current) {
      const firstInput = popoverRef.current.querySelector('select, input');
      if (firstInput) firstInput.focus();
    }
  }, []);

  const handleItemChange = (newItemId) => {
    setItemId(newItemId);
    setFormFactor('');
  };

  const handleSave = () => {
    if (!itemId || !formFactor || qty < 1) return;
    onSave({
      id: node?.id || 'n-' + Date.now().toString(36),
      itemId,
      formFactor,
      qty: parseFloat(qty),
    });
  };

  return (
    <div
      ref={popoverRef}
      className="absolute z-50 bg-white rounded-xl border border-slate-200 shadow-xl p-4 w-72"
      style={{ top: '100%', left: 0, marginTop: '4px' }}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#6366F1' }}>
          {node?.id ? 'Edit Source' : 'Add Source'}
        </p>
        <button
          className="cursor-pointer hover:opacity-70 transition-opacity"
          onClick={onClose}
          aria-label="Close popover"
        >
          <X size={14} style={{ color: '#94A3B8' }} />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#64748B' }}>Item</label>
          <select
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-200"
            style={{ borderColor: '#E2E8F0' }}
            value={itemId}
            onChange={e => handleItemChange(e.target.value)}
          >
            <option value="">Select item...</option>
            {data.categories.map(cat => (
              <optgroup key={cat.id} label={cat.name}>
                {cat.items.map(item => (
                  <option key={item.id} value={item.id}>{item.name} ({item.sku})</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#64748B' }}>Form Factor</label>
          <select
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-200"
            style={{ borderColor: '#E2E8F0' }}
            value={formFactor}
            onChange={e => setFormFactor(e.target.value)}
            disabled={!selectedItem}
          >
            <option value="">Select form factor...</option>
            {selectedItem?.formFactors.map(ff => (
              <option key={ff} value={ff}>{ff}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#64748B' }}>Quantity</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              style={{ borderColor: '#E2E8F0' }}
              value={qty}
              onChange={e => setQty(e.target.value)}
              min="0"
              step="any"
            />
            {selectedItem && data.uom.find(u => u.id === selectedItem.uomId)?.symbol && (
              <span className="text-xs flex-shrink-0" style={{ color: '#94A3B8' }}>
                {data.uom.find(u => u.id === selectedItem.uomId).symbol}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            className="flex-1 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 hover:opacity-90"
            style={{ backgroundColor: '#6366F1', color: '#fff' }}
            onClick={handleSave}
            disabled={!itemId || !formFactor || !qty}
          >
            <Check size={14} className="inline mr-1" />
            Save
          </button>
          <button
            className="px-3 py-2 rounded-lg text-sm cursor-pointer transition-all duration-150 hover:bg-slate-100"
            style={{ color: '#64748B' }}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Destination Node Popover (output only — item is pre-fixed) ─────

function DestNodePopover({ node, item, data, onSave, onClose }) {
  const [formFactor, setFormFactor] = useState(node?.formFactor || '');
  const [qty, setQty] = useState(node?.qty || 1);
  const popoverRef = useRef(null);

  useEffect(() => {
    if (popoverRef.current) {
      const firstInput = popoverRef.current.querySelector('select, input');
      if (firstInput) firstInput.focus();
    }
  }, []);

  const handleSave = () => {
    if (qty < 1) return;
    onSave({
      formFactor,
      qty: parseFloat(qty),
    });
  };

  return (
    <div
      ref={popoverRef}
      className="absolute z-50 bg-white rounded-xl border border-slate-200 shadow-xl p-4 w-64"
      style={{ top: '100%', left: 0, marginTop: '4px' }}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#6366F1' }}>
          Edit Output
        </p>
        <button
          className="cursor-pointer hover:opacity-70 transition-opacity"
          onClick={onClose}
          aria-label="Close popover"
        >
          <X size={14} style={{ color: '#94A3B8' }} />
        </button>
      </div>

      <div className="space-y-3">
        {/* Item is pre-fixed — read-only display */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#64748B' }}>Item (fixed)</label>
          <div
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC', color: '#94A3B8' }}
          >
            {item.name} ({item.sku})
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#64748B' }}>Form Factor (fixed)</label>
          <div
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC', color: '#94A3B8' }}
          >
            {formFactor}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#64748B' }}>Quantity</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              style={{ borderColor: '#E2E8F0' }}
              value={qty}
              onChange={e => setQty(e.target.value)}
              min="0"
              step="any"
            />
            {data.uom.find(u => u.id === item?.uomId)?.symbol && (
              <span className="text-xs flex-shrink-0" style={{ color: '#94A3B8' }}>
                {data.uom.find(u => u.id === item?.uomId).symbol}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            className="flex-1 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 hover:opacity-90"
            style={{ backgroundColor: '#6366F1', color: '#fff' }}
            onClick={handleSave}
            disabled={!qty}
          >
            <Check size={14} className="inline mr-1" />
            Save
          </button>
          <button
            className="px-3 py-2 rounded-lg text-sm cursor-pointer transition-all duration-150 hover:bg-slate-100"
            style={{ color: '#64748B' }}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Source Node Card ──────────────────────────────────────────────

function SourceNodeCard({ node, data, onEdit, onDelete }) {
  const [showPopover, setShowPopover] = useState(false);

  const getItemName = (itemId) => {
    for (const cat of data.categories) {
      const item = cat.items.find(i => i.id === itemId);
      if (item) return item.name;
    }
    return itemId;
  };

  const getUomSymbol = (itemId) => {
    for (const cat of data.categories) {
      const item = cat.items.find(i => i.id === itemId);
      if (item) return data.uom.find(u => u.id === item.uomId)?.symbol || '';
    }
    return '';
  };

  return (
    <div className="relative">
      <div
        className="bg-white rounded-xl border border-slate-200 p-4 hover:border-indigo-200 transition-all duration-150"
        style={{ minWidth: '180px' }}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: '#1E1B4B' }}>
              {getItemName(node.itemId)}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{node.formFactor}</p>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button
              className="p-1 rounded cursor-pointer hover:bg-indigo-50 transition-colors"
              style={{ color: '#6366F1' }}
              onClick={() => setShowPopover(v => !v)}
              aria-label="Edit node"
            >
              <Pencil size={12} />
            </button>
            <button
              className="p-1 rounded cursor-pointer hover:bg-red-50 transition-colors"
              style={{ color: '#EF4444' }}
              onClick={onDelete}
              aria-label="Delete node"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
        <div className="text-sm font-semibold" style={{ color: '#6366F1' }}>
          {node.qty.toLocaleString()}{getUomSymbol(node.itemId) ? ` ${getUomSymbol(node.itemId)}` : ''}
        </div>
      </div>

      {showPopover && (
        <SourceNodePopover
          node={node}
          data={data}
          onSave={(updated) => { onEdit(updated); setShowPopover(false); }}
          onClose={() => setShowPopover(false)}
        />
      )}
    </div>
  );
}

// ── Add Source Node Card ──────────────────────────────────────────

function AddSourceNodeCard({ data, onAdd }) {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <div className="relative">
      <button
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-150 hover:border-indigo-400 hover:bg-indigo-50"
        style={{ borderColor: '#C7D2FE', color: '#6366F1' }}
        onClick={() => setShowPopover(v => !v)}
      >
        <Plus size={14} />
        <span className="text-sm font-medium">Add Source</span>
      </button>
      {showPopover && (
        <SourceNodePopover
          node={null}
          data={data}
          onSave={(node) => { onAdd(node); setShowPopover(false); }}
          onClose={() => setShowPopover(false)}
        />
      )}
    </div>
  );
}

// ── Destination Node Card (pre-fixed to item) ─────────────────────

function DestinationCard({ output, item, data, onEdit }) {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <div className="relative">
      {output ? (
        <div
          className="bg-white rounded-xl border border-slate-200 p-4 hover:border-indigo-200 transition-all duration-150"
          style={{ minWidth: '180px' }}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: '#1E1B4B' }}>
                {item.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{output.formFactor}</p>
            </div>
            <button
              className="p-1 rounded cursor-pointer hover:bg-indigo-50 transition-colors flex-shrink-0"
              style={{ color: '#6366F1' }}
              onClick={() => setShowPopover(v => !v)}
              aria-label="Edit output"
            >
              <Pencil size={12} />
            </button>
          </div>
          <div className="text-sm font-semibold" style={{ color: '#6366F1' }}>
            {output.qty.toLocaleString()}{data.uom.find(u => u.id === item?.uomId)?.symbol ? ` ${data.uom.find(u => u.id === item?.uomId).symbol}` : ''}
          </div>
        </div>
      ) : (
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-150 hover:border-indigo-400 hover:bg-indigo-50"
          style={{ borderColor: '#C7D2FE', color: '#6366F1' }}
          onClick={() => setShowPopover(v => !v)}
        >
          <Plus size={14} />
          <span className="text-sm font-medium">Set Output</span>
        </button>
      )}

      {showPopover && (
        <DestNodePopover
          node={output}
          item={item}
          data={data}
          onSave={(updated) => { onEdit(updated); setShowPopover(false); }}
          onClose={() => setShowPopover(false)}
        />
      )}
    </div>
  );
}

// ── RecipeBuilder (main) ──────────────────────────────────────────

export default function RecipeBuilder({ item, initialRecipes, outputFormFactor, data, onSave, onClose }) {
  const makeBlankRecipe = () => ({
    id: 'r-' + Date.now().toString(36),
    name: item.name + ' recipe',
    sources: [],
    output: outputFormFactor ? { formFactor: outputFormFactor, qty: 1 } : null,
  });

  const [recipes, setRecipes] = useState(() =>
    initialRecipes && initialRecipes.length > 0 ? initialRecipes : [makeBlankRecipe()]
  );
  const [activeIdx, setActiveIdx] = useState(0);

  const activeRecipe = recipes[activeIdx];
  const sources = activeRecipe.sources;
  const output = activeRecipe.output;

  const updateActive = (patch) =>
    setRecipes(prev => prev.map((r, i) => i === activeIdx ? { ...r, ...patch } : r));

  const canSave = sources.length >= 1 && output !== null;

  const handleAddSource = (node) => updateActive({ sources: [...sources, node] });
  const handleEditSource = (updated) => updateActive({ sources: sources.map(n => n.id === updated.id ? updated : n) });
  const handleDeleteSource = (id) => updateActive({ sources: sources.filter(n => n.id !== id) });
  const handleSetOutput = (newOutput) => updateActive({ output: newOutput });
  const handleNameChange = (name) => updateActive({ name });

  const handleAddRecipe = () => {
    const newR = makeBlankRecipe();
    newR.name = 'New Recipe';
    setRecipes(prev => [...prev, newR]);
    setActiveIdx(recipes.length);
  };

  const handleSave = () => {
    if (!canSave) return;
    onSave(recipes);
  };

  const sourcesCount = sources.length;
  const canTransform = sourcesCount >= 1 && output !== null;

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col"
      style={{ backgroundColor: '#F5F3FF' }}
    >
      {/* Header */}
      <header
        className="bg-white border-b border-slate-200 px-6 flex items-center justify-between h-14 flex-shrink-0 z-20"
        style={{ boxShadow: '0 1px 3px rgba(99,102,241,0.08)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="inline-flex items-center gap-1.5 text-sm cursor-pointer hover:opacity-70 transition-opacity flex-shrink-0"
            style={{ color: '#64748B' }}
            onClick={onClose}
          >
            ← Back
          </button>
          <span className="text-slate-300 flex-shrink-0">|</span>
          {/* Recipe selector */}
          <select
            className="px-2 py-1 rounded-lg border text-sm outline-none transition-all duration-150 cursor-pointer"
            style={{ borderColor: '#E2E8F0', color: '#1E1B4B', maxWidth: '160px' }}
            value={activeIdx}
            onChange={e => setActiveIdx(Number(e.target.value))}
            onFocus={e => { e.target.style.borderColor = '#6366F1'; }}
            onBlur={e => { e.target.style.borderColor = '#E2E8F0'; }}
          >
            {recipes.map((r, i) => (
              <option key={r.id} value={i}>{r.name}</option>
            ))}
          </select>
          {/* Editable name */}
          <input
            type="text"
            className="px-2 py-1 rounded-lg border text-sm outline-none transition-all duration-150"
            style={{ borderColor: '#E2E8F0', color: '#1E1B4B', maxWidth: '180px' }}
            value={activeRecipe.name}
            onChange={e => handleNameChange(e.target.value)}
            onFocus={e => { e.target.style.borderColor = '#6366F1'; }}
            onBlur={e => { e.target.style.borderColor = '#E2E8F0'; }}
            placeholder="Recipe name"
          />
          {/* Add new recipe */}
          <button
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border text-sm cursor-pointer hover:bg-indigo-50 transition-colors flex-shrink-0"
            style={{ borderColor: '#C7D2FE', color: '#6366F1' }}
            onClick={handleAddRecipe}
          >
            <Plus size={13} />
            New Recipe
          </button>
        </div>
        <button
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ml-4"
          style={{ backgroundColor: '#6366F1', color: '#fff' }}
          onClick={handleSave}
          disabled={!canSave}
        >
          <Check size={14} />
          Save Recipe
        </button>
      </header>

      {/* Canvas */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Sources column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10B981' }} />
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#64748B' }}>
                Sources
              </h2>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium ml-auto"
                style={{ backgroundColor: '#DCFCE7', color: '#10B981' }}
              >
                {sourcesCount}
              </span>
            </div>
            <div className="space-y-3">
              {sources.map(node => (
                <SourceNodeCard
                  key={node.id}
                  node={node}
                  data={data}
                  onEdit={handleEditSource}
                  onDelete={() => handleDeleteSource(node.id)}
                />
              ))}
              <AddSourceNodeCard data={data} onAdd={handleAddSource} />
            </div>
          </div>

          {/* Transform column */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2 w-full justify-center mb-2">
              <div className="flex-1 h-px" style={{ backgroundColor: '#E2E8F0' }} />
              <ArrowRight size={20} style={{ color: '#CBD5E1' }} />
              <div className="flex-1 h-px" style={{ backgroundColor: '#E2E8F0' }} />
            </div>

            <div
              className="rounded-xl border-2 p-4 text-center w-full transition-all duration-150"
              style={
                canTransform
                  ? { borderColor: '#6366F1', backgroundColor: '#EEF2FF' }
                  : { borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }
              }
            >
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: canTransform ? '#6366F1' : '#CBD5E1' }}
              >
                Transform
              </div>
              <p className="text-xs" style={{ color: canTransform ? '#818CF8' : '#94A3B8' }}>
                {canTransform
                  ? `${sourcesCount} source${sourcesCount > 1 ? 's' : ''} → 1 output`
                  : 'Add at least 1 source and set output'
                }
              </p>
            </div>
          </div>

          {/* Destination column (fixed to item) */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6366F1' }} />
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#64748B' }}>
                Output
              </h2>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium ml-auto"
                style={{
                  backgroundColor: output ? '#EEF2FF' : '#F1F5F9',
                  color: output ? '#6366F1' : '#94A3B8',
                }}
              >
                {item?.name}
              </span>
            </div>
            <DestinationCard
              output={output}
              item={item}
              data={data}
              onEdit={handleSetOutput}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="mt-10 max-w-4xl mx-auto flex items-center gap-6 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10B981' }} />
            <span className="text-xs" style={{ color: '#64748B' }}>Sources ({sourcesCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6366F1' }} />
            <span className="text-xs" style={{ color: '#64748B' }}>Output (fixed to {item?.name})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

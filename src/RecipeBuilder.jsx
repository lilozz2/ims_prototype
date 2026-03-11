import React, { useState, useRef, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, ArrowRight, ChevronLeft, Check } from 'lucide-react';

// ── Node Popover ──────────────────────────────────────────────────

function NodePopover({ node, data, onSave, onClose }) {
  const [itemId, setItemId] = useState(node?.itemId || '');
  const [categoryId, setCategoryId] = useState(node?.categoryId || '');
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
  const selectedCategory = selectedItem
    ? data.categories.find(c => c.id === selectedItem.categoryId)
    : null;

  useEffect(() => {
    if (popoverRef.current) {
      const firstInput = popoverRef.current.querySelector('select, input');
      if (firstInput) firstInput.focus();
    }
  }, []);

  const handleItemChange = (newItemId) => {
    const item = allItems.find(i => i.id === newItemId);
    setItemId(newItemId);
    setCategoryId(item ? item.categoryId : '');
    setFormFactor('');
  };

  const handleSave = () => {
    if (!itemId || !formFactor || qty < 1) return;
    onSave({
      id: node?.id || 'n-' + Date.now().toString(36),
      itemId,
      categoryId: selectedItem?.categoryId || categoryId,
      formFactor,
      qty: parseInt(qty, 10),
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
          {node?.id ? 'Edit Node' : 'Add Node'}
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
            disabled={!selectedCategory}
          >
            <option value="">Select form factor...</option>
            {selectedCategory?.formFactors.map(ff => (
              <option key={ff} value={ff}>{ff}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#64748B' }}>Quantity</label>
          <input
            type="number"
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-200"
            style={{ borderColor: '#E2E8F0' }}
            value={qty}
            onChange={e => setQty(e.target.value)}
            min="1"
            step="1"
          />
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

// ── Node Card ─────────────────────────────────────────────────────

function NodeCard({ node, data, onEdit, onDelete }) {
  const [showPopover, setShowPopover] = useState(false);

  const getItemName = (itemId) => {
    for (const cat of data.categories) {
      const item = cat.items.find(i => i.id === itemId);
      if (item) return item.name;
    }
    return itemId;
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
        <div
          className="text-sm font-semibold"
          style={{ color: '#6366F1' }}
        >
          ×{node.qty.toLocaleString()}
        </div>
      </div>

      {showPopover && (
        <NodePopover
          node={node}
          data={data}
          onSave={(updated) => { onEdit(updated); setShowPopover(false); }}
          onClose={() => setShowPopover(false)}
        />
      )}
    </div>
  );
}

// ── AddNodeCard ───────────────────────────────────────────────────

function AddNodeCard({ data, onAdd, label }) {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <div className="relative">
      <button
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-150 hover:border-indigo-400 hover:bg-indigo-50"
        style={{ borderColor: '#C7D2FE', color: '#6366F1' }}
        onClick={() => setShowPopover(v => !v)}
      >
        <Plus size={14} />
        <span className="text-sm font-medium">{label}</span>
      </button>
      {showPopover && (
        <NodePopover
          node={null}
          data={data}
          onSave={(node) => { onAdd(node); setShowPopover(false); }}
          onClose={() => setShowPopover(false)}
        />
      )}
    </div>
  );
}

// ── RecipeBuilder (main) ──────────────────────────────────────────

export default function RecipeBuilder({ recipe: initialRecipe, data, onSave, onClose }) {
  const [name, setName] = useState(initialRecipe.name || '');
  const [sources, setSources] = useState(initialRecipe.sources || []);
  const [destinations, setDestinations] = useState(initialRecipe.destinations || []);

  const canTransform = sources.length >= 1 && destinations.length >= 1;

  const handleAddSource = (node) => {
    setSources(prev => [...prev, node]);
  };

  const handleEditSource = (updated) => {
    setSources(prev => prev.map(n => n.id === updated.id ? updated : n));
  };

  const handleDeleteSource = (id) => {
    setSources(prev => prev.filter(n => n.id !== id));
  };

  const handleAddDest = (node) => {
    setDestinations(prev => [...prev, node]);
  };

  const handleEditDest = (updated) => {
    setDestinations(prev => prev.map(n => n.id === updated.id ? updated : n));
  };

  const handleDeleteDest = (id) => {
    setDestinations(prev => prev.filter(n => n.id !== id));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const recipeToSave = {
      id: initialRecipe.id || 'r-' + Date.now().toString(36),
      name: name.trim(),
      sources,
      destinations,
    };
    onSave(recipeToSave);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F3FF' }}>
      {/* Header */}
      <header
        className="sticky top-0 bg-white border-b border-slate-200 px-6 flex items-center justify-between h-14 z-20"
      >
        <div className="flex items-center gap-3">
          <button
            className="inline-flex items-center gap-1.5 text-sm cursor-pointer hover:opacity-70 transition-opacity"
            style={{ color: '#64748B' }}
            onClick={onClose}
          >
            <ChevronLeft size={16} />
            Back
          </button>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="text-lg font-semibold outline-none bg-transparent border-b-2 transition-all duration-150 focus:border-indigo-400"
              style={{ color: '#1E1B4B', borderBottomColor: name ? 'transparent' : '#E2E8F0', minWidth: '200px' }}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Recipe name..."
              onFocus={e => e.target.style.borderBottomColor = '#6366F1'}
              onBlur={e => e.target.style.borderBottomColor = name ? 'transparent' : '#E2E8F0'}
            />
          </div>
        </div>
        <button
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#6366F1', color: '#fff' }}
          onClick={handleSave}
          disabled={!name.trim()}
        >
          <Check size={14} />
          Save Recipe
        </button>
      </header>

      {/* Canvas */}
      <div className="p-8">
        <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Sources column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#10B981' }}
              />
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#64748B' }}>
                Sources
              </h2>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium ml-auto"
                style={{ backgroundColor: '#DCFCE7', color: '#10B981' }}
              >
                {sources.length}
              </span>
            </div>
            <div className="space-y-3">
              {sources.map(node => (
                <NodeCard
                  key={node.id}
                  node={node}
                  data={data}
                  onEdit={handleEditSource}
                  onDelete={() => handleDeleteSource(node.id)}
                />
              ))}
              <AddNodeCard data={data} onAdd={handleAddSource} label="Add Source" />
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
                  ? `${sources.length} source${sources.length > 1 ? 's' : ''} → ${destinations.length} output${destinations.length > 1 ? 's' : ''}`
                  : 'Add at least 1 source and 1 destination'
                }
              </p>
            </div>
          </div>

          {/* Destinations column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#6366F1' }}
              />
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#64748B' }}>
                Destinations
              </h2>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium ml-auto"
                style={{ backgroundColor: '#EEF2FF', color: '#6366F1' }}
              >
                {destinations.length}
              </span>
            </div>
            <div className="space-y-3">
              {destinations.map(node => (
                <NodeCard
                  key={node.id}
                  node={node}
                  data={data}
                  onEdit={handleEditDest}
                  onDelete={() => handleDeleteDest(node.id)}
                />
              ))}
              <AddNodeCard data={data} onAdd={handleAddDest} label="Add Destination" />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-10 max-w-4xl mx-auto flex items-center gap-6 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10B981' }} />
            <span className="text-xs" style={{ color: '#64748B' }}>Sources ({sources.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6366F1' }} />
            <span className="text-xs" style={{ color: '#64748B' }}>Destinations ({destinations.length})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Plus, Trash2, Pencil, Package, ArrowRight, FlaskConical } from 'lucide-react';

// ── Units of Measure ──────────────────────────────────────────────

export function UomSection({ uom, onUpdate }) {
  const [adding, setAdding] = useState(false);
  const [newUnit, setNewUnit] = useState({ name: '', symbol: '', type: 'volume' });

  const handleSave = () => {
    if (!newUnit.name || !newUnit.symbol) return;
    const unit = { id: newUnit.symbol.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(), ...newUnit };
    onUpdate.addUom({ uom: unit });
    setAdding(false);
    setNewUnit({ name: '', symbol: '', type: 'volume' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: '#1E1B4B' }}>Units of Measure</h2>
          <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>Define measurement units used across the system</p>
        </div>
        <button
          data-tutorial="add-uom-btn"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 hover:opacity-90"
          style={{ backgroundColor: '#6366F1', color: '#fff' }}
          onClick={() => setAdding(true)}
        >
          <Plus size={14} />
          Add Unit
        </button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Unit Name</th>
                <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Symbol</th>
                <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Type</th>
              </tr>
            </thead>
            <tbody>
              {uom.map(u => (
                <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors duration-150">
                  <td className="py-3 px-4 text-sm font-medium" style={{ color: '#1E1B4B' }}>{u.name}</td>
                  <td className="py-3 px-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: '#F1F5F9', color: '#4F46E5' }}>
                      {u.symbol}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                      style={{
                        backgroundColor: u.type === 'volume' ? '#EFF6FF' : '#F0FDF4',
                        color: u.type === 'volume' ? '#3B82F6' : '#10B981',
                      }}
                    >
                      {u.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                      <button
                        className="p-1.5 rounded-md cursor-pointer transition-colors hover:bg-red-50"
                        style={{ color: '#EF4444' }}
                        onClick={() => onUpdate.deleteUom({ uomId: u.id })}
                        aria-label="Delete unit"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {adding && (
          <div data-tutorial="uom-inline-form" className="p-4 border-b border-slate-200 bg-indigo-50">
            <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: '#6366F1' }}>New Unit</p>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs font-medium mb-1" style={{ color: '#64748B' }}>Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#E2E8F0' }}
                  placeholder="e.g. Gram"
                  value={newUnit.name}
                  onChange={e => setNewUnit(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="w-28">
                <label className="block text-xs font-medium mb-1" style={{ color: '#64748B' }}>Symbol</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#E2E8F0' }}
                  placeholder="e.g. g"
                  value={newUnit.symbol}
                  onChange={e => setNewUnit(p => ({ ...p, symbol: e.target.value }))}
                />
              </div>
              <div className="w-32">
                <label className="block text-xs font-medium mb-1" style={{ color: '#64748B' }}>Type</label>
                <select
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#E2E8F0' }}
                  value={newUnit.type}
                  onChange={e => setNewUnit(p => ({ ...p, type: e.target.value }))}
                >
                  <option value="volume">volume</option>
                  <option value="weight">weight</option>
                </select>
              </div>
              <div className="flex items-end gap-2 mt-5">
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 hover:opacity-90"
                  style={{ backgroundColor: '#6366F1', color: '#fff' }}
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="px-3 py-2 rounded-lg text-sm cursor-pointer transition-all duration-150 hover:bg-slate-100"
                  style={{ color: '#64748B' }}
                  onClick={() => { setAdding(false); setNewUnit({ name: '', symbol: '', type: 'volume' }); }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── UoM Conversions ───────────────────────────────────────────────

export function UomConversionsSection({ uom, conversions, onUpdate }) {
  const [adding, setAdding] = useState(false);
  const [newConv, setNewConv] = useState({ fromId: '', toId: '', factor: '' });

  const getSymbol = (id) => {
    const u = uom.find(u => u.id === id);
    return u ? u.symbol : id;
  };

  const getName = (id) => {
    const u = uom.find(u => u.id === id);
    return u ? u.name : id;
  };

  const handleAdd = () => {
    if (!newConv.fromId || !newConv.toId || !newConv.factor) return;
    const conv = {
      id: 'conv-' + Date.now().toString(36),
      fromId: newConv.fromId,
      toId: newConv.toId,
      factor: parseFloat(newConv.factor),
    };
    onUpdate.addConversion({ conversion: conv });
    setAdding(false);
    setNewConv({ fromId: '', toId: '', factor: '' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: '#1E1B4B' }}>UoM Conversions</h2>
          <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>Define conversion factors between units</p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 hover:opacity-90"
          style={{ backgroundColor: '#6366F1', color: '#fff' }}
          onClick={() => setAdding(true)}
        >
          <Plus size={14} />
          Add Conversion
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {adding && (
          <div className="p-4 border-b border-slate-200 bg-indigo-50">
            <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: '#6366F1' }}>New Conversion</p>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs font-medium mb-1" style={{ color: '#64748B' }}>From</label>
                <select
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#E2E8F0' }}
                  value={newConv.fromId}
                  onChange={e => setNewConv(p => ({ ...p, fromId: e.target.value }))}
                >
                  <option value="">Select unit</option>
                  {uom.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
                  ))}
                </select>
              </div>
              <ArrowRight size={16} className="mt-5 flex-shrink-0" style={{ color: '#94A3B8' }} />
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs font-medium mb-1" style={{ color: '#64748B' }}>To</label>
                <select
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#E2E8F0' }}
                  value={newConv.toId}
                  onChange={e => setNewConv(p => ({ ...p, toId: e.target.value }))}
                >
                  <option value="">Select unit</option>
                  {uom.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
                  ))}
                </select>
              </div>
              <div className="w-28">
                <label className="block text-xs font-medium mb-1" style={{ color: '#64748B' }}>Factor</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#E2E8F0' }}
                  placeholder="e.g. 128"
                  value={newConv.factor}
                  onChange={e => setNewConv(p => ({ ...p, factor: e.target.value }))}
                  step="any"
                  min="0"
                />
              </div>
              <div className="flex items-end gap-2 mt-5">
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 hover:opacity-90"
                  style={{ backgroundColor: '#6366F1', color: '#fff' }}
                  onClick={handleAdd}
                >
                  Save
                </button>
                <button
                  className="px-3 py-2 rounded-lg text-sm cursor-pointer transition-all duration-150 hover:bg-slate-100"
                  style={{ color: '#64748B' }}
                  onClick={() => { setAdding(false); setNewConv({ fromId: '', toId: '', factor: '' }); }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {conversions.length === 0 && !adding ? (
          <div className="flex flex-col items-center justify-center py-12 px-6" style={{ color: '#64748B' }}>
            <ArrowRight size={36} className="mb-3 opacity-30" />
            <p className="text-base font-medium mb-1" style={{ color: '#1E1B4B' }}>No conversions defined</p>
            <p className="text-sm text-center">Add conversion factors between units of measure.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>From</th>
                  <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>To</th>
                  <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Factor</th>
                  <th className="py-3 px-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {conversions.map(conv => (
                  <tr key={conv.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors duration-150">
                    <td className="py-3 px-4 text-sm font-medium" style={{ color: '#1E1B4B' }}>
                      {getName(conv.fromId)}
                      <span className="ml-1.5 font-mono text-xs" style={{ color: '#94A3B8' }}>({getSymbol(conv.fromId)})</span>
                    </td>
                    <td className="py-3 px-3 text-sm" style={{ color: '#1E1B4B' }}>
                      {getName(conv.toId)}
                      <span className="ml-1.5 font-mono text-xs" style={{ color: '#94A3B8' }}>({getSymbol(conv.toId)})</span>
                    </td>
                    <td className="py-3 px-3 text-sm font-mono font-medium" style={{ color: '#6366F1' }}>
                      {conv.factor}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        className="p-1.5 rounded-md cursor-pointer transition-colors hover:bg-red-50"
                        style={{ color: '#EF4444' }}
                        onClick={() => onUpdate.deleteConversion({ conversionId: conv.id })}
                        aria-label="Delete conversion"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Locations ─────────────────────────────────────────────────────

export function LocationsSection({ locations, onUpdate, onOpenModal }) {
  const typeColor = {
    Warehouse: { bg: '#EFF6FF', text: '#3B82F6' },
    'Cold Storage': { bg: '#F0F9FF', text: '#0EA5E9' },
    'Distribution Centre': { bg: '#F0FDF4', text: '#10B981' },
    Other: { bg: '#F8FAFC', text: '#64748B' },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: '#1E1B4B' }}>Locations</h2>
          <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>Warehouses and storage facilities</p>
        </div>
        <button
          data-tutorial="add-location-btn"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 hover:opacity-90"
          style={{ backgroundColor: '#6366F1', color: '#fff' }}
          onClick={() => onOpenModal('addLocation', {})}
        >
          <Plus size={14} />
          Add Location
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {locations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6" style={{ color: '#64748B' }}>
            <Package size={36} className="mb-3 opacity-30" />
            <p className="text-base font-medium mb-1" style={{ color: '#1E1B4B' }}>No locations configured</p>
            <p className="text-sm text-center">Add warehouses and storage facilities to manage inventory.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Location ID</th>
                  <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Name</th>
                  <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Type</th>
                  <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Capacity</th>
                  <th className="py-3 px-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {locations.map(loc => {
                  const colors = typeColor[loc.type] || typeColor.Other;
                  return (
                    <tr key={loc.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors duration-150">
                      <td className="py-3 px-4">
                        <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}>
                          {loc.id}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-sm font-medium" style={{ color: '#1E1B4B' }}>{loc.name}</td>
                      <td className="py-3 px-3">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: colors.bg, color: colors.text }}
                        >
                          {loc.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-sm" style={{ color: '#64748B' }}>
                        {loc.capacity.toLocaleString()} units
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            className="p-1.5 rounded-md cursor-pointer transition-colors hover:bg-indigo-50"
                            style={{ color: '#6366F1' }}
                            onClick={() => onOpenModal('editLocation', { location: loc })}
                            aria-label={`Edit ${loc.name}`}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className="p-1.5 rounded-md cursor-pointer transition-colors hover:bg-red-50"
                            style={{ color: '#EF4444' }}
                            onClick={() => onUpdate.deleteLocation({ locationId: loc.id })}
                            aria-label={`Delete ${loc.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Recipes ───────────────────────────────────────────────────────

export function RecipesSection({ data, onOpenModal }) {
  // Collect all item-formfactor pairs that are To Manufacture or To Draw Down
  const pairs = [];
  for (const cat of data.categories) {
    for (const item of cat.items) {
      for (const ff of (item.formFactors || [])) {
        const ffType = item.formFactorTypes?.[ff];
        if (ffType === 'To Manufacture' || ffType === 'To Draw Down') {
          const ffRecipes = item.formFactorRecipes?.[ff];
          const hasRecipe = Array.isArray(ffRecipes) ? ffRecipes.length > 0 : !!ffRecipes;
          pairs.push({ cat, item, ff, ffType, hasRecipe });
        }
      }
    }
  }

  const typeStyle = {
    'To Manufacture': { bg: '#CCFBF1', text: '#0D9488' },
    'To Draw Down':   { bg: '#EDE9FE', text: '#8B5CF6' },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: '#1E1B4B' }}>Recipes</h2>
          <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>
            Define production and draw-down recipes for manufactured form factors
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {pairs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6" style={{ color: '#64748B' }}>
            <FlaskConical size={36} className="mb-3 opacity-30" />
            <p className="text-base font-medium mb-1" style={{ color: '#1E1B4B' }}>No manufacturable form factors</p>
            <p className="text-sm text-center">
              Assign "To Manufacture" or "To Draw Down" types to item form factors in the Catalog.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Item</th>
                  <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Form Factor</th>
                  <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Type</th>
                  <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Recipe</th>
                  <th className="py-3 px-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pairs.map(({ cat, item, ff, ffType, hasRecipe }) => {
                  const colors = typeStyle[ffType];
                  return (
                    <tr key={`${item.id}-${ff}`} className="border-t border-slate-100 hover:bg-slate-50 transition-colors duration-150">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium" style={{ color: '#1E1B4B' }}>{item.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{cat.name}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
                          {ff}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.bg, color: colors.text }}>
                          {ffType}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {hasRecipe ? (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>
                            Defined
                          </span>
                        ) : (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FEF9C3', color: '#CA8A04' }}>
                            Not set
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          data-tutorial={
                            item.id === 'marker-001' && ff === '200L drum' ? 'recipe-btn-marker-200L' :
                            item.id === 'marker-001' && ff === '5L Jerry can' ? 'drawdown-btn-marker-5L' :
                            undefined
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: colors.text, color: '#fff' }}
                          onClick={() => onOpenModal('editRecipe', { categoryId: cat.id, item, formFactor: ff })}
                        >
                          <FlaskConical size={11} />
                          {hasRecipe ? 'Edit Recipe' : 'Create Recipe'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── GlobalSettings (main) ─────────────────────────────────────────

const subSections = [
  { id: 'uom', label: 'Units of Measure' },
  { id: 'locations', label: 'Locations' },
];

export default function GlobalSettings({ data, onUpdate, onOpenModal }) {
  const [activeSection, setActiveSection] = useState('uom');

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs mb-4" style={{ color: '#64748B' }}>
        <span>Catalog Manager</span>
        <span className="opacity-40">›</span>
        <span style={{ color: '#6366F1' }}>Global Settings</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: '#1E1B4B' }}>Global Settings</h1>
          <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>System-wide configuration for units and locations</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left sub-nav */}
        <div className="w-48 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 p-2">
            {subSections.map(s => (
              <button
                key={s.id}
                className="w-full text-left px-3 py-2 rounded-lg mb-0.5 cursor-pointer text-sm transition-all duration-150"
                style={
                  activeSection === s.id
                    ? { backgroundColor: '#EEF2FF', color: '#4F46E5', fontWeight: 500 }
                    : { color: '#64748B' }
                }
                onClick={() => setActiveSection(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeSection === 'uom' && <UomSection uom={data.uom} />}
          {activeSection === 'conversions' && (
            <UomConversionsSection uom={data.uom} conversions={data.uomConversions} onUpdate={onUpdate} />
          )}
          {activeSection === 'locations' && (
            <LocationsSection locations={data.locations} onUpdate={onUpdate} onOpenModal={onOpenModal} />
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Package, Layers, Settings, BarChart3, X, FlaskConical, ChevronDown, Layers2 } from 'lucide-react';

// ── Items Tab ─────────────────────────────────────────────────────

function ItemsTab({ category, uom, onUpdate, onOpenModal }) {
  const getUomSymbol = (uomId) => {
    const u = uom?.find(u => u.id === uomId);
    return u ? u.symbol : uomId || '—';
  };
  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selected.length === category.items.length) {
      setSelected([]);
    } else {
      setSelected(category.items.map(i => i.id));
    }
  };

  const handleDeleteSelected = () => {
    onUpdate.deleteItems({ categoryId: category.id, itemIds: selected });
    setSelected([]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div />
        <button
          data-tutorial="add-item-btn"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 hover:opacity-90"
          style={{ backgroundColor: '#6366F1', color: '#fff' }}
          onClick={() => onOpenModal('addItem', { categoryId: category.id })}
        >
          <Plus size={14} />
          Add Item
        </button>
      </div>

      {/* Bulk delete bar */}
      {selected.length > 0 && (
        <div
          className="flex items-center justify-between px-4 py-2.5 rounded-lg mb-3"
          style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}
        >
          <span className="text-sm font-medium" style={{ color: '#DC2626' }}>
            {selected.length} item{selected.length > 1 ? 's' : ''} selected
          </span>
          <button
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150 hover:opacity-90"
            style={{ backgroundColor: '#DC2626', color: '#fff' }}
            onClick={handleDeleteSelected}
          >
            <Trash2 size={12} />
            Delete Selected
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {category.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6" style={{ color: '#64748B' }}>
            <Package size={40} className="mb-3 opacity-30" />
            <p className="text-base font-medium mb-1" style={{ color: '#1E1B4B' }}>No items in this category yet</p>
            <p className="text-sm text-center">Add the first item using the button above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 pl-4 pr-2 w-10">
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      checked={selected.length === category.items.length && category.items.length > 0}
                      onChange={toggleAll}
                      aria-label="Select all items"
                    />
                  </th>
                  <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>
                    Item Name
                  </th>
                  <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>
                    SKU
                  </th>
                  <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>
                    UoM
                  </th>
                  <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>
                    Form Factors
                  </th>
                  <th className="py-3 px-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {category.items.map(item => (
                  <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors duration-150">
                    <td className="py-3 pl-4 pr-2">
                      <input
                        type="checkbox"
                        className="cursor-pointer"
                        checked={selected.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        aria-label={`Select ${item.name}`}
                      />
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-sm font-semibold" style={{ color: '#1E1B4B' }}>{item.name}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}>
                        {item.sku}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-sm" style={{ color: '#64748B' }}>
                      {item.uomId ? (
                        <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ backgroundColor: '#F0FDF4', color: '#16A34A' }}>
                          {getUomSymbol(item.uomId)}
                        </span>
                      ) : <span className="italic opacity-50">—</span>}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {(item.formFactors || []).length === 0
                          ? <span className="text-sm italic opacity-50" style={{ color: '#64748B' }}>—</span>
                          : (item.formFactors || []).map(ff => (
                              <span key={ff} className="text-xs px-2 py-0.5 rounded font-medium" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
                                {ff}
                              </span>
                            ))
                        }
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="p-1.5 rounded-md cursor-pointer transition-colors hover:bg-indigo-50"
                          style={{ color: '#6366F1' }}
                          onClick={() => onOpenModal('editItem', { categoryId: category.id, item })}
                          aria-label={`Edit ${item.name}`}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors hover:bg-indigo-50"
                          style={{ color: '#6366F1' }}
                          onClick={() => onOpenModal('attachFormFactors', { categoryId: category.id, item })}
                          aria-label={`Attach form factors for ${item.name}`}
                          title="Form Factors"
                        >
                          <Layers2 size={13} />
                          <span>FF</span>
                        </button>
                        <button
                          className="p-1.5 rounded-md cursor-pointer transition-colors hover:bg-red-50"
                          style={{ color: '#EF4444' }}
                          onClick={() => onUpdate.deleteItems({ categoryId: category.id, itemIds: [item.id] })}
                          aria-label={`Delete ${item.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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

// ── Form Factors Tab ──────────────────────────────────────────────

function FormFactorsTab({ category, onUpdate }) {
  const [adding, setAdding] = useState(false);
  const [inputName, setInputName] = useState('');

  const resetForm = () => { setInputName(''); };

  const handleAdd = () => {
    const trimmed = inputName.trim();
    if (!trimmed) return;
    if (category.formFactors.some(f => f.name === trimmed)) return;
    onUpdate.updateFormFactors({
      categoryId: category.id,
      formFactors: [
        ...category.formFactors,
        { name: trimmed },
      ],
    });
    resetForm();
    setAdding(false);
  };

  const handleRemove = (ff) => {
    onUpdate.updateFormFactors({
      categoryId: category.id,
      formFactors: category.formFactors.filter(f => f.name !== ff.name),
    });
  };

  return (
    <div>
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {category.formFactors.length === 0 && !adding ? (
          <div className="flex flex-col items-center justify-center py-10" style={{ color: '#64748B' }}>
            <Layers size={36} className="mb-3 opacity-30" />
            <p className="text-base font-medium mb-1" style={{ color: '#1E1B4B' }}>No form factors defined</p>
            <p className="text-sm text-center mb-4">Form factors define the packaging types for items in this category.</p>
            <button
              data-tutorial="add-formfactor-btn"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 hover:opacity-90"
              style={{ backgroundColor: '#6366F1', color: '#fff' }}
              onClick={() => setAdding(true)}
            >
              <Plus size={14} />
              Add Form Factor
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>
                Form Factors ({category.formFactors.length})
              </p>
              <button
                data-tutorial="add-formfactor-btn"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150 hover:opacity-90"
                style={{ backgroundColor: '#6366F1', color: '#fff' }}
                onClick={() => setAdding(true)}
              >
                <Plus size={12} />
                Add Form Factor
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {category.formFactors.map(ff => (
                <div
                  key={ff.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border"
                  style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', borderColor: '#C7D2FE' }}
                >
                  {ff.name}
                  <button
                    className="cursor-pointer hover:opacity-70 transition-opacity ml-0.5"
                    onClick={() => handleRemove(ff)}
                    aria-label={`Remove ${ff.name} form factor`}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            {adding && (
              <div className="flex flex-wrap items-end gap-2 mt-2 p-3 rounded-lg border border-dashed" style={{ borderColor: '#C7D2FE', backgroundColor: '#F5F3FF' }}>
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-xs font-medium mb-1" style={{ color: '#64748B' }}>Name *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 transition-all duration-150"
                    style={{ borderColor: '#6366F1', boxShadow: '0 0 0 2px rgba(99,102,241,0.15)' }}
                    placeholder="e.g. 330ml Can"
                    value={inputName}
                    onChange={e => setInputName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') { setAdding(false); resetForm(); } }}
                    autoFocus
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 hover:opacity-90"
                    style={{ backgroundColor: '#6366F1', color: '#fff' }}
                    onClick={handleAdd}
                  >
                    Add
                  </button>
                  <button
                    className="px-3 py-2 rounded-lg text-sm cursor-pointer transition-all duration-150 hover:bg-slate-100"
                    style={{ color: '#64748B' }}
                    onClick={() => { setAdding(false); resetForm(); }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Attribute Schemas Tab ─────────────────────────────────────────

function AttributeSchemasTab({ category, onOpenModal }) {
  const getItemName = (itemId) => {
    const item = category.items.find(i => i.id === itemId);
    return item ? item.name : itemId;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div />
        <button
          data-tutorial="add-schema-btn"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 hover:opacity-90"
          style={{ backgroundColor: '#6366F1', color: '#fff' }}
          onClick={() => onOpenModal('addSchema', { categoryId: category.id })}
        >
          <Plus size={14} />
          Add Schema
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {category.attributeSchemas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6" style={{ color: '#64748B' }}>
            <Settings size={40} className="mb-3 opacity-30" />
            <p className="text-base font-medium mb-1" style={{ color: '#1E1B4B' }}>No schemas configured</p>
            <p className="text-sm text-center">Schemas define lot attributes for each item + form factor combination.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Item</th>
                  <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Form Factor</th>
                  <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Fields</th>
                  <th className="py-3 px-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {category.attributeSchemas.map(schema => (
                  <tr key={schema.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors duration-150">
                    <td className="py-3 px-4 text-sm font-medium" style={{ color: '#1E1B4B' }}>
                      {getItemName(schema.itemId)}
                    </td>
                    <td className="py-3 px-3 text-sm" style={{ color: '#64748B' }}>{schema.formFactor}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}
                        >
                          {schema.fields.length} fields
                        </span>
                        <span className="text-xs" style={{ color: '#94A3B8' }}>
                          {schema.fields.map(f => f.name).join(', ')}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        className="p-1.5 rounded-md cursor-pointer transition-colors hover:bg-indigo-50"
                        style={{ color: '#6366F1' }}
                        onClick={() => onOpenModal('editSchema', { categoryId: category.id, schema })}
                        aria-label="Edit schema"
                      >
                        <Pencil size={14} />
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

// ── Warehouse Policy Tab ──────────────────────────────────────────

function WarehousePolicyTab({ category, locations, onUpdate, onOpenModal }) {
  const [selectedItemId, setSelectedItemId] = useState(
    category.items.length > 0 ? category.items[0].id : null
  );

  const selectedItem = category.items.find(i => i.id === selectedItemId);

  const getLocationName = (locId) => {
    const loc = locations.find(l => l.id === locId);
    return loc ? loc.name : locId;
  };

  if (category.items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center py-16 px-6" style={{ color: '#64748B' }}>
        <Package size={40} className="mb-3 opacity-30" />
        <p className="text-base font-medium mb-1" style={{ color: '#1E1B4B' }}>No items in this category</p>
        <p className="text-sm text-center">Add items first before configuring warehouse policies.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Item selector */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {category.items.map(item => (
          <button
            key={item.id}
            className="px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-150 border"
            style={
              selectedItemId === item.id
                ? { backgroundColor: '#6366F1', color: '#fff', borderColor: '#6366F1' }
                : { backgroundColor: '#fff', color: '#64748B', borderColor: '#E2E8F0' }
            }
            onClick={() => setSelectedItemId(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>

      {selectedItem && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium" style={{ color: '#1E1B4B' }}>
              Policies for <span style={{ color: '#6366F1' }}>{selectedItem.name}</span>
            </p>
            <button
              data-tutorial="add-policy-btn"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 hover:opacity-90"
              style={{ backgroundColor: '#6366F1', color: '#fff' }}
              onClick={() => onOpenModal('addPolicy', { categoryId: category.id, itemId: selectedItem.id })}
            >
              <Plus size={14} />
              Add Policy
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {selectedItem.warehousePolicies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6" style={{ color: '#64748B' }}>
                <BarChart3 size={40} className="mb-3 opacity-30" />
                <p className="text-base font-medium mb-1" style={{ color: '#1E1B4B' }}>No policies set for this item</p>
                <p className="text-sm text-center max-w-sm">
                  Add a warehouse policy to define stock thresholds and storage conditions.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Location</th>
                      <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Min Stock</th>
                      <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Max Stock</th>
                      <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Conditions</th>
                      <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Reorder Trigger</th>
                      <th className="py-3 px-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItem.warehousePolicies.map(policy => (
                      <tr key={policy.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors duration-150">
                        <td className="py-3 px-4 text-sm font-medium" style={{ color: '#1E1B4B' }}>
                          {getLocationName(policy.locationId)}
                        </td>
                        <td className="py-3 px-3 text-sm" style={{ color: '#64748B' }}>{policy.minStock.toLocaleString()}</td>
                        <td className="py-3 px-3 text-sm" style={{ color: '#64748B' }}>{policy.maxStock.toLocaleString()}</td>
                        <td className="py-3 px-3">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              backgroundColor: policy.conditions === 'Refrigerated' ? '#EFF6FF' : policy.conditions === 'Frozen' ? '#F0F9FF' : '#F0FDF4',
                              color: policy.conditions === 'Refrigerated' ? '#3B82F6' : policy.conditions === 'Frozen' ? '#0EA5E9' : '#10B981',
                            }}
                          >
                            {policy.conditions}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-sm" style={{ color: '#64748B' }}>{policy.reorderTrigger.toLocaleString()}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              className="p-1.5 rounded-md cursor-pointer transition-colors hover:bg-indigo-50"
                              style={{ color: '#6366F1' }}
                              onClick={() => onOpenModal('editPolicy', { categoryId: category.id, itemId: selectedItem.id, policy })}
                              aria-label="Edit policy"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              className="p-1.5 rounded-md cursor-pointer transition-colors hover:bg-red-50"
                              style={{ color: '#EF4444' }}
                              onClick={() => onUpdate.removePolicy({ categoryId: category.id, itemId: selectedItem.id, policyId: policy.id })}
                              aria-label="Remove policy"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Item-Form-Factor Tab ──────────────────────────────────────────

function FormFactorGroupRow({ item, ffName, category, locations, onOpenModal, onUpdateLot }) {
  const [expanded, setExpanded] = useState(true);
  const [editingLotId, setEditingLotId] = useState(null);
  const [editQty, setEditQty] = useState('');
  const [selectedLotIds, setSelectedLotIds] = useState(new Set());
  const [batchMenuOpen, setBatchMenuOpen] = useState(false);

  const toggleLot = (lotId) => setSelectedLotIds(prev => {
    const next = new Set(prev);
    next.has(lotId) ? next.delete(lotId) : next.add(lotId);
    return next;
  });
  const ffLots = (item.lots || []).filter(lot => lot.formFactor === ffName);

  const startQtyEdit = (lot, e) => {
    e.stopPropagation();
    setEditingLotId(lot.id);
    setEditQty(String(lot.qty ?? ''));
  };

  const commitQtyEdit = (lot) => {
    const newQty = parseFloat(editQty);
    if (!isNaN(newQty) && newQty >= 0 && newQty !== lot.qty) {
      onUpdateLot({ ...lot, qty: newQty });
    }
    setEditingLotId(null);
  };

  return (
    <div className="ml-6 rounded-lg border border-slate-200 mb-2">
      {/* Row header */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 cursor-pointer select-none"
        style={{ backgroundColor: '#F8FAFC' }}
        onClick={() => setExpanded(e => !e)}
      >
        <ChevronDown
          size={14}
          style={{
            flexShrink: 0,
            color: '#94A3B8',
            transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform 150ms',
          }}
        />
        <span
          className="text-xs px-2 py-0.5 rounded font-medium"
          style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}
        >
          {ffName}
        </span>
        <span
          className="text-xs px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}
        >
          {ffLots.length} lot{ffLots.length !== 1 ? 's' : ''}
        </span>
        <div className="ml-auto flex items-center gap-2" onClick={e => e.stopPropagation()}>
          {(() => {
            const ffType = item.formFactorTypes?.[ffName] || 'To Purchase';
            const ffRecipe = item.formFactorRecipes?.[ffName] || null;
            return (
              <>
                {ffType === 'To Purchase' && (
                <button
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#6366F1', color: '#fff' }}
                  data-tutorial={item.id === 'powder-001' && ffName === '2.5kg bag' ? 'purchase-btn-powder-bag' : undefined}
                  onClick={() => onOpenModal('createLots', { categoryId: category.id, item, formFactor: ffName })}
                >
                  <Plus size={11} />
                  Purchase Lots
                </button>
                )}
                {ffType === 'To Manufacture' && (
                  <>
                    <button
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium cursor-pointer hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#0D9488', color: '#fff' }}
                      data-tutorial={item.id === 'marker-001' && ffName === '200L drum' ? 'recipe-btn-marker-200L' : undefined}
                      onClick={() => onOpenModal('editRecipe', { categoryId: category.id, item, formFactor: ffName })}
                    >
                      <FlaskConical size={11} />
                      {ffRecipe ? 'Edit Recipe' : 'Create Recipe'}
                    </button>
                    {ffRecipe && (
                      <button
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#0D9488', color: '#fff' }}
                        data-tutorial={item.id === 'marker-001' && ffName === '200L drum' ? 'produce-btn-marker-200L' : undefined}
                        onClick={() => onOpenModal('produceLot', { categoryId: category.id, item, formFactor: ffName })}
                      >
                        Produce
                      </button>
                    )}
                  </>
                )}
                {ffType === 'To Draw Down' && (
                  <>
                    <button
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium cursor-pointer hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#8B5CF6', color: '#fff' }}
                      data-tutorial={item.id === 'marker-001' && ffName === '5L Jerry can' ? 'drawdown-btn-marker-5L' : undefined}
                      onClick={() => onOpenModal('editRecipe', { categoryId: category.id, item, formFactor: ffName })}
                    >
                      <FlaskConical size={11} />
                      {ffRecipe ? 'Edit Drawdown' : 'Create Drawdown'}
                    </button>
                    {ffRecipe && (
                      <button
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#8B5CF6', color: '#fff' }}
                        data-tutorial={item.id === 'marker-001' && ffName === '5L Jerry can' ? 'drawdown-execute-btn-marker-5L' : undefined}
                        onClick={() => onOpenModal('produceLot', { categoryId: category.id, item, formFactor: ffName })}
                      >
                        Draw Down
                      </button>
                    )}
                  </>
                )}
              </>
            );
          })()}
        </div>
      </div>

      {/* Lot rows */}
      {expanded && (
        <div data-tutorial={item.id === 'powder-001' && ffName === '2.5kg bag' ? 'lot-area-powder-bag' : undefined}>
          {ffLots.length === 0 ? (
            <div className="px-4 py-3 text-xs text-center border-t border-slate-100" style={{ color: '#94A3B8' }}>
              No lots for this form factor
            </div>
          ) : (
            ffLots.map(lot => (
              <div
                key={lot.id}
                className="px-4 py-2.5 border-t border-slate-100 hover:bg-slate-50 transition-colors"
              >
                {/* Row 1: identifiers + qty/price */}
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => editingLotId !== lot.id && onOpenModal('lotHistory', { lot })}
                >
                  <input
                    type="checkbox"
                    checked={selectedLotIds.has(lot.id)}
                    onChange={() => toggleLot(lot.id)}
                    onClick={e => e.stopPropagation()}
                    className="flex-shrink-0 cursor-pointer"
                    style={{ accentColor: '#6366F1' }}
                  />
                  <span className="text-xs font-mono" style={{ color: '#1E1B4B' }}>{lot.id}</span>
                  {lot.highlightNew && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded font-medium"
                      style={{ backgroundColor: '#D1FAE5', color: '#059669' }}
                    >
                      New
                    </span>
                  )}
                  <div className="ml-auto flex items-center gap-2">
                    {lot.locationId && (() => {
                      const loc = locations?.find(l => l.id === lot.locationId);
                      return loc ? (
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#EEF2FF', color: '#6366F1' }}>
                          {loc.name}
                        </span>
                      ) : null;
                    })()}
                    <span className="text-xs" style={{ color: '#94A3B8' }}>Qty:</span>
                    {editingLotId === lot.id ? (
                      <input
                        type="number"
                        className="w-20 px-2 py-0.5 rounded border text-xs outline-none"
                        style={{ borderColor: '#6366F1', color: '#1E1B4B' }}
                        value={editQty}
                        min="0"
                        step="any"
                        autoFocus
                        onClick={e => e.stopPropagation()}
                        onChange={e => setEditQty(e.target.value)}
                        onBlur={() => commitQtyEdit(lot)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') { e.preventDefault(); commitQtyEdit(lot); }
                          if (e.key === 'Escape') { e.stopPropagation(); setEditingLotId(null); }
                        }}
                      />
                    ) : (
                      <span
                        className="text-xs font-medium cursor-text rounded px-1 hover:bg-indigo-50 transition-colors"
                        style={{ color: '#1E1B4B' }}
                        title="Click to edit quantity"
                        onClick={e => startQtyEdit(lot, e)}
                      >
                        {(lot.qty || 0).toLocaleString()}
                      </span>
                    )}
                    {lot.buyInPrice > 0 && (
                      <span className="text-xs" style={{ color: '#94A3B8' }}>
                        ${(lot.buyInPrice * (lot.qty || 0)).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          {selectedLotIds.size > 0 && (
            <div
              className="flex items-center justify-between px-4 py-2 border-t"
              style={{ backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' }}
            >
              <span className="text-xs font-medium" style={{ color: '#4F46E5' }}>
                {selectedLotIds.size} lot{selectedLotIds.size !== 1 ? 's' : ''} selected
              </span>
              <div className="relative">
                {batchMenuOpen && (
                  <div className="fixed inset-0 z-[9]" onClick={() => setBatchMenuOpen(false)} />
                )}
                <button
                  onClick={() => setBatchMenuOpen(v => !v)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-semibold"
                  style={{ backgroundColor: '#6366F1', color: '#fff' }}
                  data-tutorial="batch-actions-btn"
                >
                  Batch Actions <ChevronDown size={12} />
                </button>
                {batchMenuOpen && (
                  <div
                    className="absolute right-0 bottom-full mb-1 w-36 rounded-xl shadow-lg z-10 overflow-hidden"
                    style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0' }}
                  >
                    <button
                      className="w-full text-left text-xs px-3 py-2.5 hover:bg-slate-50 font-medium"
                      style={{ color: '#1E1B4B' }}
                      onClick={() => {
                        setBatchMenuOpen(false);
                        const selectedLots = ffLots.filter(l => selectedLotIds.has(l.id));
                        onOpenModal('batchMove', {
                          categoryId: category.id,
                          item,
                          lotIds: [...selectedLotIds],
                          lots: selectedLots,
                          onMoved: () => setSelectedLotIds(new Set()),
                        });
                      }}
                    >
                      Move
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ItemFormFactorTab({ category, data, onUpdate, onOpenModal }) {
  const uomList = data.uom || [];

  const getUomSymbol = (uomId) => {
    const u = uomList.find(u => u.id === uomId);
    return u ? u.symbol : uomId || '—';
  };

  if (category.items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center py-16 px-6" style={{ color: '#64748B' }}>
        <Package size={40} className="mb-3 opacity-30" />
        <p className="text-base font-medium mb-1" style={{ color: '#1E1B4B' }}>No items in this category</p>
        <p className="text-sm text-center">Add items first using the Items tab.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {category.items.map(item => {
        const totalLots = (item.lots || []).length;
        return (
          <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Item header */}
            <div
              className="flex items-center gap-3 px-4 py-3 border-b border-slate-100"
              style={{ backgroundColor: '#FAFAFA' }}
            >
              <Package size={16} style={{ color: '#6366F1', flexShrink: 0 }} />
              <span className="text-sm font-semibold" style={{ color: '#1E1B4B' }}>{item.name}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}>
                {item.sku}
              </span>
              {item.uomId && (
                <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ backgroundColor: '#F0FDF4', color: '#16A34A' }}>
                  {getUomSymbol(item.uomId)}
                </span>
              )}
              <span
                className="ml-auto text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}
              >
                {totalLots} lot{totalLots !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Form factor groups */}
            <div className="py-3">
              {(!item.formFactors || item.formFactors.length === 0) ? (
                <div className="px-4 py-2 text-xs italic" style={{ color: '#94A3B8' }}>
                  No form factors attached — use the Items tab to attach form factors
                </div>
              ) : (
                item.formFactors.map(ffName => (
                  <FormFactorGroupRow
                    key={ffName}
                    item={item}
                    ffName={ffName}
                    category={category}
                    locations={data.locations}
                    onOpenModal={onOpenModal}
                    onUpdateLot={(lot) => onUpdate.updateLot({ categoryId: category.id, itemId: item.id, lot })}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── CatalogManager (main) ─────────────────────────────────────────

export default function CatalogManager({ data, selectedCategoryId, onUpdate, onOpenModal, activeTab = 'itemsFF', onTabChange }) {
  const setActiveTab = onTabChange ?? (() => {});
  const category = data.categories.find(c => c.id === selectedCategoryId);

  if (!category) return null;

  const tabs = [
    { id: 'itemFF', label: 'Items & Lots' },
    { id: 'items', label: 'Items' },
    { id: 'formFactors', label: 'Form Factors' },
    { id: 'schemas', label: 'Attribute Schemas' },
    { id: 'policies', label: 'Warehouse Policy' },
  ];

  const tabLabels = {
    itemFF: 'Items & Lots',
    items: 'Items',
    formFactors: 'Form Factors',
    schemas: 'Attribute Schemas',
    policies: 'Warehouse Policy',
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs mb-4" style={{ color: '#64748B' }}>
        <span>Catalog Manager</span>
        <span className="opacity-40">›</span>
        <span style={{ color: '#1E1B4B' }}>{category.name}</span>
        <span className="opacity-40">›</span>
        <span style={{ color: '#6366F1' }}>{tabLabels[activeTab]}</span>
      </div>

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: '#1E1B4B' }}>{category.name}</h1>
          <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>Manage items, form factors, schemas and policies</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            data-tutorial={
              tab.id === 'itemFF' ? 'tab-itemFF' :
              tab.id === 'items' ? 'tab-items' :
              tab.id === 'formFactors' ? 'tab-formfactors' :
              tab.id === 'schemas' ? 'tab-schemas' :
              tab.id === 'policies' ? 'tab-policies' : undefined
            }
            className="px-4 py-2.5 text-sm font-medium cursor-pointer border-b-2 transition-all duration-150 -mb-px"
            style={
              activeTab === tab.id
                ? { borderBottomColor: '#6366F1', color: '#6366F1' }
                : { borderBottomColor: 'transparent', color: '#64748B' }
            }
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'items' && (
        <ItemsTab category={category} uom={data.uom} onUpdate={onUpdate} onOpenModal={onOpenModal} />
      )}
      {activeTab === 'formFactors' && (
        <FormFactorsTab category={category} onUpdate={onUpdate} />
      )}
      {activeTab === 'itemFF' && (
        <ItemFormFactorTab category={category} data={data} onUpdate={onUpdate} onOpenModal={onOpenModal} />
      )}
      {activeTab === 'schemas' && (
        <AttributeSchemasTab category={category} onOpenModal={onOpenModal} />
      )}
      {activeTab === 'policies' && (
        <WarehousePolicyTab
          category={category}
          locations={data.locations}
          onUpdate={onUpdate}
          onOpenModal={onOpenModal}
        />
      )}
    </div>
  );
}

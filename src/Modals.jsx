import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Plus, Trash2, Loader2, Check, ChevronDown, MapPin } from 'lucide-react';

// ── Modal Shell ───────────────────────────────────────────────────

function ModalShell({ title, onClose, children }) {
  const panelRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement;

    // Focus first focusable element
    if (panelRef.current) {
      const focusable = panelRef.current.querySelectorAll(
        'input, select, textarea, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }

    // Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();

      // Focus trap
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = [...panelRef.current.querySelectorAll(
          'input, select, textarea, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )];
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocusRef.current && previousFocusRef.current.focus) {
        previousFocusRef.current.focus();
      }
    };
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 bottom-0 z-40 bg-white flex flex-col slide-in-right"
        style={{ width: '480px', boxShadow: '-4px 0 24px rgba(0,0,0,0.12)' }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <h2 className="text-base font-semibold" style={{ color: '#1E1B4B' }}>{title}</h2>
          <button
            className="p-1.5 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} style={{ color: '#64748B' }} />
          </button>
        </div>

        {/* Panel body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </>
  );
}

// ── Field helpers ─────────────────────────────────────────────────

function FormField({ label, required, children, hint }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: '#64748B' }}>
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{hint}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, disabled, readOnly, className, ...rest }) {
  return (
    <input
      type="text"
      className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all duration-150 ${className || ''}`}
      style={{
        borderColor: '#E2E8F0',
        color: readOnly || disabled ? '#94A3B8' : '#1E1B4B',
        backgroundColor: readOnly || disabled ? '#F8FAFC' : '#fff',
      }}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      onFocus={e => { if (!readOnly && !disabled) e.target.style.borderColor = '#6366F1'; }}
      onBlur={e => { e.target.style.borderColor = '#E2E8F0'; }}
      {...rest}
    />
  );
}

function NumberInput({ value, onChange, placeholder, min, step, disabled, ...rest }) {
  return (
    <input
      type="number"
      className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all duration-150"
      style={{ borderColor: '#E2E8F0', color: '#1E1B4B' }}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      step={step}
      disabled={disabled}
      onFocus={e => { e.target.style.borderColor = '#6366F1'; }}
      onBlur={e => { e.target.style.borderColor = '#E2E8F0'; }}
      {...rest}
    />
  );
}

function SelectInput({ value, onChange, children, disabled, ...rest }) {
  return (
    <select
      className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all duration-150 cursor-pointer"
      style={{ borderColor: '#E2E8F0', color: '#1E1B4B', backgroundColor: disabled ? '#F8FAFC' : '#fff' }}
      value={value}
      onChange={onChange}
      disabled={disabled}
      onFocus={e => { if (!disabled) e.target.style.borderColor = '#6366F1'; }}
      onBlur={e => { e.target.style.borderColor = '#E2E8F0'; }}
      {...rest}
    >
      {children}
    </select>
  );
}

function ReadOnlyField({ value }) {
  return (
    <div
      className="w-full px-3 py-2 rounded-lg border text-sm"
      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC', color: '#94A3B8' }}
    >
      {value}
    </div>
  );
}

function SubmitButton({ loading, children, onClick, disabled }) {
  return (
    <button
      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed mt-6"
      style={{ backgroundColor: '#6366F1', color: '#fff' }}
      onClick={onClick}
      disabled={loading || disabled}
    >
      {loading ? (
        <>
          <Loader2 size={15} className="animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Check size={15} />
          {children}
        </>
      )}
    </button>
  );
}

// ── Shimmer skeleton ──────────────────────────────────────────────

function ShimmerField() {
  return (
    <div className="mb-4">
      <div className="h-3 w-24 rounded mb-2 shimmer" />
      <div className="h-9 w-full rounded-lg shimmer" />
    </div>
  );
}

// ── PurchaseLotsModal ───────────────────────────────────────────────

function makeEntry() {
  return { id: Date.now().toString(36) + Math.random().toString(36).slice(2), batchId: 'B-' + Date.now().toString(36).toUpperCase(), qty: '', totalPrice: '' };
}

export function PurchaseLotsModal({ category, item, preselectedFormFactor, uomLabel, locations, onSubmit, onClose }) {
  const [formFactor] = useState(preselectedFormFactor || item?.defaultFormFactor || '');
  const [locationId, setLocationId] = useState('');
  const [loadingSchema, setLoadingSchema] = useState(false);
  const [schema, setSchema] = useState(null);
  const [attrValues, setAttrValues] = useState({});
  const [entries, setEntries] = useState(() => [makeEntry()]);
  const [submitting, setSubmitting] = useState(false);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Load schema when form factor changes
  useEffect(() => {
    if (!formFactor) {
      setSchema(null);
      setAttrValues({});
      return;
    }

    const matchedSchema = category?.attributeSchemas?.find(
      s => s.itemId === item?.id && s.formFactor === formFactor
    );

    if (prefersReducedMotion) {
      setSchema(matchedSchema || null);
      setAttrValues({});
      return;
    }

    setLoadingSchema(true);
    const timer = setTimeout(() => {
      setSchema(matchedSchema || null);
      setAttrValues({});
      setLoadingSchema(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [formFactor, category, item, prefersReducedMotion]);

  const handleAttrChange = (fieldName, value) => {
    setAttrValues(prev => ({ ...prev, [fieldName]: value }));
  };

  const updateEntry = (id, field, value) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const addEntry = () => {
    setEntries(prev => [...prev, makeEntry()]);
  };

  const removeEntry = (id) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleSubmit = () => {
    const validEntries = entries.filter(e => e.batchId && e.qty);
    if (!formFactor || validEntries.length === 0) return;
    setSubmitting(true);
    setTimeout(() => {
      const lots = validEntries.map(e => ({
        id: e.batchId,
        formFactor,
        qty: parseInt(e.qty, 10),
        buyInPrice: e.qty ? (parseFloat(e.totalPrice) || 0) / parseInt(e.qty, 10) : 0,
        locationId,
        attributes: attrValues,
        highlightNew: true,
      }));
      onSubmit(lots);
      setSubmitting(false);
    }, 200);
  };

  return (
    <ModalShell title={`Purchase Lots — ${item?.name}`} onClose={onClose}>
      <FormField label="Category">
        <ReadOnlyField value={category?.name} />
      </FormField>

      <FormField label="Item Name">
        <ReadOnlyField value={item?.name} />
      </FormField>

      <FormField label="SKU">
        <ReadOnlyField value={item?.sku} />
      </FormField>

      <FormField label="Unit of Measure">
        <ReadOnlyField value={uomLabel || '—'} />
      </FormField>

      <FormField label="Form Factor" required>
        <ReadOnlyField value={formFactor} />
      </FormField>

      <FormField label="Location" required>
        <SelectInput value={locationId} onChange={e => setLocationId(e.target.value)}>
          <option value="">Select location...</option>
          {(locations || []).map(loc => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
          ))}
        </SelectInput>
      </FormField>

      {/* Dynamic attribute fields */}
      {loadingSchema && (
        <div className="mb-4">
          <div
            className="rounded-lg p-3 mb-3 text-xs font-medium"
            style={{ backgroundColor: '#EEF2FF', color: '#6366F1' }}
          >
            Loading attribute fields...
          </div>
          <ShimmerField />
          <ShimmerField />
        </div>
      )}

      {!loadingSchema && schema && schema.fields.length > 0 && (
        <div className="mb-4">
          <div
            className="rounded-lg p-3 mb-3 text-xs font-medium"
            style={{ backgroundColor: '#EEF2FF', color: '#6366F1' }}
          >
            Attribute Fields for {formFactor}
          </div>
          {schema.fields.map(field => (
            <FormField key={field.name} label={field.name} required={field.required}>
              {field.type === 'boolean' ? (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 cursor-pointer"
                    checked={!!attrValues[field.name]}
                    onChange={e => handleAttrChange(field.name, e.target.checked)}
                    style={{ accentColor: '#6366F1' }}
                  />
                  <span className="text-sm" style={{ color: '#1E1B4B' }}>{field.name}</span>
                </label>
              ) : field.type === 'date' ? (
                <input
                  type="date"
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all duration-150"
                  style={{ borderColor: '#E2E8F0' }}
                  value={attrValues[field.name] || ''}
                  onChange={e => handleAttrChange(field.name, e.target.value)}
                  onFocus={e => { e.target.style.borderColor = '#6366F1'; }}
                  onBlur={e => { e.target.style.borderColor = '#E2E8F0'; }}
                />
              ) : field.type === 'number' ? (
                <NumberInput
                  value={attrValues[field.name] || ''}
                  onChange={e => handleAttrChange(field.name, e.target.value)}
                  placeholder={`Enter ${field.name.toLowerCase()}`}
                />
              ) : (
                <TextInput
                  value={attrValues[field.name] || ''}
                  onChange={e => handleAttrChange(field.name, e.target.value)}
                  placeholder={`Enter ${field.name.toLowerCase()}`}
                />
              )}
            </FormField>
          ))}
        </div>
      )}

      {!loadingSchema && formFactor && !schema && (
        <div
          className="rounded-lg px-3 py-2 text-xs mb-4"
          style={{ backgroundColor: '#FEF9C3', color: '#854D0E' }}
        >
          No attribute schema defined for this form factor.
        </div>
      )}

      {/* Lot entries */}
      <div className="border-t border-slate-100 pt-4 mt-2">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium" style={{ color: '#1E1B4B' }}>Lots</span>
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: '#EEF2FF', color: '#6366F1' }}
          >
            {entries.length}
          </span>
        </div>

        {entries.map((entry) => (
          <div key={entry.id} className="mb-4 p-3 rounded-lg border" style={{ borderColor: '#E2E8F0' }}>
            <div className="grid grid-cols-3 gap-3">
              <FormField label="Quantity" required>
                <NumberInput
                  value={entry.qty}
                  onChange={e => updateEntry(entry.id, 'qty', e.target.value)}
                  placeholder="0"
                  min="0"
                  step="1"
                />
              </FormField>
              <FormField label="Total Price">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#94A3B8' }}>$</span>
                  <input
                    type="number"
                    className="w-full pl-6 pr-3 py-2 rounded-lg border text-sm outline-none transition-all duration-150"
                    style={{ borderColor: '#E2E8F0' }}
                    value={entry.totalPrice}
                    onChange={e => updateEntry(entry.id, 'totalPrice', e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    onFocus={e => { e.target.style.borderColor = '#6366F1'; }}
                    onBlur={e => { e.target.style.borderColor = '#E2E8F0'; }}
                  />
                </div>
              </FormField>
              <div className="flex items-center justify-end h-full">
                {entries.length > 1 && (
                  <button
                    className="p-1.5 rounded text-slate-400 hover:bg-red-100 hover:text-red-500 transition-colors"
                    onClick={() => removeEntry(entry.id)}
                    title="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          className="flex items-center gap-1.5 text-sm font-medium mb-4 hover:opacity-80 transition-opacity"
          style={{ color: '#6366F1' }}
          onClick={addEntry}
        >
          <Plus size={14} />
          Add Another
        </button>
      </div>

      <SubmitButton
        loading={submitting}
        onClick={handleSubmit}
        disabled={!formFactor || !locationId || !entries.some(e => e.batchId && e.qty)}
      >
        Purchase Lots
      </SubmitButton>
    </ModalShell>
  );
}

// ── AddItemModal / EditItemModal ──────────────────────────────────

export function AddItemModal({ category, existingItem, onSubmit, onClose }) {
  const isEdit = !!existingItem;
  const [name, setName] = useState(existingItem?.name || '');
  const [sku, setSku] = useState(existingItem?.sku || '');
  const [defaultFormFactor, setDefaultFormFactor] = useState(existingItem?.defaultFormFactor || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !sku.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      const item = isEdit
        ? { ...existingItem, name: name.trim(), sku: sku.trim(), defaultFormFactor }
        : {
            id: 'item-' + Date.now().toString(36),
            name: name.trim(),
            sku: sku.trim(),
            uomId: '',
            formFactors: [],
            defaultFormFactor,
            lots: [],
            warehousePolicies: [],
            recipe: null,
          };
      onSubmit(item);
      setSubmitting(false);
    }, 200);
  };

  return (
    <ModalShell title={isEdit ? 'Edit Item' : 'Add Item'} onClose={onClose}>
      <FormField label="Item Name" required>
        <TextInput
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Sparkling Water"
        />
      </FormField>

      <FormField label="SKU" required hint="Unique identifier for this item">
        <TextInput
          value={sku}
          onChange={e => setSku(e.target.value)}
          placeholder="e.g. BW-001"
        />
      </FormField>

      <FormField label="Default Form Factor">
        <SelectInput value={defaultFormFactor} onChange={e => setDefaultFormFactor(e.target.value)}>
          <option value="">Select form factor...</option>
          {category?.formFactors.map(ff => (
            <option key={ff.name} value={ff.name}>{ff.name}</option>
          ))}
        </SelectInput>
      </FormField>

      <SubmitButton
        loading={submitting}
        onClick={handleSubmit}
        disabled={!name.trim() || !sku.trim()}
      >
        {isEdit ? 'Save Changes' : 'Add Item'}
      </SubmitButton>
    </ModalShell>
  );
}

// ── SchemaBuilderModal ────────────────────────────────────────────

export function SchemaBuilderModal({ category, existingSchema, onSubmit, onClose }) {
  const isEdit = !!existingSchema;
  const [itemId, setItemId] = useState(existingSchema?.itemId || '');
  const [formFactor, setFormFactor] = useState(existingSchema?.formFactor || '');
  const [fields, setFields] = useState(existingSchema?.fields || []);
  const [submitting, setSubmitting] = useState(false);

  const addField = () => {
    setFields(prev => [
      ...prev,
      { name: '', type: 'text', required: false },
    ]);
  };

  const updateField = (index, updates) => {
    setFields(prev => prev.map((f, i) => i === index ? { ...f, ...updates } : f));
  };

  const removeField = (index) => {
    setFields(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!itemId || !formFactor || fields.some(f => !f.name.trim())) return;
    setSubmitting(true);
    setTimeout(() => {
      const schema = isEdit
        ? { ...existingSchema, itemId, formFactor, fields }
        : {
            id: 'schema-' + Date.now().toString(36),
            itemId,
            formFactor,
            fields,
          };
      onSubmit(schema);
      setSubmitting(false);
    }, 200);
  };

  return (
    <ModalShell title={isEdit ? 'Edit Attribute Schema' : 'Add Attribute Schema'} onClose={onClose}>
      <FormField label="Item" required>
        <SelectInput value={itemId} onChange={e => setItemId(e.target.value)}>
          <option value="">Select item...</option>
          {category?.items.map(item => (
            <option key={item.id} value={item.id}>{item.name} ({item.sku})</option>
          ))}
        </SelectInput>
      </FormField>

      <FormField label="Form Factor" required>
        <SelectInput value={formFactor} onChange={e => setFormFactor(e.target.value)}>
          <option value="">Select form factor...</option>
          {category?.formFactors.map(ff => (
            <option key={ff.name} value={ff.name}>{ff.name}</option>
          ))}
        </SelectInput>
      </FormField>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>
            Fields ({fields.length})
          </label>
          <button
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150 hover:opacity-90"
            style={{ backgroundColor: '#EEF2FF', color: '#6366F1' }}
            onClick={addField}
          >
            <Plus size={11} />
            Add Field
          </button>
        </div>

        {fields.length === 0 ? (
          <div
            className="text-center py-6 rounded-xl border-2 border-dashed text-sm"
            style={{ borderColor: '#E2E8F0', color: '#94A3B8' }}
          >
            No fields yet. Click "Add Field" to add attribute fields.
          </div>
        ) : (
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 rounded-xl border"
                style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
              >
                <div className="flex-1">
                  <input
                    type="text"
                    className="w-full px-2 py-1 rounded-md border text-sm outline-none"
                    style={{ borderColor: '#E2E8F0' }}
                    placeholder="Field name"
                    value={field.name}
                    onChange={e => updateField(index, { name: e.target.value })}
                    onFocus={e => { e.target.style.borderColor = '#6366F1'; }}
                    onBlur={e => { e.target.style.borderColor = '#E2E8F0'; }}
                  />
                </div>
                <select
                  className="px-2 py-1 rounded-md border text-xs cursor-pointer outline-none"
                  style={{ borderColor: '#E2E8F0', backgroundColor: '#fff', color: '#1E1B4B' }}
                  value={field.type}
                  onChange={e => updateField(index, { type: e.target.value })}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="boolean">Boolean</option>
                </select>
                <label className="flex items-center gap-1 cursor-pointer text-xs" style={{ color: '#64748B' }}>
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={field.required}
                    onChange={e => updateField(index, { required: e.target.checked })}
                    style={{ accentColor: '#6366F1' }}
                  />
                  Req.
                </label>
                <button
                  className="p-1 rounded cursor-pointer hover:bg-red-50 transition-colors flex-shrink-0"
                  style={{ color: '#EF4444' }}
                  onClick={() => removeField(index)}
                  aria-label="Remove field"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <SubmitButton
        loading={submitting}
        onClick={handleSubmit}
        disabled={!itemId || !formFactor || fields.some(f => !f.name.trim())}
      >
        {isEdit ? 'Save Schema' : 'Create Schema'}
      </SubmitButton>
    </ModalShell>
  );
}

// ── AddPolicyModal / EditPolicyModal ──────────────────────────────

export function AddPolicyModal({ locations, item, existingPolicy, onSubmit, onClose }) {
  const isEdit = !!existingPolicy;

  // Filter locations already assigned to this item (except the one being edited)
  const assignedLocationIds = (item?.warehousePolicies || [])
    .filter(p => !isEdit || p.id !== existingPolicy.id)
    .map(p => p.locationId);

  const availableLocations = locations.filter(l => !assignedLocationIds.includes(l.id));

  const [locationId, setLocationId] = useState(existingPolicy?.locationId || '');
  const [minStock, setMinStock] = useState(existingPolicy?.minStock?.toString() || '');
  const [maxStock, setMaxStock] = useState(existingPolicy?.maxStock?.toString() || '');
  const [conditions, setConditions] = useState(existingPolicy?.conditions || 'Ambient');
  const [reorderTrigger, setReorderTrigger] = useState(existingPolicy?.reorderTrigger?.toString() || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!locationId || !minStock || !maxStock || !reorderTrigger) return;
    setSubmitting(true);
    setTimeout(() => {
      const policy = isEdit
        ? {
            ...existingPolicy,
            locationId,
            minStock: parseInt(minStock, 10),
            maxStock: parseInt(maxStock, 10),
            conditions,
            reorderTrigger: parseInt(reorderTrigger, 10),
          }
        : {
            id: 'wp-' + Date.now().toString(36),
            locationId,
            minStock: parseInt(minStock, 10),
            maxStock: parseInt(maxStock, 10),
            conditions,
            reorderTrigger: parseInt(reorderTrigger, 10),
          };
      onSubmit(policy);
      setSubmitting(false);
    }, 200);
  };

  return (
    <ModalShell title={isEdit ? 'Edit Warehouse Policy' : 'Add Warehouse Policy'} onClose={onClose}>
      {item && (
        <div
          className="rounded-lg px-3 py-2 text-sm mb-5"
          style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}
        >
          Policy for: <span className="font-semibold">{item.name}</span>
        </div>
      )}

      <FormField label="Location" required>
        <SelectInput value={locationId} onChange={e => setLocationId(e.target.value)}>
          <option value="">Select location...</option>
          {availableLocations.map(loc => (
            <option key={loc.id} value={loc.id}>{loc.name} ({loc.type})</option>
          ))}
        </SelectInput>
        {availableLocations.length === 0 && (
          <p className="text-xs mt-1" style={{ color: '#EF4444' }}>
            All locations are already assigned to this item.
          </p>
        )}
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Min Stock" required>
          <NumberInput
            value={minStock}
            onChange={e => setMinStock(e.target.value)}
            placeholder="0"
            min="0"
            step="1"
          />
        </FormField>
        <FormField label="Max Stock" required>
          <NumberInput
            value={maxStock}
            onChange={e => setMaxStock(e.target.value)}
            placeholder="0"
            min="0"
            step="1"
          />
        </FormField>
      </div>

      <FormField label="Storage Conditions" required>
        <SelectInput value={conditions} onChange={e => setConditions(e.target.value)}>
          <option value="Ambient">Ambient</option>
          <option value="Refrigerated">Refrigerated</option>
          <option value="Frozen">Frozen</option>
          <option value="Custom">Custom</option>
        </SelectInput>
      </FormField>

      <FormField label="Reorder Trigger" required hint="Stock level that triggers a reorder">
        <NumberInput
          value={reorderTrigger}
          onChange={e => setReorderTrigger(e.target.value)}
          placeholder="0"
          min="0"
          step="1"
        />
      </FormField>

      <SubmitButton
        loading={submitting}
        onClick={handleSubmit}
        disabled={!locationId || !minStock || !maxStock || !reorderTrigger}
      >
        {isEdit ? 'Save Policy' : 'Add Policy'}
      </SubmitButton>
    </ModalShell>
  );
}

// ── AddLocationModal ──────────────────────────────────────────────

function generateLocationId(existingLocations) {
  const nums = existingLocations
    .map(l => {
      const match = l.id.match(/LOC-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(n => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `LOC-${String(max + 1).padStart(3, '0')}`;
}

export function AddLocationModal({ locations, existingLocation, onSubmit, onClose }) {
  const isEdit = !!existingLocation;
  const [name, setName] = useState(existingLocation?.name || '');
  const [type, setType] = useState(existingLocation?.type || 'Warehouse');
  const [capacity, setCapacity] = useState(existingLocation?.capacity?.toString() || '');
  const [submitting, setSubmitting] = useState(false);

  const generatedId = isEdit ? existingLocation.id : generateLocationId(locations);

  const handleSubmit = () => {
    if (!name.trim() || !capacity) return;
    setSubmitting(true);
    setTimeout(() => {
      const location = isEdit
        ? { ...existingLocation, name: name.trim(), type, capacity: parseInt(capacity, 10) }
        : {
            id: generatedId,
            name: name.trim(),
            type,
            capacity: parseInt(capacity, 10),
          };
      onSubmit(location);
      setSubmitting(false);
    }, 200);
  };

  return (
    <ModalShell title={isEdit ? 'Edit Location' : 'Add Location'} onClose={onClose}>
      <FormField label="Location ID">
        <ReadOnlyField value={generatedId} />
      </FormField>

      <FormField label="Name" required>
        <TextInput
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Warehouse C"
        />
      </FormField>

      <FormField label="Type" required>
        <SelectInput value={type} onChange={e => setType(e.target.value)}>
          <option value="Warehouse">Warehouse</option>
          <option value="Cold Storage">Cold Storage</option>
          <option value="Distribution Centre">Distribution Centre</option>
          <option value="Other">Other</option>
        </SelectInput>
      </FormField>

      <FormField label="Capacity" required hint="Maximum units this location can hold">
        <NumberInput
          value={capacity}
          onChange={e => setCapacity(e.target.value)}
          placeholder="e.g. 5000"
          min="0"
          step="1"
        />
      </FormField>

      <SubmitButton
        loading={submitting}
        onClick={handleSubmit}
        disabled={!name.trim() || !capacity}
      >
        {isEdit ? 'Save Changes' : 'Add Location'}
      </SubmitButton>
    </ModalShell>
  );
}

// ── LotTransactionHistoryModal ────────────────────────────────────

export function LotTransactionHistoryModal({ lot, locations, onClose }) {
  const panelRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement;

    if (panelRef.current) {
      const focusable = panelRef.current.querySelectorAll(
        'input, select, textarea, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) focusable[0].focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();

      if (e.key === 'Tab' && panelRef.current) {
        const focusable = [...panelRef.current.querySelectorAll(
          'input, select, textarea, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )];
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocusRef.current && previousFocusRef.current.focus) {
        previousFocusRef.current.focus();
      }
    };
  }, [onClose]);

  const transactions = lot.transactions || [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 bottom-0 z-40 bg-white flex flex-col slide-in-right"
        style={{ width: '480px', boxShadow: '-4px 0 24px rgba(0,0,0,0.12)' }}
        role="dialog"
        aria-modal="true"
        aria-label={`Transaction history for ${lot.id}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <div>
            <h2
              className="text-base font-semibold"
              style={{ color: '#1E1B4B', fontFamily: 'monospace' }}
            >
              {lot.id}
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs" style={{ color: '#64748B' }}>{lot.formFactor}</span>
              <span
                className="text-xs font-semibold"
                style={{ color: '#10B981' }}
              >
                Qty: {lot.qty.toLocaleString()}
              </span>
            </div>
            {lot.locationId && locations && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={11} style={{ color: '#6366F1' }} />
                <span className="text-xs" style={{ color: '#64748B' }}>
                  {locations.find(l => l.id === lot.locationId)?.name ?? lot.locationId}
                </span>
              </div>
            )}
            {lot.attributes && Object.keys(lot.attributes).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {Object.entries(lot.attributes).map(([key, val]) => (
                  <span
                    key={key}
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}
                  >
                    <span style={{ color: '#94A3B8' }}>{key}:</span>{' '}
                    <span style={{ color: '#475569' }}>{String(val)}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            className="p-1.5 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} style={{ color: '#64748B' }} />
          </button>
        </div>

        {/* Section label */}
        <div className="px-6 pt-4 pb-2 flex-shrink-0">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#94A3B8' }}>
            Transaction History
          </p>
        </div>

        {/* Transaction list */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {transactions.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-sm" style={{ color: '#94A3B8' }}>
              No transactions recorded.
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map(txn => {
                const txTypeMap = {
                  'buy-in':         { label: 'Buy-in',     bg: '#6366F1', fg: '#fff'    },
                  'produce':        { label: 'Produce',    bg: '#10B981', fg: '#fff'    },
                  'draw-down':      { label: 'Draw Down',  bg: '#8B5CF6', fg: '#fff'    },
                  'production-use': { label: 'Production', bg: '#F59E0B', fg: '#1C1917' },
                  'move':           { label: 'Move',       bg: '#0EA5E9', fg: '#fff'    },
                };
                const txStyle = txTypeMap[txn.type] || { label: txn.type, bg: '#E2E8F0', fg: '#64748B' };
                const isInflow = txn.qtyChange >= 0;
                return (
                  <div
                    key={txn.id}
                    className="flex items-start justify-between gap-3 py-3 border-b border-slate-100"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs px-2 py-0.5 rounded font-medium flex-shrink-0"
                          style={{ backgroundColor: txStyle.bg, color: txStyle.fg }}
                        >
                          {txStyle.label}
                        </span>
                        <span className="text-xs" style={{ color: '#94A3B8' }}>
                          {new Date(txn.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {txn.type === 'production-use' && txn.reference && (
                        <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
                          Ref:{' '}
                          <span style={{ fontFamily: 'monospace', color: '#1E1B4B' }}>
                            {txn.reference}
                          </span>
                        </p>
                      )}
                      {txn.type === 'move' && txn.reference && (
                        <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
                          →{' '}
                          <span style={{ color: '#1E1B4B', fontWeight: 500 }}>
                            {locations?.find(l => l.id === txn.reference)?.name || txn.reference}
                          </span>
                        </p>
                      )}
                      {isInflow && txn.buyInPrice != null && (
                        <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
                          Unit price: <span style={{ color: '#10B981', fontWeight: 500 }}>${txn.buyInPrice?.toFixed(2) ?? '—'}</span>
                        </p>
                      )}
                    </div>
                    <div
                      className="text-sm font-semibold flex-shrink-0"
                      style={{ color: txn.qtyChange > 0 ? '#10B981' : txn.qtyChange < 0 ? '#EF4444' : '#94A3B8' }}
                    >
                      {txn.qtyChange === 0 ? '±0' : txn.qtyChange > 0 ? `+${txn.qtyChange.toLocaleString()}` : txn.qtyChange.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── AttachFormFactorsModal ────────────────────────────────────────

export function AttachFormFactorsModal({ category, item, onSubmit, onClose }) {
  const [selected, setSelected] = useState(item?.formFactors || []);
  const [typeMap, setTypeMap] = useState(item?.formFactorTypes || {});
  const [submitting, setSubmitting] = useState(false);

  const toggle = (ffName) => {
    setSelected(prev =>
      prev.includes(ffName) ? prev.filter(n => n !== ffName) : [...prev, ffName]
    );
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      const newDefaultFF = selected.includes(item?.defaultFormFactor)
        ? item.defaultFormFactor
        : (selected[0] || '');
      onSubmit({ ...item, formFactors: selected, formFactorTypes: typeMap, defaultFormFactor: newDefaultFF });
      setSubmitting(false);
    }, 200);
  };

  return (
    <ModalShell title={`Form Factors — ${item?.name}`} onClose={onClose}>
      <p className="text-sm mb-4" style={{ color: '#64748B' }}>
        Select which form factors this item ships in and set the type for each.
      </p>

      {(category?.formFactors || []).length === 0 ? (
        <div
          className="rounded-lg px-4 py-3 text-sm"
          style={{ backgroundColor: '#FEF9C3', color: '#854D0E' }}
        >
          No form factors defined for this category. Add form factors in the Form Factors tab first.
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          {category.formFactors.map(ff => (
            <div
              key={ff.name}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors"
              style={{
                borderColor: selected.includes(ff.name) ? '#6366F1' : '#E2E8F0',
                backgroundColor: selected.includes(ff.name) ? '#EEF2FF' : '#fff',
              }}
            >
              <input
                type="checkbox"
                checked={selected.includes(ff.name)}
                onChange={() => toggle(ff.name)}
                style={{ accentColor: '#6366F1' }}
                className="w-4 h-4 cursor-pointer flex-shrink-0"
              />
              <span className="text-sm font-medium flex-1" style={{ color: '#1E1B4B' }}>{ff.name}</span>
              <select
                value={typeMap[ff.name] || 'To Purchase'}
                onChange={e => setTypeMap(prev => ({ ...prev, [ff.name]: e.target.value }))}
                disabled={!selected.includes(ff.name)}
                onClick={e => e.stopPropagation()}
                className="text-xs rounded-md border outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ padding: '3px 6px', borderColor: '#E2E8F0', color: '#1E1B4B', backgroundColor: '#fff' }}
              >
                <option value="To Purchase">To Purchase</option>
                <option value="To Manufacture">To Manufacture</option>
                <option value="To Draw Down">To Draw Down</option>
              </select>
            </div>
          ))}
        </div>
      )}

      {item?.defaultFormFactor && !selected.includes(item.defaultFormFactor) && (
        <div
          className="rounded-lg px-3 py-2 text-xs mb-4"
          style={{ backgroundColor: '#FEF9C3', color: '#854D0E' }}
        >
          The current default form factor "{item.defaultFormFactor}" is deselected — it will be replaced with the first selected form factor.
        </div>
      )}

      <SubmitButton
        loading={submitting}
        onClick={handleSubmit}
      >
        Save Form Factors
      </SubmitButton>
    </ModalShell>
  );
}

// ── ExecutionModal ────────────────────────────────────────────────

const makeRowId = () => Math.random().toString(36).slice(2, 8);

export function ExecutionModal({ item, recipe, data, executionType = 'produce', onExecute, onClose }) {
  const initSegments = () =>
    Object.fromEntries((recipe?.sources || []).map(src => [
      src.id,
      [{ id: makeRowId(), lotId: '', qtyToUse: 0 }],
    ]));

  const [locationId, setLocationId] = useState('');
  const [sourceRowsBySegment, setSourceRowsBySegment] = useState(initSegments);
  const [destRows, setDestRows] = useState([{ id: makeRowId(), qty: '' }]);
  const [submitting, setSubmitting] = useState(false);

  // Attribute schema for output form factor
  const outputSchema = React.useMemo(() => {
    if (!recipe?.output?.formFactor) return null;
    for (const cat of data.categories) {
      if (!cat.items.some(i => i.id === item?.id)) continue;
      return cat.attributeSchemas?.find(
        s => s.itemId === item.id && s.formFactor === recipe.output.formFactor
      ) || null;
    }
    return null;
  }, [data, item, recipe]);

  const [attrValues, setAttrValues] = useState({});
  const handleAttrChange = (fieldName, value) =>
    setAttrValues(prev => ({ ...prev, [fieldName]: value }));

  // Per-segment selectable lots
  const selectableLotsPerSrc = React.useMemo(() => {
    if (!locationId) return {};
    const result = {};
    for (const src of (recipe?.sources || [])) {
      result[src.id] = [];
      for (const cat of data.categories) {
        for (const itm of cat.items) {
          if (itm.id !== src.itemId) continue;
          for (const lot of itm.lots) {
            if (lot.locationId !== locationId || lot.formFactor !== src.formFactor) continue;
            result[src.id].push({ lotId: lot.id, itemName: itm.name, formFactor: lot.formFactor, qty: lot.qty });
          }
        }
      }
    }
    return result;
  }, [locationId, recipe, data]);

  // Item name lookup for segment headers
  const getItemName = (itemId) => {
    for (const cat of data.categories) {
      const found = cat.items.find(i => i.id === itemId);
      if (found) return found.name;
    }
    return itemId;
  };

  // Per-segment source row helpers
  const updateSrcRow = (srcId, rowId, patch) =>
    setSourceRowsBySegment(prev => ({
      ...prev,
      [srcId]: prev[srcId].map(r => r.id === rowId ? { ...r, ...patch } : r),
    }));

  const addSrcRow = (srcId) =>
    setSourceRowsBySegment(prev => ({
      ...prev,
      [srcId]: [...prev[srcId], { id: makeRowId(), lotId: '', qtyToUse: 0 }],
    }));

  const removeSrcRow = (srcId, rowId) =>
    setSourceRowsBySegment(prev => ({
      ...prev,
      [srcId]: prev[srcId].filter(r => r.id !== rowId),
    }));

  // Dest row helpers
  const updateDestRow = (rowId, qty) =>
    setDestRows(prev => prev.map(r => r.id === rowId ? { ...r, qty } : r));

  const addDestRow = () =>
    setDestRows(prev => [...prev, { id: makeRowId(), qty: '' }]);

  const removeDestRow = (rowId) =>
    setDestRows(prev => prev.filter(r => r.id !== rowId));

  const canSubmit =
    locationId &&
    Object.values(sourceRowsBySegment).flat().some(r => r.lotId && r.qtyToUse > 0) &&
    destRows.some(r => parseInt(r.qty, 10) > 0);

  const handleExecute = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      const now = Date.now();

      // Compute total source cost for buy-in price derivation
      const findLot = (lotId) => {
        for (const cat of data.categories) {
          for (const itm of cat.items) {
            const lot = itm.lots.find(l => l.id === lotId);
            if (lot) return lot;
          }
        }
        return null;
      };
      const allUsages = Object.values(sourceRowsBySegment).flat().filter(r => r.lotId && r.qtyToUse > 0);
      const totalSourceCost = allUsages.reduce((sum, r) => {
        const lot = findLot(r.lotId);
        return sum + r.qtyToUse * (lot?.buyInPrice || 0);
      }, 0);

      const newLots = destRows
        .filter(r => parseInt(r.qty, 10) > 0)
        .map((r, i) => {
          const batchId = 'LOT-' + now.toString(36) + '-' + r.id;
          return {
            id: batchId,
            formFactor: recipe.output.formFactor,
            qty: parseInt(r.qty, 10),
            buyInPrice: parseInt(r.qty, 10) > 0 ? totalSourceCost / parseInt(r.qty, 10) : 0,
            locationId,
            attributes: { ...attrValues },
            highlightNew: true,
            transactions: [{
              id: `TXN-${now}-dest-${i}`,
              type: executionType,
              timestamp: new Date().toISOString(),
              qtyChange: parseInt(r.qty, 10),
              reference: null,
            }],
          };
        });

      onExecute({
        locationId,
        sourceLotUsages: Object.values(sourceRowsBySegment).flat()
          .filter(r => r.lotId && r.qtyToUse > 0)
          .map(r => ({ lotId: r.lotId, qtyToUse: r.qtyToUse })),
        newLots,
      });
      setSubmitting(false);
    }, 200);
  };

  return (
    <ModalShell title={`${executionType === 'draw-down' ? 'Draw Down' : 'Produce'} — ${item?.name}`} onClose={onClose}>
      {/* Location selector */}
      <FormField label="Location" required>
        <SelectInput
          value={locationId}
          onChange={e => {
            setLocationId(e.target.value);
            setSourceRowsBySegment(initSegments());
          }}
        >
          <option value="">Select location…</option>
          {data.locations.map(loc => (
            <option key={loc.id} value={loc.id}>{loc.name} ({loc.type})</option>
          ))}
        </SelectInput>
      </FormField>

      {/* Sources section — one segment per recipe source */}
      <div className="mb-5 rounded-xl p-4" style={{ border: '1px solid #E2E8F0' }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#94A3B8' }}>
          Sources
        </p>
        {(recipe?.sources || []).map((src, srcIdx) => {
          const lotsForSrc = selectableLotsPerSrc[src.id] || [];
          const rows = sourceRowsBySegment[src.id] || [];
          return (
            <div key={src.id} className={srcIdx > 0 ? 'mt-4 pt-4 border-t border-slate-100' : ''}>
              <p className="text-xs font-semibold mb-2" style={{ color: '#1E1B4B' }}>
                {getItemName(src.itemId)}
                <span className="font-normal ml-1" style={{ color: '#64748B' }}>• {src.formFactor}</span>
              </p>
              <div className="space-y-3">
                {rows.map(row => {
                  const lotInfo = lotsForSrc.find(l => l.lotId === row.lotId);
                  const maxQty = lotInfo?.qty ?? 0;
                  return (
                    <div key={row.id} className="rounded-lg p-3" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1">
                          <SelectInput
                            value={row.lotId}
                            onChange={e => updateSrcRow(src.id, row.id, { lotId: e.target.value, qtyToUse: 0 })}
                          >
                            <option value="">Select lot…</option>
                            {lotsForSrc.map(l => (
                              <option key={l.lotId} value={l.lotId}>
                                {l.lotId} — {l.qty} avail
                              </option>
                            ))}
                          </SelectInput>
                        </div>
                        {rows.length > 1 && (
                          <button
                            onClick={() => removeSrcRow(src.id, row.id)}
                            className="p-1 rounded hover:bg-red-50"
                            style={{ color: '#EF4444' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      {row.lotId && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs w-4 text-right" style={{ color: '#94A3B8' }}>0</span>
                          <input
                            type="range"
                            min={0}
                            max={maxQty}
                            value={row.qtyToUse}
                            onChange={e => updateSrcRow(src.id, row.id, { qtyToUse: parseInt(e.target.value, 10) })}
                            className="flex-1"
                          />
                          <span className="text-xs w-8 text-left" style={{ color: '#94A3B8' }}>{maxQty}</span>
                          <input
                            type="number"
                            min={0}
                            max={maxQty}
                            value={row.qtyToUse}
                            onChange={e => {
                              const v = Math.min(maxQty, Math.max(0, parseInt(e.target.value, 10) || 0));
                              updateSrcRow(src.id, row.id, { qtyToUse: v });
                            }}
                            className="w-16 text-xs text-right rounded-lg px-2 py-1 font-mono"
                            style={{ border: '1px solid #E2E8F0', backgroundColor: '#fff' }}
                          />
                          <button
                            onClick={() => updateSrcRow(src.id, row.id, { qtyToUse: maxQty })}
                            className="text-xs px-2 py-1 rounded-lg font-semibold"
                            style={{ backgroundColor: '#EEF2FF', color: '#6366F1' }}
                          >
                            MAX
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => addSrcRow(src.id)}
                disabled={!locationId}
                className="mt-2 flex items-center gap-1 text-xs font-medium disabled:opacity-40"
                style={{ color: '#6366F1' }}
              >
                <Plus size={12} /> Add Lot
              </button>
            </div>
          );
        })}
      </div>

      {/* Destination section */}
      <div className="mb-5 rounded-xl p-4" style={{ border: '1px solid #E2E8F0' }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#94A3B8' }}>
          Destination
        </p>

        {/* Attribute fields — above qty rows */}
        {outputSchema && outputSchema.fields.length > 0 && (
          <div className="mb-4">
            <div className="rounded-lg p-3 mb-3 text-xs font-medium"
                 style={{ backgroundColor: '#EEF2FF', color: '#6366F1' }}>
              Attributes — {recipe.output.formFactor}
            </div>
            {outputSchema.fields.map(field => (
              <FormField key={field.name} label={field.name} required={field.required}>
                {field.type === 'boolean' ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!attrValues[field.name]}
                      onChange={e => handleAttrChange(field.name, e.target.checked)} />
                    <span className="text-sm" style={{ color: '#1E1B4B' }}>
                      {attrValues[field.name] ? 'Yes' : 'No'}
                    </span>
                  </label>
                ) : field.type === 'date' ? (
                  <input type="date" value={attrValues[field.name] || ''}
                    onChange={e => handleAttrChange(field.name, e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm"
                    style={{ border: '1px solid #E2E8F0' }} />
                ) : field.type === 'number' ? (
                  <NumberInput value={attrValues[field.name] || ''}
                    onChange={e => handleAttrChange(field.name, e.target.value)} />
                ) : (
                  <TextInput value={attrValues[field.name] || ''}
                    onChange={e => handleAttrChange(field.name, e.target.value)} />
                )}
              </FormField>
            ))}
          </div>
        )}
        {!outputSchema && recipe?.output?.formFactor && (
          <div className="rounded-lg px-3 py-2 text-xs mb-3"
               style={{ backgroundColor: '#FEF9C3', color: '#854D0E' }}>
            No attribute schema defined for {recipe.output.formFactor}.
          </div>
        )}

        {/* Qty rows */}
        <div className="space-y-2">
          {destRows.map((row) => (
            <div key={row.id} className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <span className="text-xs" style={{ color: '#64748B' }}>Qty:</span>
                <input
                  type="number"
                  min={0}
                  value={row.qty}
                  onChange={e => updateDestRow(row.id, e.target.value)}
                  placeholder="0"
                  className="flex-1 text-sm font-mono bg-transparent outline-none"
                  style={{ color: '#1E1B4B' }}
                />
              </div>
              {destRows.length > 1 && (
                <button
                  onClick={() => removeDestRow(row.id)}
                  className="p-1 rounded hover:bg-red-50"
                  style={{ color: '#EF4444' }}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={addDestRow}
          className="mt-2 flex items-center gap-1 text-xs font-medium"
          style={{ color: '#6366F1' }}
        >
          <Plus size={12} /> Add Destination Lot
        </button>
      </div>

      {/* Status section */}
      {(() => {
        const destTotal = destRows.reduce((sum, r) => sum + (parseInt(r.qty, 10) || 0), 0);
        return (
          <div className="mb-5 rounded-xl p-4" style={{ border: '1px solid #E2E8F0' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#94A3B8' }}>
              Status
            </p>

            {/* Destination total row */}
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold" style={{ color: '#1E1B4B' }}>{item?.name}</span>
                <span className="text-xs ml-1" style={{ color: '#64748B' }}>• {recipe?.output?.formFactor}</span>
              </div>
              <span className="text-sm font-bold font-mono" style={{ color: destTotal > 0 ? '#1E1B4B' : '#CBD5E1' }}>
                {destTotal > 0 ? destTotal : '—'}
              </span>
            </div>

            {/* Per-source rows */}
            <div className="space-y-3">
              {(recipe?.sources || []).map(src => {
                const actualQty = (sourceRowsBySegment[src.id] || []).reduce((sum, r) => sum + (r.qtyToUse || 0), 0);
                const expectedQty = recipe.output.qty > 0 ? (src.qty / recipe.output.qty) * destTotal : 0;
                const variation = actualQty - expectedQty;
                const variationPct = (destTotal > 0 && expectedQty > 0) ? (variation / expectedQty) * 100 : null;
                const absPct = variationPct !== null ? Math.abs(variationPct) : null;
                const badgeStyle = absPct === null ? null
                  : absPct === 0   ? { color: '#10B981', backgroundColor: '#ECFDF5' }
                  : absPct <= 10   ? { color: '#B45309', backgroundColor: '#FFFBEB' }
                  :                  { color: '#DC2626', backgroundColor: '#FEF2F2' };
                const fmtNum = (n) => Number.isInteger(n) ? n : n.toFixed(1).replace(/\.0$/, '');

                return (
                  <div key={src.id}>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#1E1B4B' }}>
                      {getItemName(src.itemId)}
                      <span className="font-normal ml-1" style={{ color: '#64748B' }}>• {src.formFactor}</span>
                    </p>
                    <div className="flex items-center gap-3 text-xs flex-wrap">
                      <span style={{ color: '#64748B' }}>
                        Expected{' '}
                        <span className="font-mono font-semibold" style={{ color: '#1E1B4B' }}>
                          {destTotal > 0 ? fmtNum(expectedQty) : '—'}
                        </span>
                      </span>
                      <span style={{ color: '#64748B' }}>
                        Actual{' '}
                        <span className="font-mono font-semibold" style={{ color: '#1E1B4B' }}>
                          {actualQty > 0 ? actualQty : '—'}
                        </span>
                      </span>
                      {badgeStyle && (
                        <span className="px-1.5 py-0.5 rounded font-semibold" style={badgeStyle}>
                          {variation >= 0 ? '+' : ''}{fmtNum(variation)}
                          {' '}({variationPct >= 0 ? '+' : ''}{variationPct.toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      <SubmitButton
        loading={submitting}
        onClick={handleExecute}
        disabled={!canSubmit}
      >
        {executionType === 'draw-down' ? 'Draw Down' : 'Produce'}
      </SubmitButton>
    </ModalShell>
  );
}

// ── BatchMoveModal ─────────────────────────────────────────────

export function BatchMoveModal({ lots, locations, onMove, onClose }) {
  const [newLocationId, setNewLocationId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!newLocationId) return;
    setSubmitting(true);
    setTimeout(() => {
      onMove(newLocationId);
      setSubmitting(false);
    }, 200);
  };

  return (
    <ModalShell title={`Move ${lots.length} Lot${lots.length !== 1 ? 's' : ''}`} onClose={onClose}>
      <div className="rounded-xl p-3 mb-5" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
        <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#94A3B8' }}>
          Selected Lots
        </p>
        <div className="flex flex-wrap gap-1.5">
          {lots.map(lot => (
            <span key={lot.id} className="text-xs font-mono px-2 py-0.5 rounded"
                  style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
              {lot.id}
            </span>
          ))}
        </div>
      </div>

      <FormField label="New Location" required>
        <SelectInput value={newLocationId} onChange={e => setNewLocationId(e.target.value)}>
          <option value="">Select location…</option>
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>{loc.name} ({loc.type})</option>
          ))}
        </SelectInput>
      </FormField>

      <SubmitButton loading={submitting} onClick={handleSubmit} disabled={!newLocationId}>
        Move Lots
      </SubmitButton>
    </ModalShell>
  );
}

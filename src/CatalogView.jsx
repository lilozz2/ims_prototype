import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronDown, Plus, Package, Layers, Play } from 'lucide-react';

function LotRow({ lot, onLotClick }) {
  const [highlighted, setHighlighted] = useState(lot.highlightNew);
  const timerRef = useRef(null);

  useEffect(() => {
    if (lot.highlightNew) {
      setHighlighted(true);
      timerRef.current = setTimeout(() => setHighlighted(false), 1500);
    }
    return () => clearTimeout(timerRef.current);
  }, [lot.highlightNew]);

  return (
    <tr
      className="border-t border-slate-100 transition-colors duration-150 hover:bg-slate-50 cursor-pointer"
      style={highlighted ? { backgroundColor: '#fffbeb' } : {}}
      onClick={(e) => { e.stopPropagation(); onLotClick(lot); }}
    >
      <td className="py-2 pl-12 pr-3" style={{ fontSize: '13px', color: '#1E1B4B', fontFamily: 'monospace' }}>
        {lot.id}
        {lot.highlightNew && (
          <span
            className="ml-2 text-xs px-1.5 py-0.5 rounded font-medium"
            style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}
          >
            New
          </span>
        )}
      </td>
      <td className="py-2 px-3" style={{ fontSize: '13px', color: '#64748B' }}>{lot.formFactor}</td>
      <td className="py-2 px-3" style={{ fontSize: '13px', color: '#1E1B4B', fontWeight: 500 }}>
        {lot.qty.toLocaleString()}
      </td>
      <td className="py-2 px-3" style={{ fontSize: '13px', color: '#10B981', fontWeight: 500 }}>
        ${lot.buyInPrice.toFixed(2)}
      </td>
    </tr>
  );
}

function ItemRow({ item, category, onCreateLot, onLotClick, onProduceLot }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="border-t border-slate-100 hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <td className="py-3 pl-4 pr-2 w-8">
          <button
            className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
            aria-label={expanded ? 'Collapse lots' : 'Expand lots'}
            onClick={e => { e.stopPropagation(); setExpanded(v => !v); }}
          >
            {expanded
              ? <ChevronDown size={16} />
              : <ChevronRight size={16} />
            }
          </button>
        </td>
        <td className="py-3 px-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm" style={{ color: '#1E1B4B' }}>{item.name}</span>
            <span
              className="text-xs px-2 py-0.5 rounded font-mono"
              style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}
            >
              {item.sku}
            </span>
          </div>
        </td>
        <td className="py-3 px-3">
          <span
            className="text-xs px-2 py-1 rounded-full font-medium"
            style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}
          >
            {item.lots.length} {item.lots.length === 1 ? 'Lot' : 'Lots'}
          </span>
        </td>
        <td className="py-3 px-3 text-right">
          <div className="flex items-center justify-end gap-2">
            <button
              data-tutorial={item.sku === 'CP-001' ? 'create-lot-btn-coke-powder' : undefined}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-all duration-150 hover:bg-indigo-50"
              style={{ borderColor: '#6366F1', color: '#6366F1', backgroundColor: 'transparent' }}
              onClick={e => { e.stopPropagation(); onCreateLot(item); }}
              aria-label={`Create lot for ${item.name}`}
            >
              <Plus size={12} />
              Create Lot
            </button>
            {item.recipe && (
              <button
                data-tutorial={item.id === 'coke-004' ? 'produce-btn-coke' : undefined}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-all duration-150 hover:bg-slate-50"
                style={{ borderColor: '#94A3B8', color: '#475569', backgroundColor: 'transparent' }}
                onClick={e => { e.stopPropagation(); onProduceLot(item); }}
                aria-label={`Produce lot for ${item.name}`}
                title="Produce lot"
              >
                <Play size={12} />
                Produce
              </button>
            )}
          </div>
        </td>
      </tr>

      {/* Expanded lot sub-table */}
      {expanded && (
        <>
          {item.lots.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-4 pl-12 pr-4">
                <div className="flex items-center gap-3 text-sm" style={{ color: '#64748B' }}>
                  <Package size={16} className="opacity-40" />
                  <span>No lots yet. Create the first lot for this item.</span>
                  <button
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium cursor-pointer transition-all duration-150 hover:bg-indigo-50"
                    style={{ color: '#6366F1', borderColor: '#6366F1', border: '1px solid' }}
                    onClick={() => onCreateLot(item)}
                  >
                    <Plus size={11} />
                    Add
                  </button>
                </div>
              </td>
            </tr>
          ) : (
            <>
              <tr className="bg-slate-50">
                <td colSpan={4} className="pt-1 pb-0">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th
                          className="py-1.5 pl-12 pr-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: '#94A3B8' }}
                        >
                          Batch ID
                        </th>
                        <th
                          className="py-1.5 px-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: '#94A3B8' }}
                        >
                          Form Factor
                        </th>
                        <th
                          className="py-1.5 px-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: '#94A3B8' }}
                        >
                          Qty
                        </th>
                        <th
                          className="py-1.5 px-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: '#94A3B8' }}
                        >
                          Buy-in Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.lots.map(lot => (
                        <LotRow key={lot.id} lot={lot} onLotClick={onLotClick} />
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            </>
          )}
        </>
      )}
    </>
  );
}

export default function CatalogView({ data, selectedCategoryId, onCreateLot, onOpenModal, onLotClick, onProduceLot }) {
  const [activeTab, setActiveTab] = useState('lots');
  const category = data.categories.find(c => c.id === selectedCategoryId);

  if (!category) return null;

  const tabs = [
    { id: 'lots', label: 'Items & Lots' },
    { id: 'formFactors', label: 'Form Factors' },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: '#1E1B4B' }}>{category.name}</h1>
          <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>
            {category.items.length} items &bull; {category.formFactors.length} form factors
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
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

      {/* Items & Lots Tab */}
      {activeTab === 'lots' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {category.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6" style={{ color: '#64748B' }}>
              <Package size={40} className="mb-3 opacity-30" />
              <p className="text-base font-medium mb-1" style={{ color: '#1E1B4B' }}>No items in this category</p>
              <p className="text-sm text-center">
                Switch to Catalog Manager to add items to {category.name}.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-3 pl-4 pr-2 w-8"></th>
                    <th
                      className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: '#64748B' }}
                    >
                      Item
                    </th>
                    <th
                      className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: '#64748B' }}
                    >
                      Lots
                    </th>
                    <th className="py-3 px-3 text-right w-36"></th>
                  </tr>
                </thead>
                <tbody>
                  {category.items.map(item => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      category={category}
                      onCreateLot={(item) => onCreateLot(selectedCategoryId, item)}
                      onLotClick={onLotClick}
                      onProduceLot={onProduceLot}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Form Factors Tab */}
      {activeTab === 'formFactors' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          {category.formFactors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12" style={{ color: '#64748B' }}>
              <Layers size={36} className="mb-3 opacity-30" />
              <p className="text-base font-medium mb-1" style={{ color: '#1E1B4B' }}>No form factors configured</p>
              <p className="text-sm text-center">
                Add them in Catalog Manager to define available packaging formats.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: '#64748B' }}>
                Available Form Factors
              </p>
              <div className="flex flex-wrap gap-2">
                {category.formFactors.map(ff => {
                  const uomEntry = ff.uomId ? data.uom?.find(u => u.id === ff.uomId) : null;
                  return (
                    <span
                      key={ff.name}
                      className="px-3 py-1.5 rounded-full text-sm font-medium border"
                      style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', borderColor: '#C7D2FE' }}
                    >
                      {ff.name}
                      {ff.quantity != null && uomEntry ? (
                        <span className="text-xs opacity-60 ml-1">· {ff.quantity} {uomEntry.symbol}</span>
                      ) : null}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { Package, BarChart3, Ruler, ArrowLeftRight, MapPin } from 'lucide-react';
import CatalogView from './CatalogView.jsx';
import CatalogManager from './CatalogManager.jsx';
import { UomSection, UomConversionsSection, LocationsSection } from './GlobalSettings.jsx';
import { CreateLotModal, AddItemModal, SchemaBuilderModal, AddPolicyModal, AddLocationModal, ExecutionModal, LotTransactionHistoryModal } from './Modals.jsx';
import RecipeBuilder from './RecipeBuilder.jsx';

const INITIAL_DATA = {
  categories: [
    {
      id: 'beverages',
      name: 'Beverages',
      formFactors: ['12oz Can', '5 Gal Keg', '1L Bottle', 'Bulk'],
      items: [
        {
          id: 'bw-001',
          name: 'Sparkling Water',
          sku: 'BW-001',
          defaultFormFactor: '12oz Can',
          /**
         * lots[]: Array of lot objects.
         * Each lot shape:
         * {
         *   id: string,
         *   formFactor: string,
         *   qty: number,            // current quantity (net sum of all transaction qtyChange values)
         *   buyInPrice: number,
         *   highlightNew: boolean,
         *   transactions: Array<{
         *     id: string,
         *     type: "buy-in" | "production-use",
         *     timestamp: string,    // ISO-8601
         *     qtyChange: number,    // positive = inflow, negative = outflow
         *     reference: string | null  // null for buy-in; output Batch ID for production-use
         *   }>
         * }
         */
        lots: [
            {
              id: 'B-2023-10',
              formFactor: '12oz Can',
              qty: 500,
              buyInPrice: 0.45,
              highlightNew: false,
              transactions: [
                { id: 'TXN-001', type: 'buy-in', timestamp: '2023-10-01T09:00:00', qtyChange: 500, reference: null },
              ],
            },
            {
              id: 'B-2023-11',
              formFactor: '5 Gal Keg',
              qty: 20,
              buyInPrice: 45.00,
              highlightNew: false,
              transactions: [
                { id: 'TXN-002', type: 'buy-in',         timestamp: '2023-10-05T08:30:00', qtyChange:  20, reference: null        },
                { id: 'TXN-003', type: 'production-use', timestamp: '2023-10-12T14:15:00', qtyChange:  -1, reference: 'B-2023-10' },
              ],
            },
          ],
          warehousePolicies: [
            { id: 'wp-1', locationId: 'LOC-001', minStock: 100, maxStock: 1000, conditions: 'Ambient', reorderTrigger: 150 },
            { id: 'wp-2', locationId: 'LOC-002', minStock: 20, maxStock: 200, conditions: 'Refrigerated', reorderTrigger: 30 },
          ],
          recipe: {
            id: 'r-001',
            name: 'Keg to Can Repack',
            sources: [{ itemId: 'bw-001', formFactor: '5 Gal Keg', qty: 1 }],
            output: { formFactor: '12oz Can', qty: 500 },
          },
        },
        {
          id: 'oj-002',
          name: 'Orange Juice',
          sku: 'OJ-002',
          defaultFormFactor: '1L Bottle',
          lots: [],
          warehousePolicies: [],
          recipe: {
            id: 'r-002',
            name: 'OJ Bulk Split',
            sources: [{ itemId: 'oj-002', formFactor: 'Bulk', qty: 1 }],
            output: { formFactor: '1L Bottle', qty: 100 },
          },
        },
      ],
      attributeSchemas: [
        {
          id: 'as-1',
          itemId: 'bw-001',
          formFactor: '12oz Can',
          fields: [
            { name: 'Carbonation Level', type: 'number', required: true },
            { name: 'Expiry Date', type: 'date', required: true },
          ],
        },
        {
          id: 'as-2',
          itemId: 'bw-001',
          formFactor: '5 Gal Keg',
          fields: [
            { name: 'Pressure PSI', type: 'number', required: true },
            { name: 'Fill Volume', type: 'number', required: true },
            { name: 'Expiry Date', type: 'date', required: true },
          ],
        },
        {
          id: 'as-3',
          itemId: 'oj-002',
          formFactor: '1L Bottle',
          fields: [
            { name: 'Pulp Level', type: 'text', required: false },
            { name: 'Pasteurized', type: 'boolean', required: true },
            { name: 'Expiry Date', type: 'date', required: true },
          ],
        },
      ],
    },
    {
      id: 'apparel',
      name: 'Apparel',
      formFactors: ['S', 'M', 'L', 'XL'],
      items: [],
      attributeSchemas: [],
    },
  ],
  locations: [
    { id: 'LOC-001', name: 'Warehouse A', type: 'Warehouse', capacity: 10000 },
    { id: 'LOC-002', name: 'Cold Storage B', type: 'Cold Storage', capacity: 2000 },
    { id: 'LOC-003', name: 'Distribution Hub', type: 'Distribution Centre', capacity: 5000 },
  ],
  uom: [
    { id: 'fl-oz', name: 'Fluid Ounce', symbol: 'fl oz', type: 'volume' },
    { id: 'ml', name: 'Millilitre', symbol: 'ml', type: 'volume' },
    { id: 'l', name: 'Litre', symbol: 'L', type: 'volume' },
    { id: 'gal', name: 'Gallon', symbol: 'gal', type: 'volume' },
    { id: 'kg', name: 'Kilogram', symbol: 'kg', type: 'weight' },
    { id: 'g', name: 'Gram', symbol: 'g', type: 'weight' },
    { id: 'lb', name: 'Pound', symbol: 'lb', type: 'weight' },
  ],
  uomConversions: [
    { id: 'c1', fromId: 'gal', toId: 'fl-oz', factor: 128 },
    { id: 'c2', fromId: 'l', toId: 'fl-oz', factor: 33.814 },
    { id: 'c3', fromId: 'kg', toId: 'lb', factor: 2.205 },
  ],
};

function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, 2500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  return (
    <div
      className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg toast-slide-up"
      style={{
        backgroundColor: isSuccess ? '#10B981' : '#EF4444',
        color: '#fff',
        minWidth: '240px',
        maxWidth: '360px',
      }}
      role="alert"
      aria-live="polite"
    >
      <span className="text-sm font-medium">{toast.message}</span>
      <button
        className="ml-auto cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState('catalog');
  const [data, setData] = useState(INITIAL_DATA);
  const [selectedCategoryId, setSelectedCategoryId] = useState('beverages');
  const [toast, setToast] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [recipeBuilderState, setRecipeBuilderState] = useState(null); // { item, categoryId }
  const [selectedLot, setSelectedLot] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const openModal = useCallback((type, payload = {}) => {
    setActiveModal({ type, payload });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  // ── Data mutators ──────────────────────────────────────────────

  const handleCreateLot = useCallback(({ categoryId, itemId, lot }) => {
    const buyInTxn = {
      id: `TXN-${Date.now()}`,
      type: 'buy-in',
      timestamp: new Date().toISOString(),
      qtyChange: lot.qty,
      reference: null,
    };
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id !== categoryId ? cat : {
          ...cat,
          items: cat.items.map(item =>
            item.id !== itemId ? item : {
              ...item,
              lots: [...item.lots, { ...lot, highlightNew: true, transactions: [buyInTxn] }],
            }
          ),
        }
      ),
    }));
    showToast('Lot created successfully', 'success');
    closeModal();
  }, [showToast, closeModal]);

  const handleAddItem = useCallback(({ categoryId, item }) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id !== categoryId ? cat : {
          ...cat,
          items: [...cat.items, item],
        }
      ),
    }));
    showToast('Item added', 'success');
    closeModal();
  }, [showToast, closeModal]);

  const handleEditItem = useCallback(({ categoryId, item }) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id !== categoryId ? cat : {
          ...cat,
          items: cat.items.map(i => i.id === item.id ? { ...i, ...item } : i),
        }
      ),
    }));
    showToast('Item updated', 'success');
    closeModal();
  }, [showToast, closeModal]);

  const handleDeleteItems = useCallback(({ categoryId, itemIds }) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id !== categoryId ? cat : {
          ...cat,
          items: cat.items.filter(i => !itemIds.includes(i.id)),
        }
      ),
    }));
    showToast(`${itemIds.length} item(s) deleted`, 'success');
  }, [showToast]);

  const handleUpdateFormFactors = useCallback(({ categoryId, formFactors }) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id !== categoryId ? cat : { ...cat, formFactors }
      ),
    }));
  }, []);

  const handleAddSchema = useCallback(({ categoryId, schema }) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id !== categoryId ? cat : {
          ...cat,
          attributeSchemas: [...cat.attributeSchemas, schema],
        }
      ),
    }));
    showToast('Attribute schema saved', 'success');
    closeModal();
  }, [showToast, closeModal]);

  const handleEditSchema = useCallback(({ categoryId, schema }) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id !== categoryId ? cat : {
          ...cat,
          attributeSchemas: cat.attributeSchemas.map(s => s.id === schema.id ? schema : s),
        }
      ),
    }));
    showToast('Schema updated', 'success');
    closeModal();
  }, [showToast, closeModal]);

  const handleAddPolicy = useCallback(({ categoryId, itemId, policy }) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id !== categoryId ? cat : {
          ...cat,
          items: cat.items.map(item =>
            item.id !== itemId ? item : {
              ...item,
              warehousePolicies: [...item.warehousePolicies, policy],
            }
          ),
        }
      ),
    }));
    showToast('Warehouse policy added', 'success');
    closeModal();
  }, [showToast, closeModal]);

  const handleEditPolicy = useCallback(({ categoryId, itemId, policy }) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id !== categoryId ? cat : {
          ...cat,
          items: cat.items.map(item =>
            item.id !== itemId ? item : {
              ...item,
              warehousePolicies: item.warehousePolicies.map(p => p.id === policy.id ? policy : p),
            }
          ),
        }
      ),
    }));
    showToast('Policy updated', 'success');
    closeModal();
  }, [showToast, closeModal]);

  const handleRemovePolicy = useCallback(({ categoryId, itemId, policyId }) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id !== categoryId ? cat : {
          ...cat,
          items: cat.items.map(item =>
            item.id !== itemId ? item : {
              ...item,
              warehousePolicies: item.warehousePolicies.filter(p => p.id !== policyId),
            }
          ),
        }
      ),
    }));
    showToast('Policy removed', 'success');
  }, [showToast]);

  const handleAddLocation = useCallback(({ location }) => {
    setData(prev => ({
      ...prev,
      locations: [...prev.locations, location],
    }));
    showToast('Location added', 'success');
    closeModal();
  }, [showToast, closeModal]);

  const handleEditLocation = useCallback(({ location }) => {
    setData(prev => ({
      ...prev,
      locations: prev.locations.map(l => l.id === location.id ? location : l),
    }));
    showToast('Location updated', 'success');
    closeModal();
  }, [showToast, closeModal]);

  const handleDeleteLocation = useCallback(({ locationId }) => {
    setData(prev => ({
      ...prev,
      locations: prev.locations.filter(l => l.id !== locationId),
    }));
    showToast('Location deleted', 'success');
  }, [showToast]);

  const handleAddConversion = useCallback(({ conversion }) => {
    setData(prev => ({
      ...prev,
      uomConversions: [...prev.uomConversions, conversion],
    }));
    showToast('Conversion added', 'success');
  }, [showToast]);

  const handleDeleteConversion = useCallback(({ conversionId }) => {
    setData(prev => ({
      ...prev,
      uomConversions: prev.uomConversions.filter(c => c.id !== conversionId),
    }));
    showToast('Conversion removed', 'success');
  }, [showToast]);

  const handleSaveRecipe = useCallback((itemId, recipe) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => ({
        ...cat,
        items: cat.items.map(item =>
          item.id !== itemId ? item : { ...item, recipe }
        ),
      })),
    }));
    const itemName = (() => {
      for (const cat of data.categories) {
        const found = cat.items.find(i => i.id === itemId);
        if (found) return found.name;
      }
      return itemId;
    })();
    showToast(`Recipe saved for ${itemName}`, 'success');
    setRecipeBuilderState(null);
    closeModal();
  }, [showToast, closeModal, data.categories]);

  const handleDeleteRecipe = useCallback((itemId) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => ({
        ...cat,
        items: cat.items.map(item =>
          item.id !== itemId ? item : { ...item, recipe: null }
        ),
      })),
    }));
    showToast('Recipe deleted', 'success');
  }, [showToast]);

  const handleExecuteRecipe = useCallback(({ categoryId, item, recipe, sourceLocationIds, destLocationId, multiplier, newBatchId, newLot }) => {
    setData(prev => {
      let newData = { ...prev, categories: prev.categories.map(cat => ({ ...cat, items: cat.items.map(i => ({ ...i, lots: [...i.lots] })) })) };

      // Deduct source lots FIFO per source
      recipe.sources.forEach((src, srcIndex) => {
        const consumeQty = src.qty * multiplier;
        let remaining = consumeQty;
        const newBatchIdRef = newBatchId;
        newData.categories = newData.categories.map(cat =>
          cat.id !== categoryId ? cat : {
            ...cat,
            items: cat.items.map(i =>
              i.id !== src.itemId ? i : {
                ...i,
                lots: i.lots.map(lot => {
                  if (remaining <= 0 || lot.formFactor !== src.formFactor) return lot;
                  const deduct = Math.min(lot.qty, remaining);
                  remaining -= deduct;
                  const productionTxn = {
                    id: `TXN-${Date.now()}-${srcIndex}`,
                    type: 'production-use',
                    timestamp: new Date().toISOString(),
                    qtyChange: -deduct,
                    reference: newBatchIdRef,
                  };
                  return {
                    ...lot,
                    qty: lot.qty - deduct,
                    transactions: [...(lot.transactions || []), productionTxn],
                  };
                }),
              }
            ),
          }
        );
      });

      // Add the new output lot
      newData.categories = newData.categories.map(cat =>
        cat.id !== categoryId ? cat : {
          ...cat,
          items: cat.items.map(i =>
            i.id !== item.id ? i : {
              ...i,
              lots: [...i.lots, newLot],
            }
          ),
        }
      );

      return newData;
    });
    showToast(`Production complete. Lot ${newBatchId} created.`, 'success');
    closeModal();
  }, [showToast, closeModal]);

  // ── Callbacks passed down ──────────────────────────────────────

  const catalogHandlers = {
    onCreateLot: (categoryId, item) => openModal('createLot', { categoryId, item }),
    onOpenModal: openModal,
    onLotClick: (lot) => setSelectedLot(lot),
    onProduceLot: (item) => openModal('produceLot', { categoryId: selectedCategoryId, item }),
  };

  const managerHandlers = {
    onUpdate: {
      addItem: handleAddItem,
      editItem: handleEditItem,
      deleteItems: handleDeleteItems,
      updateFormFactors: handleUpdateFormFactors,
      addSchema: handleAddSchema,
      editSchema: handleEditSchema,
      addPolicy: handleAddPolicy,
      editPolicy: handleEditPolicy,
      removePolicy: handleRemovePolicy,
    },
    onOpenModal: openModal,
  };

  const globalHandlers = {
    onUpdate: {
      addLocation: handleAddLocation,
      editLocation: handleEditLocation,
      deleteLocation: handleDeleteLocation,
      addConversion: handleAddConversion,
      deleteConversion: handleDeleteConversion,
    },
    onOpenModal: openModal,
  };

  const selectedCategory = data.categories.find(c => c.id === selectedCategoryId);

  // ── Sidebar items ──────────────────────────────────────────────

  const sidebarCategories = data.categories;

  // ── Modal rendering ────────────────────────────────────────────

  function renderModal() {
    if (!activeModal) return null;
    const { type, payload } = activeModal;

    if (type === 'createLot') {
      const category = data.categories.find(c => c.id === payload.categoryId);
      return (
        <CreateLotModal
          category={category}
          item={payload.item}
          onSubmit={(lot) => handleCreateLot({ categoryId: payload.categoryId, itemId: payload.item.id, lot })}
          onClose={closeModal}
        />
      );
    }
    if (type === 'addItem') {
      return (
        <AddItemModal
          category={data.categories.find(c => c.id === payload.categoryId)}
          existingItem={null}
          onSubmit={(item) => handleAddItem({ categoryId: payload.categoryId, item })}
          onClose={closeModal}
        />
      );
    }
    if (type === 'editItem') {
      return (
        <AddItemModal
          category={data.categories.find(c => c.id === payload.categoryId)}
          existingItem={payload.item}
          onSubmit={(item) => handleEditItem({ categoryId: payload.categoryId, item })}
          onClose={closeModal}
        />
      );
    }
    if (type === 'addSchema') {
      return (
        <SchemaBuilderModal
          category={data.categories.find(c => c.id === payload.categoryId)}
          existingSchema={null}
          onSubmit={(schema) => handleAddSchema({ categoryId: payload.categoryId, schema })}
          onClose={closeModal}
        />
      );
    }
    if (type === 'editSchema') {
      return (
        <SchemaBuilderModal
          category={data.categories.find(c => c.id === payload.categoryId)}
          existingSchema={payload.schema}
          onSubmit={(schema) => handleEditSchema({ categoryId: payload.categoryId, schema })}
          onClose={closeModal}
        />
      );
    }
    if (type === 'addPolicy') {
      const category = data.categories.find(c => c.id === payload.categoryId);
      const item = category?.items.find(i => i.id === payload.itemId);
      return (
        <AddPolicyModal
          locations={data.locations}
          item={item}
          existingPolicy={null}
          onSubmit={(policy) => handleAddPolicy({ categoryId: payload.categoryId, itemId: payload.itemId, policy })}
          onClose={closeModal}
        />
      );
    }
    if (type === 'editPolicy') {
      const category = data.categories.find(c => c.id === payload.categoryId);
      const item = category?.items.find(i => i.id === payload.itemId);
      return (
        <AddPolicyModal
          locations={data.locations}
          item={item}
          existingPolicy={payload.policy}
          onSubmit={(policy) => handleEditPolicy({ categoryId: payload.categoryId, itemId: payload.itemId, policy })}
          onClose={closeModal}
        />
      );
    }
    if (type === 'addLocation') {
      return (
        <AddLocationModal
          locations={data.locations}
          existingLocation={null}
          onSubmit={(location) => handleAddLocation({ location })}
          onClose={closeModal}
        />
      );
    }
    if (type === 'editLocation') {
      return (
        <AddLocationModal
          locations={data.locations}
          existingLocation={payload.location}
          onSubmit={(location) => handleEditLocation({ location })}
          onClose={closeModal}
        />
      );
    }
    if (type === 'editRecipe') {
      return (
        <RecipeBuilder
          item={payload.item}
          initialRecipe={payload.item.recipe}
          data={data}
          onSave={(recipe) => handleSaveRecipe(payload.item.id, recipe)}
          onClose={closeModal}
        />
      );
    }
    if (type === 'produceLot') {
      return (
        <ExecutionModal
          item={payload.item}
          recipe={payload.item.recipe}
          data={data}
          onExecute={(execPayload) => handleExecuteRecipe({ ...execPayload, categoryId: payload.categoryId, item: payload.item })}
          onClose={closeModal}
        />
      );
    }
    return null;
  }

  // ── Render ─────────────────────────────────────────────────────


  return (
    <div className="h-full" style={{ backgroundColor: '#F5F3FF' }}>
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 h-14 flex items-center px-6 border-b border-indigo-100 bg-white z-30"
        style={{ boxShadow: '0 1px 3px rgba(99,102,241,0.08)' }}
      >
        <div className="flex items-center gap-2 mr-8">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#6366F1' }}
          >
            <Package size={15} color="#fff" />
          </div>
          <span className="font-semibold text-base" style={{ color: '#1E1B4B' }}>
            Nanolumi IMS
          </span>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          <button
            className="px-4 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-all duration-150"
            style={
              mode === 'catalog'
                ? { backgroundColor: '#6366F1', color: '#fff', boxShadow: '0 1px 3px rgba(99,102,241,0.3)' }
                : { backgroundColor: 'transparent', color: '#64748B' }
            }
            onClick={() => {
              setMode('catalog');
              if (['__uom', '__conversions', '__locations'].includes(selectedCategoryId)) {
                setSelectedCategoryId(data.categories[0]?.id ?? '');
              }
            }}
          >
            Catalog
          </button>
          <button
            className="px-4 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-all duration-150"
            style={
              mode === 'manager'
                ? { backgroundColor: '#6366F1', color: '#fff', boxShadow: '0 1px 3px rgba(99,102,241,0.3)' }
                : { backgroundColor: 'transparent', color: '#64748B' }
            }
            onClick={() => setMode('manager')}
          >
            Catalog Manager
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className="fixed left-0 top-14 bottom-0 bg-white border-r border-slate-100 flex flex-col z-20 overflow-y-auto"
        style={{ width: '240px' }}
      >
        <div className="pt-4 pb-2 px-3">
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#64748B' }}>
            Categories
          </p>
          {sidebarCategories.map(cat => {
            const isActive = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                className="w-full text-left px-3 py-2 rounded-lg mb-0.5 cursor-pointer flex items-center gap-2 transition-all duration-150"
                style={
                  isActive
                    ? { backgroundColor: '#EEF2FF', color: '#4F46E5', borderLeft: '3px solid #6366F1' }
                    : { color: '#1E1B4B', borderLeft: '3px solid transparent' }
                }
                onClick={() => setSelectedCategoryId(cat.id)}
              >
                <BarChart3 size={14} style={{ flexShrink: 0, color: isActive ? '#6366F1' : '#94A3B8' }} />
                <span className="text-sm truncate">{cat.name}</span>
                <span
                  className="ml-auto text-xs px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: isActive ? '#E0E7FF' : '#F1F5F9',
                    color: isActive ? '#4F46E5' : '#64748B',
                  }}
                >
                  {cat.items.length}
                </span>
              </button>
            );
          })}
        </div>

        {mode === 'manager' && <div className="mx-3 border-t border-slate-100 my-2" />}

        {mode === 'manager' && <div className="px-3 pb-4">
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#64748B' }}>
            Configuration
          </p>
          {[
            { id: '__uom', label: 'Units of Measure', Icon: Ruler },
            { id: '__conversions', label: 'UoM Conversions', Icon: ArrowLeftRight },
            { id: '__locations', label: 'Locations', Icon: MapPin },
          ].map(({ id, label, Icon }) => {
            const isActive = selectedCategoryId === id;
            return (
              <button
                key={id}
                className="w-full text-left px-3 py-2 rounded-lg mb-0.5 cursor-pointer flex items-center gap-2 transition-all duration-150"
                style={
                  isActive
                    ? { backgroundColor: '#EEF2FF', color: '#4F46E5', borderLeft: '3px solid #6366F1' }
                    : { color: '#1E1B4B', borderLeft: '3px solid transparent' }
                }
                onClick={() => setSelectedCategoryId(id)}
              >
                <Icon size={14} style={{ flexShrink: 0, color: isActive ? '#6366F1' : '#94A3B8' }} />
                <span className="text-sm">{label}</span>
              </button>
            );
          })}
        </div>}
      </aside>

      {/* Main content */}
      <main
        className="pt-14 min-h-full"
        style={{ marginLeft: '240px' }}
      >
        <div className="p-6">
          {(() => {
            if (selectedCategoryId === '__uom') {
              return <UomSection uom={data.uom} />;
            }
            if (selectedCategoryId === '__conversions') {
              return (
                <UomConversionsSection
                  uom={data.uom}
                  conversions={data.uomConversions}
                  onUpdate={globalHandlers.onUpdate}
                />
              );
            }
            if (selectedCategoryId === '__locations') {
              return (
                <LocationsSection
                  locations={data.locations}
                  onUpdate={globalHandlers.onUpdate}
                  onOpenModal={openModal}
                />
              );
            }

            if (mode === 'catalog' && selectedCategory) {
              return (
                <CatalogView
                  data={data}
                  selectedCategoryId={selectedCategoryId}
                  onCreateLot={catalogHandlers.onCreateLot}
                  onOpenModal={catalogHandlers.onOpenModal}
                  onLotClick={catalogHandlers.onLotClick}
                  onProduceLot={catalogHandlers.onProduceLot}
                />
              );
            }
            if (mode === 'manager' && selectedCategory) {
              return (
                <CatalogManager
                  data={data}
                  selectedCategoryId={selectedCategoryId}
                  onUpdate={managerHandlers.onUpdate}
                  onOpenModal={managerHandlers.onOpenModal}
                />
              );
            }

            return null;
          })()}
        </div>
      </main>

      {/* Modals */}
      {renderModal()}

      {/* Lot Transaction History Panel */}
      {selectedLot && (
        <LotTransactionHistoryModal
          lot={selectedLot}
          onClose={() => setSelectedLot(null)}
        />
      )}

      {/* Toast */}
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { Package, BarChart3, Ruler, ArrowLeftRight, MapPin, BookOpen } from 'lucide-react';
import CatalogManager from './CatalogManager.jsx';
import { UomSection, UomConversionsSection, LocationsSection } from './GlobalSettings.jsx';
import { PurchaseLotsModal, AddItemModal, SchemaBuilderModal, AddPolicyModal, AddLocationModal, ExecutionModal, LotTransactionHistoryModal, AttachFormFactorsModal } from './Modals.jsx';
import RecipeBuilder from './RecipeBuilder.jsx';
import Tutorial, { TUTORIAL_STEPS } from './Tutorial.jsx';

const INITIAL_DATA = {
  categories: [
    {
      id: 'ingredients',
      name: 'Ingredients',
      formFactors: [
        { name: '2.5kg bag' },
        { name: '200L drum' },
        { name: '1L bottle' },
        { name: '5L Jerry can' },
      ],
      items: [
        {
          id: 'powder-001',
          name: 'powder',
          sku: 'PWD-001',
          uomId: 'kg',
          formFactors: ['2.5kg bag'],
          defaultFormFactor: '2.5kg bag',
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
              id: 'B-PWD-2401',
              formFactor: '2.5kg bag',
              qty: 50,
              buyInPrice: 12.50,
              highlightNew: false,
              transactions: [
                {
                  id: 'TXN-PWD-2401-001',
                  type: 'buy-in',
                  timestamp: '2025-01-15T09:00:00.000Z',
                  qtyChange: 50,
                  reference: null,
                },
              ],
            },
            {
              id: 'B-PWD-2402',
              formFactor: '2.5kg bag',
              qty: 25,
              buyInPrice: 12.80,
              highlightNew: false,
              transactions: [
                {
                  id: 'TXN-PWD-2402-001',
                  type: 'buy-in',
                  timestamp: '2025-02-10T09:00:00.000Z',
                  qtyChange: 37.5,
                  reference: null,
                },
                {
                  id: 'TXN-PWD-2402-002',
                  type: 'production-use',
                  timestamp: '2025-02-20T14:00:00.000Z',
                  qtyChange: -12.5,
                  reference: 'PROD-001',
                },
              ],
            },
            {
              id: 'B-PWD-2403',
              formFactor: '2.5kg bag',
              qty: 12.5,
              buyInPrice: 13.00,
              highlightNew: false,
              transactions: [
                {
                  id: 'TXN-PWD-2403-001',
                  type: 'buy-in',
                  timestamp: '2025-03-10T09:00:00.000Z',
                  qtyChange: 12.5,
                  reference: null,
                },
              ],
            },
          ],
          warehousePolicies: [],
          recipe: null,
        },
        {
          id: 'solvent-001',
          name: 'solvent',
          sku: 'SLV-001',
          uomId: 'l',
          formFactors: ['200L drum'],
          defaultFormFactor: '200L drum',
          lots: [
            {
              id: 'B-SLV-2401',
              formFactor: '200L drum',
              qty: 800,
              buyInPrice: 1.20,
              highlightNew: false,
              transactions: [
                {
                  id: 'TXN-SLV-2401-001',
                  type: 'buy-in',
                  timestamp: '2025-01-20T09:00:00.000Z',
                  qtyChange: 800,
                  reference: null,
                },
              ],
            },
            {
              id: 'B-SLV-2402',
              formFactor: '200L drum',
              qty: 600,
              buyInPrice: 1.15,
              highlightNew: false,
              transactions: [
                {
                  id: 'TXN-SLV-2402-001',
                  type: 'buy-in',
                  timestamp: '2025-02-15T09:00:00.000Z',
                  qtyChange: 1000,
                  reference: null,
                },
                {
                  id: 'TXN-SLV-2402-002',
                  type: 'production-use',
                  timestamp: '2025-02-25T14:00:00.000Z',
                  qtyChange: -400,
                  reference: 'PROD-002',
                },
              ],
            },
            {
              id: 'B-SLV-2403',
              formFactor: '200L drum',
              qty: 200,
              buyInPrice: 1.25,
              highlightNew: false,
              transactions: [
                {
                  id: 'TXN-SLV-2403-001',
                  type: 'buy-in',
                  timestamp: '2025-03-12T09:00:00.000Z',
                  qtyChange: 200,
                  reference: null,
                },
              ],
            },
          ],
          warehousePolicies: [],
          recipe: null,
        },
        {
          id: 'marker-001',
          name: 'marker solution',
          sku: 'MKR-001',
          uomId: 'l',
          formFactors: ['200L drum', '1L bottle', '5L Jerry can'],
          defaultFormFactor: '200L drum',
          lots: [
            {
              id: 'B-MKR-D2401',
              formFactor: '200L drum',
              qty: 1000,
              buyInPrice: 2.50,
              highlightNew: false,
              transactions: [
                {
                  id: 'TXN-MKR-D2401-001',
                  type: 'buy-in',
                  timestamp: '2025-01-25T09:00:00.000Z',
                  qtyChange: 1000,
                  reference: null,
                },
              ],
            },
            {
              id: 'B-MKR-D2402',
              formFactor: '200L drum',
              qty: 400,
              buyInPrice: 2.45,
              highlightNew: false,
              transactions: [
                {
                  id: 'TXN-MKR-D2402-001',
                  type: 'buy-in',
                  timestamp: '2025-02-20T09:00:00.000Z',
                  qtyChange: 600,
                  reference: null,
                },
                {
                  id: 'TXN-MKR-D2402-002',
                  type: 'production-use',
                  timestamp: '2025-03-01T14:00:00.000Z',
                  qtyChange: -200,
                  reference: 'PROD-003',
                },
              ],
            },
            {
              id: 'B-MKR-B2401',
              formFactor: '1L bottle',
              qty: 50,
              buyInPrice: 3.20,
              highlightNew: false,
              transactions: [
                {
                  id: 'TXN-MKR-B2401-001',
                  type: 'buy-in',
                  timestamp: '2025-02-01T09:00:00.000Z',
                  qtyChange: 50,
                  reference: null,
                },
              ],
            },
            {
              id: 'B-MKR-B2402',
              formFactor: '1L bottle',
              qty: 30,
              buyInPrice: 3.10,
              highlightNew: false,
              transactions: [
                {
                  id: 'TXN-MKR-B2402-001',
                  type: 'buy-in',
                  timestamp: '2025-03-01T09:00:00.000Z',
                  qtyChange: 30,
                  reference: null,
                },
              ],
            },
            {
              id: 'B-MKR-J2401',
              formFactor: '5L Jerry can',
              qty: 100,
              buyInPrice: 2.80,
              highlightNew: false,
              transactions: [
                {
                  id: 'TXN-MKR-J2401-001',
                  type: 'buy-in',
                  timestamp: '2025-01-30T09:00:00.000Z',
                  qtyChange: 100,
                  reference: null,
                },
              ],
            },
            {
              id: 'B-MKR-J2402',
              formFactor: '5L Jerry can',
              qty: 75,
              buyInPrice: 2.75,
              highlightNew: false,
              transactions: [
                {
                  id: 'TXN-MKR-J2402-001',
                  type: 'buy-in',
                  timestamp: '2025-02-15T09:00:00.000Z',
                  qtyChange: 100,
                  reference: null,
                },
                {
                  id: 'TXN-MKR-J2402-002',
                  type: 'production-use',
                  timestamp: '2025-03-05T14:00:00.000Z',
                  qtyChange: -25,
                  reference: 'PROD-004',
                },
              ],
            },
          ],
          warehousePolicies: [],
          recipe: null,
        },
      ],
      attributeSchemas: [
        {
          id: 'as-1',
          itemId: 'powder-001',
          formFactor: '2.5kg bag',
          fields: [
            { name: 'Manufacturing date', type: 'date',   required: true },
            { name: 'Production batch',   type: 'number', required: true },
          ],
        },
        {
          id: 'as-2',
          itemId: 'solvent-001',
          formFactor: '200L drum',
          fields: [
            { name: 'Manufacturing date', type: 'date', required: true },
          ],
        },
        {
          id: 'as-4',
          itemId: 'marker-001',
          formFactor: '200L drum',
          fields: [
            { name: 'Manufacturing date', type: 'date',   required: true },
            { name: 'blending batch',     type: 'number', required: true },
          ],
        },
        {
          id: 'as-5',
          itemId: 'marker-001',
          formFactor: '1L bottle',
          fields: [
            { name: 'Manufacturing date', type: 'date',   required: true },
            { name: 'blending batch',     type: 'number', required: true },
          ],
        },
        {
          id: 'as-6',
          itemId: 'marker-001',
          formFactor: '5L Jerry can',
          fields: [
            { name: 'Manufacturing date', type: 'date',   required: true },
            { name: 'blending batch',     type: 'number', required: true },
          ],
        },
      ],
    },
    {
      id: 'misc',
      name: 'Misc',
      formFactors: [],
      items: [],
      attributeSchemas: [],
    },
  ],
  locations: [
    { id: 'LOC-001', name: 'SG Warehouse', type: 'Warehouse', capacity: 10000 },
    { id: 'LOC-002', name: 'Ushkun Warehouse', type: 'Warehouse', capacity: 2000 },
    { id: 'LOC-003', name: 'Satellite Warehouse', type: 'Warehouse', capacity: 5000 },
  ],
  uom: [
    { id: 'kg', name: 'Kilogram', symbol: 'kg', type: 'weight' },
    { id: 'l',  name: 'Litre',    symbol: 'L',  type: 'volume' },
  ],
  uomConversions: [],
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
  const [data, setData] = useState(INITIAL_DATA);
  const [selectedCategoryId, setSelectedCategoryId] = useState('ingredients');
  const [toast, setToast] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [recipeBuilderState, setRecipeBuilderState] = useState(null); // { item, categoryId }
  const [managerActiveTab, setManagerActiveTab] = useState('items');
  const [tutorialStep, setTutorialStep] = useState(null); // null = inactive, 0+ = active step

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  // ── Tutorial step advancement ───────────────────────────────────
  useEffect(() => {
    if (tutorialStep === null || tutorialStep === 0) return;
    const bev = data.categories.find(c => c.id === 'beverages');
    const cokeItem = bev?.items.find(i => i.id === 'coke-004');
    const cokePowderItem = bev?.items.find(i => i.sku === 'CP-001');
    const advance = () => setTutorialStep(s => s + 1);
    switch (tutorialStep) {
      case 1:  advance(); break;
      case 2:  if (selectedCategoryId === '__locations') advance(); break;
      case 3:  if (activeModal?.type === 'addLocation') advance(); break;
      case 4:  if (data.locations.length > 3 && !activeModal) advance(); break;
      case 5:  if (selectedCategoryId === '__uom') advance(); break;
      case 6:  if (data.uom.length > 6) advance(); break;
      case 7:  if (selectedCategoryId === 'beverages') advance(); break;
      case 8:  if (managerActiveTab === 'formFactors' && selectedCategoryId === 'beverages') advance(); break;
      case 9:  if (bev && bev.formFactors.length > 4) advance(); break;
      case 10: if (managerActiveTab === 'items' && selectedCategoryId === 'beverages') advance(); break;
      case 11: if (activeModal?.type === 'addItem') advance(); break;
      case 12: if (bev && bev.items.length > 4 && !activeModal) advance(); break;
      case 13: if (managerActiveTab === 'schemas') advance(); break;
      case 14: if (activeModal?.type === 'addSchema') advance(); break;
      case 15: if (bev && bev.attributeSchemas.length > 3 && !activeModal) advance(); break;
      case 16: if (managerActiveTab === 'items') advance(); break;
      case 17: if (activeModal?.type === 'editRecipe') advance(); break;
      case 18: if (cokeItem?.recipe != null && !activeModal) advance(); break;
      case 21: if (activeModal?.type === 'createLots') advance(); break;
      case 22: if ((cokePowderItem?.lots?.length || 0) > 0 && !activeModal) advance(); break;
      case 23: if (activeModal?.type === 'produceLot' && activeModal?.payload?.item?.id === 'coke-004') advance(); break;
      case 24: if ((cokeItem?.lots?.length || 0) > 0 && !activeModal) advance(); break;
      default: break;
    }
  }, [tutorialStep, selectedCategoryId, managerActiveTab, activeModal, data]);

  // Reset managerActiveTab when category changes
  useEffect(() => {
    setManagerActiveTab('items');
  }, [selectedCategoryId]);

  const openModal = useCallback((type, payload = {}) => {
    setActiveModal({ type, payload });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  // ── Data mutators ──────────────────────────────────────────────

  const handleCreateLots = useCallback(({ categoryId, itemId, lots }) => {
    const now = new Date().toISOString();
    const newLots = lots.map((lot, i) => ({
      ...lot,
      highlightNew: true,
      transactions: [{
        id: `TXN-${Date.now()}-${i}`,
        type: 'buy-in',
        timestamp: now,
        qtyChange: lot.qty,
        reference: null,
      }],
    }));
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id !== categoryId ? cat : {
          ...cat,
          items: cat.items.map(item =>
            item.id !== itemId ? item : {
              ...item,
              lots: [...item.lots, ...newLots],
            }
          ),
        }
      ),
    }));
    const count = lots.length;
    showToast(count === 1 ? '1 lot created' : `${count} lots created`, 'success');
    closeModal();
  }, [showToast, closeModal]);

  const handleUpdateLot = useCallback(({ categoryId, itemId, lot }) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id !== categoryId ? cat : {
          ...cat,
          items: cat.items.map(item =>
            item.id !== itemId ? item : {
              ...item,
              lots: item.lots.map(l => l.id === lot.id ? { ...l, ...lot } : l),
            }
          ),
        }
      ),
    }));
    showToast('Lot updated', 'success');
  }, [showToast]);

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

  const handleAddUom = useCallback(({ uom }) => {
    setData(prev => ({ ...prev, uom: [...prev.uom, uom] }));
    showToast('Unit of measure added', 'success');
  }, [showToast]);

  const handleDeleteUom = useCallback(({ uomId }) => {
    setData(prev => ({
      ...prev,
      uom: prev.uom.filter(u => u.id !== uomId),
      uomConversions: prev.uomConversions.filter(c => c.fromId !== uomId && c.toId !== uomId),
    }));
    showToast('Unit of measure deleted', 'success');
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
      updateLot: handleUpdateLot,
    },
    onOpenModal: openModal,
  };

  const globalHandlers = {
    onUpdate: {
      addUom: handleAddUom,
      deleteUom: handleDeleteUom,
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

    if (type === 'createLots') {
      const category = data.categories.find(c => c.id === payload.categoryId);
      const uomEntry = data.uom.find(u => u.id === payload.item?.uomId);
      const uomLabel = uomEntry ? `${uomEntry.name} (${uomEntry.symbol})` : '—';
      return (
        <PurchaseLotsModal
          category={category}
          item={payload.item}
          preselectedFormFactor={payload.formFactor || ''}
          uomLabel={uomLabel}
          onSubmit={(lots) => handleCreateLots({ categoryId: payload.categoryId, itemId: payload.item.id, lots })}
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
    if (type === 'attachFormFactors') {
      const category = data.categories.find(c => c.id === payload.categoryId);
      return (
        <AttachFormFactorsModal
          category={category}
          item={payload.item}
          onSubmit={(updatedItem) => handleEditItem({ categoryId: payload.categoryId, item: updatedItem })}
          onClose={closeModal}
        />
      );
    }
    if (type === 'lotHistory') {
      return (
        <LotTransactionHistoryModal
          lot={payload.lot}
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

        {/* Tutorial launcher */}
        <div className="ml-auto">
          <button
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150 border"
            style={
              tutorialStep !== null
                ? { backgroundColor: '#6366F1', color: '#fff', borderColor: '#6366F1' }
                : { backgroundColor: 'transparent', color: '#64748B', borderColor: '#E2E8F0' }
            }
            onClick={() => setTutorialStep(tutorialStep !== null ? null : 0)}
          >
            <BookOpen size={13} />
            {tutorialStep !== null ? 'Exit Tutorial' : 'Tutorial'}
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
                data-tutorial={cat.id === 'beverages' ? 'sidebar-beverages' : undefined}
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

        <div className="mx-3 border-t border-slate-100 my-2" />

        <div className="px-3 pb-4">
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#64748B' }}>
            Configuration
          </p>
          {[
            { id: '__uom',         label: 'Units of Measure', Icon: Ruler,          tutorialId: 'sidebar-uom'       },
            { id: '__conversions', label: 'UoM Conversions',  Icon: ArrowLeftRight,  tutorialId: undefined           },
            { id: '__locations',   label: 'Locations',         Icon: MapPin,          tutorialId: 'sidebar-locations' },
          ].map(({ id, label, Icon, tutorialId }) => {
            const isActive = selectedCategoryId === id;
            return (
              <button
                key={id}
                data-tutorial={tutorialId || undefined}
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
        </div>
      </aside>

      {/* Main content */}
      <main
        className="pt-14 min-h-full"
        style={{ marginLeft: '240px' }}
      >
        <div className="p-6">
          {(() => {
            if (selectedCategoryId === '__uom') {
              return <UomSection uom={data.uom} onUpdate={globalHandlers.onUpdate} />;
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

            if (selectedCategory) {
              return (
                <CatalogManager
                  data={data}
                  selectedCategoryId={selectedCategoryId}
                  onUpdate={managerHandlers.onUpdate}
                  onOpenModal={managerHandlers.onOpenModal}
                  activeTab={managerActiveTab}
                  onTabChange={setManagerActiveTab}
                />
              );
            }

            return null;
          })()}
        </div>
      </main>

      {/* Modals */}
      {renderModal()}

      {/* Toast */}
      <Toast toast={toast} onDismiss={dismissToast} />

      {/* Tutorial overlay */}
      {tutorialStep !== null && (
        <Tutorial
          stepIndex={tutorialStep}
          onNext={() => setTutorialStep(s => s + 1)}
          onSkip={() => setTutorialStep(null)}
        />
      )}
    </div>
  );
}

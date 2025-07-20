import React, { useEffect, useState } from 'react';
import { XIcon, CheckIcon, AlertTriangleIcon, BoxIcon, LayersIcon } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLoadStore } from '../hooks/useLoadStore';
import { LoadSvgPreview } from './LoadSvgPreview';
import { LoadShapeEditor } from './LoadShapeEditor';
import { LoadSpec, LoadCategory, normalizeLoadSpec } from '../types/load';
interface LoadConfiguratorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  loadId: string | null;
}
export function LoadConfiguratorDrawer({
  isOpen,
  onClose,
  loadId
}: LoadConfiguratorDrawerProps) {
  const {
    loads,
    addToBuild,
    updateLoad
  } = useLoadStore();
  const [config, setConfig] = useState<LoadSpec | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'preview' | 'shape'>('details');
  const validationSchema = Yup.object({
    category: Yup.string().required('Required'),
    weight: Yup.number().positive('Must be positive').required('Required'),
    'dims.length': Yup.number().positive('Must be positive').required('Required'),
    'dims.width': Yup.number().positive('Must be positive').required('Required'),
    'dims.height': Yup.number().positive('Must be positive').required('Required'),
    'cg.chainage': Yup.number().required('Required').test('within-length', 'Must be within cargo length', function (value) {
      return value !== undefined && value >= 0 && value <= this.parent.parent.dims.length;
    }),
    'cg.offset': Yup.number().required('Required').test('within-width', 'Must be within cargo width', function (value) {
      return value !== undefined && Math.abs(value) <= this.parent.parent.dims.width / 2;
    }),
    securing: Yup.string().required('Required'),
    dynamicFactor: Yup.number().min(1, 'Must be at least 1').required('Required')
  });
  const formik = useFormik({
    initialValues: {
      id: '',
      category: 'box' as LoadCategory,
      weight: 0,
      dims: {
        length: 0,
        width: 0,
        height: 0
      },
      cg: {
        chainage: 0,
        offset: 0
      },
      securing: '',
      dynamicFactor: 1,
      envelopeRef: '',
      notes: '',
      shapeSvg: '',
      shapePoints: []
    },
    validationSchema,
    onSubmit: values => {
      // Ensure we update both the new and legacy fields for backward compatibility
      const updatedLoad: LoadSpec = {
        ...values,
        // Update legacy fields
        load_type: values.category,
        cargo_weight: values.weight,
        cargo_length: values.dims.length,
        cargo_width: values.dims.width,
        cargo_height: values.dims.height,
        cargo_cg_chainage: values.cg.chainage,
        cargo_cg_offset: values.cg.offset,
        load_securing: values.securing,
        dynamic_factor: values.dynamicFactor,
        permitted_envelope_ref: values.envelopeRef
      };
      if (loadId && loads.some(l => l.id === loadId)) {
        updateLoad(loadId, updatedLoad);
      } else {
        addToBuild(updatedLoad);
      }
      onClose();
    }
  });
  useEffect(() => {
    if (loadId) {
      const load = loads.find(l => l.id === loadId);
      if (load) {
        const normalizedLoad = normalizeLoadSpec(load);
        setConfig(normalizedLoad);
        formik.resetForm({
          values: {
            id: normalizedLoad.id,
            category: normalizedLoad.category,
            weight: normalizedLoad.weight,
            dims: normalizedLoad.dims,
            cg: normalizedLoad.cg,
            securing: normalizedLoad.securing,
            dynamicFactor: normalizedLoad.dynamicFactor,
            envelopeRef: normalizedLoad.envelopeRef || '',
            notes: normalizedLoad.notes || '',
            shapeSvg: normalizedLoad.shapeSvg || '',
            shapePoints: normalizedLoad.shapePoints || []
          }
        });
      }
    } else {
      setConfig(null);
      formik.resetForm();
    }
  }, [loadId, loads]);
  const handleShapeChange = (points: {
    x: number;
    y: number;
  }[], svg: string) => {
    formik.setFieldValue('shapePoints', points);
    formik.setFieldValue('shapeSvg', svg);
  };
  if (!isOpen || !config) return null;
  return <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full max-w-md flex">
        <div className="relative w-full bg-surface shadow-xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold">{t('Configure Load')}</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-gray-800">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="border-b border-gray-200 dark:border-gray-800">
            <div className="flex space-x-8 px-4">
              <button className={`py-3 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'details' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`} onClick={() => setActiveTab('details')}>
                {t('Details')}
              </button>
              <button className={`py-3 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'preview' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`} onClick={() => setActiveTab('preview')}>
                {t('Preview')}
              </button>
              <button className={`py-3 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'shape' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`} onClick={() => setActiveTab('shape')}>
                {t('Shape')}
              </button>
            </div>
          </div>
          <form onSubmit={formik.handleSubmit} className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-6">
              {activeTab === 'details' && <>
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      {t('Load Type')}
                    </h3>
                    <div className="bg-surface-100 dark:bg-gray-800 rounded p-3 mb-3 flex items-center gap-3">
                      <BoxIcon className="h-5 w-5 text-primary-600" />
                      <select name="category" value={formik.values.category} onChange={formik.handleChange} onBlur={formik.handleBlur} className="bg-transparent border-none focus:ring-0 p-0 font-medium flex-1">
                        <option value="container">{t('Container')}</option>
                        <option value="box">{t('Box')}</option>
                        <option value="e-room">{t('E-Room')}</option>
                        <option value="machinery">{t('Machinery')}</option>
                        <option value="tank">{t('Tank')}</option>
                        <option value="drum">{t('Drum')}</option>
                        <option value="cable_spool">{t('Cable Spool')}</option>
                        <option value="blade">{t('Blade')}</option>
                        <option value="tower_section">
                          {t('Tower Section')}
                        </option>
                        <option value="nacelle">{t('Nacelle')}</option>
                        <option value="vehicle">{t('Vehicle')}</option>
                        <option value="excavator">{t('Excavator')}</option>
                        <option value="mining_truck">
                          {t('Mining Truck')}
                        </option>
                        <option value="custom">{t('Custom')}</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-surface-400 mb-1">
                        {t('Cargo Weight (t)')}
                      </label>
                      <input type="number" name="weight" value={formik.values.weight} onChange={formik.handleChange} onBlur={formik.handleBlur} step="0.1" min="0" className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-surface" />
                      {formik.touched.weight && formik.errors.weight ? <div className="text-xs text-danger-500 mt-1">
                          {formik.errors.weight}
                        </div> : null}
                    </div>
                    <div>
                      <label className="block text-sm text-surface-400 mb-1">
                        {t('Dynamic Factor')}
                      </label>
                      <input type="number" name="dynamicFactor" value={formik.values.dynamicFactor} onChange={formik.handleChange} onBlur={formik.handleBlur} step="0.1" min="1" className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-surface" />
                      {formik.touched.dynamicFactor && formik.errors.dynamicFactor ? <div className="text-xs text-danger-500 mt-1">
                          {formik.errors.dynamicFactor}
                        </div> : null}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      {t('Dimensions')}
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-surface-400 mb-1">
                          {t('Length (m)')}
                        </label>
                        <input type="number" name="dims.length" value={formik.values.dims.length} onChange={formik.handleChange} onBlur={formik.handleBlur} step="0.1" min="0" className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-surface" />
                        {formik.touched.dims?.length && formik.errors.dims?.length ? <div className="text-xs text-danger-500 mt-1">
                            {formik.errors.dims.length}
                          </div> : null}
                      </div>
                      <div>
                        <label className="block text-sm text-surface-400 mb-1">
                          {t('Width (m)')}
                        </label>
                        <input type="number" name="dims.width" value={formik.values.dims.width} onChange={formik.handleChange} onBlur={formik.handleBlur} step="0.1" min="0" className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-surface" />
                        {formik.touched.dims?.width && formik.errors.dims?.width ? <div className="text-xs text-danger-500 mt-1">
                            {formik.errors.dims.width}
                          </div> : null}
                      </div>
                      <div>
                        <label className="block text-sm text-surface-400 mb-1">
                          {t('Height (m)')}
                        </label>
                        <input type="number" name="dims.height" value={formik.values.dims.height} onChange={formik.handleChange} onBlur={formik.handleBlur} step="0.1" min="0" className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-surface" />
                        {formik.touched.dims?.height && formik.errors.dims?.height ? <div className="text-xs text-danger-500 mt-1">
                            {formik.errors.dims.height}
                          </div> : null}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      {t('Center of Gravity')}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-surface-400 mb-1">
                          {t('CG Chainage (m)')}
                        </label>
                        <input type="number" name="cg.chainage" value={formik.values.cg.chainage} onChange={formik.handleChange} onBlur={formik.handleBlur} step="0.1" className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-surface" />
                        {formik.touched.cg?.chainage && formik.errors.cg?.chainage ? <div className="text-xs text-danger-500 mt-1">
                            {formik.errors.cg.chainage}
                          </div> : null}
                      </div>
                      <div>
                        <label className="block text-sm text-surface-400 mb-1">
                          {t('CG Offset (m)')}
                        </label>
                        <input type="number" name="cg.offset" value={formik.values.cg.offset} onChange={formik.handleChange} onBlur={formik.handleBlur} step="0.1" className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-surface" />
                        {formik.touched.cg?.offset && formik.errors.cg?.offset ? <div className="text-xs text-danger-500 mt-1">
                            {formik.errors.cg.offset}
                          </div> : null}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('Load Securing')}
                    </label>
                    <select name="securing" value={formik.values.securing} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-surface">
                      <option value="">{t('Select securing method')}</option>
                      <option value="chains">{t('Chains')}</option>
                      <option value="straps">{t('Straps')}</option>
                      <option value="chains_and_straps">
                        {t('Chains & Straps')}
                      </option>
                      <option value="custom">{t('Custom')}</option>
                    </select>
                    {formik.touched.securing && formik.errors.securing ? <div className="text-xs text-danger-500 mt-1">
                        {formik.errors.securing}
                      </div> : null}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('Permitted Envelope Reference')}
                    </label>
                    <select name="envelopeRef" value={formik.values.envelopeRef || ''} onChange={formik.handleChange} className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-surface">
                      <option value="">{t('None')}</option>
                      <option value="standard">{t('Standard')}</option>
                      <option value="oversize">{t('Oversize')}</option>
                      <option value="custom">{t('Custom')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('Notes')}
                    </label>
                    <textarea name="notes" value={formik.values.notes} onChange={formik.handleChange} rows={3} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-surface" />
                  </div>
                </>}
              {activeTab === 'preview' && <div className="h-96 flex items-center justify-center">
                  <LoadSvgPreview load={formik.values as LoadSpec} />
                </div>}
              {activeTab === 'shape' && <LoadShapeEditor initialPoints={formik.values.shapePoints} onChange={handleShapeChange} />}
            </div>
          </form>
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex space-x-3">
            <button onClick={onClose} className="h-8 px-3 bg-surface-100 text-primary-600 rounded hover:bg-surface-100/60 text-sm flex-1">
              {t('Cancel')}
            </button>
            <button onClick={() => formik.handleSubmit()} disabled={!formik.isValid} className="h-8 px-3 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
              {t('Save to Build')}
            </button>
          </div>
        </div>
      </div>
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}
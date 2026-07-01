import React, { useState, useMemo } from 'react';
import { AuditLogEntry, Language, OrderStatus } from '../types';
import { translate } from '../utils/api';
import { Search, Filter, Clock, User, FileText, CheckCircle, HelpCircle, ArrowRight, RefreshCw, X } from 'lucide-react';

interface OrderHistoryViewProps {
  auditLogs: AuditLogEntry[];
  lang: Language;
  onSelectOrderNumber?: (orderNumber: string | null) => void;
  onClearLogs?: () => void;
}

export default function OrderHistoryView({ auditLogs, lang, onSelectOrderNumber, onClearLogs }: OrderHistoryViewProps) {
  const isHe = lang === 'he';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [operatorFilter, setOperatorFilter] = useState<string>('all');

  // Clear filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setOperatorFilter('all');
  };

  // Get unique operators for filter dropdown
  const operators = useMemo(() => {
    const list = new Set<string>();
    auditLogs.forEach(log => {
      if (log.updatedBy) list.add(log.updatedBy);
    });
    return Array.from(list);
  }, [auditLogs]);

  // Filter audit logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchSearch = 
        log.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.updatedBy.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = statusFilter === 'all' || log.newStatus === statusFilter;
      const matchOperator = operatorFilter === 'all' || log.updatedBy === operatorFilter;

      return matchSearch && matchStatus && matchOperator;
    });
  }, [auditLogs, searchTerm, statusFilter, operatorFilter]);

  // Helper to get status colors and translations
  const getStatusDisplay = (status: OrderStatus | 'created') => {
    switch (status) {
      case 'created':
        return {
          bg: 'bg-slate-50 border-slate-200 text-slate-700',
          textHe: 'הזמנה נוצרה',
          textEn: 'Order Created',
          dot: 'bg-slate-400'
        };
      case 'pending':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-700',
          textHe: 'ממתין לטעינה',
          textEn: 'Awaiting Loading',
          dot: 'bg-amber-500'
        };
      case 'processing':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-700',
          textHe: 'בטיפול במחסן',
          textEn: 'Processing',
          dot: 'bg-blue-500'
        };
      case 'delivered':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          textHe: 'סופק בהצלחה',
          textEn: 'Delivered',
          dot: 'bg-emerald-500'
        };
      case 'cancelled':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-700',
          textHe: 'בוטל במערכת',
          textEn: 'Cancelled',
          dot: 'bg-rose-500'
        };
      default:
        return {
          bg: 'bg-slate-50 border-slate-200 text-slate-700',
          textHe: String(status),
          textEn: String(status),
          dot: 'bg-slate-500'
        };
    }
  };

  const formatLogDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleString(isHe ? 'he-IL' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div id="order-history-section" className="space-y-4" dir={isHe ? 'rtl' : 'ltr'}>
      {/* Search & Filter Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 ${isHe ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isHe ? 'חיפוש לפי מספר הזמנה, לקוח, נציג...' : 'Search by order #, customer, agent...'}
              className={`w-full bg-slate-50 text-slate-800 text-xs rounded-lg py-2.5 ${isHe ? 'pr-9 pl-4' : 'pl-9 pr-4'} border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all`}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className={`absolute top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 ${isHe ? 'left-2.5' : 'right-2.5'}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Quick Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5">
              <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-700 outline-none border-none pr-6 pl-1 font-bold cursor-pointer"
              >
                <option value="all">{isHe ? 'כל הסטטוסים' : 'All Statuses'}</option>
                <option value="pending">{isHe ? 'ממתין לטעינה' : 'Awaiting Loading'}</option>
                <option value="processing">{isHe ? 'בטיפול במחסן' : 'Processing'}</option>
                <option value="delivered">{isHe ? 'סופק בהצלחה' : 'Delivered'}</option>
                <option value="cancelled">{isHe ? 'בוטלו' : 'Cancelled'}</option>
              </select>
            </div>

            {/* Operator/Agent Filter */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5">
              <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <select
                value={operatorFilter}
                onChange={(e) => setOperatorFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-700 outline-none border-none pr-6 pl-1 font-bold cursor-pointer"
              >
                <option value="all">{isHe ? 'כל המפעילים' : 'All Operators'}</option>
                {operators.map(op => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
            </div>

            {/* Clear filters trigger */}
            {(searchTerm || statusFilter !== 'all' || operatorFilter !== 'all') && (
              <button
                onClick={resetFilters}
                className="text-xs font-black text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {isHe ? 'נקה סינונים' : 'Clear Filters'}
              </button>
            )}

            {/* Total Results badge */}
            <div className="text-[11px] font-black bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1.5 rounded-lg">
              {filteredLogs.length} {isHe ? 'פעולות נמצאו' : 'actions audited'}
            </div>
          </div>

        </div>
      </div>

      {/* Main Audit Timeline View */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center justify-center">
            <Clock className="h-10 w-10 text-slate-300 animate-pulse mb-3" />
            <p className="text-sm font-bold text-slate-600">{isHe ? 'לא נמצאו פעולות התואמות את החיפוש' : 'No matching audit records found'}</p>
            <p className="text-xs text-slate-400 mt-1">{isHe ? 'נסה להקל ראש בסינונים או לבחור הזמנה אחרת' : 'Try adjusting your filters or search criteria'}</p>
          </div>
        ) : (
          <div className="relative">
            {/* Real vertical timeline connector line */}
            <div className={`absolute top-3 bottom-3 w-0.5 bg-slate-100 ${isHe ? 'right-[23px]' : 'left-[23px]'}`} />

            <div className="space-y-6">
              {filteredLogs.map((log) => {
                const displayOld = getStatusDisplay(log.oldStatus);
                const displayNew = getStatusDisplay(log.newStatus);

                return (
                  <div key={log.id} className="relative flex items-start gap-4">
                    
                    {/* Circle Timeline Indicator */}
                    <div className="relative z-10 flex items-center justify-center h-12 w-12 rounded-full border-4 border-white bg-slate-100 shrink-0 shadow-sm">
                      <div className={`h-3 w-3 rounded-full ${displayNew.dot} animate-pulse`} />
                    </div>

                    {/* Timeline Bubble Content */}
                    <div className="flex-1 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 hover:border-slate-200/80 rounded-xl p-4 transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Order Number link - clickable to filter Dispatch list! */}
                          <button
                            onClick={() => onSelectOrderNumber?.(log.orderNumber)}
                            className="font-mono text-xs text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-100 rounded px-2 py-0.5 font-black transition-all cursor-pointer"
                            title={isHe ? 'לחץ כדי להציג את ההזמנה בסידור' : 'Click to highlight in dispatch logs'}
                          >
                            #{log.orderNumber}
                          </button>

                          <span className="text-xs font-bold text-slate-800">
                            {log.customerName}
                          </span>

                          <span className="text-[10px] text-slate-400">●</span>
                          
                          {/* Operator name */}
                          <div className="flex items-center gap-1 text-[10px] bg-slate-200/50 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                            <User className="h-2.5 w-2.5 text-slate-400 shrink-0" />
                            <span>{log.updatedBy}</span>
                          </div>
                        </div>

                        {/* Audit Details text */}
                        <div className="text-xs text-slate-600 flex items-center flex-wrap gap-2">
                          <span>{isHe ? 'שינוי סטטוס משלוח:' : 'Delivery status changed:'}</span>
                          
                          <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${displayOld.bg}`}>
                            {isHe ? displayOld.textHe : displayOld.textEn}
                          </span>

                          <ArrowRight className={`h-3.5 w-3.5 text-slate-400 ${isHe ? 'rotate-180' : ''}`} />

                          <span className={`px-1.5 py-0.5 rounded border text-[10px] font-black ${displayNew.bg}`}>
                            {isHe ? displayNew.textHe : displayNew.textEn}
                          </span>
                        </div>
                      </div>

                      {/* Right metadata (Timestamp) */}
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono shrink-0 md:text-right">
                        <Clock className="h-3 w-3 text-slate-300" />
                        <span>{formatLogDate(log.timestamp)}</span>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

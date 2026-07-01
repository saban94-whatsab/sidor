import React, { useState } from 'react';
import { 
  X, 
  Link, 
  Copy, 
  Check, 
  AlertTriangle, 
  Database, 
  Code,
  FileSpreadsheet,
  Globe2,
  Lock
} from 'lucide-react';
import { AppConfig, Language } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onSaveConfig: (config: AppConfig) => void;
  lang: Language;
}

export default function SettingsModal({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  lang,
}: SettingsModalProps) {
  const isHe = lang === 'he';

  const [webappUrl, setWebappUrl] = useState(config.webappUrl);
  const [isCopied, setIsCopied] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig({
      webappUrl: webappUrl.trim(),
      mode: 'live',
    });
    onClose();
  };

  // Google Apps Script production template for easy deployment
  const appsScriptCode = `/**
 * SabanOS - Production Google Sheets Systems Integrator
 * Sheet ID: 1Y_2N4Gs-lvAiv8fvLk9zvIhVQt5YxNPz6mCOnlh6lh8
 * Sheet Name: לוג_הזמנות_מערכת
 */

const SHEET_ID = "1Y_2N4Gs-lvAiv8fvLk9zvIhVQt5YxNPz6mCOnlh6lh8";
const SHEET_NAME = "לוג_הזמנות_מערכת";

function doGet(e) {
  const callback = e && e.parameter && e.parameter.callback;
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      return createJsonResponse({ success: false, error: "Sheet '" + SHEET_NAME + "' not found" }, callback);
    }

    if (e && e.parameter && e.parameter.action === 'updateStatus') {
      const orderNumber = e.parameter.orderNumber;
      const newStatus = e.parameter.status;
      const success = updateSheetOrderStatus(orderNumber, newStatus);
      return createJsonResponse({ success: success, orderNumber: orderNumber, status: newStatus }, callback);
    }
    
    const range = sheet.getDataRange();
    const values = range.getValues();
    if (values.length <= 1) {
      return createJsonResponse({ success: true, data: [] }, callback);
    }
    
    const data = [];
    for (var i = 1; i < values.length; i++) {
      const row = values[i];
      if (!row[1] || String(row[1]).trim() === "") continue; 
      
      data.push({
        timestamp: row[0] ? (row[0] instanceof Date ? row[0].toISOString() : String(row[0])) : "",
        orderNumber: String(row[1]).trim(),
        customerName: String(row[2]).trim(),
        warehouse: String(row[3]).trim(),
        deliveryAddress: String(row[4]).trim(),
        items: String(row[5] || "").trim(),
        status: String(row[6] || "pending").trim().toLowerCase(),
        modelUsed: String(row[7] || "").trim(),
        tokens: Number(row[8]) || 0,
        messageId: String(row[9] || "").trim()
      });
    }
    return createJsonResponse({ success: true, data: data }, callback);
  } catch (error) {
    return createJsonResponse({ success: false, error: error.toString() }, callback);
  }
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    if (postData.action === 'updateStatus') {
      const success = updateSheetOrderStatus(postData.orderNumber, postData.status);
      return createJsonResponse({ success: success });
    }
    return createJsonResponse({ success: false, error: "Unknown action" });
  } catch (error) {
    return createJsonResponse({ success: false, error: error.toString() });
  }
}

function updateSheetOrderStatus(orderNumber, status) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return false;
  const range = sheet.getDataRange();
  const values = range.getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][1]).trim() === String(orderNumber).trim()) {
      sheet.getRange(i + 1, 7).setValue(status);
      return true;
    }
  }
  return false;
}

function createJsonResponse(data, callback) {
  const jsonString = JSON.stringify(data);
  if (callback) {
    return ContentService.createTextOutput(callback + '(' + jsonString + ')').setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(jsonString)
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*');
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Quick live check validation
  const testConnection = async () => {
    if (!webappUrl) {
      setTestStatus('error');
      setErrorMessage(isHe ? 'אנא הזן כתובת אינטרנט תקינה תחילה' : 'Please enter a URL first');
      return;
    }

    setTestStatus('testing');
    try {
      // Use standard fetch with a timeout
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(webappUrl, { signal: controller.signal });
      clearTimeout(id);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const resJson = await response.json();
      const checkData = Array.isArray(resJson) ? resJson : (resJson.data || resJson.orders);
      
      if (Array.isArray(checkData)) {
        setTestStatus('success');
      } else {
        throw new Error(isHe ? 'המבנה שהוחזר אינו תקין (מצפה למערך נתונים)' : 'Response is not structured as an array');
      }
    } catch (e: any) {
      setTestStatus('error');
      setErrorMessage(e.message || String(e));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-fade-in">
      
      {/* Modal Container */}
      <div 
        id="settings-modal"
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl flex flex-col max-h-[90vh]"
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            <h3 className="font-sans text-lg font-bold text-slate-900">
              {isHe ? 'הגדרות סנכרון גוגל שיטס (Google Sheets)' : 'Google Sheets Synchronization'}
            </h3>
          </div>
          <button 
            id="settings-close-btn"
            onClick={onClose} 
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          
          {/* Input field for WebApp URL */}
          <div className="space-y-2 animate-fade-in">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Link className="h-3.5 w-3.5 text-blue-500" />
              {isHe ? 'כתובת ה-WebApp של ה-Apps Script' : 'Google Apps Script WebApp URL'}
            </label>
            <div className="flex gap-2">
              <input
                id="settings-webapp-url-input"
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={webappUrl}
                onChange={(e) => setWebappUrl(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white"
              />
              <button
                id="settings-test-conn-btn"
                type="button"
                onClick={testConnection}
                disabled={testStatus === 'testing'}
                className="rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 px-4 text-xs font-bold text-slate-700 transition-all disabled:opacity-50"
              >
                {testStatus === 'testing' ? (isHe ? 'בודק...' : 'Testing...') : (isHe ? 'בדיקת קשר' : 'Test Sync')}
              </button>
            </div>

            {/* Validation Status Badges */}
            {testStatus === 'success' && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{isHe ? 'התחברות הצליחה! הנתונים נטענו בהצלחה.' : 'Sync Connection Successful! Ready to use.'}</span>
              </div>
            )}
            {testStatus === 'error' && (
              <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl flex items-start gap-2 text-xs">
                <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{isHe ? 'שגיאת חיבור:' : 'Connection Error:'}</span>
                  <p className="mt-0.5 opacity-90">{errorMessage}</p>
                </div>
              </div>
            )}
          </div>

          {/* Instructions Block */}
          <div className="border-t border-slate-100 pt-5 space-y-3.5">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <FileSpreadsheet className="h-4.5 w-4.5 text-slate-500" />
              {isHe ? 'הוראות הגדרה קצרות' : 'How to deploy your Google Sheet backend'}
            </h4>
            
            <ol className="list-decimal list-inside space-y-2 text-slate-600 pl-1 leading-relaxed">
              <li>
                {isHe 
                  ? 'פתח את גיליון הגוגל שיטס המשרדי שלך (Google Sheet).' 
                  : 'Open your target Google Sheet containing order dispatches.'}
              </li>
              <li>
                {isHe 
                  ? 'לחץ בתפריט העליון על הרחבות (Extensions) ← Apps Script.' 
                  : 'Go to Extensions (הרחבות) -> Apps Script.'}
              </li>
              <li>
                {isHe 
                  ? 'מחק את הקוד הקיים והדבק את קוד ה-doGet הבא:' 
                  : 'Delete any template functions and paste the doGet snippet below:'}
              </li>
            </ol>

            {/* Apps Script code snippet copy area */}
            <div className="relative rounded-xl border border-slate-200 bg-slate-900 p-4 text-left font-mono text-xs text-slate-200 max-h-40 overflow-y-auto">
              <button
                id="settings-copy-code-btn"
                type="button"
                onClick={copyToClipboard}
                className="absolute right-3 top-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 p-1.5 text-slate-300 hover:text-white transition-all"
                title={isHe ? 'העתק קוד' : 'Copy code snippet'}
              >
                {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              <pre className="whitespace-pre-wrap leading-tight">{appsScriptCode}</pre>
            </div>

            <ol className="list-decimal list-inside space-y-2 text-slate-600 pl-1 leading-relaxed" start={4}>
              <li>
                {isHe 
                  ? 'לחץ על Deploy (פריסה) ← New deployment (פריסה חדשה).' 
                  : 'Click Deploy (פריסה) -> New deployment.'}
              </li>
              <li>
                {isHe 
                  ? 'בחר סוג Web app. הגדר Who has access ל- Anyone (כל אחד - הכרחי לצורך גישת ה-API).' 
                  : 'Set Type to "Web app". Make sure "Who has access" is set to "Anyone" (crucial for fetch queries).'}
              </li>
              <li>
                {isHe 
                  ? 'העתק את כתובת ה-Web app URL והדבק אותה כאן למעלה.' 
                  : 'Deploy, authorize, copy the Web app URL, and paste it into the field above.'}
              </li>
            </ol>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex justify-end gap-2.5">
          <button
            id="settings-cancel-btn"
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
          >
            {isHe ? 'ביטול' : 'Cancel'}
          </button>
          <button
            id="settings-save-btn"
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all shadow-blue-500/10"
          >
            {isHe ? 'שמור שינויים' : 'Save Configurations'}
          </button>
        </div>

      </div>
    </div>
  );
}

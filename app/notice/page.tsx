import React from "react";
import { promises as fs } from "fs";
import path from "path";

type Notice = {
  message: string;
  startDate: string; // yyyy-mm-dd
  endDate: string;   // yyyy-mm-dd
  active: boolean;
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getNotice(): Promise<Notice> {
  try {
    const file = path.join(process.cwd(), 'data', 'notice.json');
    const raw = await fs.readFile(file, 'utf-8');
    const json = JSON.parse(raw) as Notice;
    return {
      message: json.message || '',
      startDate: json.startDate || '',
      endDate: json.endDate || '',
      active: Boolean(json.active),
    };
  } catch {
    return { message: '', startDate: '', endDate: '', active: false };
  }
}

export default async function NoticePage() {
  const data = await getNotice();
  const show = data.active && data.message?.trim();

  return (
    <main className="min-h-[60vh] w-full flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 backdrop-blur p-6 md:p-8 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-300/20 text-yellow-700 dark:text-yellow-300 text-lg">⚠️</span>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">सूचना</h1>
        </div>

        {show ? (
          <>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-line">{data.message}</p>
            {(data.startDate || data.endDate) && (
              <div className="mt-4 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-4 text-gray-800 dark:text-gray-200">
                <p className="font-medium text-gray-900 dark:text-gray-100">अवकाश अवधि:</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {data.startDate || '—'} से {data.endDate || '—'} तक
                </p>
              </div>
            )}
            <p className="mt-4 text-gray-700 dark:text-gray-200">असुविधा के लिए खेद है। आपके सहयोग के लिए धन्यवाद।</p>
          </>
        ) : (
          <div className="text-gray-700 dark:text-gray-200">
            <p>वर्तमान में कोई सक्रिय सूचना नहीं है।</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Please check back later.</p>
          </div>
        )}
      </div>
    </main>
  );
}

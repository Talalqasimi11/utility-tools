let worker: Worker | null = null;
let msgId = 0;
const callbacks = new Map<number, { resolve: (val: unknown) => void, reject: (err: unknown) => void }>();

function getWorker() {
  if (typeof window === 'undefined') return null;
  if (!worker) {
    worker = new Worker(new URL('./pdf.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (e) => {
      const { id, result, error } = e.data;
      const cb = callbacks.get(id);
      if (cb) {
        if (error) cb.reject(new Error(error));
        else cb.resolve(result);
        callbacks.delete(id);
      }
    };
  }
  return worker;
}

export async function runInWorker<T>(action: string, args: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    const w = getWorker();
    if (!w) return reject(new Error('Web Workers not supported or running on server.'));
    
    const id = msgId++;
    callbacks.set(id, { resolve, reject });
    w.postMessage({ id, action, args });
  });
}

import { API_BASE } from './config';

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Kunde inte läsa filen'));
    reader.readAsDataURL(file);
  });
}

/** Uploads via same JSON/base64 endpoint as exhibition images (Vercel Blob). */
export async function uploadImageBlob(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Välj en bildfil');
  }
  const maxBytes = 2.5 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error('Bilden är för stor (max ca 2,5 MB för popup).');
  }

  const base64 = await readFileAsDataURL(file);
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'x-auth-token': token } : {}),
    },
    body: JSON.stringify({
      filename: `popup-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
      data: base64,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || err.hint || 'Uppladdning misslyckades');
  }

  const data = await response.json();
  if (!data.url) {
    throw new Error(data.error || 'Ingen URL returnerades');
  }
  return data.url as string;
}

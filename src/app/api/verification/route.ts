import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BASEROW = 'https://baserow-production-1daf.up.railway.app/api/database/rows';
const TOKEN = 'Token ygblMAbPhFxJA2cixOi25nlGmj5DBLYQ';

export async function GET(req: NextRequest) {
  const rowId = req.nextUrl.searchParams.get('row_id');
  if (!rowId) {
    return NextResponse.json({ error: 'Missing row_id' }, { status: 400 });
  }

  const headers = { Authorization: TOKEN, Accept: 'application/json' };

  // Query table 814 for the QA result linked to this row_id
  const res = await fetch(
    `${BASEROW}/table/814/?user_field_names=true&filter__field_8388__link_row_has=${rowId}`,
    { headers, next: { revalidate: 0 } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: 'Baserow error', status: res.status }, { status: 502 });
  }

  const data = await res.json();
  const rows = data.results || [];

  // Sort by id descending so we always get the latest report
  rows.sort((a: any, b: any) => b.id - a.id);
  const row = rows[0] ?? null;

  if (!row) {
    return NextResponse.json({ found: false });
  }

  let editUrl: string | null = null;
  const fallbackUrl = `https://forms.starlink.eltex.es/t/8RpNqwgyxwus?row_id=${rowId}&edit_form=True`;

  try {
    const r2 = await fetch(`${BASEROW}/table/640/${rowId}/?user_field_names=true`, { headers });
    if (r2.ok) {
      const d2 = await r2.json();
      const fetchedUrl = d2['URL FillOut Instalación'];
      if (fetchedUrl) {
        if (fetchedUrl.includes('?')) {
          editUrl = fetchedUrl + '&edit_form=True';
        } else {
          editUrl = fetchedUrl + '?edit_form=True';
        }
      } else {
        editUrl = fallbackUrl;
      }
    } else {
      editUrl = fallbackUrl;
    }
  } catch {
    editUrl = fallbackUrl;
  }

  return NextResponse.json({ found: true, row, editUrl });
}

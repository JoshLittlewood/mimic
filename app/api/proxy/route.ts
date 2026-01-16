import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url, method, headers, body, contentType } = await request.json();

    if (!url || !method) {
      return NextResponse.json(
        { error: 'Missing url or method' },
        { status: 400 }
      );
    }

    // Determine content type - use provided one or default to JSON
    const requestContentType = contentType || headers?.['Content-Type'] || 'application/json';

    const fetchHeaders: Record<string, string> = {
      ...headers,
      'Content-Type': requestContentType,
    };

    const fetchOptions: RequestInit = {
      method,
      headers: fetchHeaders,
    };

    // Add body for methods that support it
    if (['POST', 'PUT', 'PATCH'].includes(method) && body !== undefined) {
      // If JSON content type, stringify objects; otherwise pass as-is
      if (requestContentType.includes('application/json') && typeof body === 'object') {
        fetchOptions.body = JSON.stringify(body);
      } else {
        fetchOptions.body = body;
      }
    }

    const response = await fetch(url, fetchOptions);

    const responseContentType = response.headers.get('content-type');
    let data;

    if (responseContentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Request failed: ${response.status} ${response.statusText}`, data },
        { status: response.status }
      );
    }

    // Return raw text responses wrapped so client can extract them
    if (!responseContentType?.includes('application/json')) {
      return NextResponse.json({ _rawText: data });
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

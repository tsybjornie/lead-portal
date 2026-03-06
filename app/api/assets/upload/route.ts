import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// POST /api/assets/upload  Upload a file and return asset metadata
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml',
            'application/pdf',
        ];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: `File type '${file.type}' not allowed. Allowed: ${allowedTypes.join(', ')}` },
                { status: 400 }
            );
        }

        // Create upload directory
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'assets');
        await mkdir(uploadDir, { recursive: true });

        // Generate unique filename
        const ext = file.name.split('.').pop() || 'bin';
        const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const filePath = join(uploadDir, uniqueName);

        // Write file
        const bytes = await file.arrayBuffer();
        await writeFile(filePath, Buffer.from(bytes));

        // Extract metadata from form
        const category = (formData.get('category') as string) || 'documents';
        const title = (formData.get('title') as string) || file.name;
        const description = (formData.get('description') as string) || '';
        const zone = (formData.get('zone') as string) || 'Overall';
        const uploadedBy = (formData.get('uploadedBy') as string) || 'Designer';
        const shareCode = (formData.get('shareCode') as string) || '';

        // Create asset object
        const asset = {
            id: `asset-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            category,
            title,
            description,
            fileUrl: `/uploads/assets/${uniqueName}`,
            thumbnailUrl: file.type.startsWith('image/') ? `/uploads/assets/${uniqueName}` : undefined,
            zone,
            status: 'pending' as const,
            comments: [],
            uploadedBy,
            uploadedAt: new Date().toISOString(),
            source: 'upload' as const,
            fileSize: file.size,
            mimeType: file.type,
        };

        return NextResponse.json({
            success: true,
            asset,
            shareCode,
        });
    } catch (err) {
        console.error('[Upload] Error:', err);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

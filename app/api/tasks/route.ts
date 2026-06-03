import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { ResultSetHeader } from 'mysql2';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    return NextResponse.json(rows, { status: 200 });
  } catch (error: any) { 
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//create
export async function POST(request: NextRequest) {
  try {
    const { title, description, priority } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // mysql2/promise ရဲ့ query result ကို ResultSetHeader အဖြစ် type သတ်မှတ်ပေးရပါတယ်
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO tasks (title, description, priority) VALUES (?, ?, ?)',
      [title, description || null, priority || 'MEDIUM']
    );

    return NextResponse.json(
      { message: 'Task created successfully', taskId: result.insertId },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { pool } from '@/lib/db'; // 1. Curly braces ထည့်ပေးထားပါတယ်
import { NextResponse } from 'next/server';

// 2. Next.js Dynamic Route ရဲ့ params အတွက် TypeScript Type သတ်မှတ်ခြင်း
interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = params; 
    const { status } = await request.json(); 

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Database ထဲမှာ Status အပြောင်းအလဲလုပ်ခြင်း
    await pool.query(
      'UPDATE tasks SET status = ? WHERE id = ?',
      [status, id]
    );

    return NextResponse.json({ message: 'Task status updated successfully' }, { status: 200 });
  } catch (error: any) { // 3. : any ဖြည့်စွက်ပေးထားပါတယ်
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
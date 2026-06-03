import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}


export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams; 
    
    // Body ထဲကနေ status ရော priority ပါ လှမ်းယူမယ် (နှစ်ခုလုံး ပါချင်မှပါမယ်)
    const { status, priority } = await request.json(); 

    // ဘာဒေတာမှ ပို့မလာရင် Error ပြမယ်
    if (!status && !priority) {
      return NextResponse.json({ error: 'Status or Priority is required' }, { status: 400 });
    }

    // ၁။ တကယ်လို့ Status တင်ပေးပို့လာရင် သွားပြင်မယ်
    if (status) {
      await pool.query('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
    }

    // ၂။ တကယ်လို့ Priority တင်ပေးပို့လာရင် သွားပြင်မယ်
    if (priority) {
      await pool.query('UPDATE tasks SET priority = ? WHERE id = ?', [priority, id]);
    }

    return NextResponse.json({ message: 'Task updated successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2️⃣ DELETE METHOD (DELETE) - Task အလုပ်တစ်ခုကို ဖျက်ပစ်ခြင်း
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // 🔥 ဟောဒီနေရာမှာလည်း အမှားမတက်အောင် await ခံပြီးမှ id ကို ဆွဲထုတ်ရပါမယ်
    const resolvedParams = (await params) as { id: string };
    const { id } = resolvedParams;

    // Database ထဲကနေ ID ကွက်တိတူတဲ့ Task ကို ဖြုတ်ချခြင်း
    await pool.query('DELETE FROM tasks WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/db/ConnectDB';
import CategoryModel from '@/lib/models/CategoryModel';

export async function POST(req) {
    try {
        await ConnectDB();

        const { categorytitle } = await req.json()
        await CategoryModel.create({
            title: categorytitle
        })
        return NextResponse.json({ message: 'Data uploaded successfully' }, { status: 201 });
    }
    catch (error) {
        // console.log(error)
        return NextResponse.json({ error: error }, { status: 500 });
    }

}

export async function GET(req, res) {
    try {
        await ConnectDB(); // Ensure DB connection
        const category = await CategoryModel.find({}); // Fetch all categories
        return NextResponse.json(category, { status: 200 });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

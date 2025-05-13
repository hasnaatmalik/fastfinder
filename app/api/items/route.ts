import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import Item from "@/models/Item"
import { getUserFromRequest } from "@/lib/auth"

// Get all items
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const url = new URL(req.url)
    const type = url.searchParams.get("type")
    const category = url.searchParams.get("category")
    const status = url.searchParams.get("status")
    const reportedBy = url.searchParams.get("reportedBy")

    // Build query
    const query: any = {}
    if (type) query.type = type
    if (category) query.category = category
    if (status) query.status = status
    if (reportedBy) query.reportedBy = reportedBy

    const items = await Item.find(query).sort({ createdAt: -1 }).populate("reportedBy", "name email contactNumber")

    return NextResponse.json({ success: true, items })
  } catch (error) {
    console.error("Get items error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch items" }, { status: 500 })
  }
}

// Create a new item
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req)

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, type, category, location, date, contactInfo, image } = await req.json()

    // Validation
    if (!title || !description || !type || !category || !location || !date) {
      return NextResponse.json({ success: false, error: "Please fill in all required fields" }, { status: 400 })
    }

    await connectToDatabase()

    const newItem = new Item({
      title,
      description,
      type,
      category,
      location,
      date: new Date(date),
      contactInfo,
      reportedBy: userId,
      image,
      status: "open",
    })

    await newItem.save()

    return NextResponse.json({
      success: true,
      message: "Item reported successfully",
      item: newItem,
    })
  } catch (error) {
    console.error("Create item error:", error)
    return NextResponse.json({ success: false, error: "Failed to create item" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import Item from "@/models/Item"
import { getUserFromRequest } from "@/lib/auth"

// Get a specific item
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await connectToDatabase()

    const item = await Item.findById(id).populate("reportedBy", "name email contactNumber")

    if (!item) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, item })
  } catch (error) {
    console.error("Get item error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch item" }, { status: 500 })
  }
}

// Update an item
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const userId = await getUserFromRequest(req)

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const updates = await req.json()

    await connectToDatabase()

    // Find the item
    const item = await Item.findById(id)

    if (!item) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 })
    }

    // Check if the user is the owner of the item
    if (item.reportedBy.toString() !== userId) {
      return NextResponse.json({ success: false, error: "You are not authorized to update this item" }, { status: 403 })
    }

    // Update the item
    Object.keys(updates).forEach((key) => {
      if (key !== "reportedBy" && key !== "_id") {
        // Prevent changing the owner or ID
        item[key] = updates[key]
      }
    })

    await item.save()

    return NextResponse.json({
      success: true,
      message: "Item updated successfully",
      item,
    })
  } catch (error) {
    console.error("Update item error:", error)
    return NextResponse.json({ success: false, error: "Failed to update item" }, { status: 500 })
  }
}

// Delete an item
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const userId = await getUserFromRequest(req)

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Find the item
    const item = await Item.findById(id)

    if (!item) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 })
    }

    // Check if the user is the owner of the item
    if (item.reportedBy.toString() !== userId) {
      return NextResponse.json({ success: false, error: "You are not authorized to delete this item" }, { status: 403 })
    }

    await Item.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: "Item deleted successfully",
    })
  } catch (error) {
    console.error("Delete item error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete item" }, { status: 500 })
  }
}

import { supabase } from "../supabaseClient";
import type { MediaItemProps } from "../types/MediaItem";

export const ItemService = {
    fetchItems: async (userId: string, table: "completed" | "planned"): Promise<MediaItemProps[]> => {
        const { data, error } = await supabase
            .from(table === "completed" ? "completed_items_with_likes" : "planned_items_with_likes")
            .select("*")
            .eq("user_id", userId)
            .order("createdAt", { ascending: false });

        if (error) throw error;
        return data ?? [];
    },

    addItem: async (userId: string, item: Omit<MediaItemProps, "id" | "user_id">, table: "completed" | "planned") => {
        const dbItem = { ...item, user_id: userId, createdAt: item.createdAt ?? new Date().toISOString() };
        const { data, error } = await supabase.from(table === "completed" ? "completed_items" : "planned_items")
            .insert([dbItem])
            .select();

        if (error) throw error;
        return data[0];
    },

    updateItem: async (userId: string, id: string, updates: Partial<MediaItemProps>, table: "completed" | "planned") => {
        const cleanItem = { ...updates };
        delete cleanItem.status;
        delete cleanItem.statusProject;
        delete cleanItem.likes_count;
        delete cleanItem.liked_by_me;

        const { data, error } = await supabase
            .from(table === "completed" ? "completed_items" : "planned_items")
            .update(cleanItem)
            .eq("id", id)
            .eq("user_id", userId)
            .select();

        if (error) throw error;
        return data[0];
    },

    moveToCompleted: async (userId: string, item: MediaItemProps, rating: number) => {
        const updatedItem = { ...item, rating, completed_at: new Date().toISOString(), user_id: userId };
        await supabase.from("planned_items").delete().eq("id", item.id).eq("user_id", userId);
        const { data, error } = await supabase.from("completed_items").insert([updatedItem]).select();
        if (error) throw error;
        return data[0];
    },

    toggleHidden: async (userId: string, id: string, hidden: boolean, table: "completed" | "planned") => {
        const { error } = await supabase.from(table === "completed" ? "completed_items" : "planned_items")
            .update({ is_hidden: hidden })
            .eq("id", id)
            .eq("user_id", userId);
        if (error) throw error;
    },

    togglePin: async (userId: string, id: string, pinned: boolean, table: "completed" | "planned") => {
        const { error } = await supabase.from(table === "completed" ? "completed_items" : "planned_items")
            .update({ is_pinned: pinned })
            .eq("id", id)
            .eq("user_id", userId);
        if (error) throw error;
    },

    archiveItem: async (userId: string, id: string, table: "completed" | "planned") => {
        const { error } = await supabase.from(table === "completed" ? "completed_items" : "planned_items")
            .update({ is_archived: true })
            .eq("id", id)
            .eq("user_id", userId);
        if (error) throw error;
    },

    deleteItem: async (userId: string, id: string, table: "completed" | "planned") => {
        const { error } = await supabase
            .from(table === "completed" ? "completed_items" : "planned_items")
            .delete()
            .eq("id", id)
            .eq("user_id", userId);
        if (error) throw error;
    }
};

export type MediaItemProps = {
    id: string
    title: string
    type: string
    rating?: number
    comment?: string
    createdAt: string
    priority: string
    theme?: string
    isArchiveView?: boolean
    is_archived?: boolean
    is_hidden?: boolean
    user_id?: string
    progress?: number
    deadline?: string
    is_pinned?: boolean
    liked_by_me?: boolean
    likes_count?: number
    loading?: boolean
    status?: "Запланировано" | "В процессе" | "Завершено" | "Приостановлено"
    statusProject?: "Запланировано" | "В процессе" | "Завершено" | "Приостановлено"
}
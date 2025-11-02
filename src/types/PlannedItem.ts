export type PlannedItemProps = {
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
    status?: "Запланировано" | "В процессе" | "Завершено" | "Приостановлено"
}
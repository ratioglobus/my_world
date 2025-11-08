import React, { useState, useEffect, useRef } from "react"
import "../style/DiscoveryModal.css"
import { supabase } from "../supabaseClient"

interface DiscoveryModalProps {
    isOpen: boolean
    discoveryId: string
    initialTags: string[]
    title: string
    description?: string
    onClose: () => void
    onSave: (data: { title: string; description: string }) => void
    onTagsUpdate?: (updatedTags: string[]) => void
}

const DiscoveryModal: React.FC<DiscoveryModalProps> = ({
    isOpen,
    onClose,
    title,
    description = "",
    onSave,
    discoveryId,
    initialTags = [],
    onTagsUpdate,
}) => {
    const [tags, setTags] = useState<string[]>([])
    const [suggestedTags, setSuggestedTags] = useState<string[]>([])
    const [loadingSuggested, setLoadingSuggested] = useState(false)
    const [newTag, setNewTag] = useState("")
    const [user, setUser] = useState<any>(null)
    const [editMode, setEditMode] = useState(false)
    const [editedTitle, setEditedTitle] = useState(title)
    const [editedDescription, setEditedDescription] = useState(description)
    const modalRef = useRef<HTMLDivElement | null>(null)
    const tagsListRef = useRef<HTMLUListElement | null>(null)
    const suggestedListRef = useRef<HTMLUListElement | null>(null)

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data?.user) setUser(data.user)
        })
    }, [])

    useEffect(() => {
        if (!isOpen || !user) return
        setEditedTitle(title)
        setEditedDescription(description)
        setTags(initialTags ?? [])
        setEditMode(false)
        const fetchSuggested = async () => {
            setLoadingSuggested(true)
            const { data, error } = await supabase
                .from("discoveries")
                .select("tags")
                .eq("user_id", user.id)
            if (!error && data) {
                const allTags = data
                    .flatMap((item) => item.tags ?? [])
                    .filter((t) => !(initialTags ?? []).includes(t))
                const uniqueTags = Array.from(new Set(allTags))
                setSuggestedTags(uniqueTags)
            }
            setLoadingSuggested(false)
        }
        fetchSuggested()
    }, [isOpen, user, title, description, initialTags])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) onClose()
        }
        if (isOpen) document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isOpen, onClose])

    useEffect(() => {
        let scrollY = 0
        if (isOpen) {
            scrollY = window.scrollY || document.documentElement.scrollTop || 0
            document.body.style.position = "fixed"
            document.body.style.top = `-${scrollY}px`
            document.body.style.left = "0"
            document.body.style.right = "0"
            document.documentElement.style.overflow = "hidden"
        }
        return () => {
            if (isOpen) {
                document.body.style.position = ""
                document.body.style.top = ""
                document.body.style.left = ""
                document.body.style.right = ""
                document.documentElement.style.overflow = ""
                window.scrollTo({ top: scrollY, left: 0 })
            }
        }
    }, [isOpen])

    useEffect(() => {
        const attachHorizontalScroll = (list: HTMLUListElement | null) => {
            if (!list) return
            const handleWheel = (e: WheelEvent) => {
                if (e.deltaY === 0) return
                e.preventDefault()
                list.scrollBy({ left: e.deltaY })
            }
            list.addEventListener("wheel", handleWheel, { passive: false })
            return () => list.removeEventListener("wheel", handleWheel)
        }

        const cleanupTags = attachHorizontalScroll(tagsListRef.current)
        const cleanupSuggested = attachHorizontalScroll(suggestedListRef.current)

        return () => {
            cleanupTags?.()
            cleanupSuggested?.()
        }
    }, [tags, suggestedTags, loadingSuggested])

    const addTag = async (tagInput?: string) => {
        const tag = (tagInput ?? newTag).trim()
        if (!tag || !user?.id || tags.includes(tag)) {
            setNewTag("")
            return
        }
        const updatedTags = [...tags, tag]
        const { error } = await supabase
            .from("discoveries")
            .update({ tags: updatedTags })
            .eq("id", discoveryId)
            .eq("user_id", user.id)
        if (!error) {
            setTags(updatedTags)
            setSuggestedTags((prev) => prev.filter((t) => t !== tag))
            setNewTag("")
            onTagsUpdate?.(updatedTags)
        }
    }

    const removeTag = async (tagToRemove: string) => {
        if (!user?.id) return
        const updatedTags = tags.filter((t) => t !== tagToRemove)
        const { error } = await supabase
            .from("discoveries")
            .update({ tags: updatedTags })
            .eq("id", discoveryId)
            .eq("user_id", user.id)
        if (!error) {
            setTags(updatedTags)
            setSuggestedTags((prev) => (prev.includes(tagToRemove) ? prev : [...prev, tagToRemove]))
            onTagsUpdate?.(updatedTags)
        }
    }

    if (!isOpen) return null

    return (
        <div className="discovery-modal-overlay">
            <div ref={modalRef} className="discovery-modal">
                {editMode ? (
                    <>
                        <p className="discodery-modal-text">Режим редактирования</p>
                        <input
                            className="discovery-modal-input"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            placeholder="Название открытия"
                        />
                        <textarea
                            className="discovery-modal-textarea"
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            placeholder="Описание открытия..."
                        />
                        <div className="discovery-modal-actions">
                            <button className="discovery-modal-cancel" onClick={() => setEditMode(false)}>
                                Отмена
                            </button>
                            <button
                                className="discovery-modal-save"
                                onClick={() => {
                                    onSave({
                                        title: editedTitle.trim(),
                                        description: editedDescription.trim(),
                                    })
                                    setEditMode(false)
                                }}
                            >
                                Сохранить
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="discovery-modal-title">{title}</h2>
                        <p className="discovery-modal-description">
                            {description || "Описание отсутствует"}
                        </p>

                        <div className="discovery-modal-actions">
                            <button
                                className="discovery-modal-edit"
                                onClick={() => setEditMode(true)}
                            >
                                Редактировать
                            </button>
                        </div>

                        <div className="discovery-tags">
                            <div className="discovery-tags-row">
                                <input
                                    className="discovery-modal-input-tags"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder="Добавить новую метку..."
                                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                                />
                                <button className="discoveries-add-icon" onClick={() => addTag()}>
                                    ＋
                                </button>
                            </div>

                            <ul ref={tagsListRef} className="discovery-tags-list">
                                {tags.map((tag, idx) => (
                                    <li key={idx} className="discovery-tag-item active">
                                        <span className="discovery-tag">{tag}</span>
                                        <button
                                            className="discovery-tag-delete"
                                            onClick={() => removeTag(tag)}
                                        >
                                            ✕
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            {(loadingSuggested || suggestedTags.length > 0) && (
                                <>
                                    <p className="suggested-tags-title">Предложенные метки:</p>
                                    <ul ref={suggestedListRef} className="discovery-tags-list suggested">
                                        {loadingSuggested
                                            ? [...Array(5)].map((_, idx) => (
                                                <li key={idx} className="discovery-tag-item suggested placeholder">
                                                    <span className="discovery-tag">...</span>
                                                </li>
                                            ))
                                            : suggestedTags.map((tag, idx) => (
                                                <li
                                                    key={idx}
                                                    className="discovery-tag-item suggested"
                                                    onClick={() => addTag(tag)}
                                                >
                                                    <span className="discovery-tag">{tag}</span>
                                                </li>
                                            ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </>
                )}

                <button className="discovery-modal-close" onClick={onClose}>
                    ✕
                </button>
            </div>
        </div>
    )
}

export default DiscoveryModal

interface MyButtonProps {
    count: number;
    onClick: () => void;
}

export default function MyButton({ count, onClick }: MyButtonProps) {
    return (
        <button className="footer-button" onClick={onClick}>
            Clicked {count} times
        </button>
    );
}
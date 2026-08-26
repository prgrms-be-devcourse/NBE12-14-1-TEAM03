"use client";

type QuantityControlProps = {
    value: number;
    min?: number;
    onChange: (value: number) => void;
};

export default function QuantityControl({
    value,
    min = 0,
    onChange,
}: QuantityControlProps) {
    const handleDecrease = () => {
        if (value > min) {
            onChange(value - 1);
        }
    };

    const handleIncrease = () => {
        onChange(value + 1);
    };

    return (
        <div className="d-inline-flex align-items-center overflow-hidden rounded-3 border border-secondary bg-white">
            <button
                type="button"
                className="btn border-0 rounded-0 px-2 py-2 fs-5 lh-1"
                onClick={handleDecrease}
                disabled={value <= min}
                aria-label="수량 줄이기"
            >
                −
            </button>

            <span
                className="d-inline-block px-2 text-center fs-5 fw-medium"
                style={{ minWidth: "2.5rem" }}
                aria-live="polite"
            >
                {value}
            </span>

            <button
                type="button"
                className="btn border-0 rounded-0 px-2 py-2 fs-5 lh-1"
                onClick={handleIncrease}
                aria-label="수량 늘리기"
            >
                +
            </button>
        </div>
    );
}

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    variant?: "dark" | "outline-dark" | "outline-danger";
    size?: "sm";
    fullWidth?: boolean;
    children: ReactNode;
}

export default function Button({ 
    variant = "dark",
    size,
    fullWidth,
    className = "",
    children,
    ...rest
}: ButtonProps) {
    
    const classes = [
        "btn",
        `btn-${variant}`,
        size === "sm" ? "btn-sm" : "",
        fullWidth ? "w-100" : "",
        className,
    ]
    .filter(Boolean)
    .join(" ");
    
    return (
    <button type="button" className={classes} {...rest}>
        {children}
    </button>
    );
}


/*
variant: 
    dark: 검은 배경 + 흰 글자 
    outline-dark: 흰 배경에 검은 글자
    outline-danger: 흰 배경에 빨간 테두리, 글자

size:
    sm: 작은 버튼

fullWidth: 가로 전체 버튼


    사용 예시
------------------------------------------------------------------------    
    주요 실행 버튼 (기본 값)
    <Button onClick={handleSubmit}>주문 내역</Button>
------------------------------------------------------------------------
    일반 기능  (뒤로, 취소)
    <Button variant="outline-dark" onClick={handleBack}>상품 더 보기</Button>
------------------------------------------------------------------------
    삭제, 주문 취소
    <Button variant="outline-danger" onClick={handleDelete}>주문 취소</Button>
------------------------------------------------------------------------
    테이블 안의 작은 버튼
    <Button variant="outline-dark" size="sm">수정</Button>
------------------------------------------------------------------------
    가로 전체 버튼
    <Button fullWidth>주문하기</Button>
------------------------------------------------------------------------
    필터 버튼 
    const [filter, setFilter] = useState<"all" | "today" | "date">("all");

    return (
        <div className="d-flex flex-wrap gap-2 mb-4">
        <Button
            variant={filter === "all" ? "dark" : "outline-dark"}
            onClick={() => setFilter("all")}
        >
            전체 주문
        </Button>

        <Button
            variant={filter === "today" ? "dark" : "outline-dark"}
            onClick={() => setFilter("today")}
        >
            오늘 배송
        </Button>

        <Button
            variant={filter === "date" ? "dark" : "outline-dark"}
            onClick={() => setFilter("date")}
        >
            날짜별 배송
        </Button>
        </div>
    );
------------------------------------------------------------------------
폼 제출 ("button"이 기본값입니다!)
<Button type="submit">저장</Button>

*/
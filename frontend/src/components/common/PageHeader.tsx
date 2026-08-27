'use client';

import React from "react";

export interface PageHeaderProps {
  /** 페이지 제목 (예: "주문", "주문 내역", "상품 관리") */
  title: React.ReactNode;
  /** 페이지 설명 문구 */
  description?: React.ReactNode;
  /** 우측에 배치될 액션 버튼이나 부가 요소 (선택 사항) */
  actions?: React.ReactNode;
  /** 추가 커스텀 클래스 */
  className?: string;
}

export default function PageHeader({
  title,
  description,
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={`d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4 ${className}`.trim()}
    >
      <div>
        <h1 className="h3 mb-1">{title}</h1>
        {description && (
          <p className="text-body-secondary mb-0">{description}</p>
        )}
      </div>

      {actions && (
        <div className="d-flex align-items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/Button";

export default function ProductCreatePage() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!file) {
            alert("상품 이미지를 선택해주세요.");
            return;
        }

        try {
            const productFormData = new FormData(e.currentTarget);
            const name = String(productFormData.get("name"));
            const category = String(productFormData.get("category"));
            const price = Number(productFormData.get("price"));
            const imageFormData = new FormData();
            imageFormData.append("file", file);
            const imageResponse = await fetch("/api/images", {
                method: "POST",
                body: imageFormData,
            });

            if (!imageResponse.ok) {
                throw new Error("이미지 업로드에 실패했습니다.");
            }

            const imageData = await imageResponse.json();
            const photoUrl = imageData.data.photoUrl;
            const productResponse = await fetch("/api/products/admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    category,
                    price,
                    photoUrl,
                }),
            });

            if (!productResponse.ok) {
                throw new Error("상품 등록에 실패했습니다.");
            }
            router.push("/admin/products");

        } catch (error) {
            console.error(error);
            alert("상품 등록 중 오류가 발생했습니다.");
        }
    }

    return (
        <>
            <PageHeader
                title="상품 생성"
                description="Product 엔티티에 존재하는 필드만 입력합니다."
            />

            <section className="border bg-white p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            상품명
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            className="form-control"
                            placeholder="Columbia Nariño"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="category" className="form-label">
                            카테고리
                        </label>
                        <select
                            id="category"
                            name="category"
                            className="form-select"
                            defaultValue=""
                            required
                        >
                            <option value="" disabled>
                                카테고리를 선택해주세요.
                            </option>
                            <option value="커피콩">커피콩</option>
                            <option value="드립백">드립백</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="price" className="form-label">
                            가격
                        </label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            className="form-control"
                            placeholder="5000"
                            min="1"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="file" className="form-label">
                            상품 이미지
                        </label>
                        <input
                            id="file"
                            type="file"
                            className="form-control mb-3"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={(e) => {
                                const selectedFile =
                                    e.target.files?.[0] ?? null;

                                setFile(selectedFile);

                                if (selectedFile) {
                                    setPreviewUrl(
                                        URL.createObjectURL(selectedFile)
                                    );
                                } else {
                                    setPreviewUrl(null);
                                }
                            }}
                        />
                        <div
                            className="border bg-white d-flex align-items-center justify-content-center"
                            style={{ minHeight: "240px"}}
                        >
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="상품 이미지 미리보기"
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "220px",
                                        objectFit: "contain",
                                    }}
                                />
                            ) : (
                                <span className="text-body-secondary">
                                    이미지 파일을 선택해주세요.
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <Button
                            type="button"
                            variant="outline-dark"
                            onClick={() => router.push("/admin/products")}
                        >
                            취소
                        </Button>

                        <Button type="submit">
                            상품 등록
                        </Button>
                    </div>

                </form>
            </section>
        </>
    );
}